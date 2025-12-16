import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { Container } from '../../components/Container/Container';
import { COLORS } from "../../theme/Colors";
import { Fonts } from "../../theme/Fonts";
import CustomHeader from "../../components/Header/CustomHeader";
import Icon from 'react-native-vector-icons/Ionicons';
import { Icons, imgPath } from "../../assets";
import { verticalScale,scale,moderateScale } from "../../utils/Scalling";
import StoryItem from "../../components/Story/StoryItem";

const Community = ({ navigation })=> {
    const friends = useMemo(() => ([
        { id: '1', name: 'Bruce', avatar: Icons.Avatar },
        { id: '2', name: 'Selena', avatar: Icons.Cat },
        { id: '3', name: 'jennifer', avatar: Icons.Monkey },
        { id: '4', name: 'Jack', avatar: Icons.Face },
        { id: '5', name: 'Mia', avatar: Icons.Cat },
        { id: '6', name: 'Leo', avatar: Icons.Avatar },
    ]), []);

    const posts = useMemo(() => ([
        {
            id: 'p1',
            image: imgPath.Dogs,
            quote: '“Oh cute–did you grow that fur for clout?”',
            tag: 'Sassy',
            author: 'Anika',
            initials: 'AT',
            likes: '1.2k',
            comments: '220',
            shares: '10',
            tint: '#EAF2FF', 
        },
        {
            id: 'p2',
            image: imgPath.Dogs,
            quote: '“Oh cute–did you grow that fur for clout?”',
            tag: 'Sassy',
            author: 'Anika',
            initials: 'AT',
            likes: '1.2k',
            comments: '220',
            shares: '10',
            tint: '#FFF4C6', 
        },
        {
            id: 'p3',
            image: imgPath.Dogs,
            quote: '“Oh cute–did you grow that fur for clout?”',
            tag: 'Sassy',
            author: 'Anika',
            initials: 'AT',
            likes: '1.2k',
            comments: '220',
            shares: '10',
            tint: '#EAF2FF',
        },
        {
            id: 'p4',
            image: imgPath.Dogs,
            quote: '“Oh cute–did you grow that fur for clout?”',
            tag: 'Sassy',
            author: 'Anika',
            initials: 'AT',
            likes: '1.2k',
            comments: '220',
            shares: '10',
            tint: '#FFF4C6',
        },
    ]), []);

    const renderPost = ({ item }) => {
        return (
            <View style={[styles.card, { backgroundColor: item.tint }]}> 
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                <Text style={styles.cardQuote}>{item.quote}</Text>

                <View style={styles.chip}><Text style={styles.chipText}>{item.tag}</Text></View>

                <View style={styles.authorRow}>
                    <View style={styles.authorBadge}><Text style={styles.authorBadgeText}>{item.initials}</Text></View>
                    <Text style={styles.authorName}>{item.author} · 2h</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}><Icon name="heart-outline" size={20} color={COLORS.darkGrey} /><Text style={styles.statText}>{item.likes}</Text></View>
                    <View style={styles.stat}><Icon name="chatbubble-ellipses-outline" size={20} color={COLORS.darkGrey} /><Text style={styles.statText}>{item.comments}</Text></View>
                    <View style={styles.stat}><Icon name="paper-plane-outline" size={20} color={COLORS.darkGrey} /><Text style={styles.statText}>{item.shares}</Text></View>
                </View>
            </View>
        );
    };

    return(
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
            <CustomHeader title="Community" showBackButton={false}/>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Friends</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
                    {friends.map((f, idx)=> (
                        <TouchableOpacity key={f.id} activeOpacity={0.8} onPress={()=> navigation.navigate('ShowStory', { stories: friends, startIndex: idx })}>
                            <StoryItem name={f.name} avatar={f.avatar} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(it)=>it.id}
                    numColumns={2}
                    columnWrapperStyle={styles.column}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: verticalScale(20) }}
                />
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    content:{
        paddingHorizontal: scale(12),
        paddingTop: verticalScale(10),
    },
    sectionTitle:{
        fontFamily: Fonts.Medium,
        fontSize: moderateScale(16),
        color: COLORS.black,
        marginBottom: verticalScale(10),
        marginLeft: scale(6),
    },
    storiesRow:{
        paddingRight: scale(8),
        marginBottom: verticalScale(16),
    },
    column:{
        justifyContent: 'space-between',
        marginBottom: verticalScale(12),
    },
    card:{
        width: '48%',
        borderRadius: scale(12),
        padding: scale(10),
    },
    cardImage:{
        width: '100%',
        height: verticalScale(140),
        borderRadius: scale(8),
        marginBottom: verticalScale(10),
    },
    cardQuote:{
        fontFamily: Fonts.SeniBold,
        fontSize: moderateScale(14),
        color: COLORS.darkGrey,
        lineHeight: verticalScale(20),
        marginBottom: verticalScale(8),
    },
    chip:{
        alignSelf: 'flex-start',
        backgroundColor: COLORS.white,
        paddingVertical: verticalScale(6),
        paddingHorizontal: scale(12),
        borderRadius: scale(20),
        marginBottom: verticalScale(10),
    },
    chipText:{
        fontFamily: Fonts.Medium,
        fontSize: moderateScale(12),
        color: COLORS.darkGrey,
    },
    authorRow:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    authorBadge:{
        width: scale(34),
        height: scale(34),
        borderRadius: scale(17),
        backgroundColor: COLORS.darkGrey,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(8),
    },
    authorBadgeText:{
        color: COLORS.white,
        fontFamily: Fonts.Bold,
        fontSize: moderateScale(12),
    },
    authorName:{
        fontFamily: Fonts.Medium,
        fontSize: moderateScale(13),
        color: COLORS.darkGrey,
    },
    statsRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stat:{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    statText:{
        fontFamily: Fonts.Medium,
        fontSize: moderateScale(12),
        color: COLORS.darkGrey,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
});

export default Community;