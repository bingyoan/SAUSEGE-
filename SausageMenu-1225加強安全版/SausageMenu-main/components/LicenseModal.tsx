import React, { useState } from 'react';
import { Lock, X, ExternalLink, Loader2, Key } from 'lucide-react';
import { SausageDogLogo } from './DachshundAssets';
import { GUMROAD_PRODUCT_PERMALINK } from '../constants';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (key: string) => Promise<boolean>;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const success = await onVerify(key);
      if (success) {
        onClose();
      } else {
        setError('Invalid license key');
      }
    } catch (e) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative overflow-hidden text-center border-4 border-sausage-100">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
            <div className="bg-sausage-100 p-4 rounded-full">
                <Lock className="w-8 h-8 text-sausage-600" />
            </div>
        </div>

        <h2 className="text-2xl font-black text-sausage-900 mb-2">License Required</h2>
        <p className="text-sausage-700 mb-6 text-sm">
            To use the multi-image menu translation feature, please enter your purchase license key.
        </p>

        <div className="space-y-4">
            <div className="relative">
                <Key className="absolute left-3 top-3.5 text-gray-400" size={16} />
                <input 
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter License Key"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-sausage-500 focus:outline-none text-sm font-mono"
                />
            </div>
            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <button
                onClick={handleVerify}
                disabled={loading || !key}
                className="w-full bg-sausage-600 text-white py-3 rounded-xl font-bold hover:bg-sausage-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Unlock App'}
            </button>

            <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Don't have a key yet?</p>
                <a 
                    href={`https://bingyoan.gumroad.com/l/${GUMROAD_PRODUCT_PERMALINK}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-sausage-100 text-sausage-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sausage-200"
                >
                    Buy License <ExternalLink size={16} />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};