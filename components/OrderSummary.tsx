import React, { useState } from 'react';
import { X, Home, Users, Download } from 'lucide-react';
import { Cart, MenuData, CartItem } from '../types';
import { SausageDogLogo } from './DachshundAssets';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface OrderSummaryProps {
    cart: Cart;
    menuData: MenuData;
    onClose: () => void;
    onFinish: (paidBy: string) => void;
    taxRate: number;
    serviceRate: number;
    hidePrice?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    cart,
    menuData,
    onClose,
    onFinish,
    taxRate,
    serviceRate,
    hidePrice = false
}) => {
    const [personCount, setPersonCount] = useState(1);
    const [paidBy, setPaidBy] = useState('');
    const cartItems = Object.values(cart) as CartItem[];

    const totalPrice = cartItems.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);

    // Feature 1: Calculation Logic
    const taxAmount = totalPrice * (taxRate / 100);
    const serviceAmount = totalPrice * (serviceRate / 100);
    const finalPrice = totalPrice + taxAmount + serviceAmount;

    const finalConverted = finalPrice * menuData.exchangeRate;

    // Split Calculations
    const splitPriceOriginal = Math.ceil(finalPrice / personCount);
    const splitPriceConverted = Math.ceil(finalConverted / personCount);

    // Identify most expensive item
    const mostExpensiveItem = cartItems.reduce((prev, current) =>
        (prev.item.price * prev.quantity) > (current.item.price * current.quantity) ? prev : current
        , cartItems[0]);

    const handleShare = async () => {
        const element = document.getElementById('receipt-view');
        if (!element) return;
        const toastId = toast.loading('Printing receipt...');
        try {
            const originalRadius = element.style.borderRadius;
            element.style.borderRadius = '0';

            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#fff',
                logging: false
            });

            element.style.borderRadius = originalRadius;

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `SausageReceipt_${Date.now()}.png`;
            link.click();
            toast.success('Receipt printed to gallery!', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Printer jammed!', { id: toastId });
        }
    };

    return (
        <div className="fixed inset-0 bg-sausage-900 z-50 flex flex-col h-full">
            <div className="bg-gray-100 flex-1 flex flex-col overflow-hidden m-2 mb-0 rounded-t-3xl">
                {/* Header */}
                <div className="p-4 bg-white flex justify-between items-center shadow-sm z-10 sticky top-0">
                    <h2 className="text-xl font-black text-sausage-900">Checkout</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 pb-20">
                    <div id="receipt-view" className="bg-white p-6 rounded-none shadow-sm border border-gray-200 relative overflow-hidden mb-6 mx-auto max-w-sm font-mono">
                        {/* Jagged Edge Top */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-[radial-gradient(circle,transparent_50%,#fff_50%)] bg-[length:20px_20px] rotate-180 -mt-2"></div>

                        <div className="flex flex-col items-center mb-6 border-b-2 border-dashed border-black pb-4 mt-2">
                            <SausageDogLogo className="w-20 h-12 text-black mb-2" />
                            <h3 className="font-black text-black text-2xl uppercase tracking-widest">SAUSAGE PAL</h3>
                            <p className="text-gray-500 text-xs text-center uppercase">
                                {menuData.restaurantName || "STREET FOOD & GOOD VIBES"}<br />
                                {new Date().toLocaleString()}
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {cartItems.map(({ item, quantity }) => {
                                const lineTotalOriginal = item.price * quantity;
                                const lineTotalConverted = (lineTotalOriginal * menuData.exchangeRate).toFixed(0);
                                return (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div className="flex gap-2 items-start">
                                            <span className="font-bold text-black min-w-[20px]">{quantity}x</span>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase leading-none mb-0.5">{item.translatedName}</p>
                                                <p className="font-black text-sausage-900 text-sm leading-tight">{item.originalName}</p>
                                            </div>
                                        </div>
                                        {!hidePrice && (
                                            <div className="text-right">
                                                <span className="font-bold text-black block">
                                                    {lineTotalOriginal.toFixed(0)}
                                                </span>
                                                <span className="text-[10px] text-gray-400 block font-bold">
                                                    ≈ {lineTotalConverted}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {mostExpensiveItem && !hidePrice && (
                            <div className="mb-4 border border-black p-2 text-center">
                                <p className="text-[10px] uppercase font-bold">★ BIG SPENDER ITEM ★</p>
                                <p className="text-xs font-bold">{mostExpensiveItem.item.translatedName}</p>
                            </div>
                        )}

                        <div className="border-t-2 border-dashed border-black pt-4">
                            {!hidePrice ? (
                                <>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="font-bold text-gray-500 uppercase">Subtotal</span>
                                        <span className="font-bold">{totalPrice}</span>
                                    </div>
                                    {taxRate > 0 && (
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="text-gray-500 uppercase">Tax ({taxRate}%)</span>
                                            <span>{taxAmount.toFixed(0)}</span>
                                        </div>
                                    )}
                                    {serviceRate > 0 && (
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="text-gray-500 uppercase">Service ({serviceRate}%)</span>
                                            <span>{serviceAmount.toFixed(0)}</span>
                                        </div>
                                    )}

                                    {/* Dual Currency Total Display */}
                                    <div className="flex justify-between items-end mb-2 mt-2 pt-2 border-t border-dashed border-black">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-black uppercase text-sm">Total</span>
                                            <span className="text-[10px] text-gray-500">{menuData.originalCurrency}</span>
                                        </div>
                                        <span className="font-black text-3xl text-black">{finalPrice.toFixed(0)}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-black text-white p-2 rounded-lg">
                                        <span className="font-bold uppercase text-xs">Est. {menuData.targetCurrency}</span>
                                        <span className="font-black text-xl">≈ {finalConverted.toFixed(0)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6 border-b-2 border-dashed border-black mb-4">
                                    <p className="font-black text-black tracking-widest uppercase">Dish List Only</p>
                                    <p className="text-[10px] text-gray-400 italic">No price data available</p>
                                </div>
                            )}

                            {paidBy && (
                                <div className="mt-2 text-right text-xs uppercase font-bold text-black">
                                    PAID BY: {paidBy}
                                </div>
                            )}
                        </div>

                        {personCount > 1 && !hidePrice && (
                            <div className="mt-4 pt-3 border-t-2 border-dashed border-black">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-black uppercase">Split ({personCount})</span>
                                    <span className="font-black text-lg text-black">
                                        {splitPriceOriginal} <span className="text-[10px]">{menuData.originalCurrency}</span>
                                    </span>
                                </div>
                                <div className="flex justify-end items-center text-gray-600">
                                    <span className="text-sm font-bold">≈ {splitPriceConverted} {menuData.targetCurrency} / ea</span>
                                </div>
                            </div>
                        )}

                        {/* Barcode Stub */}
                        <div className="mt-6 flex flex-col items-center opacity-80">
                            <div className="h-8 w-full bg-[repeating-linear-gradient(90deg,black,black_2px,white_2px,white_4px)]"></div>
                            <p className="text-[10px] text-center mt-1">THANK YOU FOR EATING</p>
                        </div>

                        {/* Jagged Edge Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[radial-gradient(circle,transparent_50%,#fff_50%)] bg-[length:20px_20px] mb-[-10px]"></div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-sausage-800 uppercase mb-1 block">Who Paid First?</label>
                            <input
                                type="text"
                                value={paidBy}
                                onChange={(e) => setPaidBy(e.target.value)}
                                placeholder="Enter Name (Optional)"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-sausage-500"
                            />
                        </div>

                        {!hidePrice && (
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-sausage-800 font-bold text-sm">
                                    <Users size={16} /> Split Calculator
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 p-1 rounded-xl">
                                    <button onClick={() => setPersonCount(Math.max(1, personCount - 1))} className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-600">-</button>
                                    <div className="text-center">
                                        <span className="font-black text-xl text-gray-800 block leading-none">{personCount}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">PERSONS</span>
                                    </div>
                                    <button onClick={() => setPersonCount(personCount + 1)} className="w-10 h-10 bg-sausage-600 text-white rounded-lg shadow-sm flex items-center justify-center font-bold">+</button>
                                </div>

                                {/* Real-time Split Preview */}
                                <div className="mt-2 p-2 bg-sausage-50 rounded-lg border border-sausage-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-sausage-800">Per Person:</span>
                                    <div className="text-right">
                                        <span className="block text-sm font-black text-sausage-900">{splitPriceOriginal} {menuData.originalCurrency}</span>
                                        <span className="block text-xs font-bold text-sausage-600">≈ {splitPriceConverted} {menuData.targetCurrency}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer Actions */}
                <div className="bg-white p-4 border-t border-gray-200 grid grid-cols-2 gap-3 safe-area-bottom shrink-0">
                    <button onClick={handleShare} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold gap-1">
                        <Download size={20} /> <span className="text-xs">Receipt Img</span>
                    </button>
                    <button onClick={() => onFinish(paidBy)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-sausage-600 text-white hover:bg-sausage-700 font-bold gap-1 shadow-md">
                        <Home size={20} /> <span className="text-xs">Finish Order</span>
                    </button>
                </div>
            </div>
        </div>
    );
};