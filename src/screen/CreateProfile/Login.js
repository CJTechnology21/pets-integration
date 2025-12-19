import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomTextInput from '../../components/textInput/CustomTextInput';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserService from '../../services/userService';
import { handleApiCallWithLoader } from '../../utils/graphqlUtils';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { saveTokens } from '../../services/apiService';
import Loader from '../../components/Loader'; // Import Loader component

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false); // Loader state

  const validateEmail = emailValue => {
    if (!emailValue || !emailValue.trim()) {
      return 'Email is required';
    }
    const trimmedEmail = emailValue.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = pass => {
    if (!pass || !pass.trim()) {
      return 'Password is required';
    }
    if (pass.length < 6) {
      return 'Password must be at least 6 characters';
    }
    // Additional password validation rules (currently disabled)
    // if (!/(?=.*[a-z])/.test(pass)) {
    //   return 'Password must contain at least one lowercase letter';
    // }
    // if (!/(?=.*[A-Z])/.test(pass)) {
    //   return 'Password must contain at least one uppercase letter';
    // }
    // if (!/(?=.*\d)/.test(pass)) {
    //   return 'Password must contain at least one number';
    // }
    return '';
  };

  const handleEmailChange = text => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(text) }));
    }
  };

  const handlePasswordChange = text => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(text) }));
    }
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      // Set loading state
      setIsLoading(true);

      try {
        // Use handleApiCallWithLoader to ensure proper toast notifications and loader display
        const result = await handleApiCallWithLoader(
          () => UserService.login(email, password),
          'Login successful!', // This message will only show for truly successful logins
          'login',
          () => setShowLoader(true),
          () => setShowLoader(false)
        );

        if (result.success) {
          // Extract user data from the new response structure
          const { status, code, message, data } = result.data.login;
          const { idToken, refreshToken, userId, email: userEmail } = data;

          // Save tokens to secure storage using the new secure storage module
          await saveTokens({
            idToken,
            refreshToken,
            userId,
            email: userEmail,
          });

          // Dispatch login success action to update Redux state
          dispatch(
            loginSuccess({
              idToken,
              refreshToken,
              userId,
              email: userEmail,
            }),
          );

          // Navigate to bottom tab navigator
          navigation.navigate('BottomTab');
        } else {
          // Error message is already displayed via toast in handleApiCallWithLoader
        }
      } catch (error) {
        // Error message is already displayed via toast in handleApiCallWithLoader
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('CreateProfile');
  };

  const handleGoogle = () => {
    // Google login handler
  };

  const handleEmail = () => {
    // Email login handler
  };

  return (
    <Container
      backgroundColor={COLORS.white}
      statusBarBackgroundColor={COLORS.white}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <CustomHeader 
          title="Login" 
          titleColor={COLORS.white} 
          showBackButton={navigation.canGoBack()}
        />
        <Loader visible={showLoader} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteContainer}>
            <Text style={styles.mainTitle}>Login Your {'\n'}Account</Text>

            <CustomTextInput
              placeholder="Enter Your Email"
              value={email}
              onChangeText={handleEmailChange}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomTextInput
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              leftIcon="lock-closed-outline"
              secureTextEntry={true}
              error={errors.password}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
              <Text style={styles.forgotText}>Forget Password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.accountsSection}>
              <Text style={styles.accountsText}>Continue With Accounts</Text>
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogle}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialButtonText}>GOOGLE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.emailButton]}
                  onPress={handleEmail}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialButtonText}>EMAIL</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(40),
  },
  whiteContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(40),
    minHeight: '100%',
  },
  mainTitle: {
    fontSize: moderateScale(28),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(30),
  },
  forgotText: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(12),
    fontSize: moderateScale(12),
    fontFamily: Fonts.Medium,
    color: COLORS.textGrey,
  },
  loginButton: {
    backgroundColor: COLORS.primary2,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
    height: verticalScale(56),
  },
  loginButtonText: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.Bold,
    color: COLORS.white,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  signUpText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
  },
  signUpLink: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: COLORS.primary2,
    textDecorationLine: 'underline',
  },
  accountsSection: {
    marginTop: verticalScale(10),
  },
  accountsText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(56),
    marginHorizontal: scale(6),
  },
  googleButton: {
    backgroundColor: COLORS.googleButton,
  },
  emailButton: {
    backgroundColor: COLORS.emailButton,
  },
  socialButtonText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Bold,
    color: COLORS.white,
  },
});

export default Login;
