declare module 'react-native-draggable-flatlist' {
  import { FlatListProps, ViewStyle } from 'react-native';

  export interface RenderItemParams<T> {
    item: T;
    index: number;
    drag: () => void;
    isActive: boolean;
  }

  export interface DraggableFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
    data: T[];
    renderItem: (params: RenderItemParams<T>) => React.ReactNode;
    onDragEnd?: (params: { data: T[]; from: number; to: number }) => void;
    keyExtractor: (item: T, index: number) => string;
    containerStyle?: ViewStyle;
    dragItemOverflow?: boolean;
    activationDistance?: number;
    dragHitSlop?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    dragActivationDistance?: number;
    dragItemOverflow?: boolean;
    dragHitSlop?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    dragActivationDistance?: number;
    dragItemOverflow?: boolean;
    dragHitSlop?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    dragActivationDistance?: number;
  }

  export default class DraggableFlatList<T> extends React.Component<DraggableFlatListProps<T>> {}
} 