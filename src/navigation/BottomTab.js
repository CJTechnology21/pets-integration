import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../theme/Colors';
import {Fonts} from '../theme/Fonts';
import {moderateScale, verticalScale} from '../utils/Scalling';
import {useTabBar} from '../context/TabBarContext';
import PetProfile from '../screen/Pet_Profile/PetProfile';

import Feed from '../screen/Home/Home';
import Discover from '../screen/Community/Community';
import Camera from '../screen/Camera/Camera';
import Profile from '../screen/Profile/Profile';
import Chat from '../screen/Chat/Chat';
import ChatUser from '../screen/Chat/ChatUser';
import Settings from'../screen/Settings/Settings'

const Tab = createBottomTabNavigator();

const CustomTabBar = ({state, descriptors, navigation}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { isImageCaptured, isFilterScrolling, showMenuOptions } = useTabBar();
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    state.routes.forEach((route, index) => {
      const isFocused = state.index === index;
      Animated.spring(animatedValues[index], {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });
  }, [state.index]);

  if (isKeyboardVisible || isImageCaptured || isFilterScrolling || showMenuOptions) {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const isCamera = route.name === 'Camera';

          const iconConfig = {
            Feed: {name: 'home', outline: 'home-outline'},
            Discover: {name: 'compass', outline: 'compass-outline'},
            Camera: {name: 'camera', outline: 'camera-outline'},
            Chat: {name: 'chatbubbles', outline: 'chatbubbles-outline'},
            // Profile: {name: 'person', outline: 'person-outline'},
            Settings: {name: 'settings', outline: 'settings-outline'},
          };

          const icon = iconConfig[route.name] || {name: 'home', outline: 'home-outline'};

          const scale = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          });

          const opacity = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (isCamera) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.cameraButtonContainer}>
                <LinearGradient
                  colors={
                    isFocused
                      ? [COLORS.primory1, '#FF9500']
                      : [COLORS.white, COLORS.white]
                  }
                  style={styles.cameraButton}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}>
                  <Animated.View
                    style={[
                      styles.cameraIconContainer,
                      {
                        transform: [{scale}],
                      },
                    ]}>
                    <Icon
                      name={isFocused ? icon.name : icon.outline}
                      size={moderateScale(28)}
                      color={isFocused ? COLORS.white : COLORS.grey}
                    />
                  </Animated.View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}>
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{scale}],
                    opacity,
                  },
                ]}>
                <Icon
                  name={isFocused ? icon.name : icon.outline}
                  size={moderateScale(24)}
                  color={isFocused ? COLORS.primory1 : COLORS.grey}
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? COLORS.primory1 : COLORS.grey,
                    opacity,
                  },
                ]}>
                {label}
              </Animated.Text>
              {isFocused && (
                <Animated.View
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: animatedValues[index],
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const BottomTab = () => {
  return (
    <Tab.Navigator
    
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true 
      }}>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="Camera" component={Camera} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? verticalScale(15) : verticalScale(8),
    paddingTop: verticalScale(6),
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(30),
    marginHorizontal: moderateScale(20),
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: verticalScale(5),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(2),
  },
  tabLabel: {
    fontSize: moderateScale(10),
    fontFamily: Fonts.Medium,
    marginTop: verticalScale(1),
  },
  activeIndicator: {
    position: 'absolute',
    bottom: verticalScale(2),
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: COLORS.primory1,
  },
  cameraButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(-30),
    marginHorizontal: moderateScale(8),
  },
  cameraButton: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primory1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  cameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTab;

