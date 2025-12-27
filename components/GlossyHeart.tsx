import React from 'react';

const GlossyHeart = ({ days }: { days: number }) => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center animate-heartbeat">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff758c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff7eb3', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="highlight" cx="30%" cy="30%" r="50%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
          </radialGradient>
          <filter id="glow">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
             <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* Main Heart Shape */}
        <path
          d="M100,180 C20,130 0,80 0,50 C0,20 25,0 55,0 C75,0 90,10 100,30 C110,10 125,0 145,0 C175,0 200,20 200,50 C200,80 180,130 100,180 Z"
          fill="url(#heartGradient)"
          stroke="#ff9eb5"
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Glossy Highlight for 3D effect */}
        <path
          d="M100,35 C90,20 75,10 55,10 C35,10 20,25 15,50"
          fill="none"
          stroke="url(#highlight)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
          transform="scale(0.8) translate(25, 10)"
        />
        <ellipse cx="60" cy="50" rx="15" ry="25" fill="url(#highlight)" transform="rotate(-20, 60, 50)" opacity="0.6"/>

      </svg>
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-6">
        <span className="text-5xl md:text-6xl font-bold drop-shadow-md tracking-tighter filter">{days}</span>
        <span className="text-xl md:text-2xl font-light uppercase tracking-[0.2em] mt-2 opacity-90">Days</span>
        <span className="text-xs md:text-sm font-serif italic opacity-80 mt-1">in love</span>
      </div>
    </div>
  );
};

export default GlossyHeart;