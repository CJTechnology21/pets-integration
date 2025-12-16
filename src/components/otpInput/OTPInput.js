import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';

const OTPInput = forwardRef(({ 
  length = 6, 
  onComplete, 
  onChange,
  autoFocus = false 
}, ref) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      const digits = numericText.slice(0, length).split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });
      
      setOtp(newOtp);
      const finalOtp = newOtp.join('');
      
      if (onChange) onChange(finalOtp);
      if (finalOtp.length === length && onComplete) {
        onComplete(finalOtp);
      }
      
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setActiveIndex(nextIndex);
      
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);
    const finalOtp = newOtp.join('');

    if (onChange) onChange(finalOtp);
    
    if (numericText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    } else if (finalOtp.length === length && onComplete) {
      onComplete(finalOtp);
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
      
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      
      const finalOtp = newOtp.join('');
      if (onChange) onChange(finalOtp);
    }
  };

  const handleFocus = (index) => {
    setActiveIndex(index);
  };

  const handleBlur = () => {
  };

  const clearOtp = () => {
    setOtp(Array(length).fill(''));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    if (onChange) onChange('');
  };

  useImperativeHandle(ref, () => ({
    clearOtp,
    getValue: () => otp.join(''),
    focus: () => inputRefs.current[0]?.focus()
  }));

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            activeIndex === index ? styles.inputFocused : {},
            value ? styles.inputFilled : {}
          ]}
          value={value}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(10),
  },
  input: {
    width: scale(45),
    height: scale(55),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: COLORS.black,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputFocused: {
    borderColor: COLORS.primary2,
    shadowColor: COLORS.primary2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputFilled: {
    borderColor: COLORS.primary2,
    backgroundColor: COLORS.lightPrimaryBg,
  },
});

export default OTPInput;