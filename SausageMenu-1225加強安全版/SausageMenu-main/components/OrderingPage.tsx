import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, AlertTriangle, Info, Filter, X, Check, Zap } from 'lucide-react';
import { MenuItem, MenuData, Cart, TargetLanguage, CartItem, MenuOption } from '../types';
import { explainDish } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { ALLERGENS_LIST, ALLERGENS_MAP } from '../constants';
import { SausageDogLogo } from './DachshundAssets';

interface OrderingPageProps {
    apiKey: string;
    menuData: MenuData;
    cart: Cart;
    targetLang: TargetLanguage;
    onUpdateCart: (item: MenuItem, delta: number) => void;
    onViewSummary: () => void;
    onBack: () => void;
    taxRate: number;
    serviceRate: number;
    hidePrice?: boolean;
}

export const OrderingPage: React.FC<OrderingPageProps> = ({
    apiKey,
    menuData,
    cart,
    targetLang,
    onUpdateCart,
    onViewSummary,
    onBack,
    taxRate,
    serviceRate,
    hidePrice = false
}) => {
    const [activeCategory, setActiveCategory] = useState<string>(menuData.items[0]?.category || 'General');
    const [explanations, setExplanations] = useState<Record<string, string>>({});
    const [loadingExplanation, setLoadingExplanation] = useState<string | null>(null);

    // Feature 1: Allergen Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

    // Feature 9: Easter Egg State
    const [showRareDog, setShowRareDog] = useState(false);

    // Calculate totals
    const cartValues = Object.values(cart) as CartItem[];
    const baseTotal = cartValues.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
    const multiplier = 1 + (taxRate + serviceRate) / 100;
    const finalTotalOriginal = baseTotal * multiplier;
    const finalTotalConverted = finalTotalOriginal * menuData.exchangeRate;
    const totalItems = cartValues.reduce((sum, item) => sum + item.quantity, 0);

    // Easter Egg Logic
    useEffect(() => {
        const hour = new Date().getHours();
        const isLateNight = hour >= 22 || hour < 4;
        const isHighValue = finalTotalOriginal > 5000;

        if ((isLateNight || isHighValue) && !showRareDog) {
            setShowRareDog(true);
        }
    }, [cart, finalTotalOriginal]);

    const toggleAllergen = (allergen: string) => {
        setExcludedAllergens(prev =>
            prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
        );
    };

    const groupedItems = useMemo<Record<string, MenuItem[]>>(() => {
        const groups: Record<string, MenuItem[]> = {};
        menuData.items.forEach(item => {
            const cat = item.category || 'Others';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [menuData.items]);

    const categories = Object.keys(groupedItems);

    const handleExplain = async (item: MenuItem) => {
        if (explanations[item.id]) return;
        setLoadingExplanation(item.id);
        const text = await explainDish(apiKey, item.originalName, menuData.detectedLanguage, targetLang);
        setExplanations(prev => ({ ...prev, [item.id]: text }));
        setLoadingExplanation(null);
    };

    const scrollToCategory = (cat: string) => {
        setActiveCategory(cat);
        const element = document.getElementById(`cat-${cat}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const createVariantItem = (baseItem: MenuItem, option: MenuOption, index: number): MenuItem => {
        return {
            ...baseItem,
            id: `${baseItem.id}-opt-${index}`,
            translatedName: `${baseItem.translatedName} - ${option.name}`,
            originalName: `${baseItem.originalName} (${option.name})`,
            price: option.price,
            options: []
        };
    };

    // Check if item should be dimmed based on allergens
    const isRisky = (item: MenuItem) => {
        if (!item.allergens) return false;
        return item.allergens.some(a => excludedAllergens.includes(a));
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 relative">
            {/* Sticky Top Bar */}
            <div className="bg-white shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                    <button onClick={onBack} className="p-2 text-sausage-800 hover:bg-sausage-50 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1">
                        <h2 className="font-bold text-sausage-900 leading-tight">Menu</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-gray-500">{menuData.items.length} dishes</p>

                            {/* Token Usage Display */}
                            {menuData.usageMetadata && (
                                <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-500 font-mono" title={`Prompt: ${menuData.usageMetadata.promptTokenCount} | Output: ${menuData.usageMetadata.candidatesTokenCount}`}>
                                    <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                                    {menuData.usageMetadata.totalTokenCount}
                                </div>
                            )}

                            {excludedAllergens.length > 0 && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded-full font-bold">
                                    Filter Active
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Feature 1: Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`p-2 rounded-full border transition-colors ${excludedAllergens.length > 0 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600'}`}
                    >
                        <Filter size={20} />
                    </button>
                </div>

                <div className="flex overflow-x-auto hide-scrollbar px-2 py-2 gap-2 bg-white/95 backdrop-blur-sm">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-sausage-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32">
                {categories.map((category) => (
                    <div key={category} id={`cat-${category}`} className="scroll-mt-36">
                        <h3 className="text-xl font-black text-sausage-900 mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-sausage-500 rounded-full"></div>
                            {category}
                        </h3>

                        <div className="grid gap-4">
                            {groupedItems[category].map((item) => {
                                const quantity = cart[item.id]?.quantity || 0;
                                const convertedPrice = (item.price * menuData.exchangeRate).toFixed(0);
                                const risky = isRisky(item);

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        key={item.id}
                                        className={`bg-white rounded-2xl p-4 shadow-sm border-2 relative overflow-hidden transition-all duration-300 ${quantity > 0 ? 'border-sausage-400 ring-2 ring-sausage-100' : 'border-gray-100'} ${risky ? 'opacity-40 grayscale-[0.8]' : ''}`}
                                    >
                                        {/* Item Info */}
                                        <div className="mb-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-extrabold text-gray-800 text-lg leading-tight">{item.translatedName}</h4>
                                                {(item.allergy_warning || risky) && (
                                                    <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${risky ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>
                                                        <AlertTriangle size={10} /> {risky ? 'AVOID' : 'Allergen'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium mt-0.5">{item.originalName}</p>
                                        </div>

                                        {/* Description & Tags */}
                                        <div className="bg-amber-50 rounded-xl p-3 mb-3 border border-amber-100 relative">
                                            {item.shortDescription && (
                                                <p className="text-amber-900 text-sm font-medium mb-2 leading-relaxed">{item.shortDescription}</p>
                                            )}
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {item.dietary_tags?.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-white text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">{tag}</span>
                                                ))}
                                                {item.allergens?.map(alg => (
                                                    <span key={alg} className={`text-[10px] border px-1.5 py-0.5 rounded ${excludedAllergens.includes(alg) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-400 border-red-200'}`}>
                                                        {ALLERGENS_MAP[targetLang]?.[alg] || alg}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Variants/Options Display */}
                                            {item.options && item.options.length > 0 && (
                                                <div className="mt-2 border-t border-amber-200 pt-2">
                                                    <p className="text-[10px] uppercase font-bold text-amber-500 mb-2">Available Options</p>
                                                    <div className="space-y-2">
                                                        {item.options.map((opt, idx) => {
                                                            const variantItem = createVariantItem(item, opt, idx);
                                                            const vQty = cart[variantItem.id]?.quantity || 0;

                                                            return (
                                                                <div key={idx} className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-amber-100">
                                                                    <div className="flex-1 mr-2">
                                                                        <div className="text-xs font-bold text-amber-900">{opt.name}</div>
                                                                        <div className="text-[10px] font-mono text-amber-700">{opt.price} {menuData.originalCurrency}</div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-amber-200 p-0.5">
                                                                        <button
                                                                            onClick={() => onUpdateCart(variantItem, -1)}
                                                                            disabled={vQty === 0}
                                                                            className={`w-6 h-6 flex items-center justify-center rounded-md ${vQty > 0 ? 'bg-amber-100 text-amber-800' : 'text-gray-300'}`}
                                                                        >
                                                                            <Minus size={12} />
                                                                        </button>
                                                                        <span className={`w-4 text-center text-xs font-bold ${vQty > 0 ? 'text-amber-900' : 'text-gray-300'}`}>{vQty}</span>
                                                                        <button
                                                                            onClick={() => onUpdateCart(variantItem, 1)}
                                                                            className="w-6 h-6 flex items-center justify-center rounded-md bg-amber-500 text-white hover:bg-amber-600"
                                                                        >
                                                                            <Plus size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {explanations[item.id] ? (
                                                <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-100">
                                                    💡 {explanations[item.id]}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleExplain(item)}
                                                    disabled={loadingExplanation === item.id}
                                                    className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 mt-2 transition-colors"
                                                >
                                                    {loadingExplanation === item.id ? 'Thinking...' : <><Info size={12} /> Explain</>}
                                                </button>
                                            )}
                                        </div>

                                        {/* Base Item Price & Action */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div>
                                                {!hidePrice ? (
                                                    <>
                                                        <span className="block font-black text-xl text-sausage-900">
                                                            {convertedPrice} <span className="text-xs font-bold text-sausage-600">{menuData.targetCurrency}</span>
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-mono">
                                                            {item.price} {menuData.originalCurrency}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-400 italic">Price Hidden</span>
                                                )}
                                            </div>
                                            <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
                                                <button
                                                    onClick={() => onUpdateCart(item, -1)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${quantity > 0 ? 'bg-white text-sausage-700 shadow-sm' : 'text-gray-300'}`}
                                                    disabled={quantity === 0}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className={`w-8 text-center font-bold ${quantity > 0 ? 'text-sausage-900' : 'text-gray-300'}`}>
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateCart(item, 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-sausage-600 text-white shadow-md hover:bg-sausage-700 active:scale-95 transition-transform"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Footer */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 bg-white border-t border-sausage-100 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] p-4 z-40 pb-6 safe-area-bottom"
                    >
                        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                {!hidePrice ? (
                                    <>
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Est. Final Total</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-sausage-900">{finalTotalConverted.toFixed(0)}</span>
                                            <span className="text-sm font-bold text-sausage-600">{menuData.targetCurrency}</span>
                                        </div>
                                        {(taxRate > 0 || serviceRate > 0) && (
                                            <span className="text-[10px] text-gray-400">
                                                Includes {taxRate}% Tax & {serviceRate}% Service
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-sausage-500 font-black uppercase tracking-widest">Dish List Mode</span>
                                        <span className="text-lg font-bold text-sausage-900 leading-none">Ready to Checkout</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onViewSummary}
                                className="flex-1 bg-sausage-900 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg hover:bg-sausage-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {hidePrice ? "View Summary" : "Checkout"} <span className="bg-sausage-700 px-2 py-0.5 rounded text-sm">{totalItems}</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feature 1: Allergen Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-sausage-900 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" /> Dietary Exclusions
                            </h3>
                            <button onClick={() => setIsFilterOpen(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Select ingredients you want to avoid. Items containing these will be dimmed.</p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {ALLERGENS_LIST.map(alg => (
                                <button
                                    key={alg}
                                    onClick={() => toggleAllergen(alg)}
                                    className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-between ${excludedAllergens.includes(alg) ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                                >
                                    {ALLERGENS_MAP[targetLang]?.[alg] || alg}
                                    {excludedAllergens.includes(alg) && <Check size={16} />}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full bg-sausage-900 text-white py-3 rounded-xl font-bold"
                        >
                            Apply Filters
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Feature 9: Easter Egg - Rare Dog */}
            <AnimatePresence>
                {showRareDog && (
                    <motion.div
                        initial={{ x: 100, rotate: 0 }}
                        animate={{ x: 0, rotate: [0, -10, 10, 0] }}
                        exit={{ x: 200 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-32 right-0 z-40 bg-purple-600 text-white p-3 rounded-l-2xl shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                            alert("WOOF! You found the Late Night Party Dog! 🌭🎉");
                            setShowRareDog(false);
                        }}
                    >
                        <SausageDogLogo className="w-12 h-8 text-yellow-300 drop-shadow-md" />
                        <div className="text-xs font-bold leading-tight">
                            RARE<br />DOG!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};