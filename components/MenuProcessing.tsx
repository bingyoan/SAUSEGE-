import React, { useEffect, useState, useMemo } from 'react';
import { SausageDogLogo, BoneIcon } from './DachshundAssets';
import { motion } from 'framer-motion';
import { ETIQUETTE_TIPS } from '../constants';
import { GeoLocation, TargetLanguage } from '../types';

interface MenuProcessingProps {
  scanLocation?: GeoLocation;
  targetLang: TargetLanguage;
}

const STEPS = [
  "Compressing images...",
  "Uploading to AI...",
  "Analyzing menu structure...",
  "Applying Strict OCR...",
  "Translating tasty treats...",
  "Detecting allergens...",
  "Finalizing details..."
];

export const MenuProcessing: React.FC<MenuProcessingProps> = ({ scanLocation, targetLang }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate through ALL tips every 5 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % ETIQUETTE_TIPS.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  const currentTip = ETIQUETTE_TIPS[tipIndex];

  useEffect(() => {
    const intervals = [1000, 1500, 3000, 2000, 2000, 1500, 2000];
    let stepIndex = 0;

    const advanceStep = () => {
      if (stepIndex < STEPS.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setTimeout(advanceStep, intervals[stepIndex] || 2000);
      }
    };
    const initialTimeout = setTimeout(advanceStep, intervals[0]);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, []);

  // Determine which language to show for the content
  const displayContent = currentTip.content[targetLang] || currentTip.content[TargetLanguage.English] || "Wait a moment...";

  return (
    <div className="flex flex-col items-center justify-center h-full bg-sausage-50 p-8 relative">
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <SausageDogLogo className="w-48 h-32" />
        </motion.div>
        <motion.div
          className="absolute top-0 right-[-30px] text-sausage-400"
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <BoneIcon className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Feature 10: Dining Etiquette Tip Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-md border-2 border-sausage-100 mb-8 min-h-[160px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-sausage-200"></div>
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Dining Etiquette: {currentTip.countryName}
        </p>

        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-xl font-black text-sausage-900 leading-snug">
            DID YOU KNOW?
          </h3>

          <div className="mt-2 pt-2 border-t border-dashed border-gray-100">
            <p className="text-md font-bold text-gray-700 leading-relaxed">
              "{displayContent}"
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="h-2 bg-sausage-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sausage-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="h-8 relative overflow-hidden text-center">
          {STEPS.map((step, index) => (
            index === currentStep && (
              <motion.p
                key={step}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute inset-0 w-full text-sausage-800 font-bold text-lg"
              >
                {step}
              </motion.p>
            )
          ))}
        </div>
      </div>
    </div>
  );
};