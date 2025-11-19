import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface Point {
  x: number;
  y: number;
}

interface PathData {
  id: string;
  points: Point[];
  color: string;
  strokeWidth: number;
}

interface DrawingCanvasProps {
  onDrawingChange?: (paths: PathData[]) => void;
  canvasHeight?: number;
  brushColor?: string;
  brushSize?: number;
  backgroundColor?: string;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onDrawingChange,
  canvasHeight = height * 0.6,
  brushColor = theme.colors.primary,
  brushSize = 5,
  backgroundColor = theme.colors.white,
}) => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const pathIdCounter = useRef(0);

  const createPathString = (points: Point[]): string => {
    if (points.length === 0) return '';
    
    let pathString = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      pathString += ` L ${points[i].x},${points[i].y}`;
    }
    
    return pathString;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const locationX = evt.nativeEvent.locationX;
        const locationY = evt.nativeEvent.locationY;
        
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const locationX = evt.nativeEvent.locationX;
        const locationY = evt.nativeEvent.locationY;
        
        setCurrentPath((prevPath) => [...prevPath, { x: locationX, y: locationY }]);
      },
      
      onPanResponderRelease: () => {
        if (currentPath.length > 0) {
          const newPath: PathData = {
            id: `path-${pathIdCounter.current++}`,
            points: currentPath,
            color: brushColor,
            strokeWidth: brushSize,
          };
          
          const newPaths = [...paths, newPath];
          setPaths(newPaths);
          setCurrentPath([]);
          
          onDrawingChange?.(newPaths);
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        { height: canvasHeight, backgroundColor },
      ]}
      {...panResponder.panHandlers}
    >
      <Svg width={width} height={canvasHeight} style={styles.svg}>
        <G>
          {/* Render completed paths */}
          {paths.map((path) => (
            <Path
              key={path.id}
              d={createPathString(path.points)}
              stroke={path.color}
              strokeWidth={path.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          
          {/* Render current path being drawn */}
          {currentPath.length > 0 && (
            <Path
              d={createPathString(currentPath)}
              stroke={brushColor}
              strokeWidth={brushSize}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </G>
      </Svg>
    </View>
  );
};

// Ref methods for controlling the canvas
export const DrawingCanvasRef = {
  clear: (setPaths: React.Dispatch<React.SetStateAction<PathData[]>>) => {
    setPaths([]);
  },
  
  undo: (setPaths: React.Dispatch<React.SetStateAction<PathData[]>>) => {
    setPaths((prev) => prev.slice(0, -1));
  },
  
  getPaths: (paths: PathData[]) => paths,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.border.light,
  },
  svg: {
    backgroundColor: 'transparent',
  },
});

export default DrawingCanvas;

