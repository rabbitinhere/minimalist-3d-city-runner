
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ControlState, BuildingData } from '../types';
import { PLAYER_SPEED, COLLISION_RADIUS, CHUNK_SIZE, GRID_SIZE, COLORS } from '../constants';

interface PlayerProps {
  controls: ControlState;
  onPositionUpdate: (pos: THREE.Vector3) => void;
}

const Player: React.FC<PlayerProps> = ({ controls, onPositionUpdate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(0, 0, 0));

  // For collision, we need to know nearby buildings
  // To keep it efficient in a single component, we'll calculate "virtual" buildings 
  // near the player using the same logic as CityChunk
  const checkCollision = (nextPos: THREE.Vector3) => {
    const chunkX = Math.round(nextPos.x / CHUNK_SIZE);
    const chunkZ = Math.round(nextPos.z / CHUNK_SIZE);

    // Check current and 8 surrounding chunks for simple bounding box collision
    for (let cx = chunkX - 1; cx <= chunkX + 1; cx++) {
      for (let cz = chunkZ - 1; cz <= chunkZ + 1; cz++) {
        const seed = (cx * 1234.5 + cz * 6789.1);
        const padding = 2;
        const blockSize = (CHUNK_SIZE - padding * 2) / GRID_SIZE;

        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            if (i === Math.floor(GRID_SIZE / 2) || j === Math.floor(GRID_SIZE / 2)) continue;
            const random = Math.sin(seed + i * 10 + j * 20) * 0.5 + 0.5;
            if (random < 0.2) continue;

            const bx = cx * CHUNK_SIZE - CHUNK_SIZE / 2 + padding + i * blockSize + blockSize / 2;
            const bz = cz * CHUNK_SIZE - CHUNK_SIZE / 2 + padding + j * blockSize + blockSize / 2;
            const bw = blockSize * 0.7;
            const bd = blockSize * 0.7;

            // Simple AABB check with buffer
            const buffer = COLLISION_RADIUS;
            if (
              nextPos.x + buffer > bx - bw / 2 &&
              nextPos.x - buffer < bx + bw / 2 &&
              nextPos.z + buffer > bz - bd / 2 &&
              nextPos.z - buffer < bz + bd / 2
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Movement direction
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (controls.forward) moveDir.z -= 1;
    if (controls.backward) moveDir.z += 1;
    if (controls.left) moveDir.x -= 1;
    if (controls.right) moveDir.x += 1;

    if (moveDir.length() > 0) {
      moveDir.normalize();
      // Smoothly rotate character to face direction
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        delta * 10
      );
      
      // Animation (swinging legs)
      const time = state.clock.getElapsedTime();
      const swingSpeed = 12;
      const swingAmount = 0.5;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * swingSpeed) * swingAmount;
        rightLegRef.current.rotation.x = -Math.sin(time * swingSpeed) * swingAmount;
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.0 + Math.abs(Math.sin(time * swingSpeed * 2)) * 0.1;
      }
    } else {
      // Idle animation
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 10);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 10);
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 1.0, delta * 10);
      }
    }

    // Apply movement
    const nextX = position.current.clone().add(new THREE.Vector3(moveDir.x * PLAYER_SPEED * delta, 0, 0));
    if (!checkCollision(nextX)) {
        position.current.x = nextX.x;
    }

    const nextZ = position.current.clone().add(new THREE.Vector3(0, 0, moveDir.z * PLAYER_SPEED * delta));
    if (!checkCollision(nextZ)) {
        position.current.z = nextZ.z;
    }

    groupRef.current.position.copy(position.current);

    // Camera follow
    const idealOffset = new THREE.Vector3(0, 10, 15);
    idealOffset.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0)); 
    const targetCamPos = position.current.clone().add(idealOffset);
    state.camera.position.lerp(targetCamPos, 0.1);
    state.camera.lookAt(position.current.x, position.current.y + 1, position.current.z);

    onPositionUpdate(position.current);
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="#f87171" />
        {/* Head */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#fca5a5" />
        </mesh>
      </mesh>
      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh ref={rightLegRef} position={[0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
};

export default Player;
