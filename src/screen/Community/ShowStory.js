import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Image, StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback, StatusBar, Text } from "react-native";
import { Container } from '../../components/Container/Container';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, verticalScale, moderateScale } from "../../utils/Scalling";

const { width, height } = Dimensions.get('window');
const DURATION_MS = 5000;

const ShowStory = ({ navigation, route })=> {
    const stories = route?.params?.stories || (route?.params?.story ? [route.params.story] : []);
    const startIndex = route?.params?.startIndex ?? 0;
    const [currentIndex, setCurrentIndex] = useState(Math.min(Math.max(0, startIndex), Math.max(0, stories.length - 1)));
    const progress = useRef(new Animated.Value(0)).current;

    const currentStory = stories[currentIndex] || {};
    const avatarSource = useMemo(()=> currentStory?.avatar, [currentStory]);
    const name = currentStory?.name || '';

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBarStyle('dark-content');
        };
    }, []);

    useEffect(() => {
        progress.setValue(0);
        const anim = Animated.timing(progress, {
            toValue: 1,
            duration: DURATION_MS,
            useNativeDriver: false,
            easing: Easing.linear,
        });
        anim.start(({ finished }) => {
            if (finished) {
                if (currentIndex < stories.length - 1) {
                    setCurrentIndex((idx)=> idx + 1);
                } else {
                    navigation.goBack();
                }
            }
        });
        return () => {
            progress.stopAnimation();
        };
    }, [currentIndex, stories.length, navigation, progress]);

    const fullBarWidth = width - scale(20);
    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, fullBarWidth],
    });

    const onTap = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx)=> idx + 1);
        } else {
            navigation.goBack();
        }
    };

    return(
        <Container backgroundColor={COLORS.black} statusBarBackgroundColor={COLORS.black}>
            <View style={styles.root}>
                <View style={styles.progressBarBg}>
                    <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
                </View>

                <View style={styles.headerRow}>
                    {avatarSource ? (
                        <Image source={avatarSource} style={styles.headerAvatar} />
                    ) : null}
                    <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
                </View>

                <TouchableWithoutFeedback onPress={onTap}>
                    <View style={styles.storyArea}>
                        {avatarSource ? (
                            <Image source={avatarSource} style={styles.storyImage} resizeMode="contain" />
                        ) : null}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    root:{
        flex: 1,
        backgroundColor: COLORS.black,
    },
    progressBarBg:{
        position: 'absolute',
        top: verticalScale(10),
        left: scale(10),
        right: scale(10),
        height: verticalScale(4),
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderRadius: scale(2),
        overflow: 'hidden',
    },
    progressBarFill:{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: COLORS.white,
    },
    headerRow:{
        marginTop: verticalScale(18),
        paddingHorizontal: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    headerAvatar:{
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)'
    },
    headerName:{
        marginLeft: scale(10),
        color: COLORS.white,
        fontFamily: Fonts.Medium,
        fontSize: moderateScale(14),
        maxWidth: width - scale(100),
        textTransform: 'capitalize',
    },
    storyArea:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storyImage:{
        width: width * 0.9,
        height: height * 0.75,
        opacity: 0.9,
    },
});

export default ShowStory;