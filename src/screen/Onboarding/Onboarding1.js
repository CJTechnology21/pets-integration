import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Container } from '../../components/Container/Container';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/Colors';
import { Icons } from '../../assets';

const Onboarding1 = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding2');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Container backgroundColor={COLORS.lightBlue} statusBarBackgroundColor='white' statusBarStyle='dark-content'>
      <View style={styles.container}>
            <Image source={Icons.Star2} style={styles.starImageTop} resizeMode="contain" />

            <Image source={Icons.Star1} style={styles.starImageBottom} resizeMode="contain" />

        <View style={styles.content}>
          <Text style={styles.title}>Let's setup</Text>
          <Text style={styles.title}>your new device</Text>
          <Text style={styles.subtitle}>running <Text style={{fontWeight:"bold"}}>ameos</Text></Text>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
    position: 'relative',
  },
  shapeTopLeft: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: '70%',
    height: '60%',
    zIndex: 1,
    overflow: 'hidden',
  },
  orangeShapeTop: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.orangeShape,
    borderBottomRightRadius: 200,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 100,
    transform: [{ rotate: '-8deg' }],
    overflow: 'hidden',
  },
  shapeBottomRight: {
    position: 'absolute',
    bottom: -50,
    right: -40,
    width: '65%',
    height: '50%',
    zIndex: 1,
    overflow: 'hidden',
  },
  orangeShapeBottom: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.orangeShape,
    borderTopLeftRadius: 200,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 80,
    transform: [{ rotate: '5deg' }],
    overflow: 'hidden',
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
    width: 250,
    height: 250,
    bottom: -20,
    right: -30,
  },
  content: {
    position: 'absolute',
    top: 120,
    left: 40,
    zIndex: 2,
    maxWidth: '60%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 36,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 10,
  },
});

export default Onboarding1;

