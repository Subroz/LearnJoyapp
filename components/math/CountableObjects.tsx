import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { VisualObject } from '@/types';

interface CountableObjectsProps {
  visualObjects: VisualObject[];
  size?: number;
  spacing?: number;
}

interface ObjectIconProps {
  type: VisualObject['type'];
  color: string;
  size: number;
}

// Individual object SVG icons
const ObjectIcon: React.FC<ObjectIconProps> = ({ type, color, size }) => {
  const iconSize = size;
  
  switch (type) {
    case 'apple':
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
          {/* Apple body */}
          <Circle cx="50" cy="60" r="35" fill={color} />
          {/* Apple stem */}
          <Rect x="48" y="20" width="4" height="15" fill="#8B4513" />
          {/* Apple leaf */}
          <Path d="M 55 25 Q 65 20 70 25 Q 65 30 55 25" fill="#228B22" />
        </Svg>
      );
    
    case 'balloon':
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
          {/* Balloon */}
          <Circle cx="50" cy="45" r="30" fill={color} />
          {/* Balloon highlight */}
          <Circle cx="45" cy="40" r="8" fill="white" opacity="0.6" />
          {/* Balloon string */}
          <Path 
            d="M 50 75 Q 45 85 40 95" 
            stroke="#666" 
            strokeWidth="2" 
            fill="none" 
          />
          {/* Balloon knot */}
          <Polygon points="50,75 48,78 52,78" fill={color} />
        </Svg>
      );
    
    case 'star':
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
          {/* Star */}
          <Path
            d="M 50,10 L 61,40 L 95,40 L 68,60 L 79,90 L 50,70 L 21,90 L 32,60 L 5,40 L 39,40 Z"
            fill={color}
            stroke="#FFA500"
            strokeWidth="2"
          />
        </Svg>
      );
    
    case 'heart':
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
          {/* Heart */}
          <Path
            d="M 50,85 C 50,85 15,60 15,40 C 15,25 25,15 35,15 C 42,15 48,20 50,25 C 52,20 58,15 65,15 C 75,15 85,25 85,40 C 85,60 50,85 50,85 Z"
            fill={color}
            stroke="#E91E63"
            strokeWidth="2"
          />
        </Svg>
      );
    
    case 'animal':
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
          {/* Simple bear/teddy bear */}
          {/* Head */}
          <Circle cx="50" cy="50" r="25" fill={color} />
          {/* Left ear */}
          <Circle cx="30" cy="30" r="12" fill={color} />
          {/* Right ear */}
          <Circle cx="70" cy="30" r="12" fill={color} />
          {/* Eyes */}
          <Circle cx="42" cy="45" r="3" fill="#000" />
          <Circle cx="58" cy="45" r="3" fill="#000" />
          {/* Nose */}
          <Circle cx="50" cy="55" r="4" fill="#000" />
          {/* Smile */}
          <Path 
            d="M 40 58 Q 50 63 60 58" 
            stroke="#000" 
            strokeWidth="2" 
            fill="none" 
          />
        </Svg>
      );
    
    default:
      return (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="40" fill={color} />
        </Svg>
      );
  }
};

export const CountableObjects: React.FC<CountableObjectsProps> = ({
  visualObjects,
  size = 40,
  spacing = 8,
}) => {
  const renderObjectGroup = (obj: VisualObject, groupIndex: number) => {
    const objects = [];
    const itemsPerRow = Math.min(obj.count, 10); // Max 10 items per row
    const rows = Math.ceil(obj.count / itemsPerRow);
    
    for (let i = 0; i < obj.count; i++) {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      
      objects.push(
        <View
          key={`${groupIndex}-${i}`}
          style={[
            styles.objectItem,
            {
              marginRight: spacing,
              marginBottom: spacing,
            },
          ]}
        >
          <ObjectIcon type={obj.type} color={obj.color} size={size} />
        </View>
      );
    }
    
    return (
      <View key={groupIndex} style={styles.objectGroup}>
        {objects}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {visualObjects.map((obj, index) => renderObjectGroup(obj, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  objectGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    maxWidth: '100%',
  },
  objectItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CountableObjects;

