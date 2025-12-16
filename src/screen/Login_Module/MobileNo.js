import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../theme/Fonts';

const MobileNo = () => {
  
    const navigation = useNavigation()

    const [phoneNumber, setPhoneNumber] = useState('');

  const handleLater = () => {
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

          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={24} color={COLORS.black} style={styles.phoneIcon} />
            <TextInput
              style={styles.input}
              placeholder="+00 0000000 000"
              placeholderTextColor={COLORS.black}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoFocus={false}
              maxLength={10}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={()=>navigation.navigate('AgeVerify')}
              disabled={!phoneNumber.trim()}
              title="Continue"
              variant="primary"
              height={verticalScale(56)}
              borderRadius={moderateScale(12)}
              fontSize={moderateScale(18)}
            />

            <Button
              onPress={handleLater}
              title="Later"
              variant="secondary"
              height={verticalScale(56)}
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
    fontFamily:Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(32),
    justifyContent:"flex-start",
    alignItems:"center",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(40),
    height: verticalScale(56),
  },
  phoneIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    color: COLORS.black,
    padding: 0,
    fontFamily:Fonts.Regular
  },
  buttonContainer: {
    gap: verticalScale(16),
  },
});

export default MobileNo;
