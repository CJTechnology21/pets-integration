import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import OTPInput from '../../components/otpInput/OTPInput';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserService from '../../services/userService';
import { handleApiCallWithLoader } from '../../utils/graphqlUtils';
import Loader from '../../components/Loader'; // Import Loader component

const VerifyPhone = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const phoneNumber = route.params?.phoneNumber || '+00 000000 0000';
  const email = route.params?.email || ''; // Get email from previous screen
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(270); // 04:30
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showLoader, setShowLoader] = useState(false); // Loader state
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTimer = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOtpChange = value => {
    setOtp(value);
  };

  const handleContinue = async () => {
    if (otp.length === 6) {
      // Use handleApiCallWithLoader to ensure proper toast notifications and loader display
      const result = await handleApiCallWithLoader(
        () => UserService.verifyOtpForSignup(email, otp),
        'OTP verified successfully!',
        'verifyOtpForSignup',
        () => setShowLoader(true),
        () => setShowLoader(false)
      );
      
      if (result.success) {
        // Navigate to Login screen after successful OTP verification
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        // Error message is already displayed via toast in handleApiCallWithLoader
      }
    }
  };

  const handleSendAgain = () => {
    if (canResend) {
      setTimer(270);
      setCanResend(false);
      setOtp('');
      if (otpInputRef.current) {
        otpInputRef.current.clearOtp();
      }
      // TODO: Implement actual resend OTP functionality if needed
    }
  };

  return (
    <Container
      backgroundColor={COLORS.background}
      statusBarBackgroundColor={COLORS.background}
    >
      <CustomHeader title="Verify Phone" />
      <Loader visible={showLoader} />
      
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.circle}>
            <Text style={styles.icon}>🔒</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Verify Your Phone</Text>
        
        <Text style={styles.description}>
          We've sent a 6-digit code to your phone number
        </Text>
        
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        
        <View style={styles.otpContainer}>
          <OTPInput
            ref={otpInputRef}
            length={6}
            onChange={handleOtpChange}
            onComplete={handleContinue}
            autoFocus={true}
          />
        </View>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Code expires in</Text>
          <Text style={[styles.timer, !canResend && styles.timerActive]}>
            {formatTimer(timer)}
          </Text>
        </View>
        
        <Button
          onPress={handleContinue}
          disabled={otp.length !== 6 || isVerifying}
          title={isVerifying ? "Verifying..." : "Continue"}
          variant="primary"
          height={verticalScale(56)}
          borderRadius={moderateScale(16)}
          fontSize={moderateScale(18)}
          fontWeight="bold"
          style={styles.continueButton}
        />
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity 
            onPress={handleSendAgain}
            disabled={!canResend}
            style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
          >
            <Text style={[styles.resendButtonText, !canResend && styles.resendButtonTextDisabled]}>
              {canResend ? 'Resend Code' : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(40),
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  circle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: COLORS.lightPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: moderateScale(40),
  },
  title: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(24),
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  description: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(16),
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(22),
  },
  phoneNumber: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(16),
    color: COLORS.primary2,
    textAlign: 'center',
    marginBottom: verticalScale(30),
  },
  otpContainer: {
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  timerLabel: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.textGrey,
    marginRight: scale(8),
  },
  timer: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(16),
    color: COLORS.textGrey,
  },
  timerActive: {
    color: COLORS.error,
  },
  continueButton: {
    marginBottom: verticalScale(20),
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.textGrey,
    marginRight: scale(8),
  },
  resendButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendButtonText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(14),
    color: COLORS.primary2,
  },
  resendButtonTextDisabled: {
    color: COLORS.grey,
  },
});

export default VerifyPhone;