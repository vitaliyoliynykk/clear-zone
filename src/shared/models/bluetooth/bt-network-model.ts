import { SignalStrengthModel } from './signal-strength-model';

export interface WifiNetworkModel {
  name: string;
  signal: SignalStrengthModel;
  isSecure: boolean;
}
