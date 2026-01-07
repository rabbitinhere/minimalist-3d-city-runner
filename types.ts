
export interface ChunkCoords {
  x: number;
  z: number;
}

export interface BuildingData {
  id: string;
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
}

export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}
