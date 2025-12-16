import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Container } from '../../components/Container/Container';
import { useNavigation } from '@react-navigation/native';
import { Icons } from '../../assets';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

const Onboarding2 = () => {
  const navigation = useNavigation();
  
  return (
    <Container backgroundColor={COLORS.lightBlue} statusBarBackgroundColor='white' statusBarStyle='dark-content'>
      <View style={styles.container}>
        <Image source={Icons.Star2} style={styles.starImageTop} resizeMode="contain" />
        <Image source={Icons.Star1} style={styles.starImageBottom} resizeMode="cover" />

        <View style={styles.centerContent}>
          <Image source={Icons.Logo} style={styles.logo} resizeMode="contain" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.continueButton}
          onPress={() => navigation.navigate('Onboarding3')}
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: 550,
    aspectRatio: 0.70, // tuned to the provided artwork
    bottom:70
  },
  
  starImageTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    top: 0,
    left: -30,
  },
  starImageBottom: {
    position: 'absolute',
    left: 70,
    right: 0,
    bottom: 0,
    width: '90%', 
    height: '46%', 
    alignSelf: 'center',
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

export default Onboarding2;

