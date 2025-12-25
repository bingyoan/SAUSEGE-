import React, { useState } from 'react';
import { Lock, Check, RefreshCw, Loader2 } from 'lucide-react';
import { GUMROAD_PRODUCT_PERMALINK } from '../constants';
import { supabase } from '../lib/supabase';

interface PaymentGateProps {
  userEmail: string | undefined;
  userId: string | undefined;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ userEmail, userId }) => {
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const gumroadLink = `https://gumroad.com/l/${GUMROAD_PRODUCT_PERMALINK}?email=${encodeURIComponent(userEmail || '')}`;

  const handleVerify = async () => {
    if (!userEmail || !userId) return;

    setVerifying(true);
    setVerifyError('');

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, userId })
      });

      const data = await res.json();

      if (data.verified) {
        // Refresh session to get updated metadata
        await supabase.auth.refreshSession();
        // Reload page to reflect new status
        window.location.reload();
      } else {
        setVerifyError('No purchase found. Please complete your purchase first.');
      }
    } catch (e) {
      setVerifyError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-sausage-600 p-4 rounded-full border-4 border-white shadow-lg">
          <Lock className="text-white w-8 h-8" />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-black text-sausage-900 mb-2">Premium Required</h2>
          <p className="text-gray-500 text-sm mb-6">
            Unlock unlimited menu scanning with a Pro subscription.
          </p>

          <ul className="text-left space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
            <li className="flex gap-2 text-sm text-gray-700 font-bold">
              <Check className="text-green-500" size={18} /> Unlimited Menu Scans
            </li>
            <li className="flex gap-2 text-sm text-gray-700 font-bold">
              <Check className="text-green-500" size={18} /> High-Speed AI Processing
            </li>
            <li className="flex gap-2 text-sm text-gray-700 font-bold">
              <Check className="text-green-500" size={18} /> Receipt Generation
            </li>
          </ul>

          <a
            href={gumroadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-sausage-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-sausage-700 active:scale-95 transition-all mb-3"
          >
            Upgrade Now
          </a>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {verifying ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            {verifying ? 'Verifying...' : 'Already Purchased? Verify'}
          </button>

          {verifyError && (
            <p className="text-red-500 text-xs mt-2">{verifyError}</p>
          )}

          <p className="text-[10px] text-gray-400 mt-4">
            Logged in as: {userEmail}
          </p>
        </div>
      </div>
    </div>
  );
};
