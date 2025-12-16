import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { scale } from '../../utils/Scalling';

const ToolbarButton = ({ onPress, iconSource, iconText, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.toolbarButton, style]}
      onPress={onPress}
    >
      {iconSource ? (
        <Image 
          source={iconSource} 
          style={styles.toolbarIcon}
          resizeMode="contain"
        />
      ) : iconText ? (
        <Text style={styles.toolbarText}>{iconText}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toolbarButton: {
    paddingVertical: 10,
  },
  toolbarIcon: {
    width: 20, 
    height: 20, 
  },
  toolbarText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ToolbarButton;

