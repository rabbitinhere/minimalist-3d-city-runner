
import React from 'react';
import { BuildingData } from '../types';

interface BuildingProps {
  data: BuildingData;
}

const Building: React.FC<BuildingProps> = ({ data }) => {
  return (
    <mesh position={[data.x, data.height / 2, data.z]} castShadow receiveShadow>
      <boxGeometry args={[data.width, data.height, data.depth]} />
      <meshStandardMaterial color={data.color} />
      {/* Decorative windows */}
      <mesh position={[0, 0, data.depth / 2 + 0.01]}>
        <planeGeometry args={[data.width * 0.8, data.height * 0.8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>
    </mesh>
  );
};

export default Building;
