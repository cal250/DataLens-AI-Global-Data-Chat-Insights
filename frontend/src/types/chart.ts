export type ChartType = 'line' | 'bar' | 'pie' | 'scatter';

export interface ChartOptions {
  title?: string;
  width?: number | string;
  height?: number | string;
  legend?: {
    position?: 'bottom' | 'top' | 'left' | 'right' | 'none';
    alignment?: 'start' | 'center' | 'end';
  };
  chartArea?: {
    width?: string | number;
    height?: string | number;
    left?: string | number;
    top?: string | number;
  };
  colors?: string[];
  fontSize?: number;
  [key: string]: any;
}

export interface ChartData {
  type: ChartType;
  data: any[];
  options: ChartOptions;
} 