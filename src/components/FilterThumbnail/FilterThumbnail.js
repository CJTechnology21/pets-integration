import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale } from '../../utils/Scalling';

const FilterThumbnail = ({ filter, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.filterThumbnailWrapper}
    >
      <View style={[styles.filterThumbnail, isSelected && styles.filterThumbnailActive]}>
        {filter?.image && (
          <View style={styles.filterImageWrapper}>
            <Image
              source={filter.image}
              style={styles.filterImage}
              resizeMode="cover"
            />
          </View>
        )}
        <Text style={styles.filterThumbnailText}>
          {filter?.name || ''}
        </Text>
      </View>
    </TouchableOpacity> 

  );
};

const styles = StyleSheet.create({
  filterThumbnailWrapper: {
    alignItems: 'center',
    marginRight: 12,
  },
  filterThumbnail: {
    minWidth: scale(70),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(16),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(6),
  },
  filterThumbnailActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterThumbnailText: {
    color: COLORS.white,
    fontSize: scale(12),
    fontWeight: 'bold',
    fontFamily: Fonts.Medium,
    textAlign: 'center',
  },
  filterImageWrapper: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  filterImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(14),
  },
});

export default FilterThumbnail;

