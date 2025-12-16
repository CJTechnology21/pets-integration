import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../theme/Colors';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from "../../theme/Fonts";

const Privacy = () => {
    const navigation = useNavigation();
    const [isAgreed, setIsAgreed] = useState(true);

    const handleContinue = () => {
     navigation.navigate("CreateProfile")
    };

    return (
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
            <View style={styles.container}>
                <CustomHeader title="Privacy Policy" />
                
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        <Text style={styles.paragraph}>
                            We collect personal information you provide when signing up, placing orders, or contacting us. This may include your name, address, email, and payment details.
                        </Text>
                        
                        <Text style={styles.paragraph}>
                            Your data is used to process orders, provide customer service, personalize your shopping experience, and send updates about your account or promotions (if subscribed).
                        </Text>
                        
                        <Text style={styles.paragraph}>
                            Your data is used to process orders, provide customer service, personalize your shopping experience, and send updates about your account or promotions (if subscribed).
                        </Text>
                        
                        <Text style={styles.paragraph}>
                            Your data is used to process orders, provide customer service, personalize your shopping experience, and send updates about your account or promotions (if subscribed).
                        </Text>
                        
                        <Text style={styles.paragraph}>
                            Your data is used to process orders, provide customer service, personalize your shopping experience, and send updates about your account or promotions (if subscribed).
                        </Text>
                        
                        <Text style={styles.paragraph}>
                            Your data is used to process orders, provide customer service, personalize your shopping experience, and send updates about your account or promotions (if subscribed).
                        </Text>
                    </View>
                    
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setIsAgreed(!isAgreed)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    isAgreed && styles.checkboxChecked
                                ]}
                            >
                                {isAgreed && (
                                    <Icon name="checkmark" size={16} color={COLORS.white} />
                                )}
                            </View>
                            <Text style={styles.checkboxLabel}>
                                I agree to the Privacy Policy and Terms & Conditions
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                
                <Button
                    onPress={handleContinue}
                    disabled={!isAgreed}
                    title="Continue"
                    variant="primary"
                    height={verticalScale(50)}
                    borderRadius={moderateScale(12)}
                    fontSize={moderateScale(18)}
                    style={{ marginHorizontal: scale(20), marginBottom: verticalScale(20) }}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    contentContainer: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
    },
    paragraph: {
        fontSize: moderateScale(15),
        color: COLORS.black,
        lineHeight: moderateScale(22),
        marginBottom: verticalScale(16),
        textAlign: 'left',
        fontFamily:Fonts.Regular
    },
    checkboxContainer: {
        paddingHorizontal: scale(20),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
    },
    checkbox: {
        width: scale(24),
        height: scale(24),
        borderWidth: 2,
        borderColor: COLORS.grey,
        borderRadius: moderateScale(4),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        marginRight: scale(12),
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary2,
        borderColor: COLORS.primary2,
    },
    checkboxLabel: {
        fontSize: moderateScale(15),
        color: COLORS.black,
        fontFamily:Fonts.Regular,
        flex: 1,
    },
});

export default Privacy;