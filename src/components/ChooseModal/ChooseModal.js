import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import CustomCheckbox from '../checkbox/CustomCheckbox';
import Button from '../buttons/Button';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { regionalLanguages } from '../../utils/DataBase';
import { Fonts } from '../../theme/Fonts';

const ChooseModal = ({ visible, onClose, onContinue, onLater }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const toggleLanguage = (languageId) => {
    setSelectedLanguage(languageId);
  };

  const handleContinue = () => {
    if (onContinue && selectedLanguage) {
      onContinue([selectedLanguage]); 
    }
    onClose();
  };

  const handleLater = () => {
    if (onLater) {
      onLater();
    }
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setSelectedLanguage(null);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Regional Language</Text>

              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {regionalLanguages.map((language) => (
                  <CustomCheckbox
                    key={language.id}
                    label={language.name}
                    checked={selectedLanguage === language.id}
                    onPress={() => toggleLanguage(language.id)}
                  />
                ))}
              </ScrollView>

              <View style={styles.buttonContainer}>
                <Button
                  onPress={handleContinue}
                  disabled={!selectedLanguage}
                  title="Continue"
                  variant="primary"
                  height={verticalScale(45)}
                  borderRadius={moderateScale(8)}
                  fontSize={moderateScale(16)}
                />

                <Button
                  onPress={handleLater}
                  title="Later"
                  variant="secondary"
                  height={verticalScale(45)}
                  borderRadius={moderateScale(8)}
                  fontSize={moderateScale(16)}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(20),
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: moderateScale(24),
    fontFamily:Fonts.Bold,
    color: COLORS.black,
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: verticalScale(300),
  },
  buttonContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    gap: verticalScale(12),
  },
});

export default ChooseModal;