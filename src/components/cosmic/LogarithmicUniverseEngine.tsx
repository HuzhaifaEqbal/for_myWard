'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { universeData, UniverseObject } from '@/data/universeData';

export default function LogarithmicUniverseEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zoom range from 10^-16 to 10^28
  const MIN_ZOOM = -16;
  const MAX_ZOOM = 28;

  // Zoom levels: current (animated) and target
  const [zoomLevel, setZoomLevel] = useState<number>(0); // 10^0 = 1 meter (Human scale)
  const targetZoomRef = useRef<number>(0);
  const currentZoomRef = useRef<number>(0);

  const [activeItem, setActiveItem] = useState<UniverseObject | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Image cache
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Touch tracking for pinch-to-zoom & drag
  const touchStateRef = useRef<{
    lastY: number;
    initialPinchDistance: number | null;
    initialZoom: number;
  }>({
    lastY: 0,
    initialPinchDistance: null,
    initialZoom: 0,
  });

  // Preload all images
  useEffect(() => {
    let count = 0;
    const total = universeData.length;

    universeData.forEach((item) => {
      const img = new Image();
      if (item.image_url.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = item.image_url;

      img.onload = () => {
        imageCacheRef.current.set(item.id, img);
        count++;
        setLoadedCount(count);
        if (count === total) {
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load image for: ${item.name_en}`);
        count++;
        setLoadedCount(count);
        if (count === total) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // Update active item based on current zoom level
  const updateActiveItem = useCallback((zoom: number) => {
    let closest: UniverseObject | null = null;
    let minDiff = Infinity;

    for (const item of universeData) {
      const itemLog = Math.log10(item.scale);
      const diff = Math.abs(itemLog - zoom);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    }

    if (minDiff < 1.4) {
      setActiveItem(closest);
    } else {
      setActiveItem(null);
    }
  }, []);

  // Set zoom to a specific object
  const jumpToObject = (item: UniverseObject) => {
    const target = Math.log10(item.scale);
    targetZoomRef.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));
  };

  // Canvas render & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Smooth interpolation (lerp) toward target zoom
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.12;
      const currentZoom = currentZoomRef.current;
      setZoomLevel(currentZoom);
      updateActiveItem(currentZoom);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space gradient background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) / 1.1
      );
      bgGrad.addColorStop(0, '#0a1024');
      bgGrad.addColorStop(0.5, '#050a18');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Dynamic Stars background
      const starSeed = Math.floor(currentZoom * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 60; i++) {
        const x = (Math.sin(i * 99 + starSeed) * 0.5 + 0.5) * width;
        const y = (Math.cos(i * 33 + starSeed) * 0.5 + 0.5) * height;
        const radius = ((i % 3) + 1) * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const viewportSize = Math.pow(10, currentZoom);
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw grid / scale concentric circles
      ctx.strokeStyle = 'rgba(168, 180, 208, 0.08)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (height / 2) * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Iterate through universeData and render visible objects
      universeData.forEach((item) => {
        // screenSize in pixels
        const screenSize = (item.scale / viewportSize) * (height / 2);

        // Visible if between 8px and 3.5x canvas width
        if (screenSize >= 8 && screenSize <= width * 3.5) {
          // Compute opacity based on size to smoothly fade in/out
          let opacity = 1;
          if (screenSize < 24) {
            opacity = Math.max(0, (screenSize - 8) / 16);
          } else if (screenSize > width * 2) {
            opacity = Math.max(0, (width * 3.5 - screenSize) / (width * 1.5));
          }

          ctx.save();
          ctx.globalAlpha = opacity;

          const img = imageCacheRef.current.get(item.id);
          const drawRadius = screenSize / 2;

          if (img && img.complete && img.naturalWidth > 0) {
            // Draw image centered
            ctx.drawImage(
              img,
              centerX - drawRadius,
              centerY - drawRadius,
              screenSize,
              screenSize
            );
          } else {
            // Fallback stylized glowing sphere
            const glow = ctx.createRadialGradient(
              centerX, centerY, drawRadius * 0.2,
              centerX, centerY, drawRadius
            );
            glow.addColorStop(0, '#f7be1d');
            glow.addColorStop(0.7, '#c0c6de');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(centerX, centerY, drawRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          // Subtle glowing selection halo
          ctx.strokeStyle = 'rgba(247, 190, 29, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, drawRadius + 6, 0, Math.PI * 2);
          ctx.stroke();

          // Draw Object Name & Scale below the item
          if (screenSize >= 28 && screenSize <= width * 1.8) {
            ctx.font = 'bold 15px Geist, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const textY = Math.min(height - 40, centerY + drawRadius + 14);

            // Text background pill
            const text = item.name_ar;
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = 'rgba(5, 20, 36, 0.75)';
            ctx.beginPath();
            ctx.roundRect(centerX - textWidth / 2 - 12, textY - 4, textWidth + 24, 28, 14);
            ctx.fill();
            ctx.strokeStyle = 'rgba(247, 190, 29, 0.4)';
            ctx.stroke();

            // Text content
            ctx.fillStyle = '#f7be1d';
            ctx.fillText(text, centerX, textY + 2);
          }

          ctx.restore();
        }
      });

      // HUD: Current Scale Marker Top Left
      ctx.fillStyle = 'rgba(168, 180, 208, 0.8)';
      ctx.font = '12px Geist, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `المقياس البصري: 10^${currentZoom.toFixed(1)} متر (${viewportSize < 0.001 ? viewportSize.toExponential(2) : viewportSize.toLocaleString()} م)`,
        24,
        28
      );

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateActiveItem]);

  // Wheel zoom handler with preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Scrolling down (e.deltaY > 0) -> zooms in (decreases zoom level or increases scale magnification)
      // Scrolling up (e.deltaY < 0) -> zooms out (increases zoom level)
      const zoomDelta = e.deltaY * 0.003;
      targetZoomRef.current = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, targetZoomRef.current + zoomDelta)
      );
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Touch handlers (Drag & Pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStateRef.current.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStateRef.current.initialPinchDistance = dist;
      touchStateRef.current.initialZoom = targetZoomRef.current;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const deltaY = e.touches[0].clientY - touchStateRef.current.lastY;
      touchStateRef.current.lastY = e.touches[0].clientY;
      targetZoomRef.current = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, targetZoomRef.current - deltaY * 0.03)
      );
    } else if (e.touches.length === 2 && touchStateRef.current.initialPinchDistance) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStateRef.current.initialPinchDistance;
      const zoomChange = Math.log10(ratio) * 4;
      targetZoomRef.current = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, touchStateRef.current.initialZoom - zoomChange)
      );
    }
  };

  const handleTouchEnd = () => {
    touchStateRef.current.initialPinchDistance = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full rounded-3xl overflow-hidden bg-[#02040a] border border-outline-variant/30 shadow-2xl flex flex-col items-center select-none"
    >
      {/* Canvas viewport */}
      <div className="relative w-full h-[580px] md:h-[650px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-grab active:cursor-grabbing"
        />

        {/* Top Controls: Zoom IN / OUT Buttons */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <button
            onClick={() => {
              targetZoomRef.current = Math.min(MAX_ZOOM, targetZoomRef.current + 2);
            }}
            className="w-10 h-10 rounded-xl bg-surface-container-high/80 hover:bg-tertiary hover:text-surface text-on-surface border border-outline-variant/40 backdrop-blur-md flex items-center justify-center transition-all shadow-lg"
            title="تكبير المدى الكوني (Zoom Out)"
          >
            <span className="material-symbols-outlined text-xl">zoom_out</span>
          </button>
          <button
            onClick={() => {
              targetZoomRef.current = Math.max(MIN_ZOOM, targetZoomRef.current - 2);
            }}
            className="w-10 h-10 rounded-xl bg-surface-container-high/80 hover:bg-tertiary hover:text-surface text-on-surface border border-outline-variant/40 backdrop-blur-md flex items-center justify-center transition-all shadow-lg"
            title="التقريب إلى أدق الجسيمات (Zoom In)"
          >
            <span className="material-symbols-outlined text-xl">zoom_in</span>
          </button>
        </div>

        {/* Top Right: Info Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/70 border border-primary/20 backdrop-blur-md text-xs text-primary font-ui-header">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>حرّك عجلة الماوس أو المس للشاشات للتقريب والتبعيد</span>
        </div>

        {/* Quranic Glassmorphism Overlay Card */}
        {activeItem && (
          <div className="absolute top-16 md:top-20 right-4 left-4 md:right-8 md:left-auto md:max-w-md z-20 animate-fade-in pointer-events-auto">
            <div className="backdrop-blur-xl bg-black/75 text-white rounded-2xl p-6 border border-tertiary/30 shadow-[0_0_35px_rgba(247,190,29,0.15)] transition-all duration-300">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-tertiary font-ui-header">
                    {activeItem.name_ar}
                  </h3>
                  <span className="text-xs text-gray-400 font-label-mono">
                    {activeItem.name_en} • {activeItem.scale_display}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                </div>
              </div>

              {/* Quranic Ayah */}
              <div className="bg-tertiary/5 rounded-xl p-4 border-r-4 border-tertiary mb-3 text-right">
                <p
                  className="text-xl md:text-2xl text-yellow-300 leading-relaxed font-verse-display"
                  dir="rtl"
                >
                  ﴿ {activeItem.ayah} ﴾
                </p>
                <div className="text-left text-xs text-tertiary/70 mt-2 font-label-mono">
                  {activeItem.surah_ref}
                </div>
              </div>

              {/* Tafsir / Reflection */}
              <p
                className="text-sm md:text-base text-gray-200 leading-relaxed text-right font-body-main"
                dir="rtl"
              >
                {activeItem.tafsir}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Scale Slider & Quick Jump Pointers */}
      <div className="w-full bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline-variant/20 p-4 md:p-6 z-20 flex flex-col gap-4">
        {/* Slider */}
        <div className="flex items-center gap-4 px-2">
          <span className="text-xs font-label-mono text-primary whitespace-nowrap">
            10⁻¹⁶ م (دون ذري)
          </span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step="0.05"
            value={zoomLevel}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              targetZoomRef.current = val;
            }}
            className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-tertiary"
          />
          <span className="text-xs font-label-mono text-tertiary whitespace-nowrap">
            10²⁸ م (الكون كله)
          </span>
        </div>

        {/* Quick jump badges / pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {universeData.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => jumpToObject(item)}
                className={`px-3 py-1.5 rounded-full text-xs font-ui-header whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-tertiary/20 text-tertiary border-tertiary shadow-[0_0_12px_rgba(247,190,29,0.3)]'
                    : 'bg-surface-container/40 text-on-surface-variant hover:text-on-surface border-outline-variant/20 hover:border-primary/40'
                }`}
              >
                <span>{item.name_ar}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
