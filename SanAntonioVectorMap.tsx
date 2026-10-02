import React, { useState } from 'react';

interface SanAntonioVectorMapProps {
  className?: string;
  opacity?: number;
  maskId?: string;
  show3dDepth?: boolean;
}

export const SanAntonioVectorMap: React.FC<SanAntonioVectorMapProps> = ({
  className = '',
  opacity = 0.85
}) => {
  // Primary local asset path, with an instant dark high-res map fallback
  const [imgSrc, setImgSrc] = useState<string>('/san_antonio_dark_map.png');

  return (
    <div 
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden bg-[#000000] z-0 ${className}`}
      style={{ opacity }}
    >
      {/* 1. Real High-Resolution Dark Monochrome Street Grid */}
      <img
        src={imgSrc}
        alt="San Antonio City Street Network"
        className="w-full h-full object-cover object-center filter grayscale contrast-[175%] brightness-[80%]"
        onError={() => {
          // If local /san_antonio_dark_map.png is not yet uploaded, fall back to high-res dark aerial grid
          setImgSrc('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80');
        }}
      />

      {/* 2. Pitch-Black Obsidian Radial Vignette & Edge Dissolve */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 48%, rgba(0,0,0,0.1) 0%, rgba(4,7,17,0.55) 55%, #000000 92%)'
        }}
      />

      {/* 3. Top & Bottom Vertical Gradient Scrims (Ensures top controls & bottom dock stay pure black) */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#000000] via-[#000000]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" />
    </div>
  );
};

export default SanAntonioVectorMap;
