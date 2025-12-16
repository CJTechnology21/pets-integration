import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { Fonts } from '../../theme/Fonts';

const CustomCheckbox = ({ 
  label, 
  checked, 
  onPress, 
  containerStyle,
  labelStyle 
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked
        ]}
      >
        {checked && (
          <Icon name="checkmark" size={16} color={COLORS.white} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
  },
  label: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily:Fonts.Regular,
    paddingTop:scale(5)
  },
  checkbox: {
    width: scale(24),
    height: scale(24),
    borderWidth: 2,
    borderColor: COLORS.grey,
    borderRadius: moderateScale(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primory1,
    borderColor: COLORS.primory1,
  },
});

export default CustomCheckbox;

