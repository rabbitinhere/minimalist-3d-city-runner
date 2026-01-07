
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Player from './Player';
import World from './World';
import { useControls } from '../hooks/useControls';

const Game: React.FC = () => {
  const controls = useControls();
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 0));

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 10, 20], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#e2e8f0']} />
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 50]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <Suspense fallback={null}>
          <World playerPos={playerPos} />
          <Player 
            controls={controls} 
            onPositionUpdate={(pos) => setPlayerPos(pos.clone())} 
          />
          <Environment preset="city" />
        </Suspense>

        <ContactShadows 
          position={[0, 0, 0]} 
          opacity={0.4} 
          scale={100} 
          blur={1} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 p-4 bg-white/80 backdrop-blur rounded-xl shadow-lg border border-slate-200 pointer-events-none">
        <h1 className="text-xl font-bold text-slate-800">City Runner</h1>
        <p className="text-sm text-slate-500">WASD or Arrows to Move</p>
        <div className="mt-2 text-xs font-mono text-slate-400">
          POS: {Math.round(playerPos.x)}, {Math.round(playerPos.z)}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none opacity-50">
        <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg bg-white ${controls.forward ? 'border-red-500 scale-95' : 'border-slate-300'}`}>W</div>
        <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg bg-white ${controls.left ? 'border-red-500 scale-95' : 'border-slate-300'}`}>A</div>
        <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg bg-white ${controls.backward ? 'border-red-500 scale-95' : 'border-slate-300'}`}>S</div>
        <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg bg-white ${controls.right ? 'border-red-500 scale-95' : 'border-slate-300'}`}>D</div>
      </div>
    </div>
  );
};

export default Game;
