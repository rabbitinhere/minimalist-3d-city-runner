
import React, { useMemo } from 'react';
import Building from './Building';
import { CHUNK_SIZE, GRID_SIZE, COLORS } from '../constants';
import { BuildingData } from '../types';

interface CityChunkProps {
  x: number;
  z: number;
}

const CityChunk: React.FC<CityChunkProps> = ({ x, z }) => {
  const buildings = useMemo(() => {
    const chunkBuildings: BuildingData[] = [];
    const seed = (x * 1234.5 + z * 6789.1);
    
    // Create a pseudo-random grid inside the chunk
    // We leave space for streets (cross shape in center)
    const padding = 2;
    const blockSize = (CHUNK_SIZE - padding * 2) / GRID_SIZE;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        // Simple heuristic: don't place buildings on center lines (streets)
        if (i === Math.floor(GRID_SIZE / 2) || j === Math.floor(GRID_SIZE / 2)) {
          continue;
        }

        // Randomly skip some buildings for variety
        const random = Math.sin(seed + i * 10 + j * 20) * 0.5 + 0.5;
        if (random < 0.2) continue;

        const h = 5 + random * 15;
        const w = blockSize * 0.7;
        const d = blockSize * 0.7;
        
        chunkBuildings.push({
          id: `${x}-${z}-${i}-${j}`,
          x: x * CHUNK_SIZE - CHUNK_SIZE / 2 + padding + i * blockSize + blockSize / 2,
          z: z * CHUNK_SIZE - CHUNK_SIZE / 2 + padding + j * blockSize + blockSize / 2,
          width: w,
          height: h,
          depth: d,
          color: COLORS[Math.floor(random * COLORS.length)],
        });
      }
    }
    return chunkBuildings;
  }, [x, z]);

  return (
    <group>
      {/* Floor / Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x * CHUNK_SIZE, -0.01, z * CHUNK_SIZE]} receiveShadow>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Road Markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x * CHUNK_SIZE, 0, z * CHUNK_SIZE]}>
        <planeGeometry args={[CHUNK_SIZE, 0.2]} />
        <meshBasicMaterial color="#475569" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x * CHUNK_SIZE, 0, z * CHUNK_SIZE]}>
        <planeGeometry args={[CHUNK_SIZE, 0.2]} />
        <meshBasicMaterial color="#475569" />
      </mesh>

      {buildings.map((b) => (
        <Building key={b.id} data={b} />
      ))}
    </group>
  );
};

export default React.memo(CityChunk);
