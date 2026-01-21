export interface Threshold {
  min?: number;
  max?: number;
  color: string;
  badgeColor: 'green' | 'red' | 'orange' | 'gray';
  label: string;
}
