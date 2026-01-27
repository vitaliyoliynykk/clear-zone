import { ModuleNetworkStatus } from './module-network-status-model';

export type WsDataModel = {
  [K in keyof WsPayloads]: WsBase<K>;
}[keyof WsPayloads];

interface WsPayloads {
  status: { status: ModuleNetworkStatus };
  co2: { co2: number };
  temp: { temp: number; hum: number };
  pms: { pm10: number; pm25: number; pm100: number };
}

interface WsBase<K extends keyof WsPayloads> {
  type: K;
  ts: number;
  data: WsPayloads[K];
  deviceId: string;
  retained: boolean;
}
