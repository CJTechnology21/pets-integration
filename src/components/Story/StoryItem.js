import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import { scale, verticalScale, moderateScale } from "../../utils/Scalling";

const DEFAULT_RING_COLORS = ["#D41FD3", "#FF4EB2"]; 

const StoryItem = ({ name, avatar, ringColors = DEFAULT_RING_COLORS }) => {
    return (
        <View style={styles.storyItem}>
            <View style={[styles.storyRingOuter, { backgroundColor: ringColors[0] }]}> 
                <View style={[styles.storyRingInner, { backgroundColor: ringColors[1] }]}> 
                    <Image source={avatar} style={styles.storyAvatar} />
                </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    storyItem:{
        width: scale(82),
        alignItems: 'center',
    },
    storyRingOuter:{
        width: scale(66),
        height: scale(66),
        borderRadius: scale(66/2),
        alignItems: 'center',
        justifyContent: 'center',
        padding: scale(3),
    },
    storyRingInner:{
        width: '100%',
        height: '100%',
        borderRadius: scale(60/2),
        padding: scale(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    storyAvatar:{
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(50),
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    storyName:{
        marginTop: verticalScale(6),
        fontSize: moderateScale(12),
        fontFamily: Fonts.Medium,
        color: COLORS.black,
        textTransform: 'capitalize',
    },
});

export default StoryItem;


