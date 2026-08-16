import React, { useState } from 'react';
import { Sliders } from 'lucide-react';

export default function BeforeAfterViewer({ beforeUrl, afterUrl, beforeLabel = "Before (Citizen Report)", afterLabel = "After (Official Repair)" }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div className="before-after-container-wrapper my-4">
      <div 
        className="before-after-container glass-panel"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Before Image (Base Layer) */}
        <img 
          src={beforeUrl} 
          alt="Before Repair" 
          className="before-image"
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-red-400 border border-red-500/30 z-10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          {beforeLabel}
        </div>

        {/* After Image (Top Clipped Layer) */}
        <div 
          className="after-wrapper"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={afterUrl} 
            alt="After Repair" 
            className="after-image"
            style={{ width: '100%', height: '100%' }}
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/30 z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {afterLabel}
          </div>
        </div>

        {/* Divider Handle */}
        <div 
          className="slider-handle"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="slider-handle-button">
            <Sliders size={16} />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
        <span>◀ Drag handle to compare before and after photos ▶</span>
        <span>{Math.round(sliderPosition)}% Resolution View</span>
      </div>
    </div>
  );
}
