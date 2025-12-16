


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { moderateScale, verticalScale, scale } from '../../utils/Scalling';

const SEGMENTS = ['Chats', 'Tips', 'Blogs'];

const webAvatars = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
  'https://images.unsplash.com/photo-1546182990-dffeafbe841d',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16',
  'https://images.unsplash.com/photo-1484249170766-998fa6efe3c0',
];

const chatListData = [
  {
    id: '1',
    name: 'Dr. Meera (Vet)',
    lastMessage: 'Hydration is key! How is Bruno doing today?',
    time: '2m',
    unread: 2,
    avatar: webAvatars[0],
  },
  {
    id: '2',
    name: 'Dog Lovers Club',
    lastMessage: 'Weekend meetup at the park! Who is in?',
    time: '10m',
    unread: 5,
    avatar: webAvatars[1],
  },
  {
    id: '3',
    name: 'Riya',
    lastMessage: 'Try salmon treats, my cat loves them 😺',
    time: '1h',
    unread: 0,
    avatar: webAvatars[2],
  },
  {
    id: '4',
    name: 'Aman',
    lastMessage: 'Shared a video: Puppy training basics',
    time: '2h',
    unread: 1,
    avatar: webAvatars[3],
  },
  {
    id: '5',
    name: 'PetRoast Support',
    lastMessage: 'Your order has been shipped 🚚',
    time: 'Yesterday',
    unread: 0,
    avatar: webAvatars[4],
  },
];

const tipsData = [
  {
    id: 't1',
    title: '5 Signs Your Pet Needs a Vet Visit',
    subtitle: 'Know when to act fast and keep them safe.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
  },
  {
    id: 't2',
    title: 'Healthy Homemade Treats',
    subtitle: 'Simple recipes your pet will adore.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  },
  {
    id: 't3',
    title: 'Daily Exercise Checklist',
    subtitle: 'Keep your buddy active and happy.',
    image: 'https://images.unsplash.com/photo-1558944351-c6ae9bd3f051',
  },
];

const blogsData = [
  {
    id: 'b1',
    title: 'Understanding Pet Anxiety',
    subtitle: 'Triggers, symptoms, and how to help.',
    image: 'https://images.unsplash.com/photo-1551058846-3a04e8b5efc5',
  },
  {
    id: 'b2',
    title: 'Best Breeds for Apartments',
    subtitle: 'Space-friendly companions you will love.',
    image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc',
  },
  {
    id: 'b3',
    title: 'Grooming 101',
    subtitle: 'Basics for shiny coats and happy pets.',
    image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8',
  },
];


const SegmentControl = ({ value, onChange }) => {
  return (
    <View style={styles.segmentContainer}>
      {SEGMENTS.map((s) => {
        const active = value === s;
        return (
          <TouchableOpacity
            key={s}
            activeOpacity={0.8}
            onPress={() => onChange(s)}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
          >
            <Text style={[styles.segmentLabel, { color: active ? COLORS.white : COLORS.darkGrey }]}>
              {s}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ChatRow = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.chatRow}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatRowTextWrap}>
        <View style={styles.chatRowHeader}>
          <Text numberOfLines={1} style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatRowFooter}>
          <Text numberOfLines={1} style={styles.chatLastMsg}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Card = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
};

    const Chats = () => {
  const navigation = useNavigation();
  const [segment, setSegment] = useState('Chats');

  const renderList = () => {
    if (segment === 'Chats') {
      return (
        <FlatList
          data={chatListData}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <ChatRow item={item} onPress={() => navigation.navigate('ChatUser', { chat: item })} />
          )}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    if (segment === 'Tips') {
      return (
        <FlatList
          data={tipsData}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <Card item={item} />}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.spacer16} />}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    return (
      <FlatList
        data={blogsData}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <Card item={item} />}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.spacer16} />}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
      <CustomHeader title={'Chat'} showBackButton={false} />
      <View style={styles.headerInfoWrap}>
        <Text style={styles.headerTitle}>Stay Connected</Text>
        <Text style={styles.headerSubtitle}>DM friends, get pet care tips and read blogs</Text>
      </View>
      <SegmentControl value={segment} onChange={setSegment} />
      {renderList()}
    </Container>
  );
};

const styles = StyleSheet.create({
  headerInfoWrap: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(6),
  },
  headerTitle: {
    fontFamily: Fonts.SeniBold,
    fontSize: moderateScale(18),
    color: COLORS.primary2,
  },
  headerSubtitle: {
    marginTop: verticalScale(4),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.textGrey,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGrey,
    marginHorizontal: scale(16),
    padding: scale(4),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(10),
  },
  segmentItem: {
    flex: 1,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: COLORS.primory1,
  },
  segmentLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(13),
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(120),
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGrey,
  },
  spacer16: {
    height: verticalScale(16),
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    gap: scale(12),
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: COLORS.lightGrey,
  },
  chatRowTextWrap: {
    flex: 1,
  },
  chatRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatName: {
    flex: 1,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.black,
    marginRight: scale(10),
  },
  chatTime: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(11),
    color: COLORS.textGrey,
  },
  chatRowFooter: {
    marginTop: verticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatLastMsg: {
    flex: 1,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.darkGrey,
    marginRight: scale(10),
  },
  unreadBadge: {
    minWidth: moderateScale(20),
    paddingHorizontal: scale(6),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: COLORS.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: COLORS.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(11),
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  cardImage: {
    width: '100%',
    height: verticalScale(140),
    backgroundColor: COLORS.lightGrey,
  },
  cardBody: {
    padding: scale(12),
  },
  cardTitle: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  cardSubtitle: {
    marginTop: verticalScale(4),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.textGrey,
  },
  threadWrap: {
    flex: 1,
  },
  threadList: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(90),
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: verticalScale(10),
    gap: scale(8),
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  threadAvatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.lightGrey,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
  },
  bubbleMe: {
    backgroundColor: COLORS.primory1,
    borderTopRightRadius: moderateScale(2),
  },
  bubbleOther: {
    backgroundColor: COLORS.lightBlue,
    borderTopLeftRadius: moderateScale(2),
  },
  bubbleTextMe: {
    color: COLORS.white,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
  },
  bubbleTextOther: {
    color: COLORS.primary2,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
  },
  bubbleTime: {
    marginTop: verticalScale(4),
    alignSelf: 'flex-end',
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(10),
    color: COLORS.textGrey,
  },
  composerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    height: verticalScale(40),
    backgroundColor: COLORS.inputBackground,
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(14),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
    color: COLORS.black,
    marginRight: scale(10),
  },
  sendBtn: {
    height: verticalScale(40),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: COLORS.white,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(13),
  },
});

export default Chats;