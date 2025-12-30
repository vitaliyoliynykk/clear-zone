export interface WsDataModel<T = never> {
  type: 'status';
  ts: number;
  data: T;
  deviceId: string;
  retained: boolean;
}
