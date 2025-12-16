import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from '../../utils/Scalling';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../components/textInput/CustomTextInput';
import { showToast } from '../../utils/graphqlUtils';
import UserService from '../../services/userService';

const ForgotPass = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation - remove non-digit characters and validate
  const validatePhone = phone => {
    const phoneToValidate = phone.replace(/[^0-9]/g, '');
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phoneToValidate);
  };

  const OptionCard = ({ type, title, subtitle, icon }) => {
    const isActive = selected === type;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelected(type)}
        style={[styles.card, isActive && styles.cardActive]}
      >
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <Icon name={icon} size={20} color={COLORS.black} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNext = async () => {
    // Reset errors
    setEmailError('');
    setPhoneError('');

    if (selected === 'email') {
      // Validate email
      if (!email.trim()) {
        setEmailError('Email is required');
        return;
      }

      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      // Call send password reset email API
      try {
        setIsLoading(true);
        const response = await UserService.sendPasswordResetEmail(email);

        if (response.success) {
          showToast(
            'Password reset instructions sent to your email!',
            'success',
          );
          navigation.goBack(); // Navigate back to login
        } else {
          showToast(
            response.error.message || 'Failed to send password reset email',
            'error',
          );
        }
      } catch (error) {
        console.error('Error sending password reset email:', error);
        showToast('An unexpected error occurred', 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Validate phone
      if (!phone.trim()) {
        setPhoneError('Phone number is required');
        return;
      }

      // Clean phone number before validation
      const phoneToValidate = phone.replace(/[^0-9]/g, '');

      if (!validatePhone(phoneToValidate)) {
        setPhoneError('Please enter a valid phone number (10-15 digits)');
        return;
      }

      // Clean phone number before sending
      const phoneToSend = phone.replace(/[^0-9]/g, '');

      // Call send password reset phone API
      try {
        setIsLoading(true);
        const response = await UserService.sendPasswordResetPhone(phoneToSend);

        if (response.success) {
          showToast(
            'Password reset instructions sent to your phone!',
            'success',
          );
          navigation.goBack(); // Navigate back to login
        } else {
          showToast(
            response.error.message || 'Failed to send password reset SMS',
            'error',
          );
        }
      } catch (error) {
        console.error('Error sending password reset SMS:', error);
        showToast('An unexpected error occurred', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container
      backgroundColor={COLORS.white}
      statusBarBackgroundColor={COLORS.white}
    >
      <CustomHeader title="Forgot Password" />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Forget Password</Text>
        <Text style={styles.screenSubtitle}>
          Select which contact details should we use to{'\n'}reset your password
        </Text>

        <View style={{ height: verticalScale(16) }} />

        <OptionCard
          type="email"
          title="Email"
          subtitle="Code sent to your email"
          icon="mail-outline"
        />
        <View style={{ height: verticalScale(12) }} />
        <OptionCard
          type="phone"
          title="Phone"
          subtitle="Code sent to your phone"
          icon="call-outline"
        />

        {/* Conditional input fields */}
        {selected === 'email' && (
          <View style={{ marginTop: verticalScale(20) }}>
            <CustomTextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={text => {
                setEmail(text.trim());
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              error={emailError}
            />
          </View>
        )}

        {selected === 'phone' && (
          <View style={{ marginTop: verticalScale(20) }}>
            <CustomTextInput
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={text => {
                // Clean the phone number as user types
                const cleanedText = text.replace(/[^0-9]/g, '');
                setPhone(cleanedText);
                if (phoneError) setPhoneError('');
              }}
              keyboardType="phone-pad"
              error={phoneError}
            />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.nextButton}
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.nextText}>Sending...</Text>
          ) : (
            <Text style={styles.nextText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
  },
  screenTitle: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(28),
    color: COLORS.black,
  },
  screenSubtitle: {
    marginTop: verticalScale(6),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.textGrey,
    lineHeight: moderateScale(18),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    backgroundColor: COLORS.lightGrey,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    elevation: 3,
  },
  iconWrap: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGrey,
    marginRight: scale(12),
  },
  iconWrapActive: {
    backgroundColor: '#F3F6FA',
  },
  cardTitle: {
    fontFamily: Fonts.SeniBold,
    fontSize: moderateScale(16),
    color: COLORS.black,
  },
  cardSubtitle: {
    marginTop: verticalScale(4),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.placeholderColor,
  },
  nextButton: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(20),
    backgroundColor: COLORS.primary2,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: COLORS.white,
    fontFamily: Fonts.SeniBold,
    fontSize: moderateScale(16),
  },
});

export default ForgotPass;
