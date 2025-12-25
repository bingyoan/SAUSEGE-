import React, { useRef, useState } from 'react';
import { Camera, Upload, Globe, History, Settings, CheckCircle, Lock, PenTool } from 'lucide-react';
import { TargetLanguage } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';
import { SausageDogLogo, PawPrint } from './DachshundAssets';

interface WelcomeScreenProps {
    onLanguageChange: (lang: TargetLanguage) => void;
    selectedLanguage: TargetLanguage;
    onImagesSelected: (files: File[], isHandwritingMode: boolean) => void;
    onViewHistory: () => void;
    onOpenSettings: () => void;
    isVerified: boolean;
    hasApiKey: boolean;
    hidePrice: boolean;
    onHidePriceChange: (hide: boolean) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
    onLanguageChange,
    selectedLanguage,
    onImagesSelected,
    onViewHistory,
    onOpenSettings,
    isVerified,
    hasApiKey,
    hidePrice,
    onHidePriceChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Feature 11: Handwriting Mode State
    const [isHandwritingMode, setIsHandwritingMode] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onImagesSelected(Array.from(e.target.files), isHandwritingMode);
        }
    };

    return (
        <div className="flex flex-col h-full bg-sausage-50 relative">
            {/* Fixed Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <PawPrint className="absolute top-10 left-[-20px] w-24 h-24 text-sausage-200 opacity-50 rotate-[-15deg]" />
                <PawPrint className="absolute bottom-10 right-[-20px] w-40 h-40 text-sausage-200 opacity-50 rotate-[15deg]" />
            </div>

            {/* Header */}
            <div className="flex justify-between p-4 z-20 sticky top-0 bg-sausage-50/80 backdrop-blur-sm">
                <button
                    onClick={onOpenSettings}
                    className={`p-3 rounded-full transition-colors shadow-sm border border-sausage-100 flex items-center justify-center ${!hasApiKey ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-sausage-700 hover:bg-sausage-50'}`}
                >
                    <Settings size={20} />
                </button>

                <button
                    onClick={onViewHistory}
                    className="p-3 bg-white text-sausage-700 rounded-full hover:bg-sausage-50 transition-colors shadow-sm border border-sausage-100"
                >
                    <History size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-6 z-10">
                <div className="text-center pt-4">
                    <div className="animate-bounce-slow inline-block">
                        <SausageDogLogo className="w-48 h-32 mx-auto drop-shadow-lg" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-sausage-900 mt-4 tracking-tight leading-tight">
                        Sausage Dog <br /><span className="text-sausage-600">Menu Pal</span>
                    </h1>

                    <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${isVerified ? 'bg-white border-green-200 text-green-600' : 'bg-white border-sausage-200 text-sausage-600'}`}>
                        {isVerified ? <><CheckCircle size={12} /> PRO UNLIMITED</> : <><Lock size={12} /> FREE MODE</>}
                    </div>
                </div>

                <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-[2rem] shadow-xl border-4 border-sausage-100 space-y-5">
                    {/* Language Selector */}
                    <div className="bg-sausage-50 p-1 rounded-xl border border-sausage-200">
                        <div className="flex items-center gap-2 px-3 py-2 text-sausage-800 font-bold text-xs uppercase tracking-wider mb-1">
                            <Globe size={14} /> Translate to
                        </div>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => onLanguageChange(e.target.value as TargetLanguage)}
                            className="w-full p-3 bg-white rounded-lg shadow-sm text-sausage-900 focus:outline-none font-bold text-lg text-center"
                        >
                            {LANGUAGE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Handwriting Mode Toggle */}
                    <div
                        onClick={() => setIsHandwritingMode(!isHandwritingMode)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${isHandwritingMode ? 'bg-amber-50 border-amber-400' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isHandwritingMode ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-400'}`}>
                                <PenTool size={20} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isHandwritingMode ? 'text-amber-900' : 'text-gray-500'}`}>Handwriting Mode</p>
                                <p className="text-[10px] text-gray-400 leading-tight">For calligraphy & vertical text</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isHandwritingMode ? 'bg-amber-500' : 'bg-gray-200'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isHandwritingMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                    {/* New: Hide Price Feature */}
                    <div
                        onClick={() => onHidePriceChange(!hidePrice)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${hidePrice ? 'bg-sausage-50 border-sausage-400' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${hidePrice ? 'bg-sausage-200 text-sausage-800' : 'bg-gray-100 text-gray-400'}`}>
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${hidePrice ? 'text-sausage-900' : 'text-gray-500'}`}>僅顯示餐點名稱</p>
                                <p className="text-[10px] text-gray-400 leading-tight">隱藏菜單上的價格顯示</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${hidePrice ? 'bg-sausage-600' : 'bg-gray-200'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${hidePrice ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-1">
                        <button
                            onClick={() => cameraInputRef.current?.click()}
                            disabled={!hasApiKey}
                            className={`w-full py-5 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 font-bold transition-all active:scale-95 border-b-4 ${hasApiKey ? 'bg-sausage-600 border-sausage-800 hover:bg-sausage-700 text-white' : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'}`}
                        >
                            <Camera size={32} />
                            <span className="text-lg">Take Photo</span>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!hasApiKey}
                            className={`w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${hasApiKey ? 'bg-white border-sausage-300 text-sausage-700 hover:bg-sausage-50' : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}
                        >
                            <Upload size={20} />
                            Upload from Gallery
                        </button>
                    </div>
                </div>
            </div>

            <input type="file" accept="image/*" multiple capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />
            <input type="file" accept="image/*" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>
    );
};