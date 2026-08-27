'use client';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Stars, Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const COSMIC_DATA = [
  { id: 'earth', name: 'الأرض', size: 1, color: '#22d3ee', position: [0, 0, 0] },
  { id: 'sun', name: 'الشمس', size: 109, color: '#facc15', position: [300, 0, -300] },
  { id: 'uyscuti', name: 'أكبر نجم (UY Scuti)', size: 1700, color: '#ef4444', position: [4000, 0, -4000] }, 
  { id: 'milkyway', name: 'درب التبانة', size: 10000, color: '#818cf8', position: [20000, 0, -20000] },
  { id: 'ic1101', name: 'أكبر مجرة (IC 1101)', size: 50000, color: '#4f46e5', position: [100000, 0, -100000] },
];

export default function CosmicScene() {
  const controlsRef = useRef<CameraControls>(null);
  
  const focusOn = (x: number, y: number, z: number, size: number) => {
    controlsRef.current?.setLookAt(
      x, y + size * 2, z + size * 4, // Camera position
      x, y, z, // Target
      true // Animate
    );
  };

  return (
    <div className="w-full h-[600px] relative rounded-2xl overflow-hidden bg-[#050505] shadow-2xl border border-outline-variant/20">
      <div className="absolute inset-0 pointer-events-none border border-primary/10 rounded-2xl z-20"></div>
      <Canvas camera={{ position: [0, 5, 20], fov: 60 }} className="z-10">
        <CameraControls ref={controlsRef} maxDistance={200000} />
        <ambientLight intensity={0.2} />
        <pointLight position={[300, 0, -300]} intensity={2} color="#facc15" />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {COSMIC_DATA.map((body) => (
          <mesh 
            key={body.id} 
            position={new THREE.Vector3(...body.position)}
            onClick={(e) => {
              e.stopPropagation();
              focusOn(body.position[0], body.position[1], body.position[2], body.size);
            }}
          >
            <sphereGeometry args={[body.size, 64, 64]} />
            <meshStandardMaterial 
              color={body.color} 
              emissive={body.id !== 'earth' ? body.color : '#000000'}
              emissiveIntensity={body.id !== 'earth' ? 0.3 : 0}
              wireframe={body.id === 'milkyway' || body.id === 'ic1101'}
              transparent={body.id === 'milkyway' || body.id === 'ic1101'}
              opacity={body.id === 'milkyway' || body.id === 'ic1101' ? 0.3 : 1}
            />
            <Html center position={[0, body.size + (body.size * 0.5), 0]} zIndexRange={[100, 0]}>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  focusOn(body.position[0], body.position[1], body.position[2], body.size);
                }}
                className="bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20 text-on-surface whitespace-nowrap font-ui-header text-sm cursor-pointer hover:border-primary hover:text-primary transition-all shadow-lg"
              >
                {body.name}
              </div>
            </Html>
          </mesh>
        ))}
      </Canvas>
      
      {/* Overlay UI for navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto p-2 w-[95%] md:w-auto z-30 scrollbar-hide">
        {COSMIC_DATA.map((body) => (
          <button
            key={`btn-${body.id}`}
            onClick={() => focusOn(body.position[0], body.position[1], body.position[2], body.size)}
            className="px-5 py-3 bg-surface-container/90 backdrop-blur-lg rounded-xl border border-outline-variant/30 text-on-surface hover:border-primary/50 hover:bg-surface-bright/50 hover:text-primary transition-all font-ui-header text-sm whitespace-nowrap shadow-xl"
          >
            {body.name}
          </button>
        ))}
      </div>
    </div>
  );
}
