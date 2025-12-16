import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomSwitch from '../../components/switch/CustomSwitch';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import {
  updatePipSetting,
  getPipSetting,
} from '../../components/FaceOverlay/FaceOverlay';

const PrivacySafty = ({ navigation }) => {
  const [parentalLock, setParentalLock] = useState(false);
  const [coppaCompliance, setCoppaCompliance] = useState(false);
  const [gdprCompliance, setGdprCompliance] = useState(false);
  const [pipCameraEnabled, setPipCameraEnabled] = useState(true);

  useEffect(() => {
    // Load PIP setting on mount
    const loadPipSetting = async () => {
      const setting = await getPipSetting();
      setPipCameraEnabled(setting);
    };
    loadPipSetting();
  }, []);

  const handlePipCameraToggle = async value => {
    setPipCameraEnabled(value);
    await updatePipSetting(value);
  };

  const handleNext = () => {
    // Next button handler
  };

  return (
    <Container
      backgroundColor={COLORS.white}
      statusBarBackgroundColor={COLORS.white}
    >
      <CustomHeader title="Privacy & Safety" showBackButton={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Parental Lock</Text>
            <Text style={styles.settingDescription}>
              Notify via email/SMS for new device logins.
            </Text>
          </View>
          <CustomSwitch value={parentalLock} onValueChange={setParentalLock} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>COPPA Compliance</Text>
            <Text style={styles.settingDescription}>
              Notify via email/SMS for new device logins.
            </Text>
          </View>
          <CustomSwitch
            value={coppaCompliance}
            onValueChange={setCoppaCompliance}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>GDPR Compliance</Text>
            <Text style={styles.settingDescription}>
              Notify via email/SMS for new device logins.
            </Text>
          </View>
          <CustomSwitch
            value={gdprCompliance}
            onValueChange={setGdprCompliance}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>PIP Camera</Text>
            <Text style={styles.settingDescription}>
              Show front camera in picture-in-picture mode when using back
              camera.
            </Text>
          </View>
          <CustomSwitch
            value={pipCameraEnabled}
            onValueChange={handlePipCameraToggle}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          style={styles.nextButton}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(100),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: verticalScale(25),
  },
  settingContent: {
    flex: 1,
    marginRight: scale(15),
  },
  settingLabel: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    marginBottom: verticalScale(5),
  },
  settingDescription: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
    lineHeight: verticalScale(18),
  },
  buttonContainer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10),
    backgroundColor: COLORS.white,
  },
  nextButton: {
    width: '100%',
  },
});

export default PrivacySafty;
