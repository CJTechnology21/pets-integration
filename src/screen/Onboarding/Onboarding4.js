import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Container } from '../../components/Container/Container';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icons } from '../../assets';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

const Onboarding4= () => {
  const navigation = useNavigation();
  
  const handleContinue = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingComplete', 'true');
      // Navigate to CreateProfile (signup) after onboarding completion
      navigation.navigate('CreateProfile');
    } catch (error) {
      console.error('Error marking onboarding as complete:', error);
      // Navigate to CreateProfile even if there's an error
      navigation.navigate('CreateProfile');
    }
  };
  
  return (
    <Container backgroundColor={COLORS.lightBlue} statusBarBackgroundColor='white' statusBarStyle='dark-content'>
      <View style={styles.container}>

        <Image source={Icons.Star2} style={styles.starImageTop} resizeMode="contain" />
        <Image source={Icons.Star3} style={styles.starImageBottom} resizeMode="cover" />

        <View style={styles.textContainer}>
          <Text style={styles.titleLine1}>Set your</Text>
          <Text style={styles.titleLine2}>environment</Text>
          <Text style={styles.subtitle}>Depends if you're on a phone or PC</Text>
        </View>

        <View style={styles.centerContent}>
          <Image source={Icons.Monkey} style={styles.logo} resizeMode="contain" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={["#DFF2FF", "rgba(162,215,254,0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBg}
          />
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    right: 30,
    zIndex: 10,
  },
  titleLine1: {
    fontSize: 20,
    color: COLORS.black,
    fontWeight: '400',
    marginBottom: 4,
  },
  titleLine2: {
    fontSize: 36,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '400',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: 500,
    aspectRatio: 0.70, // tuned to the provided artwork
    bottom:0
  },
  
  starImageTop: {
    position: 'absolute',
    width: 400,
    height: 250,
    top: 0,
    left: -100,
  },
  starImageBottom: {
    position: 'absolute',
    right: -20,
    bottom: 0,
    width: 200,
    height: 200,
    alignSelf: 'flex-end',
  }, 
  continueButton: {
    position: 'absolute',
    left: 50,
    right: 50,
    bottom: 24,
    height: 56,
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  continueText: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily:Fonts.SeniBold
  },
});

export default Onboarding4;