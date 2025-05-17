declare module 'react-native-chart-kit' {
  import { ViewStyle } from 'react-native';

  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    decimalPlaces?: number;
    color?: (opacity?: number) => string;
    labelColor?: (opacity?: number) => string;
    style?: ViewStyle;
    propsForDots?: {
      r?: number;
      strokeWidth?: number;
      stroke?: string;
    };
  }

  export interface LineChartData {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity?: number) => string;
      strokeWidth?: number;
    }[];
  }

  export interface PieChartData {
    data: {
      name: string;
      population: number;
      color: string;
      legendFontColor?: string;
      legendFontSize?: number;
    }[];
  }

  export interface LineChartProps {
    data: LineChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: ViewStyle;
    withDots?: boolean;
    withShadow?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withVerticalLines?: boolean;
    withHorizontalLines?: boolean;
    withVerticalLabels?: boolean;
    withHorizontalLabels?: boolean;
    fromZero?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
    yAxisInterval?: number;
    segments?: number;
    renderDotContent?: (props: any) => React.ReactNode;
    onDataPointClick?: (data: any) => void;
    getDotColor?: (dataPoint: any, dataPointIndex: number) => string;
    renderDotContent?: (props: any) => React.ReactNode;
    decorator?: () => React.ReactNode;
    onDataPointClick?: (data: any) => void;
    getDotColor?: (dataPoint: any, dataPointIndex: number) => string;
    renderDotContent?: (props: any) => React.ReactNode;
    decorator?: () => React.ReactNode;
  }

  export interface PieChartProps {
    data: PieChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    accessor?: string;
    backgroundColor?: string;
    paddingLeft?: string;
    center?: [number, number];
    absolute?: boolean;
    hasLegend?: boolean;
    center?: [number, number];
    avoidFalseZero?: boolean;
    style?: ViewStyle;
  }

  export class LineChart extends React.Component<LineChartProps> {}
  export class PieChart extends React.Component<PieChartProps> {}
} 