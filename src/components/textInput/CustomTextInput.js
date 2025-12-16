import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

const CustomTextInput = ({
  placeholder,
  secureTextEntry,
  keyboardType,
  value,
  onChangeText,
  error,
  maxLength,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  fieldName,
  containerStyle,
  inputStyle,
  editable = true,
  onPress,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const getIconColor = () => {
    return isFocused || value ? COLORS.black : COLORS.placeholderColor;
  };

  const getContainerStyle = () => {
    return [
      styles.inputContainer,
      isFocused && styles.inputContainerFocused,
      error && styles.inputError,
      containerStyle,
    ];
  };

  const Content = (
    <View style={getContainerStyle()}>
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={20}
          color={getIconColor()}
          style={styles.inputIcon}
        />
      )}
      {editable ? (
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholderColor}
          style={[styles.input, inputStyle]}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <TouchableOpacity
          style={styles.displayValueWrap}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.displayValueText,
              !value && { color: COLORS.placeholderColor },
              inputStyle,
            ]}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
        </TouchableOpacity>
      )}
      {secureTextEntry && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Icon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={getIconColor()}
          />
        </TouchableOpacity>
      )}
      {rightIcon && !secureTextEntry && (
        <View style={styles.rightIcon}>{rightIcon}</View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {editable ? (
        Content
      ) : (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
          {Content}
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    height: verticalScale(56),
    borderWidth: 0,
  },
  inputContainerFocused: {
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  inputIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    color: COLORS.black,
    padding: 0,
    fontFamily: Fonts.Medium,
  },
  displayValueWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  displayValueText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
  },
  eyeIcon: {
    paddingLeft: scale(8),
  },
  rightIcon: {
    paddingLeft: scale(8),
  },
  errorText: {
    color: 'red',
    fontSize: moderateScale(12),
    marginTop: scale(4),
    marginLeft: scale(4),
  },
});

export default CustomTextInput;
