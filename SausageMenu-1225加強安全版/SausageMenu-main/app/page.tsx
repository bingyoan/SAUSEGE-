"use client";

import React, { useState, useEffect } from 'react';
// ★ 修改點 1：不需要在這裡引入 WelcomeGate 了，App 裡面自己有
import App from '../App'; 

// 🌍 翻譯資料庫 (為了版面簡潔，我這裡省略中間的翻譯內容，請保留你原本的 TRANSLATIONS 常數)
// ... (請保留原本那一大串 TRANSLATIONS) ...
const TRANSLATIONS = {
    // ... 請確保這裡是你原本完整的翻譯內容 ...
    'zh-TW': {
        langName: "繁體中文",
        tagline: "出國旅遊必備神器",
        heroTitle: "點餐不再是困難",
        heroSubtitle: "Show 給店員看就好！",
        heroDesc: "不懂外語也能輕鬆點餐。從翻譯菜單、避開過敏原，到自動分帳與美食導航，SausageMenuPal 幫你搞定一切。",
        btnDownload: "取得終身買斷版",
        btnLearnMore: "了解功能",
        successTitle: "點餐成功！",
        successDesc: "店員秒懂，無需比手畫腳",
        featuresTitle: "從看不懂到安心吃",
        featuresDesc: "透過 AI 深度解析，我們解決了每一個點餐環節的焦慮。",
        feat1Title: "拍菜單，看懂靈魂",
        feat1Desc: "AI 自動翻譯並生成點餐介面，不再盲選。",
        feat2Title: "過敏原紅燈警示",
        feat2Desc: "選擇你的過敏源，AI 幫你避開地雷食物。",
        feat3Title: "AI 深度菜色解析",
        feat3Desc: "告訴你口感與特色，就像美食家在旁解說。",
        toolsTag: "More Than Menu",
        toolsTitle: "不只是點餐，更是你的旅遊神隊友",
        tool1Title: "自由設定匯率",
        tool1Desc: "不必再心算。輸入當地金額，直接顯示你能理解的價格。",
        tool2Title: "智慧分帳功能",
        tool2Desc: "紀錄誰先付了錢，自動計算每人應付金額。",
        tool3Title: "美食足跡導航",
        tool3Desc: "想回訪那間好吃的店？從歷史紀錄一鍵導航。",
        pricingTag: "限時優惠中",
        pricingTitle: "只要一餐的價格，\n換來終身的美食自由",
        pricingDesc: "立即加入，獲得 SausageMenuPal 完整功能。包含未來所有的 AI 模型升級與新功能更新。",
        pricingBtn: "立即購買 (終身 PRO)",
        pricingNote: "* 支援 PWA 安裝 | 終身一次付費",
        navFeatures: "核心功能",
        navTools: "旅遊工具",
        navPricing: "終身方案",
        navLogin: "已有帳號？開啟 App",
        navLoginMobile: "開啟 App (舊客戶)"
    },
    'en': {
        langName: "English",
        tagline: "Essential Travel Tool",
        heroTitle: "Ordering Made Easy",
        heroSubtitle: "Just Show It to the Waiter!",
        heroDesc: "Order easily without knowing the language. From translating menus and avoiding allergens to bill splitting and food navigation.",
        btnDownload: "Get Lifetime Access",
        btnLearnMore: "Learn More",
        successTitle: "Order Success!",
        successDesc: "Waiter understands instantly.",
        featuresTitle: "Eat with Confidence",
        featuresDesc: "AI analysis resolves every anxiety about ordering food abroad.",
        feat1Title: "Snap & Understand",
        feat1Desc: "AI translates menus and creates an ordering interface.",
        feat2Title: "Allergen Alert",
        feat2Desc: "Select your allergies, AI helps you avoid dangerous foods.",
        feat3Title: "Deep Food Analysis",
        feat3Desc: "Explains texture and ingredients like a food critic.",
        toolsTag: "More Than Menu",
        toolsTitle: "Your Ultimate Travel Companion",
        tool1Title: "Custom Exchange Rates",
        tool1Desc: "No more mental math. See prices in your home currency instantly.",
        tool2Title: "Smart Bill Split",
        tool2Desc: "Track who paid and calculate shares automatically.",
        tool3Title: "Food Footprint Nav",
        tool3Desc: "One-click navigation back to that delicious restaurant.",
        pricingTag: "Limited Time Offer",
        pricingTitle: "The Price of One Meal,\nFor Lifetime Freedom",
        pricingDesc: "Get full access to SausageMenuPal. Includes all future AI updates and new features.",
        pricingBtn: "Buy Now (Lifetime PRO)",
        pricingNote: "* PWA Support | One-time Payment",
        navFeatures: "Features",
        navTools: "Tools",
        navPricing: "Pricing",
        navLogin: "Log in / Open App",
        navLoginMobile: "Open App"
    },
    'ja': {
        langName: "日本語",
        tagline: "海外旅行の必需品",
        heroTitle: "注文はもう難しくない",
        heroSubtitle: "店員に見せるだけでOK！",
        heroDesc: "言葉がわからなくても簡単に注文。メニュー翻訳からアレルギー回避、割り勘計算まで、SausageMenuPalにお任せ。",
        btnDownload: "買い切り版を入手",
        btnLearnMore: "機能を見る",
        successTitle: "注文成功！",
        successDesc: "店員さんにすぐ伝わります",
        featuresTitle: "読めないメニューも安心",
        featuresDesc: "AI解析により、海外での注文の不安を解消します。",
        feat1Title: "撮るだけで理解",
        feat1Desc: "AIがメニューを翻訳し、注文画面を生成します。",
        feat2Title: "アレルギー警告",
        feat2Desc: "アレルゲンを設定すれば、AIが危険な食品を回避します。",
        feat3Title: "料理詳細解説",
        feat3Desc: "食感や特徴を、まるで美食家のように解説します。",
        toolsTag: "More Than Menu",
        toolsTitle: "注文だけじゃない、旅の相棒",
        tool1Title: "為替レート設定",
        tool1Desc: "暗算は不要。現地の金額を入力するだけで、自国通貨で表示。",
        tool2Title: "スマート割り勘",
        tool2Desc: "誰が払ったかを記録し、一人当たりの支払額を自動計算。",
        tool3Title: "グルメ足跡ナビ",
        tool3Desc: "履歴からワンクリックで、あのお店へナビゲーション。",
        pricingTag: "期間限定",
        pricingTitle: "一食分の価格で、\n一生涯の美食の自由を",
        pricingDesc: "SausageMenuPalの全機能を今すぐ入手。将来のAIアップデートも全て含まれます。",
        pricingBtn: "今すぐ購入 (生涯PRO版)",
        pricingNote: "* PWA対応 | 追加課金なし",
        navFeatures: "機能",
        navTools: "ツール",
        navPricing: "価格",
        navLogin: "アプリを開く",
        navLoginMobile: "アプリを開く"
    },
    'ko': {
        langName: "한국어",
        tagline: "해외여행 필수품",
        heroTitle: "주문이 쉬워집니다",
        heroSubtitle: "직원에게 보여주기만 하세요!",
        heroDesc: "언어를 몰라도 걱정 없습니다. 메뉴 번역, 알레르기 피하기, 더치페이 계산까지 SausageMenuPal이 해결해 드립니다.",
        btnDownload: "평생 소장판 구매",
        btnLearnMore: "기능 더보기",
        successTitle: "주문 성공!",
        successDesc: "직원이 바로 이해합니다.",
        featuresTitle: "안심하고 즐기는 미식",
        featuresDesc: "AI 심층 분석으로 해외 식당 주문의 모든 불안을 해결했습니다.",
        feat1Title: "메뉴판 촬영 번역",
        feat1Desc: "AI가 메뉴를 번역하고 주문 화면을 자동으로 생성합니다.",
        feat2Title: "알레르기 경고",
        feat2Desc: "알레르기를 설정하면 AI가 위험한 음식을 피하도록 도와줍니다.",
        feat3Title: "심층 메뉴 분석",
        feat3Desc: "마치 미식가처럼 식감과 재료를 자세히 설명해 줍니다.",
        toolsTag: "More Than Menu",
        toolsTitle: "주문 그 이상의 여행 파트너",
        tool1Title: "환율 자유 설정",
        tool1Desc: "암산할 필요 없이 현지 금액을 입력하면 내 나라 돈으로 보여줍니다.",
        tool2Title: "스마트 더치페이",
        tool2Desc: "누가 계산했는지 기록하고 1인당 금액을 자동으로 계산합니다.",
        tool3Title: "맛집 발자국 내비",
        tool3Desc: "히스토리에서 클릭 한 번으로 그 맛집까지 길을 안내합니다.",
        pricingTag: "한정 기간 할인",
        pricingTitle: "밥 한 끼 가격으로,\n평생 누리는 미식의 자유",
        pricingDesc: "지금 가입하고 SausageMenuPal의 모든 기능을 평생 소장하세요. 미래의 모든 업데이트가 포함됩니다.",
        pricingBtn: "지금 구매하기 (평생 PRO)",
        pricingNote: "* PWA 지원 | 추가 결제 없음",
        navFeatures: "핵심 기능",
        navTools: "여행 도구",
        navPricing: "가격",
        navLogin: "앱 열기",
        navLoginMobile: "앱 열기"
    }
} as const;

type LangKey = keyof typeof TRANSLATIONS;

// 🌟 語言選擇畫面組件
const LanguageSelector = ({ onSelect }: { onSelect: (lang: LangKey) => void }) => {
    return (
        <div className="fixed inset-0 bg-[#FDFBF7] z-[100] flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-8">
                <i className="ph-bold ph-fork-knife"></i>
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">Welcome to SausageMenuPal</h1>
            <p className="text-stone-500 mb-10">Please select your language</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                {(Object.entries(TRANSLATIONS) as [LangKey, typeof TRANSLATIONS[LangKey]][]).map(([key, data]) => (
                    <button 
                        key={key}
                        onClick={() => onSelect(key)}
                        className="flex items-center justify-between p-4 bg-white border-2 border-stone-100 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all group"
                    >
                        <span className="font-bold text-stone-700 group-hover:text-orange-600">{data.langName}</span>
                        <i className="ph-bold ph-caret-right text-stone-300 group-hover:text-orange-500"></i>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function Page() {
    // 狀態控制：顯示 Landing Page (landing) 還是 App (app)
    const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [currentLang, setCurrentLang] = useState<LangKey | null>(null);
    
    // ★ 修改點 1：更新為新的 Gumroad 連結
    const DOWNLOAD_LINK = "https://bingyoan.gumroad.com/l/chkqus";

    const IMAGES = {
        hero_phone: "/images/show.jpg",      
        feature_trans: "/images/trans.jpg",  
        feature_allergy: "/images/allergy.jpg", 
        feature_ai: "/images/ai.jpg",        
        tool_exchange: "/images/rate.jpg",   
        tool_split: "/images/split.jpg",     
        tool_nav: "/images/nav.jpg",         
        logo: "/images/logo.png"             
    };

    // 初始化：檢查語言設定與 PWA 模式
    useEffect(() => {
        // 1. PWA 模式直通
        if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
            setViewMode('app');
            return;
        }

        // 2. 回頭客直通
        const isReturningUser = localStorage.getItem('smp_prefer_app');
        if (isReturningUser === 'true') {
            setViewMode('app');
            return;
        }

        // 3. 語言設定
        const savedLang = localStorage.getItem('smp_language') as LangKey;
        if (savedLang && TRANSLATIONS[savedLang]) {
            setCurrentLang(savedLang);
        }
        
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLanguageSelect = (langKey: LangKey) => {
        setCurrentLang(langKey);
        localStorage.setItem('smp_language', langKey);
        window.scrollTo(0, 0);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const enterApp = () => {
        localStorage.setItem('smp_prefer_app', 'true');
        setViewMode('app');
        window.scrollTo(0, 0);
    };

    // ★ 修改點 3：簡化邏輯 - 只要是 App 模式，就直接渲染 <App />
    // 讓 <App /> 內部的 useEffect 去檢查 localStorage 並決定要不要顯示 WelcomeGate
    if (viewMode === 'app') {
        return <App />;
    }

    // --- 以下 Landing Page 代碼保持不變 ---
    if (!currentLang) {
        return <LanguageSelector onSelect={handleLanguageSelect} />;
    }

    const t = TRANSLATIONS[currentLang];
    const theme = {
        bg: "bg-[#FDFBF7]", 
        bgAlt: "bg-[#FFF4E6]", 
        primary: "bg-orange-500 hover:bg-orange-600",
        textMain: "text-stone-800",
    };

    const mainFeatures = [
        { id: 1, title: t.feat1Title, desc: t.feat1Desc, icon: "ph-globe", image: IMAGES.feature_trans },
        { id: 2, title: t.feat2Title, desc: t.feat2Desc, icon: "ph-warning", image: IMAGES.feature_allergy },
        { id: 3, title: t.feat3Title, desc: t.feat3Desc, icon: "ph-brain", image: IMAGES.feature_ai }
    ];

    return (
        <div className={`min-h-screen font-sans ${theme.bg} ${theme.textMain} selection:bg-orange-200 animate-fade-in`}>
            {/* ... 導覽列 ... */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden border border-stone-100">
                            <img src={IMAGES.logo} className="w-full h-full object-contain" alt="Logo" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                        <span className="text-xl md:text-2xl font-bold tracking-tight text-stone-800">SausageMenuPal</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-stone-600 hover:text-orange-500 font-medium transition-colors">{t.navFeatures}</a>
                        <a href="#tools" className="text-stone-600 hover:text-orange-500 font-medium transition-colors">{t.navTools}</a>
                        <button onClick={() => setCurrentLang(null)} className="text-stone-400 hover:text-orange-500 px-2"><i className="ph-bold ph-globe text-lg"></i></button>
                        <button onClick={enterApp} className="text-stone-500 hover:text-stone-800 font-medium transition-colors border-r border-stone-300 pr-6 mr-2">{t.navLogin}</button>
                        
                        {/* ★ 修改點：將 Button 改為 a 標籤，並連結到 Gumroad */}
                        <a 
                            href={DOWNLOAD_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${theme.primary} text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 no-underline`}
                        >
                            {t.pricingBtn}
                        </a>
                    </div>

                    <button className="md:hidden text-stone-600" onClick={toggleMenu}><i className={`ph-bold ${isMenuOpen ? 'ph-x' : 'ph-list'} text-2xl`}></i></button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-4 border-t border-stone-100">
                        <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                            <span className="text-stone-400 text-sm">Language</span>
                            <button onClick={() => {toggleMenu(); setCurrentLang(null);}} className="text-orange-500 font-bold flex items-center gap-1"><i className="ph-bold ph-globe"></i> Switch</button>
                        </div>
                        <a href="#features" className="text-stone-600 font-medium" onClick={toggleMenu}>{t.navFeatures}</a>
                        <a href="#tools" className="text-stone-600 font-medium" onClick={toggleMenu}>{t.navTools}</a>
                        <button className="text-stone-600 font-medium flex items-center gap-2 text-left" onClick={() => { toggleMenu(); enterApp(); }}>
                            <i className="ph-bold ph-sign-in text-orange-500"></i>{t.navLoginMobile}
                        </button>
                        
                        {/* ★ 修改點：Mobile Menu 的按鈕也改成 a 標籤 */}
                        <a 
                            href={DOWNLOAD_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={toggleMenu}
                            className={`${theme.primary} text-white px-6 py-3 rounded-xl font-bold text-center w-full block no-underline`}
                        >
                            {t.pricingBtn}
                        </a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/2 space-y-8 text-center lg:text-left z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>{t.tagline}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-stone-900 tracking-tight whitespace-pre-line">
                                {t.heroTitle} <br/><span className="text-orange-500">{t.heroSubtitle}</span>
                            </h1>
                            <p className="text-lg md:text-xl text-stone-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">{t.heroDesc}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {/* ★ 修改點：Hero Section 主按鈕改為 a 標籤 */}
                                <a 
                                    href={DOWNLOAD_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${theme.primary} text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all no-underline`}
                                >
                                    <i className="ph-bold ph-download text-xl"></i>{t.btnDownload}
                                </a>
                                <a href="#features" className="bg-white text-stone-700 border-2 border-stone-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-orange-300 hover:text-orange-600 transition-all flex items-center justify-center">{t.btnLearnMore}</a>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative mt-10 lg:mt-0 flex justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-orange-200/40 to-yellow-100/40 rounded-full blur-3xl -z-10"></div>
                            <div className="relative border-gray-800 bg-gray-800 border-[12px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                                <div className="w-[120px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                                <div className="h-full w-full bg-stone-900 rounded-[2rem] overflow-hidden relative">
                                    <img src={IMAGES.hero_phone} alt="Show to waiter screen" className="object-cover w-full h-full" onError={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }} />
                                    <div className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-stone-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-full text-green-600"><i className="ph-bold ph-check-circle text-xl"></i></div>
                                            <div><p className="font-bold text-stone-800 text-sm">{t.successTitle}</p><p className="text-xs text-stone-500">{t.successDesc}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features & Other Sections */}
            <section id="features" className={`py-20 ${theme.bgAlt}`}>
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-800">{t.featuresTitle}</h2>
                        <p className="text-stone-500 text-lg">{t.featuresDesc}</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {mainFeatures.map((feature, index) => (
                                <div key={feature.id} className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${activeFeature === index ? 'bg-white border-orange-400 shadow-lg' : 'bg-white/50 border-transparent hover:bg-white'}`} onClick={() => setActiveFeature(index)}>
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${activeFeature === index ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-500'}`}><i className={`ph-bold ${feature.icon} text-xl`}></i></div>
                                        <div><h3 className="text-xl font-bold text-stone-800 mb-1">{feature.title}</h3><p className="text-stone-500">{feature.desc}</p></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center relative">
                            <div className="relative border-gray-800 bg-gray-800 border-[10px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                                <div className="w-[100px] h-[16px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                                <div className="h-full w-full bg-white rounded-[2rem] overflow-hidden">
                                    <img src={mainFeatures[activeFeature].image} className="w-full h-full object-cover transition-opacity duration-300" alt="Feature Preview" onError={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="mb-16">
                        <span className="text-orange-500 font-bold tracking-wider text-sm uppercase">{t.toolsTag}</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-2">{t.toolsTitle}</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group relative h-[400px] mb-6 rounded-3xl overflow-hidden shadow-lg border border-stone-100 bg-stone-100">
                            <img src={IMAGES.tool_exchange} className="w-full h-full object-cover" alt="Exchange" onError={(e) => e.currentTarget.style.backgroundColor='#eee'}/>
                            <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur p-4 border-t border-stone-100">
                                <h4 className="font-bold text-stone-800">{t.tool1Title}</h4><p className="text-xs text-stone-500">{t.tool1Desc}</p>
                            </div>
                        </div>
                        <div className="group relative h-[400px] mb-6 rounded-3xl overflow-hidden shadow-lg border border-stone-100 bg-stone-100 md:-mt-12">
                            <img src={IMAGES.tool_split} className="w-full h-full object-cover" alt="Split" onError={(e) => e.currentTarget.style.backgroundColor='#eee'}/>
                            <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur p-4 border-t border-stone-100">
                                <h4 className="font-bold text-stone-800">{t.tool2Title}</h4><p className="text-xs text-stone-500">{t.tool2Desc}</p>
                            </div>
                        </div>
                        <div className="group relative h-[400px] mb-6 rounded-3xl overflow-hidden shadow-lg border border-stone-100 bg-stone-100">
                            <img src={IMAGES.tool_nav} className="w-full h-full object-cover" alt="Nav" onError={(e) => e.currentTarget.style.backgroundColor='#eee'}/>
                            <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur p-4 border-t border-stone-100">
                                <h4 className="font-bold text-stone-800">{t.tool3Title}</h4><p className="text-xs text-stone-500">{t.tool3Desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-300 text-sm font-bold mb-4 border border-orange-500/30">{t.pricingTag}</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 whitespace-pre-line">{t.pricingTitle}</h2>
                            <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">{t.pricingDesc}</p>
                            <div className="flex justify-center">
                                {/* ★ 修改點：Pricing CTA 主按鈕改為 a 標籤 */}
                                <a 
                                    href={DOWNLOAD_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 group no-underline"
                                >
                                    <span>{t.pricingBtn}</span><i className="ph-bold ph-caret-right text-xl group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                            <p className="mt-6 text-stone-500 text-sm">{t.pricingNote}</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-[#FDFBF7] pt-16 pb-8 border-t border-stone-200">
                <div className="container mx-auto px-6 text-center text-stone-400 text-sm">
                    <p>&copy; 2024 SausageMenuPal. All rights reserved.</p>
                    <button onClick={() => {setCurrentLang(null); window.scrollTo(0,0);}} className="mt-2 hover:text-orange-500 text-xs underline">Change Language</button>
                </div>
            </footer>
        </div>
    );
}
