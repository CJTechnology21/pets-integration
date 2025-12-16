import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';

const Button = ({
  onPress,
  disabled = false,
  title = 'Button',
  variant = 'primary', 
  style,
  textStyle,
  height = verticalScale(56),
  borderRadius = moderateScale(12),
  fontSize = moderateScale(18),
}) => {

  const isPrimary = variant === 'primary';
  const buttonBackgroundColor = isPrimary ? COLORS.primaryLight : COLORS.white;
  const buttonTextColor = isPrimary ? COLORS.primary2 : COLORS.grey;
  const buttonFontFamily = Fonts.Medium;
  const buttonBorderColor = isPrimary ? COLORS.primary2 : COLORS.lightGrey;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height,
          borderRadius,
          backgroundColor: disabled ? COLORS.lightGrey : buttonBackgroundColor,
          borderColor: buttonBorderColor,
          borderWidth: 1,
        },
        isPrimary && !disabled && styles.buttonShadow,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          {
            fontSize,
            color: buttonTextColor,
            fontFamily: buttonFontFamily 
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShadow: {
    shadowColor: COLORS.primary2,
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.08,
    shadowRadius: scale(6),
    elevation: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
  },
});

export default Button;

