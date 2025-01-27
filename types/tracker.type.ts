export type Tracker = {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  restoreWhen: 'short' | 'long' | 'manual';
};
