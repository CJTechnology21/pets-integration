import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomTextInput from '../../components/textInput/CustomTextInput';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, moderateScale, verticalScale } from "../../utils/Scalling";
import { useNavigation } from "@react-navigation/native";

const ResetPass = () => {
  const navigation = useNavigation('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const nextErrors = { password: '', confirmPassword: '' };

    if (!password || password.length < 6) {
      nextErrors.password = 'Minimum 6 characters required';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm password';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(nextErrors);
    return !nextErrors.password && !nextErrors.confirmPassword;
  };

  const onReset = () => {
    if (!validate()) return;
    setShowSuccess(true);
  };

  const onDone = () => {
    setShowSuccess(false);
    navigation.navigate('Login');
  };

  return (
    <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
      <CustomHeader title="Reset Password" />

      <View style={styles.content}>
        <Text style={styles.title}>Rest Your{`\n`}Password</Text>

        <CustomTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed-outline"
          secureTextEntry={true}
          error={errors.password}
        />

        <CustomTextInput
          placeholder="Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon="lock-closed-outline"
          secureTextEntry={true}
          error={errors.confirmPassword}
        />

        <TouchableOpacity style={styles.resetButton} onPress={onReset} activeOpacity={0.85}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardOuter}>
            <View style={styles.modalCardInner}>
              <View style={styles.tickCircle}>
                <Text style={styles.tickText}>✓</Text>
              </View>
              <Text style={styles.modalTitle}>Successful</Text>
              <Text style={styles.modalDesc}>
                Congratulations! Your password has been successfully updated. Click
                {"\n"}Continue to login
              </Text>
              <TouchableOpacity style={styles.doneButton} onPress={onDone} activeOpacity={0.9}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(30),
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(24),
  },
  resetButton: {
    backgroundColor: COLORS.primary2,
    borderRadius: moderateScale(12),
    height: verticalScale(56),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  resetButtonText: {
    color: COLORS.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(18),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(24),
  },
  modalCardOuter: {
    backgroundColor: COLORS.primary2,
    borderRadius: moderateScale(20),
    padding: scale(8),
  },
  modalCardInner: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    padding: scale(20),
    width: '90%',
    alignItems: 'center',
  },
  tickCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.primary2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(-30),
    marginBottom: verticalScale(10),
  },
  tickText: {
    color: COLORS.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(18),
  },
  modalTitle: {
    fontFamily: Fonts.SeniBold,
    fontSize: moderateScale(18),
    color: COLORS.black,
    marginTop: verticalScale(6),
    marginBottom: verticalScale(6),
  },
  modalDesc: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  doneButton: {
    backgroundColor: COLORS.primary2,
    borderRadius: moderateScale(12),
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(24),
    alignSelf: 'stretch',
  },
  doneText: {
    color: COLORS.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
  },
});

export default ResetPass;