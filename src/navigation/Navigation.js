import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { autoLogin } from '../services/authService';
import Onboarding1 from '../screen/Onboarding/Onboarding1';
import Onboarding2 from '../screen/Onboarding/Onboarding2';
import Onboarding3 from '../screen/Onboarding/Onboarding3';
import Onboarding4 from '../screen/Onboarding/Onboarding4';
import Select_Language from '../screen/Language /Select_Language';
import MobileNo from '../screen/Login_Module/MobileNo';
import AgeVerify from '../screen/Login_Module/AgeVerify';
import Privacy from '../screen/Login_Module/Privacy';
import CreateProfile from '../screen/CreateProfile/CreateProfile';
import EnterMobile from '../screen/CreateProfile/EnterMobile';
import VerifyPhone from '../screen/CreateProfile/VerifyPhone';
import Login from '../screen/CreateProfile/Login';
import ForgotPass from '../screen/ForgotPassword/ForgotPass';
import ForgotVerify from '../screen/ForgotPassword/ForgotVerify';
import Home from '../screen/Home/Home';
import ResetPass from '../screen/ForgotPassword/ResetPass';
import BottomTab from './BottomTab';
import ShowStory from '../screen/Community/ShowStory';
import ChatUser from '../screen/Chat/ChatUser';
import Chat from '../screen/Chat/Chat';
import Notifications from '../screen/Settings/Notifications';
import PrivacySafty from '../screen/Settings/PrivacySafty';
import LegalPrivacy from '../screen/Settings/LegalPrivacy';
import PetProfile from '../screen/Pet_Profile/PetProfile';
import { COLORS } from '../theme/Colors';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check onboarding status
        const onboardingComplete = await AsyncStorage.getItem(
          'onboardingComplete',
        );
        setIsOnboardingComplete(onboardingComplete === 'true');

        // Attempt auto-login
        const autoLoginSuccess = await autoLogin();
        setIsLoggedIn(autoLoginSuccess);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primory1} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          isOnboardingComplete
            ? isLoggedIn
              ? 'BottomTab'
              : 'Login'
            : 'Onboarding1'
        }
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="Onboarding4" component={Onboarding4} />
        <Stack.Screen name="Select_Language" component={Select_Language} />
        <Stack.Screen name="MobileNo" component={MobileNo} />
        <Stack.Screen name="AgeVerify" component={AgeVerify} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="EnterMobile" component={EnterMobile} />
        <Stack.Screen name="VerifyPhone" component={VerifyPhone} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="ForgotVerify" component={ForgotVerify} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
        <Stack.Screen name="ShowStory" component={ShowStory} />
        <Stack.Screen name="ChatUser" component={ChatUser} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PrivacySafty" component={PrivacySafty} />
        <Stack.Screen name="LegalPrivacy" component={LegalPrivacy} />
        <Stack.Screen name="PetProfile" component={PetProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
