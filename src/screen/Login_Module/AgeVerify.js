import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";

import { Container } from '../../components/Container/Container';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/Colors';
import { Icons, imgPath } from '../../assets';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from "../../components/Header/CustomHeader";
import OTPInput from '../../components/otpInput/OTPInput';
import Button from '../../components/buttons/Button';
import { Fonts } from "../../theme/Fonts";

const AgeVerify = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [mobileNumber] = useState('+91 - 12989200823');
  const otpInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleResendOtp = () => {
    setOtp('');
    setTimer(30);
    if (otpInputRef.current) {
      otpInputRef.current.clearOtp();
    }
  };

  const handleContinue = async () => {
    if (otp.length === 4) {
      try {
        navigation.navigate('Privacy');
      } catch (error) {
        // Handle OTP verification error
      }
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}.${String(secs).padStart(2, '0')}`;
  };

  return (
    <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.headerBackground}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
       <CustomHeader title={'Age Verification'}/>

          <View style={styles.backgroundCirclesContainer}>
            <Image source={Icons.Ellipse1} style={styles.ellipse1} />
            <Image source={Icons.Ellipse2} style={styles.ellipse2} />
          </View>

          <View style={styles.ratingImageContainer}>
            <Image source={Icons.Rating} style={styles.ratingImage} />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.mainTitle}>Age Verifiaction</Text>

            <Text style={styles.descriptionText}>
              We Will send you a one time password on this <Text style={styles.boldText}>Mobile Number</Text>
            </Text>

            <Text style={styles.mobileNumber}>+91 - 12989200823</Text>

            <View style={styles.otpContainer}>
              <OTPInput
                ref={otpInputRef}
                length={4}
                onChange={handleOtpChange}
                onComplete={(value) => {}}
                autoFocus={true}
              />
            </View>

            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTimer(timer)}</Text>
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendQuestion}>Do not send OTP? </Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
                <Text style={[styles.resendLink, timer > 0 && styles.resendLinkDisabled]}>
                  Send OTP
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              onPress={handleContinue}
              disabled={otp.length !== 4}
              title="Continue"
              variant="primary"
              height={verticalScale(45)}
              borderRadius={moderateScale(12)}
              fontSize={moderateScale(18)}
              style={{ marginHorizontal: scale(20), marginBottom: verticalScale(30) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(15),
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.grey,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
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
  
  halfCircle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: scale(200),
    height: scale(200),
    backgroundColor: '#243B55',
    borderBottomLeftRadius: scale(200),
    zIndex: 0,
  },
  // Background Circles
  backgroundCirclesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 0,
  },
  ellipse1: {
    position: 'absolute',
    width: '100%',
    height: verticalScale(285),
    resizeMode: 'contain',
  },
  ellipse2: {
    position: 'absolute',
    width: scale(180),
    height: verticalScale(180),
    top: verticalScale(0),
    right: scale(-30),
    resizeMode: 'contain',
  },
  ratingImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(70),
    marginBottom: verticalScale(5),
    zIndex: 1,
  },
  ratingImage: {
    width: scale(300),
    height: verticalScale(280),
    resizeMode: 'contain',
  },
  contentContainer: {
    zIndex: 1,
  },
  mainTitle: {
    fontSize: moderateScale(22),
    fontFamily:Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(16),
    textAlign: 'center',
    bottom:scale(15)
  },
  descriptionText: {
    fontSize: moderateScale(15),
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: verticalScale(5),
    lineHeight: moderateScale(22),
    paddingHorizontal: scale(20),
    bottom:scale(15),
    fontFamily:Fonts.Medium
  },
  boldText: {
     fontFamily:Fonts.Bold
  },
  mobileNumber: {
    fontSize: moderateScale(18),
    fontFamily:Fonts.Bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  otpContainer: {
    marginBottom: verticalScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  timerText: {
    fontSize: moderateScale(18),
    color: COLORS.grey,
    fontFamily:Fonts.Medium
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(30),
  },
  resendQuestion: {
    fontSize: moderateScale(14),
    color: COLORS.grey,
    fontFamily:Fonts.Regular
  },
  resendLink: {
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontFamily:Fonts.Bold
  },
  resendLinkDisabled: {
    opacity: 0.5,
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
    fontFamily:Fonts.Bold,
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: scale(40),
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default AgeVerify;