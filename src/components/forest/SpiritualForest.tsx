'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Text } from '@react-three/drei';
import { useState, useEffect } from 'react';

type TreeData = {
  _id: string;
  deedType: 'quran' | 'prayer' | 'dhikr';
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: number;
};

// 3D Tree Component
function SimpleTree({ position, scale, rotation, type }: { position: [number, number, number], scale: number, rotation: number, type: 'quran' | 'prayer' | 'dhikr' }) {
  const colors = {
    quran: '#10b981', // Emerald green
    prayer: '#3b82f6', // Blue
    dhikr: '#f59e0b', // Amber
  };

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 1, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Leaves Tier 1 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 7]} />
        <meshStandardMaterial color={colors[type]} />
      </mesh>
      {/* Leaves Tier 2 */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.7, 1.2, 7]} />
        <meshStandardMaterial color={colors[type]} />
      </mesh>
      {/* Leaves Tier 3 */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.4, 0.8, 7]} />
        <meshStandardMaterial color={colors[type]} />
      </mesh>
    </group>
  );
}

export default function SpiritualForest() {
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [planting, setPlanting] = useState(false);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      const res = await fetch('/api/tree');
      const json = await res.json();
      if (json.success) {
        setTrees(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const plantTree = async (type: 'quran' | 'prayer' | 'dhikr') => {
    setPlanting(true);
    // Random position in a 20x20 area
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    const rotation = Math.random() * Math.PI * 2;
    const scale = 0.8 + Math.random() * 0.4;
    
    try {
      const res = await fetch('/api/tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deedType: type,
          position: { x, y: 0, z },
          scale,
          rotation,
          modelType: 1
        })
      });
      const json = await res.json();
      if (json.success) {
        setTrees([...trees, json.data]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPlanting(false);
    }
  };

  return (
    <div className="w-full relative flex flex-col gap-4">
      {/* 3D View */}
      <div className="w-full h-[500px] rounded-2xl overflow-hidden relative shadow-2xl border border-outline-variant/20 bg-blue-50">
        {loading && (
          <div className="absolute inset-0 z-20 bg-surface/50 backdrop-blur-sm flex items-center justify-center text-primary font-ui-header">
            جاري تحميل غابتك الروحانية...
          </div>
        )}
        <Canvas camera={{ position: [0, 5, 15], fov: 50 }} shadows>
          <OrbitControls 
            minDistance={5} 
            maxDistance={30} 
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below ground
          />
          <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
          <ambientLight intensity={0.4} />
          <directionalLight 
            castShadow 
            position={[10, 20, 10]} 
            intensity={1.5} 
            shadow-mapSize={[1024, 1024]}
          >
            <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
          </directionalLight>

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>

          {/* Trees */}
          {trees.map((tree) => (
            <SimpleTree 
              key={tree._id} 
              position={[tree.position.x, tree.position.y, tree.position.z]} 
              scale={tree.scale} 
              rotation={tree.rotation}
              type={tree.deedType}
            />
          ))}
          
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#14532d" />
        </Canvas>
      </div>

      {/* Farm Controls UI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button 
          onClick={() => plantTree('quran')}
          disabled={planting}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-emerald-500 text-3xl">auto_stories</span>
          <span className="font-ui-header text-emerald-300">قراءة قرآن</span>
        </button>
        <button 
          onClick={() => plantTree('prayer')}
          disabled={planting}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-blue-500 text-3xl">mosque</span>
          <span className="font-ui-header text-blue-300">صلاة / نافلة</span>
        </button>
        <button 
          onClick={() => plantTree('dhikr')}
          disabled={planting}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-amber-500 text-3xl">self_improvement</span>
          <span className="font-ui-header text-amber-300">أذكار واستغفار</span>
        </button>
      </div>
    </div>
  );
}
