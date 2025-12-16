import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';

const CustomHeader = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
        
        <Text style={styles.title}>{title || 'Select Language'}</Text>
        
        <View style={styles.spacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:COLORS.white,
    paddingHorizontal: scale(20),
    borderBottomWidth:0.3,
    paddingBottom: verticalScale(10),
    borderBottomColor:COLORS.grey,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(20),
    backgroundColor: COLORS.primary2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: moderateScale(16),
    fontFamily:Fonts.Medium,
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: scale(40),
  },
});

export default CustomHeader;

