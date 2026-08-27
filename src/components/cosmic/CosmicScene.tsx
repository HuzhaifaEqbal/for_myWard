'use client';

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Stars, Html, Billboard } from '@react-three/drei';
import { universeData, UniverseObject } from '@/data/universeData';
import * as THREE from 'three';

// 3D positioning and visual size distribution for the 10 objects
const OBJECT_3D_CONFIG: Record<string, { pos: [number, number, number]; visualRadius: number; color: string }> = {
  proton: { pos: [-120, 15, -60], visualRadius: 2.5, color: '#3b82f6' },
  atom: { pos: [-60, 8, -30], visualRadius: 3.5, color: '#06b6d4' },
  dna: { pos: [-25, 3, -15], visualRadius: 4, color: '#ec4899' },
  cell: { pos: [-8, 0, 8], visualRadius: 4.5, color: '#22c55e' },
  human: { pos: [0, 0, 25], visualRadius: 5, color: '#fde047' },
  earth: { pos: [35, -2, 0], visualRadius: 7, color: '#22d3ee' },
  sun: { pos: [110, 10, -70], visualRadius: 20, color: '#facc15' },
  milky_way: { pos: [320, 25, -220], visualRadius: 50, color: '#818cf8' },
  supercluster: { pos: [800, 50, -550], visualRadius: 100, color: '#f43f5e' },
  observable_universe: { pos: [1800, 100, -1200], visualRadius: 200, color: '#c084fc' },
};

function CelestialObject3D({
  item,
  config,
  isSelected,
  onSelect,
}: {
  item: UniverseObject;
  config: { pos: [number, number, number]; visualRadius: number; color: string };
  isSelected: boolean;
  onSelect: (item: UniverseObject) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={new THREE.Vector3(...config.pos)}>
      {/* 3D Glowing Sphere / Aura */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
        }}
      >
        <sphereGeometry args={[config.visualRadius, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={isSelected ? 0.8 : 0.35}
          wireframe={item.id === 'milky_way' || item.id === 'supercluster' || item.id === 'observable_universe'}
          transparent
          opacity={item.id === 'milky_way' || item.id === 'supercluster' || item.id === 'observable_universe' ? 0.35 : 0.85}
        />
      </mesh>

      {/* Center Billboard with the exact same icon image */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Html center position={[0, 0, 0]} zIndexRange={[100, 0]} transform distanceFactor={Math.max(12, config.visualRadius * 4)}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className={`w-20 h-20 rounded-full flex items-center justify-center p-2 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'ring-4 ring-tertiary bg-surface/90 scale-110 shadow-[0_0_25px_rgba(247,190,29,0.6)]'
                : 'hover:scale-105 bg-surface/60 hover:bg-surface/90'
            }`}
          >
            <img
              src={item.image_url}
              alt={item.name_ar}
              className="w-full h-full object-contain pointer-events-none drop-shadow"
            />
          </div>
        </Html>
      </Billboard>

      {/* Floating Name Badge */}
      <Html center position={[0, config.visualRadius + 3.5, 0]} zIndexRange={[100, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className={`px-3.5 py-1.5 rounded-full border text-xs md:text-sm font-ui-header whitespace-nowrap cursor-pointer transition-all shadow-lg backdrop-blur-md flex items-center gap-2 ${
            isSelected
              ? 'bg-tertiary text-surface font-bold border-tertiary shadow-[0_0_15px_rgba(247,190,29,0.5)] scale-105'
              : 'bg-surface/80 border-primary/20 text-on-surface hover:border-primary hover:text-primary'
          }`}
        >
          <img src={item.image_url} alt="" className="w-4 h-4 object-contain rounded-full" />
          <span>{item.name_ar}</span>
        </div>
      </Html>
    </group>
  );
}

export default function CosmicScene() {
  const controlsRef = useRef<CameraControls>(null);
  const [selectedItem, setSelectedItem] = useState<UniverseObject>(universeData[4]); // Default to Human (Index 4)

  const focusOnObject = (item: UniverseObject) => {
    setSelectedItem(item);
    const config = OBJECT_3D_CONFIG[item.id] || { pos: [0, 0, 0], visualRadius: 5 };
    const [x, y, z] = config.pos;
    const radius = config.visualRadius;

    // Smooth cinematic camera flight
    controlsRef.current?.setLookAt(
      x,
      y + radius * 1.5,
      z + radius * 3.5 + 8, // Camera eye position
      x,
      y,
      z, // Camera target
      true // Animate
    );
  };

  return (
    <div className="w-full h-[620px] md:h-[680px] relative rounded-3xl overflow-hidden bg-[#02040a] shadow-2xl border border-outline-variant/30 select-none">
      <div className="absolute inset-0 pointer-events-none border border-primary/10 rounded-3xl z-20"></div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 15, 60], fov: 55 }} className="z-10">
        <CameraControls ref={controlsRef} maxDistance={3500} minDistance={2} />
        <ambientLight intensity={0.35} />
        <pointLight position={[110, 10, -70]} intensity={3} color="#facc15" distance={2000} />
        <pointLight position={[0, 0, 25]} intensity={1.5} color="#38bdf8" distance={500} />

        <Stars radius={600} depth={100} count={7000} factor={5} saturation={0.5} fade speed={1.2} />

        {/* Render all 10 Universe Objects */}
        {universeData.map((item) => {
          const config = OBJECT_3D_CONFIG[item.id] || { pos: [0, 0, 0], visualRadius: 5, color: '#ffffff' };
          return (
            <CelestialObject3D
              key={item.id}
              item={item}
              config={config}
              isSelected={selectedItem?.id === item.id}
              onSelect={focusOnObject}
            />
          );
        })}
      </Canvas>

      {/* Top Left Navigation Help */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 border border-primary/20 backdrop-blur-md text-xs text-primary font-ui-header">
        <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
        <span>اضغط على أي كائن ثلاثي الأبعاد أو على الأزرار للتنقل إليه بالكاميرا</span>
      </div>

      {/* Active Object Quranic Overlay Card */}
      {selectedItem && (
        <div className="absolute top-16 md:top-20 right-4 left-4 md:right-8 md:left-auto md:max-w-md z-20 animate-fade-in pointer-events-auto">
          <div className="backdrop-blur-xl bg-black/80 text-white rounded-2xl p-5 md:p-6 border border-tertiary/30 shadow-[0_0_30px_rgba(247,190,29,0.2)] transition-all">
            {/* Header with Icon */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface p-1.5 border border-tertiary/40 flex items-center justify-center">
                  <img src={selectedItem.image_url} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-tertiary font-ui-header">
                    {selectedItem.name_ar}
                  </h3>
                  <span className="text-xs text-gray-400 font-label-mono">
                    {selectedItem.name_en} • {selectedItem.scale_display}
                  </span>
                </div>
              </div>
            </div>

            {/* Quranic Verse */}
            <div className="bg-tertiary/5 rounded-xl p-3.5 border-r-4 border-tertiary mb-3 text-right">
              <p className="text-lg md:text-xl text-yellow-300 leading-relaxed font-verse-display" dir="rtl">
                ﴿ {selectedItem.ayah} ﴾
              </p>
              <div className="text-left text-xs text-tertiary/70 mt-1.5 font-label-mono">
                {selectedItem.surah_ref}
              </div>
            </div>

            {/* Tafsir */}
            <p className="text-xs md:text-sm text-gray-200 leading-relaxed text-right font-body-main" dir="rtl">
              {selectedItem.tafsir}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Bar: Quick Jump Pills using the exact 10 objects with their icons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto p-2 w-[95%] md:w-auto z-30 scrollbar-hide bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl border border-outline-variant/30">
        {universeData.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <button
              key={`btn-3d-${item.id}`}
              onClick={() => focusOnObject(item)}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-ui-header whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-tertiary text-surface font-bold border-tertiary shadow-[0_0_15px_rgba(247,190,29,0.4)] scale-105'
                  : 'bg-surface-container/60 text-on-surface-variant hover:text-on-surface border-outline-variant/20 hover:border-primary/40'
              }`}
            >
              <img src={item.image_url} alt="" className="w-4 h-4 object-contain" />
              <span>{item.name_ar}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
