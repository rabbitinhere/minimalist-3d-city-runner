
import React, { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import CityChunk from './CityChunk';
import { CHUNK_SIZE, RENDER_DISTANCE } from '../constants';
import { ChunkCoords } from '../types';

const World: React.FC<{ playerPos: THREE.Vector3 }> = ({ playerPos }) => {
  const [activeChunks, setActiveChunks] = useState<ChunkCoords[]>([]);

  const updateChunks = useCallback(() => {
    const pX = Math.round(playerPos.x / CHUNK_SIZE);
    const pZ = Math.round(playerPos.z / CHUNK_SIZE);

    const newChunks: ChunkCoords[] = [];
    for (let x = pX - RENDER_DISTANCE; x <= pX + RENDER_DISTANCE; x++) {
      for (let z = pZ - RENDER_DISTANCE; z <= pZ + RENDER_DISTANCE; z++) {
        newChunks.push({ x, z });
      }
    }
    
    // Only update if chunks actually changed to avoid re-renders
    const currentKeys = activeChunks.map(c => `${c.x},${c.z}`).sort().join('|');
    const newKeys = newChunks.map(c => `${c.x},${c.z}`).sort().join('|');

    if (currentKeys !== newKeys) {
      setActiveChunks(newChunks);
    }
  }, [playerPos, activeChunks]);

  useEffect(() => {
    updateChunks();
  }, [playerPos.x, playerPos.z]);

  return (
    <group>
      {activeChunks.map(chunk => (
        <CityChunk key={`${chunk.x}-${chunk.z}`} x={chunk.x} z={chunk.z} />
      ))}
    </group>
  );
};

export default World;
