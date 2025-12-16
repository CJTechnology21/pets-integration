import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { scale ,moderateScale} from '../../utils/Scalling';
import { Icons } from '../../assets';

const GalleryIcon = () => {
  return (
    <View style={styles.galleryIconContainer}>
        <Image source={Icons.gallery} style={styles.galleryIconImage} resizeMode="contain" />
      <Text style={styles.galleryText}>Gallery</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryIconContainer: {
    alignItems: 'center',
    width:scale(60),
    right:scale(27),
    bottom:scale(5),
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding:scale(10),
    borderTopRightRadius:moderateScale(20),
    borderBottomRightRadius:moderateScale(20),
  },
  galleryIcon: {
    width:scale(50),
    height:scale(50),
    borderRadius: 8,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  galleryIconImage: {
    width: scale(30),
    height: scale(30),
  },
  galleryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default GalleryIcon;

