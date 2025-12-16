import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, verticalScale, moderateScale } from "../../utils/Scalling";
import OTPInput from "../../components/otpInput/OTPInput";
import Button from "../../components/buttons/Button";
import { useNavigation } from "@react-navigation/native";

const COUNTDOWN_SECONDS = 150; 

const ForgotVerify = () => {
    const navigation = useNavigation('')
    const route = useRoute();
    const method = route?.params?.method === 'phone' ? 'phone' : 'email';

    const title = method === 'phone' ? 'Verify Phone' : 'Verify Email';
    const hint = method === 'phone'
        ? 'We have sent code to your phone number'
        : 'We have sent code to your email';

    const masked = useMemo(() => {
        return method === 'phone' ? '+91-98XX-XX12' : 'Joseph---Mail.Com';
    }, [method]);

    const [otp, setOtp] = useState('');
    const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSeconds((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => timerRef.current && clearInterval(timerRef.current);
    }, []);

    const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

    const canContinue = otp.length === 4;
    const canResend = seconds === 0;

    const handleResend = () => {
        if (!canResend) return;
        setSeconds(COUNTDOWN_SECONDS);
    };

    return(
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
            <CustomHeader title={title}/>

            <View style={styles.wrapper}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSubtitle}>{hint}</Text>
                    <Text style={styles.masked}>{masked}</Text>

                    <View style={{ height: verticalScale(16) }} />
                    <OTPInput length={4} autoFocus onChange={setOtp} />

                    <Text style={styles.timerText}>{seconds > 0 ? `(${formattedTime})` : ''}</Text>

                    <Button
                        onPress={()=>navigation.navigate('ResetPass')}
                        disabled={!canContinue}
                        title={method === 'phone' ? 'Continue' : 'Verify'}
                        variant="primary"
                        height={verticalScale(50)}
                        borderRadius={scale(12)}
                        fontSize={moderateScale(16)}
                        style={{ marginTop: verticalScale(16) }}
                    />

                    <Button
                        onPress={handleResend}
                        disabled={!canResend}
                        title={canResend ? 'Send Again' : 'Later'}
                        variant="secondary"
                        height={verticalScale(50)}
                        borderRadius={scale(12)}
                        fontSize={moderateScale(16)}
                        style={{ marginTop: verticalScale(12) }}
                    />
                </View>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(16),
        backgroundColor: COLORS.white
    },
    card:{
        marginTop: verticalScale(8),
        backgroundColor: COLORS.white,
        borderRadius: scale(16),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(18),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle:{
        fontFamily: Fonts.SeniBold,
        fontSize: moderateScale(18),
        color: COLORS.black,
        textAlign:'center'
    },
    cardSubtitle:{
        marginTop: verticalScale(4),
        fontFamily: Fonts.Regular,
        fontSize: moderateScale(12),
        color: COLORS.textGrey,
        textAlign:'center'
    },
    masked:{
        marginTop: verticalScale(10),
        textAlign:'center',
        fontFamily: Fonts.SeniBold,
        fontSize: moderateScale(14),
        color: COLORS.black
    },
    timerText:{
        marginTop: verticalScale(8),
        textAlign:'left',
        marginLeft: scale(6),
        fontFamily: Fonts.Regular,
        fontSize: moderateScale(11),
        color: COLORS.textGrey
    },
});

export default ForgotVerify;