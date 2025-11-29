import React from 'react';

interface PolaroidFrameProps {
  imageSrc: string;
  caption: string;
  date: string;
  isDeveloping: boolean;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({ 
  imageSrc, 
  caption, 
  date,
  isDeveloping 
}) => {
  return (
    <div className="relative group cursor-default select-none">
      {/* Physical Paper Shadow/Effect */}
      <div className="relative bg-white pt-4 px-4 pb-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform transition-transform duration-500 hover:rotate-1 hover:scale-[1.02] w-[320px] sm:w-[360px] mx-auto">
        
        {/* The Photo Area */}
        <div className="relative aspect-square w-full bg-gray-900 overflow-hidden shadow-inner border border-gray-100">
          
          {/* Developing Overlay (covers image initially) */}
          <div 
            className={`absolute inset-0 bg-[#1a1a1a] z-10 transition-opacity duration-[3000ms] ease-in-out ${isDeveloping ? 'opacity-100' : 'opacity-0'}`} 
          />
          
          <img 
            src={imageSrc} 
            alt="Polaroid Memory" 
            className={`w-full h-full object-cover filter contrast-[1.1] saturate-[1.1] sepia-[0.1] transition-all duration-[3000ms] ${isDeveloping ? 'blur-md grayscale' : 'blur-0 grayscale-0'}`}
          />

          {/* Glare/Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/0 pointer-events-none mix-blend-overlay opacity-30" />
        </div>

        {/* Caption Area */}
        <div className={`mt-6 text-center transition-opacity duration-1000 delay-1000 ${isDeveloping ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-3xl font-handwriting text-gray-800 leading-tight min-h-[1.5em] px-2 break-words">
            {caption || "..."}
          </h2>
          <p className="text-[10px] text-gray-400 font-serif tracking-widest mt-2 uppercase">
            {date} • Polaroid Snap
          </p>
        </div>

        {/* Texture overlay for paper */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 pointer-events-none mix-blend-multiply" />
      </div>
    </div>
  );
};
