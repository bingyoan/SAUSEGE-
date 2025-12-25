import React from 'react';

export const SausageDogLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Body */}
    <path d="M25,35 Q20,35 15,30 Q10,25 10,20 Q10,10 20,10 L60,10 Q80,10 80,20 Q80,30 75,35" className="text-sausage-800" fill="#c2410c" stroke="none" />
    {/* Legs */}
    <path d="M25,35 L25,45 M35,35 L35,45 M65,35 L65,45 M75,35 L75,45" className="text-sausage-900" strokeWidth="4" />
    {/* Tail */}
    <path d="M10,20 Q5,15 5,10" className="text-sausage-900" strokeWidth="3" />
    {/* Head Area */}
    <circle cx="80" cy="18" r="10" className="text-sausage-800" fill="#c2410c" stroke="none" />
    {/* Ear */}
    <path d="M82,15 Q90,20 85,30" className="text-sausage-900" fill="#7c2d12" stroke="none" />
    {/* Eye */}
    <circle cx="82" cy="15" r="1.5" fill="white" />
    <circle cx="82.5" cy="15" r="0.5" fill="black" />
    {/* Nose */}
    <circle cx="90" cy="18" r="1.5" fill="black" />
    {/* Collar */}
    <path d="M72,12 L72,28" stroke="#fcd34d" strokeWidth="3" />
  </svg>
);

export const BoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.5,6c-1.7,0-3.2,0.9-4.2,2.3C12.9,7.5,12.5,6.9,12,6.9c-0.5,0-0.9,0.6-1.4,1.4C9.7,6.9,8.2,6,6.5,6C3.5,6,1,8.5,1,11.5c0,1.8,0.9,3.4,2.2,4.4C2.1,16.5,2,17,2,17.5C2,20.5,4.5,23,7.5,23c1.7,0,3.2-0.9,4.2-2.3c0.4,0.8,0.8,1.4,1.4,1.4c0.5,0,0.9-0.6,1.4-1.4c0.9,1.4,2.5,2.3,4.2,2.3c3,0,5.5-2.5,5.5-5.5c0-0.5-0.1-1-0.2-1.6c1.3-1,2.2-2.6,2.2-4.4C23,8.5,20.5,6,17.5,6z" />
  </svg>
);

export const PawPrint: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12,14c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,14,12,14z M6.7,11.8c1.6,0.8,3.5,0.2,4.3-1.4c0.8-1.6,0.2-3.5-1.4-4.3S6.1,6,5.3,7.6C4.5,9.2,5.1,11.1,6.7,11.8z M17.3,11.8c1.6-0.8,2.2-2.7,1.4-4.3S15.2,6,13.6,6.8c-1.6,0.8-2.2,2.7-1.4,4.3S15.7,12.6,17.3,11.8z M2.8,14.6c1.3,0.6,2.9-0.1,3.4-1.4c0.6-1.3-0.1-2.9-1.4-3.4C3.4,9.2,1.9,9.8,1.3,11.2C0.7,12.5,1.4,14.1,2.8,14.6z M21.2,14.6c1.3-0.6,1.9-2.2,1.4-3.4c-0.6-1.3-2.2-1.9-3.4-1.4c-1.3,0.6-1.9,2.2-1.4,3.4C18.4,14.6,20,15.2,21.2,14.6z"/>
    </svg>
);
