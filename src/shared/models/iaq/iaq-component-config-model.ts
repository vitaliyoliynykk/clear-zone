export interface IAQComponentConfigModel {
  unit: string;
  name: string;
  padding: number;
  visualMap?: { gt?: number; lte?: number; color: string }[];
}
