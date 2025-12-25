'use client';
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import { WelcomeScreen } from './components/WelcomeScreen';
import { OrderingPage } from './components/OrderingPage';
import { OrderSummary } from './components/OrderSummary';
import { HistoryPage } from './components/HistoryPage';
import { SettingsModal } from './components/SettingsModal';
import { MenuProcessing } from './components/MenuProcessing';
import { ApiKeyGate } from './components/ApiKeyGate';
import { WelcomeGate } from './components/WelcomeGate';

// Types & Constants
import { MenuData, Cart, AppState, HistoryRecord, TargetLanguage, CartItem, MenuItem, GeoLocation } from './types';
import { parseMenuImage } from './services/geminiService';

const App: React.FC = () => {
  // --- Simplified Auth State ---
  const [isPro, setIsPro] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Settings
  const [apiKey, setApiKey] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [serviceRate, setServiceRate] = useState(0);
  const [hidePrice, setHidePrice] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // App Logic
  const [currentView, setCurrentView] = useState<AppState>('welcome');
  const [cart, setCart] = useState<Cart>({});
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [targetLang, setTargetLang] = useState<TargetLanguage>(TargetLanguage.ChineseTW);
  const [scanLocation, setScanLocation] = useState<GeoLocation | undefined>(undefined);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // --- Init (Load from LocalStorage) ---
  useEffect(() => {
    // 1. Auth Persistence
    const savedIsPro = localStorage.getItem('is_pro') === 'true';
    if (savedIsPro) setIsPro(true);

    // 2. Settings Persistence
    setApiKey(localStorage.getItem('gemini_api_key') || '');
    setTaxRate(Number(localStorage.getItem('tax_rate')) || 0);
    setServiceRate(Number(localStorage.getItem('service_rate')) || 0);
    setHidePrice(localStorage.getItem('hide_price') === 'true');

    // 3. History Persistence
    const savedHistory = localStorage.getItem('order_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    setLoadingAuth(false);
  }, []);

  // --- Handlers ---
  const handleVerifySuccess = (verified: boolean) => {
    setIsPro(verified);
    if (verified) {
      localStorage.setItem('is_pro', 'true');
    }
  };

  // --- Helper Functions ---
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 1536;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; }
          } else {
            if (height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
          } else reject(new Error("Canvas failed"));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const getCurrentLocation = (): Promise<GeoLocation | undefined> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn("GPS Error", err);
          resolve(undefined);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  // --- Core Processing Logic ---
  const handleImagesSelected = async (files: File[]) => {
    if (!navigator.onLine) {
      toast.error("Network Error: Please connect to the internet.");
      return;
    }
    // Strict Client Check
    if (!apiKey) {
      toast.error("Critical: API Key missing.");
      return;
    }

    const filesToProcess = files.slice(0, 4);

    const toastId = toast.loading("Acquiring GPS Location...");
    const location = await getCurrentLocation();
    setScanLocation(location);
    toast.dismiss(toastId);

    setCurrentView('processing');

    try {
      const base64Images = await Promise.all(filesToProcess.map(compressImage));

      // Step 2: Simplified Backend Call (No Access Token Needed)
      const data = await parseMenuImage(
        apiKey,
        base64Images,
        targetLang,
        false,
        '' // No Auth Token needed for new flow
      );

      setMenuData(data);
      setCart({});
      setCurrentView('ordering');

    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(errMsg);
      setCurrentView('welcome');
    }
  };

  const handleUpdateCart = (item: MenuItem, delta: number) => {
    setCart(prevCart => {
      const existingItem = prevCart[item.id];
      if (delta > 0) {
        return { ...prevCart, [item.id]: { item: item, quantity: (existingItem ? existingItem.quantity : 0) + delta } };
      } else {
        if (!existingItem) return prevCart;
        const newQty = existingItem.quantity + delta;
        if (newQty <= 0) {
          const newCart = { ...prevCart };
          delete newCart[item.id];
          return newCart;
        } else {
          return { ...prevCart, [item.id]: { ...existingItem, quantity: newQty } };
        }
      }
    });
  };

  const handleFinishOrder = (paidBy: string = '') => {
    if (!menuData) return;
    const cartItems = Object.values(cart) as CartItem[];
    const totalOriginal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      items: cartItems,
      totalOriginalPrice: totalOriginal,
      currency: menuData.originalCurrency || 'JPY',
      restaurantName: menuData.restaurantName,
      paidBy: paidBy,
      location: scanLocation,
      taxRate: taxRate,
      serviceRate: serviceRate
    };

    const newHistory = [newRecord, ...history];
    setHistory(newHistory);
    localStorage.setItem('order_history', JSON.stringify(newHistory));

    localStorage.removeItem('current_menu_session');
    setCart({});
    setCurrentView('welcome');
  };

  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('order_history', JSON.stringify(newHistory));
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // --- RENDER GATES ---

  // 0. Loading State
  if (loadingAuth) {
    return <div className="h-screen bg-sausage-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sausage-600"></div></div>;
  }

  // 1. Mandatory Auth Gate (WelcomeGate)
  if (!isPro) {
    return (
      <div className="h-screen w-full bg-sausage-50 font-sans text-gray-900 overflow-hidden">
        <Toaster position="top-center" />
        <WelcomeGate onVerify={handleVerifySuccess} />
      </div>
    );
  }

  // 2. BYOK Gate (ApiKeyGate)
  if (!apiKey) {
    return (
      <div className="h-screen w-full bg-sausage-50 font-sans text-gray-900 overflow-hidden">
        <Toaster position="top-center" />
        <ApiKeyGate onSave={(key) => {
          setApiKey(key);
          localStorage.setItem('gemini_api_key', key);
        }} />
      </div>
    );
  }

  // 3. Main App
  return (
    <div className="h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#333', color: '#fff' } }} />

      <AnimatePresence mode="wait">
        {currentView === 'welcome' && (
          <motion.div key="welcome" {...pageVariants} className="h-full">
            <WelcomeScreen
              onLanguageChange={setTargetLang}
              selectedLanguage={targetLang}
              onImagesSelected={handleImagesSelected}
              onViewHistory={() => setCurrentView('history')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              isVerified={isPro}
              hasApiKey={!!apiKey}
              hidePrice={hidePrice}
              onHidePriceChange={(hide) => {
                setHidePrice(hide);
                localStorage.setItem('hide_price', hide.toString());
              }}
            />
          </motion.div>
        )}

        {currentView === 'processing' && (
          <motion.div key="processing" {...pageVariants} className="h-full">
            <MenuProcessing scanLocation={scanLocation} targetLang={targetLang} />
          </motion.div>
        )}

        {currentView === 'ordering' && menuData && (
          <motion.div key="ordering" {...pageVariants} className="h-full">
            <OrderingPage
              apiKey={apiKey}
              menuData={menuData}
              cart={cart}
              onUpdateCart={handleUpdateCart}
              onViewSummary={() => setCurrentView('summary')}
              onBack={() => setCurrentView('welcome')}
              targetLang={targetLang}
              taxRate={taxRate}
              serviceRate={serviceRate}
              hidePrice={hidePrice}
            />
          </motion.div>
        )}

        {currentView === 'summary' && menuData && (
          <motion.div key="summary" initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }} className="h-full absolute inset-0 z-50">
            <OrderSummary
              cart={cart}
              menuData={menuData}
              onClose={() => setCurrentView('ordering')}
              onFinish={handleFinishOrder}
              taxRate={taxRate}
              serviceRate={serviceRate}
              hidePrice={hidePrice}
            />
          </motion.div>
        )}

        {currentView === 'history' && (
          <motion.div key="history" {...pageVariants} className="h-full">
            <HistoryPage
              history={history}
              onBack={() => setCurrentView('welcome')}
              onDelete={handleDeleteHistory}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isSettingsOpen && (
        <SettingsModal
          currentKey={apiKey}
          currentTax={taxRate}
          currentService={serviceRate}
          onSave={(key, tax, service) => {
            setApiKey(key);
            setTaxRate(tax);
            setServiceRate(service);
            localStorage.setItem('gemini_api_key', key);
            localStorage.setItem('tax_rate', tax.toString());
            localStorage.setItem('service_rate', service.toString());
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
          isOpen={isSettingsOpen}
        />
      )}
    </div>
  );
};

export default App;