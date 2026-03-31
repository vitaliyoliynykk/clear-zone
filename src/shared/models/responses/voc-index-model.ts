export interface VocIndexModel {
  index?: number;
  date?: Date;
  uptimeSeconds: number;
  state: VocSensorState;
}

export type VocSensorState = 'warm_up' | 'calibrating' | 'ready';
