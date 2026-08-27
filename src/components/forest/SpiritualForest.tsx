'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Beneficiary } from '@/components/sadaqah/SadaqahHub';

export type TreeItem = {
  _id: string;
  userId: string;
  beneficiaryId?: string;
  beneficiaryName: string;
  deedType: 'quran' | 'prayer' | 'dhikr';
  treeType: 'palm' | 'olive' | 'luminous';
  deedDetail: string;
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: number;
  createdAt: string;
};

// 3D Procedural Palm Tree Component (Quran)
function PalmTree3D({
  tree,
  isSelected,
  onSelect,
}: {
  tree: TreeItem;
  isSelected: boolean;
  onSelect: (t: TreeItem) => void;
}) {
  return (
    <group
      position={[tree.position.x, 0, tree.position.z]}
      scale={[tree.scale, tree.scale, tree.scale]}
      rotation={[0, tree.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(tree);
      }}
    >
      {/* Curved Segmented Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 2.5, 8]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 2.6, 0]} rotation={[0, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 1.5, 8]} />
        <meshStandardMaterial color="#713f12" roughness={0.9} />
      </mesh>

      {/* Palm Fronds (Leaves) */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <group key={i} position={[0.25, 3.3, 0]} rotation={[0.4, (angle * Math.PI) / 180, 0.4]}>
          <mesh position={[0, 0, 0.8]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.4, 0.05, 1.8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#15803d' : '#16a34a'} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Date Clusters */}
      <mesh position={[0.25, 3.1, 0.2]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.4} />
      </mesh>

      {/* Selection Glow Ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial color="#f7be1d" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

// 3D Procedural Olive Tree Component (Prayers)
function OliveTree3D({
  tree,
  isSelected,
  onSelect,
}: {
  tree: TreeItem;
  isSelected: boolean;
  onSelect: (t: TreeItem) => void;
}) {
  return (
    <group
      position={[tree.position.x, 0, tree.position.z]}
      scale={[tree.scale, tree.scale, tree.scale]}
      rotation={[0, tree.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(tree);
      }}
    >
      {/* Gnarled Wood Trunk */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 1.8, 7]} />
        <meshStandardMaterial color="#57534e" roughness={0.95} />
      </mesh>

      {/* Olive Canopy Tier 1 */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <dodecahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
      </mesh>

      {/* Olive Canopy Tier 2 */}
      <mesh position={[0.4, 2.5, 0.2]} castShadow>
        <dodecahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#65a30d" roughness={0.7} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.4, 32]} />
          <meshBasicMaterial color="#f7be1d" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

// 3D Procedural Luminous Flower Component (Dhikr)
function LuminousFlower3D({
  tree,
  isSelected,
  onSelect,
}: {
  tree: TreeItem;
  isSelected: boolean;
  onSelect: (t: TreeItem) => void;
}) {
  return (
    <group
      position={[tree.position.x, 0, tree.position.z]}
      scale={[tree.scale, tree.scale, tree.scale]}
      rotation={[0, tree.rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(tree);
      }}
    >
      {/* Green Stalk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 6]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>

      {/* Glowing Flower Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0.85, 0]}>
          <octahedronGeometry args={[0.35]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#fbbf24"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>

        {/* Floating Petals */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <mesh
            key={i}
            position={[
              Math.sin((deg * Math.PI) / 180) * 0.35,
              0.85,
              Math.cos((deg * Math.PI) / 180) * 0.35,
            ]}
          >
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </Float>

      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.8, 32]} />
          <meshBasicMaterial color="#f7be1d" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export default function SpiritualForest() {
  const [trees, setTrees] = useState<TreeItem[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiaryFilter, setSelectedBeneficiaryFilter] = useState<string>('all');
  const [selectedTree, setSelectedTree] = useState<TreeItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchForest = async () => {
    try {
      const url =
        selectedBeneficiaryFilter === 'all'
          ? '/api/tree'
          : `/api/tree?beneficiaryId=${selectedBeneficiaryFilter}`;
      const res = await fetch(url);
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

  useEffect(() => {
    fetch('/api/beneficiaries')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBeneficiaries(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchForest();
  }, [selectedBeneficiaryFilter]);

  // Statistics
  const palmCount = trees.filter((t) => t.treeType === 'palm' || t.deedType === 'quran').length;
  const oliveCount = trees.filter((t) => t.treeType === 'olive' || t.deedType === 'prayer').length;
  const luminousCount = trees.filter((t) => t.treeType === 'luminous' || t.deedType === 'dhikr').length;

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Top Controls & Filter Bar */}
      <div className="bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="material-symbols-outlined text-3xl">forest</span>
          </div>
          <div>
            <h3 className="font-ui-header text-xl font-bold text-on-surface">الواحة الروحانية 3D الموثقة</h3>
            <p className="font-body-main text-xs text-on-surface-variant">
              كل نخلة وشجرة وزهرة هنا تمثل عملاً حقيقياً قمت بتوثيقه أو إهدائه لمن تحب
            </p>
          </div>
        </div>

        {/* Beneficiary Filter Dropdown */}
        <div className="flex items-center gap-2 bg-surface/80 px-4 py-2 rounded-2xl border border-outline-variant/30 text-xs font-ui-header">
          <span className="text-on-surface-variant">تصفية الواحة:</span>
          <select
            value={selectedBeneficiaryFilter}
            onChange={(e) => setSelectedBeneficiaryFilter(e.target.value)}
            className="bg-transparent font-bold text-tertiary outline-none cursor-pointer"
          >
            <option value="all" className="bg-surface text-on-surface">عرض جميع الأشجار ({trees.length})</option>
            {beneficiaries.map((b) => (
              <option key={b._id} value={b._id} className="bg-surface text-on-surface">
                غابة: {b.name} ({b.relationship})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3D Oasis Viewport */}
      <div className="w-full h-[540px] md:h-[620px] rounded-3xl overflow-hidden relative shadow-2xl border border-outline-variant/30 bg-[#051424]">
        {loading && (
          <div className="absolute inset-0 z-20 bg-surface/60 backdrop-blur-md flex items-center justify-center text-primary font-ui-header">
            جاري استحضار واحتك الروحانية...
          </div>
        )}

        <Canvas camera={{ position: [0, 18, 28], fov: 48 }} shadows>
          <OrbitControls
            minDistance={8}
            maxDistance={55}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera below ground
          />
          <Sky sunPosition={[120, 35, 80]} turbidity={0.05} rayleigh={0.3} />
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[25, 40, 20]}
            intensity={1.8}
            shadow-mapSize={[2048, 2048]}
          >
            <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30]} />
          </directionalLight>

          {/* Lush Oasis Ground Terrain */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>

          {/* Meandering Turquoise River */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[6, 12, 32, 1, 0, Math.PI * 1.5]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
          </mesh>

          {/* Render All Trees */}
          {trees.map((tree) => {
            const isSelected = selectedTree?._id === tree._id;
            if (tree.treeType === 'olive' || tree.deedType === 'prayer') {
              return (
                <OliveTree3D
                  key={tree._id}
                  tree={tree}
                  isSelected={isSelected}
                  onSelect={(t) => setSelectedTree(t)}
                />
              );
            }
            if (tree.treeType === 'luminous' || tree.deedType === 'dhikr') {
              return (
                <LuminousFlower3D
                  key={tree._id}
                  tree={tree}
                  isSelected={isSelected}
                  onSelect={(t) => setSelectedTree(t)}
                />
              );
            }
            return (
              <PalmTree3D
                key={tree._id}
                tree={tree}
                isSelected={isSelected}
                onSelect={(t) => setSelectedTree(t)}
              />
            );
          })}

          <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.45} far={15} color="#052e16" />
        </Canvas>

        {/* Tree Inspection Floating Card */}
        {selectedTree && (
          <div className="absolute top-4 right-4 z-20 max-w-sm w-[90%] md:w-auto animate-fade-in pointer-events-auto">
            <div className="bg-surface/90 backdrop-blur-xl border-2 border-tertiary/40 rounded-2xl p-4 shadow-2xl text-right">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2 mb-2">
                <span className="text-xs font-bold text-tertiary font-ui-header">
                  بطاقة توثيق الشجرة
                </span>
                <button onClick={() => setSelectedTree(null)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">
                  {selectedTree.treeType === 'palm' || selectedTree.deedType === 'quran' ? '🌴' : selectedTree.treeType === 'olive' ? '🫒' : '🌸'}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-on-surface font-ui-header">
                    {selectedTree.deedDetail}
                  </h4>
                  <span className="text-[11px] text-tertiary font-ui-header block">
                    مهداة إلى: {selectedTree.beneficiaryName || 'نفسك'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-on-surface-variant font-label-mono pt-1 border-t border-outline-variant/10">
                تاريخ الغرس: {new Date(selectedTree.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 text-[11px] font-ui-header">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300">
            <span>🌴</span>
            <span>نخيل القرآن ({palmCount})</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-lime-500/30 text-lime-300">
            <span>🫒</span>
            <span>زيتون الصلوات ({oliveCount})</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-md border border-amber-500/30 text-amber-300">
            <span>🌸</span>
            <span>زهور الأذكار ({luminousCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
