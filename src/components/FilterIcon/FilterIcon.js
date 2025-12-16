import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale } from '../../utils/Scalling';

const FilterIcon = ({ name, isSelected, isCenter, image }) => {
  const getIconText = (filterName) => filterName.charAt(0).toUpperCase();

  return (
    <View style={[
      styles.iconPlaceholder,
      isSelected && styles.selectedIconPlaceholder,
      isCenter && styles.centerIconPlaceholder
    ]}>
      {image ? (
        <Image 
          source={image} 
          style={[
            styles.filterImage,
            isCenter && styles.centerFilterImage
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[
          styles.iconText,
          isSelected && styles.selectedIconText,
          isCenter && styles.centerIconText
        ]}>
          {getIconText(name)}
        </Text>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedIconPlaceholder: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  centerIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderColor: 'rgba(255,255,255,0.85)',
    borderWidth: 2,
  },
  filterImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(24),
  },
  centerFilterImage: {
    borderRadius: moderateScale(28),
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary2,
    fontFamily: Fonts.Bold,
  },
  selectedIconText: {
    color: COLORS.primary2,
  },
  centerIconText: {
    color: COLORS.primary2,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterIcon;

