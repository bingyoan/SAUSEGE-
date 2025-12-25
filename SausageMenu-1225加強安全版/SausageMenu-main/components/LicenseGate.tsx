import React, { useState, useEffect } from 'react';
import { Key, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { SausageDogLogo, BoneIcon } from './DachshundAssets';
import { GUMROAD_PRODUCT_PERMALINK } from '../constants';

interface LicenseGateProps {
  children: React.ReactNode;
}

export const LicenseGate: React.FC<LicenseGateProps> = ({ children }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('sausage_license_key');
    if (savedKey) {
      verifyLicense(savedKey, true);
    } else {
      setCheckingStorage(false);
    }
  }, []);

  const verifyLicense = async (key: string, isAutoCheck = false) => {
    if (!key.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Call local Vercel API function instead of Gumroad directly
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_permalink: GUMROAD_PRODUCT_PERMALINK,
          license_key: key.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && !data.purchase.refunded && !data.purchase.chargebacked) {
        setIsVerified(true);
        localStorage.setItem('sausage_license_key', key.trim());
      } else {
        if (isAutoCheck) {
          localStorage.removeItem('sausage_license_key');
        }
        throw new Error('Invalid or expired license key.');
      }
    } catch (err) {
      console.error(err);
      setError(isAutoCheck ? 'Session expired. Please enter license again.' : 'Verification failed. Please check your key.');
      setIsVerified(false);
    } finally {
      setIsLoading(false);
      setCheckingStorage(false);
    }
  };

  if (checkingStorage) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-sausage-50">
        <Loader2 className="animate-spin text-sausage-600 w-10 h-10" />
      </div>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-sausage-50 relative overflow-hidden">
        {/* Background Decoration */}
        <BoneIcon className="absolute top-10 left-[-20px] w-32 h-32 text-sausage-100 rotate-45" />

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 z-10 border-4 border-sausage-100 text-center">
            <div className="mb-6 flex justify-center">
                <SausageDogLogo className="w-32 h-20" />
            </div>
            
            <h1 className="text-2xl font-black text-sausage-900 mb-2">Welcome!</h1>
            <p className="text-sausage-700 mb-6 text-sm">
                Please enter your purchase license key to unlock the full Sausage Dog Menu Pal experience.
            </p>

            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="text-gray-400" size={18} />
                    </div>
                    <input
                        type="text"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        placeholder="Paste License Key (XXXX-XXXX...)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sausage-500 text-sm font-mono"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <button
                    onClick={() => verifyLicense(licenseKey)}
                    disabled={isLoading || !licenseKey}
                    className="w-full bg-sausage-600 text-white py-3 rounded-xl font-bold hover:bg-sausage-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                    {isLoading ? 'Verifying...' : 'Unlock App'}
                </button>

                <p className="text-xs text-gray-400 mt-4">
                    Don't have a key? <a href={`https://gumroad.com/l/${GUMROAD_PRODUCT_PERMALINK}`} target="_blank" className="underline hover:text-sausage-600">Buy now on Gumroad</a>
                </p>
            </div>
        </div>
    </div>
  );
};