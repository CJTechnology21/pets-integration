import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import Button from '../../components/buttons/Button';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';


const LegalPrivacy = () => {
    const handleCall = () => Linking.openURL('tel:706880122');
    const handleWhatsApp = async () => {
        const url = 'whatsapp://send?phone=7096880122';
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) Linking.openURL(url);
    };
    const handleWebsite = () => Linking.openURL('https://roastpet.co');
    const handleEmail = () => Linking.openURL('mailto:hello@petroast.co');

    const Card = ({ icon, title, subtitle, onPress }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.iconWrap}>
                <Icon name={icon} size={moderateScale(20)} color={COLORS.primary2} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
    );

    return(
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
            <CustomHeader title={'Legal & Privacy'} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Contact Support</Text>
                    <Text style={styles.sectionDesc}>Your top up transaction successfully added, let’s go !</Text>
                </View>

                <View style={styles.problemBox}>
                    <Text style={styles.problemTitle}>Report a Problem</Text>
                    <Text style={styles.problemDesc}>Do you have any problem or issues on your experience & adventure? let us know below</Text>
                </View>

                <View style={styles.row}>
                    <Card 
                        icon="call-outline" 
                        title="Phone Number" 
                        subtitle="7096880122" 
                        onPress={handleCall}
                    />
                    <Card 
                        icon="logo-whatsapp" 
                        title="Whatsapp Number" 
                        subtitle={"7096880122"}
                        onPress={handleWhatsApp}
                    />
                </View>

                <View style={styles.row}>
                    <Card 
                        icon="globe-outline" 
                        title="App" 
                        subtitle="roastpet.co" 
                        onPress={handleWebsite}
                    />
                    <Card 
                        icon="mail-outline" 
                        title="Email" 
                        subtitle="hello@petroast.co" 
                        onPress={handleEmail}
                    />
                </View>

                <View style={styles.buttonWrap}>
                    <Button title="Next" onPress={() => {}} />
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        paddingBottom: verticalScale(24),
    },
    sectionHeader: {
        marginHorizontal: scale(20),
        marginTop: verticalScale(12),
    },
    sectionTitle: {
        fontSize: moderateScale(22),
        fontFamily: Fonts.Bold,
        color: COLORS.black,
        marginBottom: verticalScale(6),
    },
    sectionDesc: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.Regular,
        color: COLORS.textGrey,
        lineHeight: verticalScale(20),
    },
    problemBox: {
        marginHorizontal: scale(20),
        marginTop: verticalScale(20),
        padding: verticalScale(16),
        borderRadius: moderateScale(16),
        backgroundColor: COLORS.lightGrey,
        borderWidth: 1,
        borderColor: '#EEF2F6',
    },
    problemTitle: {
        fontSize: moderateScale(18),
        fontFamily: Fonts.SeniBold,
        color: COLORS.black,
        marginBottom: verticalScale(6),
    },
    problemDesc: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.Regular,
        color: COLORS.textGrey,
        lineHeight: verticalScale(20),
    },
    row: {
        flexDirection: 'row',
        gap: scale(12),
        marginHorizontal: scale(20),
        marginTop: verticalScale(16),
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: moderateScale(16),
        padding: verticalScale(14),
        borderWidth: 1,
        borderColor: '#EEF2F6',
    },
    iconWrap: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: COLORS.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(12),
    },
    cardTitle: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.Medium,
        color: COLORS.textGrey,
        marginBottom: verticalScale(6),
    },
    cardSubtitle: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.SeniBold,
        color: COLORS.black,
    },
    buttonWrap: {
        marginHorizontal: scale(20),
        marginTop: verticalScale(24),
    },
});

export default LegalPrivacy;