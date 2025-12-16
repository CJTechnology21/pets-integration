import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { scale } from '../../utils/Scalling';
import FilterIcon from '../FilterIcon/FilterIcon';

const FILTER_ITEM_INTERVAL = 95;

const CameraFilterItem = React.memo(({ 
  item, 
  index, 
  scrollX, 
  isSelected, 
  isCenter, 
  onPress 
}) => {
  const inputRange = useMemo(() => [
    (index - 0.2) * FILTER_ITEM_INTERVAL,
    index * FILTER_ITEM_INTERVAL,
    (index + 0.2) * FILTER_ITEM_INTERVAL,
  ], [index]);

  const scaleValue = useMemo(() => scrollX.interpolate({
    inputRange,
    outputRange: [1, 1.2, 0.8],
    extrapolate: 'clamp',
  }), [scrollX, inputRange]);

  const opacity = useMemo(() => scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  }), [scrollX, inputRange]);

  const animatedStyle = useMemo(() => ({
    transform: [{ scale: scaleValue }], 
    opacity 
  }), [scaleValue, opacity]);

  return (
    <TouchableOpacity
      style={styles.filterItemContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedStyle}>
        <FilterIcon 
          name={item.name}
          isSelected={isSelected}
          isCenter={isCenter}
          image={item.image}
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  filterItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: FILTER_ITEM_INTERVAL,
    height: scale(90),
    paddingHorizontal: 7.5,
    right:16,
    top:4.5
  },
});

export default CameraFilterItem;

