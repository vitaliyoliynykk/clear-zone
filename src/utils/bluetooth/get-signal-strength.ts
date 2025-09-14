import { SignalStrengthModel } from '@/shared/models/bluetooth/signal-strength-model';

export const getSignalStrength = (rssi: number): SignalStrengthModel => {
  if (rssi >= -60) return 'strong';
  else if (rssi >= -80) return 'medium';
  else return 'low';
};
