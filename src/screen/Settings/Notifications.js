import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomSwitch from '../../components/switch/CustomSwitch';
import Button from '../../components/buttons/Button';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';

const Notifications = ({ navigation }) => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emails, setEmails] = useState(false);
  const [anonymousReviews, setAnonymousReviews] = useState(false);

  const handleNext = () => {
    // Next button handler
  };

  return (
    <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
      <CustomHeader title='Notifications' showBackButton={true} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Two-Factor Authentication (2FA)</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingDescription}>
                Add an extra security layer with SMS or email for login.
              </Text>
            </View>
            <CustomSwitch 
              value={twoFactorAuth} 
              onValueChange={setTwoFactorAuth}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Notify via email/SMS for new device logins.
              </Text>
            </View>
            <CustomSwitch 
              value={pushNotifications} 
              onValueChange={setPushNotifications}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Emails</Text>
              <Text style={styles.settingDescription}>
                Notify if unusual activity is detected (e.g., multiple failed login attempts).
              </Text>
            </View>
            <CustomSwitch 
              value={emails} 
              onValueChange={setEmails}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Privacy Options</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Anonymous Reviews</Text>
              <Text style={styles.settingDescription}>
                Set your review & rating default review settings as anonymous.
              </Text>
            </View>
            <CustomSwitch 
              value={anonymousReviews} 
              onValueChange={setAnonymousReviews}
            />
          </View>
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
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(100),
  },
  section: {
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(15),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
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

export default Notifications;