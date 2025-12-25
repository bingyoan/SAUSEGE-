import React, { useState } from 'react';
import { Key, ExternalLink, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { SausageDogLogo, PawPrint } from './DachshundAssets';
import toast from 'react-hot-toast';

interface ApiKeyGateProps {
  onSave: (key: string) => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedKey = inputKey.trim();

    if (!cleanedKey) {
      setError("Please enter an API Key.");
      return;
    }

    // Basic format validation for Google API Keys
    if (!cleanedKey.startsWith('AIza')) {
      setError("Invalid format. API Keys usually start with 'AIza'.");
      return;
    }

    // Save and proceed
    localStorage.setItem('gemini_api_key', cleanedKey);
    onSave(cleanedKey);
    toast.success("Welcome to Sausage Dog Menu Pal!");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-sausage-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <PawPrint className="absolute top-10 left-[-20px] w-32 h-32 text-sausage-100 rotate-[-15deg]" />
      <PawPrint className="absolute bottom-10 right-[-20px] w-48 h-48 text-sausage-100 rotate-[15deg]" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-sausage-100 relative z-10 animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center text-center mb-8">
          <SausageDogLogo className="w-32 h-20 mb-4" />
          <h1 className="text-3xl font-black text-sausage-900 mb-2">Welcome!</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            To start using <strong>Sausage Dog Menu Pal</strong>, you need to provide your own Google Gemini API Key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-sausage-800 uppercase tracking-wider ml-1">
              Your API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="text-gray-400" size={18} />
              </div>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => {
                    setInputKey(e.target.value);
                    setError(null);
                }}
                placeholder="AIzaSy..."
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-sausage-100 transition-all font-mono text-sm ${error ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-sausage-500'}`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-1 text-red-500 text-xs font-bold animate-pulse">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-sausage-600 hover:bg-sausage-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            Start Ordering <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div className="text-left">
              <p className="text-xs font-bold text-blue-800 mb-1">Your key is safe</p>
              <p className="text-[10px] text-blue-600 leading-tight mb-2">
                It is stored locally on your device (Browser Storage) and sent directly to Google. No middleman servers.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:underline hover:text-blue-800"
              >
                Get a free API Key here <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};