import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  Alert
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { logoutUser } from '../../services/apiService';

const Settings = ({ navigation }) => {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const handleItemPress = (itemName) => {
    if (itemName === 'Notifications') {
      navigation.navigate('Notifications');
    }
    if (itemName === 'Privacy') {
      navigation.navigate('Privacy');
    }
    if (itemName === 'PrivacySafty') {
      navigation.navigate('PrivacySafty');
    }
    if (itemName === 'LegalPrivacy') {
      navigation.navigate('LegalPrivacy');
    }
    if (itemName === 'Select_Language') {
      navigation.navigate('Select_Language');
    }
    if (itemName === 'PetProfile') {
      navigation.navigate('PetProfile');
    }
  };
  

  const handleLogout = () => {
    setIsLogoutVisible(true);
  };
  
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const SettingsItem = ({ icon, title, onPress }) => (
    <TouchableOpacity 
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon name={icon} size={moderateScale(22)} color={COLORS.black} />
      <Text style={styles.settingsItemText}>{title}</Text>
      <Icon name="chevron-forward" size={moderateScale(20)} color={COLORS.grey} />
    </TouchableOpacity>
  );

  const performLogout = async () => {
    try {
      await logoutUser();
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
      <CustomHeader title='Settings' showBackButton={false} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.premiumBannerContainer}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFE066', '#FFB84D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBanner}
          >
            <Text style={styles.premiumTitle}>Premium Membership</Text>
            <Text style={styles.premiumSubtitle}>Upgrade for more features</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingsItem
            icon="person-outline"
            title="Profile"
            onPress={() => setIsProfileModalVisible(true)}
          />
          
          <SettingsItem
            icon="lock-closed-outline"
            title="Privacy and safety"
            onPress={() => handleItemPress('PrivacySafty')}
          />
          
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => handleItemPress('Notifications')}
          />
          
          <SettingsItem
            icon="language-outline"
            title="Language"
            onPress={() => handleItemPress('Select_Language')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          
          <SettingsItem
            icon="star-outline"
            title="Help & Support"
            onPress={() => handleItemPress('Help & Support')}
          />
          
          <SettingsItem
            icon="help-circle-outline"
            title="Legal & Licences"
            onPress={() => handleItemPress('LegalPrivacy')}
          />
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        visible={isLogoutVisible}
        animationType="fade"
        onRequestClose={() => setIsLogoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalOuter}>
            <View style={styles.modalInner}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconExclaim}>!</Text>
              </View>
              <Text style={styles.modalTitle}>Log out?</Text>
              <Text style={styles.modalSubtitle}>
                Are you sure you want to log out from this account?
              </Text>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsLogoutVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsLogoutVisible(false);
                    performLogout();
                  }}
                  style={styles.logoutCta}
                >
                  <Text style={styles.logoutCtaText}>Log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={isProfileModalVisible}
        animationType="fade"
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalOuter}>
            <View style={styles.modalInner}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconExclaim}>?</Text>
              </View>
              <Text style={styles.modalTitle}>Open profile</Text>
              <Text style={styles.modalSubtitle}>
                Choose which profile view you'd like to open.
              </Text>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsProfileModalVisible(false);
                    navigation.navigate('PetProfile');
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Pet Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsProfileModalVisible(false);
                    navigation.navigate('Profile');
                  }}
                  style={styles.logoutCta}
                >
                  <Text style={styles.logoutCtaText}>Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  premiumBannerContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  premiumBanner: {
    borderRadius: moderateScale(12),
    padding: verticalScale(15),
    paddingLeft: scale(20),
    paddingRight: scale(20),
  },
  premiumTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.Bold,
    color:COLORS.white,
    marginBottom: verticalScale(5),
  },
  premiumSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color:COLORS.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(10),
    marginHorizontal: scale(20),
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    backgroundColor: COLORS.white,
  },
  settingsItemText: {
    flex: 1,
    fontSize: moderateScale(15),
    fontFamily: Fonts.Regular,
    color: COLORS.black,
    marginLeft: scale(15),
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    bottom:scale(20)
  },
  logoutText: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.Bold,
    color: COLORS.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  modalOuter: {
    backgroundColor: COLORS.primary2,
    borderRadius: moderateScale(16),
    padding: scale(8),
    width: '100%',
  },
  modalInner: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
  },
  iconCircle: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    borderWidth: 2,
    borderColor: COLORS.primary2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  iconExclaim: {
    fontSize: moderateScale(28),
    color: COLORS.primary2,
    fontFamily: Fonts.Bold,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(8),
  },
  modalSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.textGrey,
    textAlign: 'center',
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(18),
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EDEDED',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginRight: scale(12),
  },
  cancelText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Bold,
    color: COLORS.textGrey,
  },
  logoutCta: {
    flex: 1,
    backgroundColor: COLORS.primary2,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  logoutCtaText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Bold,
    color: COLORS.white,
  },
});

export default Settings;  