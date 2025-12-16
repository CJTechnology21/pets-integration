import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomTextInput from '../../components/textInput/CustomTextInput';
import DatePickerInput from '../../components/DatePickerInput/DatePickerInput';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation } from '@react-navigation/native';
import StepProgress from '../../components/StepProgress/StepProgress';
import PhoneNumberInput from 'react-native-phone-number-input';
import UserService from '../../services/userService';
import { handleApiCall } from '../../utils/graphqlUtils'; // Import handleApiCall function

const CreateProfile = () => {
  const navigation = useNavigation();
  const TOTAL_STEPS = 5;

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameLocked, setUsernameLocked] = useState(false);
  const phoneInputRef = useRef(null);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', // Add email field to form state
    dob: '',
    username: '',
    password: '',
    confirmPassword: '',
    country: 'IN',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '', // Add email error state
    dob: '',
    username: '',
    password: '',
    confirmPassword: '',
    country: '',
    phoneNumber: '',
  });

  const {
    firstName,
    lastName,
    email,
    dob,
    username,
    password,
    confirmPassword,
    country,
    phoneNumber,
  } = formData;

  const validateName = (name, label) => {
    if (!name || !name.trim()) {
      return `${label} is required`;
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return `${label} must be at least 2 characters`;
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      return `${label} should only contain letters`;
    }
    return '';
  };

  // Add email validation function
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

  const validateDOB = date => {
    if (!date || !date.trim()) {
      return 'Date of Birth is required';
    }
    const dateRegex = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/;
    const trimmedDate = date.trim();
    if (!dateRegex.test(trimmedDate)) {
      return 'Please enter date in DD/MM/YYYY format';
    }
    const match = trimmedDate.match(dateRegex);
    if (!match) {
      return 'Please enter date in DD/MM/YYYY format';
    }
    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
      return 'Invalid month';
    }
    if (dayNum < 1 || dayNum > 31) {
      return 'Invalid day';
    }
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return 'Invalid year';
    }

    const dateObj = new Date(yearNum, monthNum - 1, dayNum);
    if (
      dateObj.getDate() !== dayNum ||
      dateObj.getMonth() !== monthNum - 1 ||
      dateObj.getFullYear() !== yearNum
    ) {
      return 'Invalid date';
    }

    const today = new Date();
    const age =
      today.getFullYear() -
      yearNum -
      (today.getMonth() < monthNum - 1 ||
      (today.getMonth() === monthNum - 1 && today.getDate() < dayNum)
        ? 1
        : 0);
    if (age < 13) {
      return 'You must be at least 13 years old';
    }

    return '';
  };

  const validateUsername = value => {
    if (!value || !value.trim()) {
      return 'Username is required';
    }
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
      return 'Use only letters, numbers, dot or underscore';
    }
    return '';
  };

  const validatePassword = pass => {
    if (!pass || !pass.trim()) {
      return 'Password is required';
    }
    if (pass.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const validateConfirmPassword = value => {
    if (!value || !value.trim()) {
      return 'Please confirm your password';
    }
    if (value !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateCountry = value => {
    if (!value || !value.trim()) {
      return 'Country is required';
    }
    return '';
  };

  const validatePhoneNumber = value => {
    if (!value || !value.trim()) {
      return 'Phone number is required';
    }
    if (phoneInputRef.current) {
      const isValid = phoneInputRef.current.isValidNumber(value);
      if (!isValid) {
        return 'Enter a valid phone number';
      }
    } else {
      if (!/^\d{7,15}$/.test(value)) {
        return 'Enter a valid phone number';
      }
    }
    return '';
  };

  const usernameSuggestion = useMemo(() => {
    if (!firstName && !lastName) {
      return '';
    }
    const sanitizedFirst = firstName.trim().toLowerCase().replace(/\s+/g, '');
    const sanitizedLast = lastName.trim().toLowerCase().replace(/\s+/g, '');
    let suffix = '';
    if (dob) {
      const match = dob.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
      if (match) {
        suffix = match[3].slice(-2);
      }
    } else {
      suffix = new Date().getFullYear().toString().slice(-2);
    }
    return (
      [sanitizedFirst, sanitizedLast].filter(Boolean).join('_') +
      (suffix ? suffix : '')
    );
  }, [firstName, lastName, dob]);

  useEffect(() => {
    if (!usernameLocked && usernameSuggestion) {
      setFormData(prev => ({ ...prev, username: usernameSuggestion }));
    }
  }, [usernameLocked, usernameSuggestion]);

  const validators = {
    firstName: value => validateName(value, 'First Name'),
    lastName: value => validateName(value, 'Last Name'),
    email: validateEmail, // Add email validator
    dob: validateDOB,
    username: validateUsername,
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
    country: validateCountry,
    phoneNumber: validatePhoneNumber,
  };

  const fieldsByStep = {
    1: ['firstName', 'lastName', 'email'], // Add email to step 1
    2: ['dob'],
    3: ['username'],
    4: ['password', 'confirmPassword'],
    5: ['phoneNumber'],
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  const handleContinue = async () => {
    const activeFields = fieldsByStep[currentStep] || [];
    const nextErrors = {};
    let hasError = false;

    activeFields.forEach(field => {
      const error = validators[field](formData[field]);
      nextErrors[field] = error;
      if (error) {
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(prev => ({ ...prev, ...nextErrors }));
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setErrors(prev => ({ ...prev, ...nextErrors }));
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step - submit the form
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsRegistering(true);

    const userData = {
      firstName,
      lastName,
      email, // Include email in user data
      username,
      password,
      dob,
      phoneNumber,
    };

    try {
      // Use handleApiCall to ensure proper toast notifications
      const result = await handleApiCall(
        () => UserService.createUser(userData),
        'Account created successfully!',
        'createUser',
      );

      if (result.success) {
        // Note: Not calling sendOtpForSignup anymore as per new requirements
        // The API declaration is kept in the codebase for future use
        setIsRegistering(false);
        // Navigate to verification screen, passing the email
        navigation.navigate('VerifyPhone', { email });
      } else {
        setIsRegistering(false);
        // Error message is already displayed via toast in handleApiCall
      }
    } catch (error) {
      setIsRegistering(false);
      // Error message is already displayed via toast in handleApiCall
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
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
          title="Create Account"
          titleColor={COLORS.black}
          onBackPress={handleBack}
          showBackButton={false}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whiteContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.mainTitle}>Create account</Text>
              <Text style={styles.stepText}>
                Step {currentStep} of {TOTAL_STEPS}
              </Text>
              <StepProgress
                totalSteps={TOTAL_STEPS}
                currentStep={currentStep}
              />
            </View>

            {currentStep === 1 && (
              <View>
                <CustomTextInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={text => handleInputChange('firstName', text)}
                  leftIcon="person-outline"
                  error={errors.firstName}
                />
                <CustomTextInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={text => handleInputChange('lastName', text)}
                  leftIcon="person-outline"
                  error={errors.lastName}
                  containerStyle={{ marginTop: verticalScale(16) }}
                />
                {/* Email input field */}
                <CustomTextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={text => handleInputChange('email', text)}
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  containerStyle={{ marginTop: verticalScale(16) }}
                />
              </View>
            )}

            {currentStep === 2 && (
              <View>
                <DatePickerInput
                  placeholder="Birthday (DD/MM/YYYY)"
                  value={dob}
                  onChange={value => handleInputChange('dob', value)}
                  leftIcon="calendar-outline"
                  error={errors.dob}
                  minimumDate={new Date(1900, 0, 1)}
                  maximumDate={new Date()}
                />
              </View>
            )}

            {currentStep === 3 && (
              <View style={styles.usernameWrapper}>
                <Text style={styles.usernameHelper}>Your username is</Text>
                <Text style={styles.usernameValue}>
                  {username || 'username_here'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingUsername(true);
                    setUsernameLocked(true);
                  }}
                >
                  <Text style={styles.usernameAction}>Change my username</Text>
                </TouchableOpacity>
                {isEditingUsername && (
                  <CustomTextInput
                    placeholder="Enter username"
                    value={username}
                    onChangeText={text => handleInputChange('username', text)}
                    leftIcon="at"
                    error={errors.username}
                    containerStyle={{ marginTop: verticalScale(20) }}
                  />
                )}
              </View>
            )}

            {currentStep === 4 && (
              <View>
                <CustomTextInput
                  placeholder="Set a password"
                  value={password}
                  onChangeText={text => handleInputChange('password', text)}
                  leftIcon="lock-closed-outline"
                  secureTextEntry
                  error={errors.password}
                />
                <Text style={styles.passwordHint}>
                  Your password should be at least 8 characters
                </Text>
                <CustomTextInput
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={text =>
                    handleInputChange('confirmPassword', text)
                  }
                  leftIcon="lock-closed-outline"
                  secureTextEntry
                  error={errors.confirmPassword}
                  containerStyle={{ marginTop: verticalScale(16) }}
                />
              </View>
            )}

            {currentStep === 5 && (
              <View>
                <View style={styles.phoneInputWrapper}>
                  <PhoneNumberInput
                    ref={phoneInputRef}
                    defaultValue={phoneNumber}
                    defaultCode={formData.country || 'IN'}
                    layout="first"
                    withShadow={false}
                    withDarkTheme={false}
                    autoFocus={false}
                    placeholder="Phone number"
                    onChangeText={text => {
                      handleInputChange('phoneNumber', text);
                    }}
                    onChangeFormattedText={text => {
                      setFormattedPhoneNumber(text);
                    }}
                    onChangeCountry={country => {
                      handleInputChange('country', country.cca2);
                    }}
                    containerStyle={styles.phoneInputContainer}
                    textContainerStyle={styles.phoneInputTextContainer}
                    textInputStyle={styles.phoneInputText}
                    codeTextStyle={styles.codeText}
                    flagButtonStyle={styles.flagButton}
                    countryPickerButtonStyle={styles.countryPickerButton}
                  />
                  {errors.phoneNumber ? (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  ) : null}
                </View>
                <Text style={styles.phoneDisclaimer}>
                  By proceeding, you agree to receive transactional messaging
                  via text, WhatsApp, or other messaging channel about your
                  account.
                </Text>
                <TouchableOpacity onPress={handleEmail}>
                  <Text style={styles.emailOption}>Use email instead</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonRow}>
              {currentStep > 1 && (
                <Button
                  onPress={handleBack}
                  title="Back"
                  variant="secondary"
                  height={verticalScale(56)}
                  borderRadius={moderateScale(12)}
                  fontSize={moderateScale(16)}
                  style={[styles.flexButton, styles.backButton]}
                />
              )}
              <Button
                onPress={handleContinue}
                title={currentStep === TOTAL_STEPS ? 'Finish' : 'Continue'}
                variant="primary"
                height={verticalScale(56)}
                borderRadius={moderateScale(12)}
                fontSize={moderateScale(18)}
                loading={isRegistering}
                style={[
                  styles.flexButton,
                  currentStep === 1
                    ? styles.fullWidthButton
                    : styles.primaryButton,
                ]}
              />
            </View>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already Have An Account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
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
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(40),
    minHeight: '100%',
  },
  stepHeader: {
    marginBottom: verticalScale(24),
  },
  mainTitle: {
    fontSize: moderateScale(30),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
  },
  stepText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: COLORS.textGrey,
    marginTop: verticalScale(4),
  },
  usernameWrapper: {
    paddingVertical: verticalScale(24),
  },
  usernameHelper: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
  },
  usernameValue: {
    fontSize: moderateScale(26),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginVertical: verticalScale(10),
  },
  usernameAction: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    color: COLORS.primary2,
    textDecorationLine: 'underline',
  },
  passwordHint: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
    marginTop: verticalScale(8),
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
  phoneDisclaimer: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
    marginTop: verticalScale(8),
    lineHeight: moderateScale(18),
  },
  emailOption: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: COLORS.primary2,
    marginTop: verticalScale(16),
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: moderateScale(12),
    marginTop: scale(4),
    marginLeft: scale(4),
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  signInText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
  },
  signInLink: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: COLORS.primary2,
    textDecorationLine: 'underline',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: verticalScale(32),
    marginBottom: verticalScale(20),
  },
  flexButton: {
    flex: 1,
  },
  backButton: {
    marginRight: scale(12),
  },
  primaryButton: {},
  fullWidthButton: {
    flex: 1,
  },
});

export default CreateProfile;
