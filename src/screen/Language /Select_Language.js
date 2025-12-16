import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
// Import AsyncStorage - install with: npm install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import ChooseModal from '../../components/ChooseModal/ChooseModal';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { mostUsedLanguages, otherLanguages } from '../../utils/DataBase';
import { Fonts } from '../../theme/Fonts';

const Select_Language = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [languageType, setLanguageType] = useState('App Language');
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLanguageTypeChange = type => {
    setLanguageType(type);
  };

  const handleLanguageSelect = languageName => {
    setSelectedLanguage(languageName);
    setIsModalVisible(true);
  };

  const handleModalContinue = async selectedLanguages => {
    try {
      // Save language preference
      await AsyncStorage.setItem('userLanguage', selectedLanguage);
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingComplete', 'true');
      setIsModalVisible(false);
      navigation.navigate('CreateProfile');
    } catch (error) {
      setIsModalVisible(false);
      navigation.navigate('CreateProfile');
    }
  };

  const handleModalLater = () => {
    setIsModalVisible(false);
  };

  const renderLanguageItem = language => {
    const isSelected = selectedLanguage === language.name;

    return (
      <TouchableOpacity
        key={language.id}
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(language.name)}
        activeOpacity={0.7}
      >
        <View style={styles.flagContainer}>
          <Text style={styles.flag}>{language.flag}</Text>
        </View>
        <Text
          style={[
            styles.languageName,
            isSelected && styles.selectedLanguageName,
          ]}
        >
          {language.name}
        </Text>
        <View style={styles.radioContainer}>
          <View
            style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
          >
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container
      backgroundColor={COLORS.white}
      statusBarBackgroundColor={COLORS.white}
    >
      <CustomHeader title="Select Language" />

      <View style={styles.languageTypeContainer}>
        <TouchableOpacity
          style={[
            styles.languageTypeTab,
            languageType === 'App Language' && styles.activeTab,
          ]}
          onPress={() => handleLanguageTypeChange('App Language')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.languageTypeText,
              languageType === 'App Language' && styles.activeTabText,
            ]}
          >
            App Language
          </Text>
          {languageType === 'App Language' && (
            <View style={styles.tabIndicator} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageTypeTab,
            languageType === 'Roast Language' && styles.activeTab,
          ]}
          onPress={() => handleLanguageTypeChange('Roast Language')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.languageTypeText,
              languageType === 'Roast Language' && styles.activeTabText,
            ]}
          >
            Roast Language
          </Text>
          {languageType === 'Roast Language' && (
            <View style={styles.tabIndicator} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color={COLORS.grey}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Select language here"
          placeholderTextColor={COLORS.grey}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Used</Text>
          {mostUsedLanguages.map(language => renderLanguageItem(language))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Languages</Text>
          {otherLanguages.map(language => renderLanguageItem(language))}
        </View>
      </ScrollView>

      <ChooseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onContinue={handleModalContinue}
        onLater={handleModalLater}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  languageTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(16),
    borderBottomColor: '#E0E0E0',
    marginTop: scale(25),
  },
  languageTypeTab: {
    flex: 1,
    paddingBottom: verticalScale(12),
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active state styling
  },
  languageTypeText: {
    fontSize: moderateScale(13),
    color: COLORS.grey,
    fontFamily: Fonts.Medium,
  },
  activeTabText: {
    color: COLORS.black,
    fontFamily: Fonts.Medium,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(30),
    paddingHorizontal: scale(16),
    height: verticalScale(40),
    marginHorizontal: scale(20),
    marginBottom: verticalScale(16),
    borderColor: COLORS.grey,
    borderWidth: 0.5,
  },
  searchIcon: {
    marginRight: scale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: COLORS.black,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(40),
  },
  section: {
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    marginBottom: verticalScale(5),
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
    backgroundColor: COLORS.white,
  },
  selectedLanguageItem: {
    backgroundColor: COLORS.primary2,
  },
  flagContainer: {
    width: scale(32),
    height: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  flag: {
    fontSize: moderateScale(24),
  },
  languageName: {
    flex: 1,
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: Fonts.Regular,
  },
  selectedLanguageName: {
    color: COLORS.white,
    fontFamily: Fonts.Regular,
  },
  radioContainer: {
    marginLeft: scale(8),
  },
  radioOuter: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: COLORS.grey,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  radioOuterSelected: {
    borderColor: COLORS.white,
  },
  radioInner: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: COLORS.primary2,
  },
});

export default Select_Language;