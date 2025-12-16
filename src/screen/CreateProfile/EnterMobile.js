import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../theme/Fonts';
import PhoneNumberInput from 'react-native-phone-number-input';

const EnterMobile = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef(null);

  const handleContinue = () => {
    if (phoneNumber.trim() && phoneInput.current?.isValidNumber(phoneNumber)) {
      const callingCode = phoneInput.current?.getCallingCode() || '';
      const fullPhoneNumber = formattedValue || `+${callingCode}${phoneNumber}`;
      navigation.navigate('VerifyPhone', { phoneNumber: fullPhoneNumber });
    }
  };

  const handleLater = () => {
    // Later button handler
  };

  return (
    <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <CustomHeader title="Enter phone number" />

        <View style={styles.content}>
          <Text style={styles.title}>Enter Your Phone {'\n'}Number</Text>
          <View style={styles.phoneInputWrapper}>
            <PhoneNumberInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              defaultCode="IN"
              layout="first"
              withShadow={false}
              withDarkTheme={false}
              autoFocus={false}
              placeholder="Phone Number"
              onChangeText={(text) => {
                setPhoneNumber(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              containerStyle={styles.phoneInputContainer}
              textContainerStyle={styles.phoneInputTextContainer}
              textInputStyle={styles.phoneInputText}
              codeTextStyle={styles.codeText}
              flagButtonStyle={styles.flagButton}
              countryPickerButtonStyle={styles.countryPickerButton}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              title="Continue"
              variant="primary"
              height={verticalScale(45)}
              borderRadius={moderateScale(12)}
              style={{ marginTop: scale(10) }}
            />

            <Button
              onPress={handleLater}
              title="Later"
              variant="secondary"
              height={verticalScale(45)}
              borderRadius={moderateScale(12)}
              fontSize={moderateScale(18)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(32),
  },
  buttonContainer: {
    gap: verticalScale(10),
  },
  phoneInputWrapper: {
    marginBottom: verticalScale(16),
  },
  phoneInputContainer: {
    width: '100%',
    backgroundColor: COLORS.inputBackground,
    borderRadius: moderateScale(12),
    borderWidth: 0,
    height: verticalScale(56),
    overflow: 'hidden',
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    height: verticalScale(56),
    borderRadius: moderateScale(12),
  },
  flagButton: {
    width: scale(70),
    height: verticalScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
  },
  countryPickerButton: {
    width: scale(60),
    height: verticalScale(56),
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    height: verticalScale(56),
    paddingVertical: 0,
    margin: 0,
  },
  codeText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    marginLeft: scale(4),
  },
});

export default EnterMobile;