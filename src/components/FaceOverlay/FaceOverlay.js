import React, { useState, useMemo, useEffect, useRef } from "react";
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, StatusBar, ActivityIndicator, Animated, PanResponder, FlatList, Dimensions, TextInput, Modal, Keyboard, Platform,Pressable, Share, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from "react-native-vision-camera";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Video from "react-native-video";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Fonts } from "../../theme/Fonts";
import { moderateScale, scale, verticalScale } from "../../utils/Scalling";
import { COLORS } from "../../theme/Colors";
import { Icons } from "../../assets";
import { useTabBar } from "../../context/TabBarContext";
import FilterIcon from "../FilterIcon/FilterIcon";
import GalleryIcon from "../GalleryIcon/GalleryIcon";
import CameraFilterItem from "../CameraFilterItem/CameraFilterItem";
import RecordingIndicator from "../RecordingIndicator/RecordingIndicator";
import FilterThumbnail from "../FilterThumbnail/FilterThumbnail";
import ToolbarButton from "../ToolbarButton/ToolbarButton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FILTER_ITEM_INTERVAL = 95;

const defaultFilterCategories = [
  {
    id: 'normal',
    name: 'Normal',
    items: [
      { id: 'normal_clean', name: 'Clean', image: Icons.Ellipse1 },
      { id: 'normal_soft', name: 'Soft Glow', image: Icons.Ellipse2 },
      { id: 'normal_warm', name: 'Warm', image: Icons.Vector },
    ],
  },
  {
    id: 'glasses',
    name: 'Glasses',
    items: [
      { id: 'glasses_round', name: 'Round', image: Icons.Avatar },
      { id: 'glasses_aviator', name: 'Aviator', image: Icons.Face },
      { id: 'glasses_sunglass', name: 'Sunglass', image: Icons.smile },
    ],
  },
  {
    id: 'scarf',
    name: 'Scarf',
    items: [
      { id: 'scarf_1', name: 'Scarf 1', image: Icons.grid },
      { id: 'scarf_2', name: 'Scarf 2', image: Icons.Cat },
      { id: 'scarf_3', name: 'Scarf 3', image: Icons.Monkey },
    ],
  },
  {
    id: 'bows',
    name: 'Bows',
    items: [
      { id: 'bow_1', name: 'Bow 1', image: Icons.Cat },
      { id: 'bow_2', name: 'Bow 2', image: Icons.Monkey },
      { id: 'bow_3', name: 'Bow 3', image: Icons.grid },
    ],
  },
  {
    id: 'food',
    name: 'Food',
    items: [
      { id: 'food_1', name: 'Food 1', image: Icons.Avatar },
      { id: 'food_2', name: 'Food 2', image: Icons.Face },
      { id: 'food_3', name: 'Food 3', image: Icons.smile },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    items: [
      { id: 'vintage_1', name: 'Vintage 1', image: Icons.Ellipse1 },
      { id: 'vintage_2', name: 'Vintage 2', image: Icons.Ellipse2 },
      { id: 'vintage_3', name: 'Vintage 3', image: Icons.Vector },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    items: [
      { id: 'accessory_bow', name: 'Bow', image: Icons.Cat },
      { id: 'accessory_hat', name: 'Hat', image: Icons.Monkey },
      { id: 'accessory_scarf', name: 'Scarf', image: Icons.grid },
    ],
  },
];

const cameraFiltersData = [
  { id: '1', name: 'Normal', image: Icons.Avatar },
  { id: '2', name: 'Glasses', image: Icons.Face },
  { id: '3', name: 'Scarf', image: Icons.grid },
  { id: '4', name: 'Bows', image: Icons.Cat },
  { id: '5', name: 'Food', image: Icons.Vector },
  { id: '6', name: 'B&W', image: Icons.Ellipse1 },
  { id: '7', name: 'Vintage', image: Icons.Ellipse2 },
  { id: '8', name: 'Warm', image: Icons.smile },
];

const FaceOverlay = ({
  title = "Face Enrollment",
  imageSource,
  filters = [],
  onCapture = () => {},
  onPickFromGallery = () => {},
  onVideoRecorded = () => {},
  onImageStateChange = () => {},
}) => {
  const { setImageCaptured, setFilterScrolling, showMenuOptions, setShowMenuOptions } = useTabBar();
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [flashMode, setFlashMode] = useState('off');
  const filterCarouselRef = useRef(null);
  const filterScrollX = useRef(new Animated.Value(0)).current;
  const [selectedCameraFilterId, setSelectedCameraFilterId] = useState(cameraFiltersData[0]?.id || '1');
  const [centerCameraFilterId, setCenterCameraFilterId] = useState(cameraFiltersData[0]?.id || '1');
  const [selectedFilterItemId, setSelectedFilterItemId] = useState(null);
  const [textOverlays, setTextOverlays] = useState([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [selectedFontStyle, setSelectedFontStyle] = useState('regular'); 
  const [selectedTextColor, setSelectedTextColor] = useState(COLORS.white);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('rgba(0, 0, 0, 0.5)');
  const [suggestedWords, setSuggestedWords] = useState(['i', 'and', 'the']);
  const textIdCounter = useRef(0);
  
  const menuOptions = [
    { id: 'recents', label: 'Recents', icon: '⏱️' },
    { id: 'favourites', label: 'Favourites', icon: '🤍' },
    { id: 'foryou', label: 'For You', icon: '☆' },
    { id: 'zootropolis', label: 'Zootropolis 2', icon: '🐰' },
    { id: 'aesthetic', label: 'Aesthetic', icon: '🧑‍🎨' },
    { id: 'Games', label: 'Games', icon: '🎲' },
    { id: 'Movies', label: 'Movies', icon: '🎥' },
    { id: 'Music', label: 'Music', icon: '🎵' },
    { id: 'Books', label: 'Books', icon: '📚' },
    { id: 'TV Shows', label: 'TV Shows', icon: '📺' },
    { id: 'Anime', label: 'Anime', icon: '🎥' },
    { id: 'Manga', label: 'Manga', icon: '📚' },
    { id: 'Comics', label: 'Comics', icon: '🎥' },
  ];
  
  const camera = useRef(null);
  const backDevice = useCameraDevice('back');
  const frontDevice = useCameraDevice('front');
  const [cameraType, setCameraType] = useState('back'); 
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
  const recordingTimerRef = useRef(null);
  const panResponder = useRef(null);
  const longPressTimerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const currentDevice = cameraType === 'front' ? frontDevice : backDevice;

  // Toggle camera function
  const toggleCamera = () => {
    setCameraType(prev => prev === 'back' ? 'front' : 'back');
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!hasMicPermission) {
      requestMicPermission();
    }
  }, [hasPermission, requestPermission, hasMicPermission, requestMicPermission]);

  const normalizedFilters = useMemo(() => {
    if (!filters || filters.length === 0) {
      return [{ id: 0, name: "Original", image: null }];
    }
    return filters;
  }, [filters]);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => capturedImage !== null && selectedTextId === null,
      onMoveShouldSetPanResponder: () => capturedImage !== null && selectedTextId === null,
      onPanResponderRelease: (evt, gestureState) => {
        if (!capturedImage || selectedTextId !== null) return;
        const { dx } = gestureState;
        if (Math.abs(dx) > 50) {
          if (dx > 0) {
            setSelectedFilterIndex(prev => prev > 0 ? prev - 1 : normalizedFilters.length - 1);
          } else {
            setSelectedFilterIndex(prev => prev < normalizedFilters.length - 1 ? prev + 1 : 0);
          }
        }
      },
    });
  }, [capturedImage, normalizedFilters.length, selectedTextId]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const headerTitle = useMemo(() => {
    return title;
  }, [title]);

  const handleCapture = async () => {
    if (!camera.current || !currentDevice || isCapturing || isRecording) return;
    
    try {
      setIsCapturing(true);
      const photo = await camera.current.takePhoto({
        flash: flashMode,
      });
      const imageUri = `file://${photo.path}`;
      setCapturedImage(imageUri);
      setCapturedVideo(null);
      setSelectedFilterIndex(0); 
      onCapture(imageUri, photo);
      onImageStateChange(true);
      setImageCaptured(true);
    } catch (error) {
      console.error('Error capturing photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const startRecording = async () => {
    if (!camera.current || !currentDevice || isRecording || isCapturing) return;
    
    try {
      setIsRecording(true);
      setRecordingTime(0);
      await camera.current.startRecording({
        flash: flashMode,
        onRecordingFinished: (video) => {
          const videoUri = `file://${video.path}`;
          setCapturedVideo(videoUri);
          setCapturedImage(null);
          setIsRecording(false);
          setRecordingTime(0);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
          onVideoRecorded(videoUri, video);
          onImageStateChange(true);
          setImageCaptured(true);
        },
        onRecordingError: (error) => {
          console.error('Error recording video:', error);
          setIsRecording(false);
          setRecordingTime(0);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        },
      });

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { 
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!camera.current || !isRecording) return;
    
    try {
      await camera.current.stopRecording();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handlePressIn = () => {
    if (isRecording || isCapturing) {
      return;
    }

    isLongPressRef.current = false;
    
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      startRecording();
    }, 300);
  };

  const handlePressOut = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isRecording) {
      stopRecording();
    } 
    else if (!isLongPressRef.current && !isCapturing) {
      handleCapture();
    }
    
    isLongPressRef.current = false;
  };

  const toggleFlash = () => {
    setFlashMode(prev => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  };

  const handleOpenGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
        quality: 1,
      });
      if (result && !result.didCancel && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setCapturedImage(asset.uri);
        setSelectedFilterIndex(0); 
        onPickFromGallery(asset.uri, asset);
        onImageStateChange(true);
        setImageCaptured(true);
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
    }
  };


  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedVideo(null);
    setSelectedFilterIndex(0);
    setTextOverlays([]);
    setSelectedTextId(null);
    onImageStateChange(false);
    setImageCaptured(false);
  };

  const handleSaveImage = async () => {
    if (!capturedImage) return;
    
    try {
      const imageUri = capturedImage.startsWith('file://') 
        ? capturedImage.replace('file://', '') 
        : capturedImage;
      
      await CameraRoll.save(imageUri, { type: 'photo' });
      Alert.alert('Success', 'Image saved to gallery!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image to gallery');
    }
  };

  const handleShareImage = async () => {
    if (!capturedImage) return;
    
    try {
      const shareOptions = Platform.select({
        ios: {
          url: capturedImage,
        },
        android: {
          message: 'Check out this image!',
          url: capturedImage,
          title: 'Share Image',
        },
      });

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleAddText = () => {
    setShowTextInput(true);
    setTextInputValue('');
    setSelectedTextId(null);
    setSelectedFontStyle('regular');
    setSelectedTextColor(COLORS.white);
    setSelectedBackgroundColor('rgba(0, 0, 0, 0.5)');
  };

  const handleTextInputSubmit = () => {
    if (textInputValue.trim()) {
      const newText = {
        id: selectedTextId || `text_${textIdCounter.current++}`,
        text: textInputValue,
        x: SCREEN_WIDTH / 2 - 50,
        y: 300,
        fontSize: 24,
        color: selectedTextColor,
        backgroundColor: selectedBackgroundColor,
        fontStyle: selectedFontStyle,
        rotation: 0,
      };
      
      if (selectedTextId) {
        setTextOverlays(prev => prev.map(t => t.id === selectedTextId ? newText : t));
      } else {
        setTextOverlays(prev => [...prev, newText]);
      }
      
      setTextInputValue('');
      setShowTextInput(false);
      setSelectedTextId(null);
      setSelectedFontStyle('regular');
      setSelectedTextColor(COLORS.white);
      setSelectedBackgroundColor('rgba(0, 0, 0, 0.5)');
    }
  };

  const handleSuggestedWordPress = (word) => {
    setTextInputValue(prev => prev + (prev ? ' ' : '') + word);
  };

  const handleFontStylePress = (style) => {
    setSelectedFontStyle(style);
  };

  const handleColorPress = () => {
    const colors = [COLORS.white, '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    const currentIndex = colors.indexOf(selectedTextColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setSelectedTextColor(colors[nextIndex]);
  };

  const handleTextPress = (textId) => {
    setSelectedTextId(textId);
    const textItem = textOverlays.find(t => t.id === textId);
    if (textItem) {
      setTextInputValue(textItem.text);
      setSelectedFontStyle(textItem.fontStyle || 'regular');
      setSelectedTextColor(textItem.color || COLORS.white);
      setSelectedBackgroundColor(textItem.backgroundColor || 'rgba(0, 0, 0, 0.5)');
      setShowTextInput(true);
    }
  };

  const handleDeleteText = (textId) => {
    setTextOverlays(prev => prev.filter(t => t.id !== textId));
    setSelectedTextId(null);
  };

  const textPanRespondersRef = useRef({});

  const getTextPanResponder = (textId) => {
    if (!textPanRespondersRef.current[textId]) {
      textPanRespondersRef.current[textId] = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setSelectedTextId(textId);
        },
        onPanResponderMove: (evt, gestureState) => {
          setTextOverlays(prev => prev.map(text => {
            if (text.id === textId) {
              return {
                ...text,
                x: Math.max(0, Math.min(SCREEN_WIDTH - 100, text.x + gestureState.dx)),
                y: Math.max(0, Math.min(SCREEN_WIDTH * 1.5, text.y + gestureState.dy)),
              };
            }
            return text;
          }));
        },
        onPanResponderRelease: () => {
        },
      });
    }
    return textPanRespondersRef.current[textId];
  };

  useEffect(() => {
    const activeIds = new Set(textOverlays.map(t => t.id));
    Object.keys(textPanRespondersRef.current).forEach(id => {
      if (!activeIds.has(id)) {
        delete textPanRespondersRef.current[id];
      }
    });
  }, [textOverlays]);



  const handleFilterSelect = (idx) => {
    setSelectedFilterIndex(idx);
  };

  const cameraFilters = cameraFiltersData;

  const onCameraFilterScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: filterScrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        // Hide tab bar immediately when any scroll happens
        const offsetX = event.nativeEvent.contentOffset.x;
        if (offsetX !== undefined && offsetX !== 0) {
          setFilterScrolling(true);
          // Check if current filter is not Normal
          const currentIndex = Math.round(offsetX / FILTER_ITEM_INTERVAL);
          if (currentIndex >= 0 && currentIndex < cameraFilters.length) {
            const currentFilterId = cameraFilters[currentIndex].id;
            if (currentFilterId !== '1') {
              setShowMenuOptions(true);
            }
          }
        }
      }
    }
  );

  const onCameraFilterScrollBegin = () => {
    // Hide tab bar immediately when scroll begins
    setFilterScrolling(true);
  };

  const onCameraFilterMomentumEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const centerIndex = Math.round(contentOffsetX / FILTER_ITEM_INTERVAL);
    if (centerIndex >= 0 && centerIndex < cameraFilters.length) {
      const centerFilterId = cameraFilters[centerIndex].id;
      setCenterCameraFilterId(centerFilterId);
      setSelectedCameraFilterId(centerFilterId);
      setSelectedFilterItemId(null);
      
      // If filter is not Normal (id !== '1'), show menu options
      if (centerFilterId !== '1') {
        setShowMenuOptions(true);
        setFilterScrolling(true); // Keep tab bar hidden
      } else {
        // If back to Normal, hide menu options and show tab bar
        setShowMenuOptions(false);
        setFilterScrolling(false);
      }
    }
  };
  
  const handleCloseMenuOptions = () => {
    setShowMenuOptions(false);
    setFilterScrolling(false);
  };

  const handleCameraFilterPress = (item, index) => {
    setSelectedCameraFilterId(item.id);
    setCenterCameraFilterId(item.id);
    setSelectedFilterItemId(null);
    filterCarouselRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
    // Removed image capture - only change filter selection
  };

  const getFilterItems = () => {
    const currentFilterId = selectedCameraFilterId || centerCameraFilterId;
    
    const filterToCategoryMap = {
      '2': 'glasses',   
      '3': 'scarf',     
      '4': 'bows',      
      '5': 'food',      
      '7': 'vintage',   
    };
    
    const categoryId = filterToCategoryMap[currentFilterId];
    if (categoryId) {
      const category = defaultFilterCategories.find(cat => cat.id === categoryId);
      return category ? category.items : [];
    }
    return [];
  };

  const filterItems = getFilterItems();
  const showFilterItems = filterItems.length > 0;

  const renderCameraFilterItem = ({ item, index }) => {
    const isCenter = centerCameraFilterId === item.id;
    const isSelected = selectedCameraFilterId === item.id;

    return (
      <CameraFilterItem
        item={item}
        index={index}
        scrollX={filterScrollX}
        isSelected={isSelected}
        isCenter={isCenter}
        onPress={() => handleCameraFilterPress(item, index)}
      />
    );
  };

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!currentDevice) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionText}>Camera not available</Text>
      </View>
    );
  }

  const backgroundSource = capturedImage 
    ? { uri: capturedImage } 
    : (imageSource || null);


  return (
    <GestureHandlerRootView style={styles.container}>
      {capturedVideo ? (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: capturedVideo }}
            style={styles.video}
            resizeMode="cover"
            repeat
            paused={false}
          />
          <View style={styles.previewOverlay}>
            <View style={styles.topOverlay}>
              <TouchableOpacity onPress={handleRetake} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Preview</Text>
              <View style={styles.spacer} />
            </View>

            <View style={styles.previewBottomControls}>
              <TouchableOpacity style={styles.previewButton} onPress={handleRetake}>
                <Text style={styles.previewButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.previewButton, styles.sendButton]} 
                onPress={() => {
                  onVideoRecorded(capturedVideo);
                }}
              >
                <Text style={[styles.previewButtonText, styles.sendButtonText]}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : capturedImage ? (
        <View style={styles.imageBackgroundContainer} {...(panResponder.current?.panHandlers || {})}>
          <ImageBackground 
            source={backgroundSource} 
            style={styles.imageBackground} 
            resizeMode="cover"
          >
            <View style={styles.topOverlay}>
              <TouchableOpacity onPress={handleRetake} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{headerTitle}</Text>
              <View style={styles.spacer} />
            </View>

            <View style={styles.rightToolbar}>
              <ToolbarButton 
                iconText="T"
                onPress={handleAddText}
              />
              <ToolbarButton 
                iconSource={Icons.Face}
              />
              <ToolbarButton 
                iconSource={Icons.grid}
              />
              <ToolbarButton 
                iconSource={Icons.down}
              />
            </View>

            {textOverlays.map((textItem) => {
              const textPanResponder = getTextPanResponder(textItem.id);
              const isSelected = selectedTextId === textItem.id;
              
              return (
                <View
                  key={textItem.id}
                  style={[
                    styles.textOverlayContainer,
                    {
                      top: textItem.y,
                    },
                  ]}
                  {...textPanResponder.panHandlers}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleTextPress(textItem.id)}
                    style={styles.textOverlayTouchable}
                  >
                    <View
                      style={[
                        styles.textOverlayWrapper,
                        {
                          backgroundColor: textItem.backgroundColor || 'rgba(0, 0, 0, 0.5)',
                          transform: [{ rotate: `${textItem.rotation}deg` }],
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.textOverlay,
                          {
                            fontSize: textItem.fontSize,
                            color: textItem.color,
                            fontWeight: textItem.fontStyle === 'bold' ? 'bold' : 'normal',
                            fontStyle: textItem.fontStyle === 'italic' ? 'italic' : 'normal',
                            textShadowColor: textItem.fontStyle === 'outline' ? COLORS.black : 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: textItem.fontStyle === 'outline' ? { width: 2, height: 2 } : { width: 1, height: 1 },
                            textShadowRadius: textItem.fontStyle === 'outline' ? 4 : 3,
                          },
                        ]}
                      >
                        {textItem.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={styles.bottomControls}>
              <View style={styles.saveShareRow}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveImage}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={handleShareImage}>
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          
          <Modal
            visible={showTextInput}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setShowTextInput(false);
              setTextInputValue('');
              setSelectedTextId(null);
              setSelectedFontStyle('regular');
              setSelectedTextColor(COLORS.white);
              setSelectedBackgroundColor('rgba(0, 0, 0, 0.5)');
            }}
          >
            <View style={styles.textInputModal}>
              <TouchableOpacity 
                style={styles.textInputModalBackdrop}
                activeOpacity={1}
                onPress={() => {
                  setShowTextInput(false);
                  setTextInputValue('');
                  setSelectedTextId(null);
                  setSelectedFontStyle('regular');
                  setSelectedTextColor(COLORS.white);
                  setSelectedBackgroundColor('rgba(0, 0, 0, 0.5)');
                }}
              />
              <View style={styles.textInputContainer}>
                <ScrollView
                  style={styles.textInputScrollView}
                  contentContainerStyle={styles.textInputScrollContent}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.textInputActionBar}>
                    <TouchableOpacity
                      style={styles.textInputBackButton}
                      onPress={() => {
                        setShowTextInput(false);
                        setTextInputValue('');
                        setSelectedTextId(null);
                        setSelectedFontStyle('regular');
                        setSelectedTextColor(COLORS.white);
                        setSelectedBackgroundColor('rgba(0, 0, 0, 0.5)');
                      }}
                    >
                      <Text style={styles.textInputBackIcon}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textInputFormatButton}>
                      <Text style={styles.textInputFormatIcon}>Aa</Text>
                    </TouchableOpacity>
                  </View>

                  {suggestedWords.length > 0 && (
                    <View style={styles.suggestedWordsContainer}>
                      {suggestedWords.map((word, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.suggestedWordButton, index > 0 && { marginLeft: 8 }]}
                          onPress={() => handleSuggestedWordPress(word)}
                        >
                          <Text style={styles.suggestedWordText}>{word}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.textInputFieldContainer}>
                    <TouchableOpacity
                      style={styles.textInputIconButton}
                      onPress={handleColorPress}
                    >
                      <View style={[styles.colorPickerIcon, { backgroundColor: selectedTextColor }]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textInputIconButton}>
                      <Text style={styles.textInputAtIcon}>@</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.textInputField}
                      placeholder="Type here..."
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={textInputValue}
                      onChangeText={setTextInputValue}
                      autoFocus={true}
                      multiline={false}
                      maxLength={100}
                    />
                    <View style={styles.fontStyleButtonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.fontStyleButton,
                          selectedFontStyle === 'regular' && styles.fontStyleButtonActive
                        ]}
                        onPress={() => handleFontStylePress('regular')}
                      >
                        <Text style={[
                          styles.fontStyleButtonText,
                          selectedFontStyle === 'regular' && styles.fontStyleButtonTextActive
                        ]}>Abc</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.fontStyleButton,
                          { marginLeft: 4 },
                          selectedFontStyle === 'bold' && styles.fontStyleButtonActive
                        ]}
                        onPress={() => handleFontStylePress('bold')}
                      >
                        <Text style={[
                          styles.fontStyleButtonText,
                          styles.fontStyleButtonTextBold,
                          selectedFontStyle === 'bold' && styles.fontStyleButtonTextActive
                        ]}>Abc</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.fontStyleButton,
                          { marginLeft: 4 },
                          selectedFontStyle === 'italic' && styles.fontStyleButtonActive
                        ]}
                        onPress={() => handleFontStylePress('italic')}
                      >
                        <Text style={[
                          styles.fontStyleButtonText,
                          styles.fontStyleButtonTextItalic,
                          selectedFontStyle === 'italic' && styles.fontStyleButtonTextActive
                        ]}>Abc</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.fontStyleButton,
                          { marginLeft: 4 },
                          selectedFontStyle === 'outline' && styles.fontStyleButtonActive
                        ]}
                        onPress={() => handleFontStylePress('outline')}
                      >
                        <Text style={[
                          styles.fontStyleButtonText,
                          styles.fontStyleButtonTextOutline,
                          selectedFontStyle === 'outline' && styles.fontStyleButtonTextActive
                        ]}>Abc</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.backgroundColorSelectorContainer}>
                    <Text style={styles.backgroundColorLabel}>Background Color:</Text>
                    <View style={styles.backgroundColorOptions}>
                      {['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'].map((color, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.backgroundColorOption,
                            { backgroundColor: color },
                            selectedBackgroundColor === color && styles.backgroundColorOptionActive
                          ]}
                          onPress={() => setSelectedBackgroundColor(color)}
                        />
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.textInputSubmitButton}
                    onPress={handleTextInputSubmit}
                  >
                    <Text style={styles.textInputSubmitIcon}>✓</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.cameraContainer} {...(panResponder.current?.panHandlers || {})}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={currentDevice}
            isActive={true}
            photo={true}
            video={true}
            audio={hasMicPermission}
          />
          
          <View style={styles.overlayContainer}>
            <View style={styles.topOverlay}>
              <TouchableOpacity 
                style={styles.faceIconContainer}
                onPress={toggleCamera}
                activeOpacity={0.7}
              >
                <Image 
                  source={Icons.Face} 
                  style={[
                    styles.faceIcon,
                    cameraType === 'front' && styles.faceIconActive
                  ]} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.title}>{headerTitle}</Text>
              <View style={styles.spacer} />
            </View>

            {isRecording && (
              <RecordingIndicator recordingTime={recordingTime} />
            )}

            <View style={styles.rightToolbar}>
              <ToolbarButton 
                iconText={flashMode === 'off' ? '⚡' : flashMode === 'on' ? '⚡' : '⚡'}
                onPress={toggleFlash}
              />
              <ToolbarButton 
                iconSource={Icons.Face}
              />
              <ToolbarButton 
                iconSource={Icons.grid}
              />
            </View>

            <View style={styles.bottomControls}>
              <View style={styles.filterControls}>
                <TouchableOpacity 
                  style={styles.galleryWrapper}
                  onPress={handleOpenGallery}
                >
                  <GalleryIcon />
                </TouchableOpacity>
                
                {showFilterItems && (
                  <View style={styles.filterItemsContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filterItemsList}
                    >
                      {filterItems.map((item) => (
                        <FilterThumbnail
                          key={item.id}
                          filter={item}
                          isSelected={selectedFilterItemId === item.id}
                          onPress={() => setSelectedFilterItemId(item.id)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
                
                <View style={styles.filtersSection}>
                  <View style={styles.snapCenterHighlight} pointerEvents="box-none">
                    <TouchableOpacity 
                      style={styles.snapCenterRing}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (!isCapturing && !isRecording && camera.current && currentDevice && !capturedImage) {
                          handleCapture();
                        }
                      }}
                    />
                  </View>
                  <Animated.FlatList
                    ref={filterCarouselRef}
                    data={cameraFilters}
                    renderItem={renderCameraFilterItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    onScroll={onCameraFilterScroll}
                    onScrollBeginDrag={onCameraFilterScrollBegin}
                    onScrollEndDrag={(event) => {
                      setFilterScrolling(true);
                      const contentOffsetX = event.nativeEvent.contentOffset.x;
                      const currentIndex = Math.round(contentOffsetX / FILTER_ITEM_INTERVAL);
                      if (currentIndex >= 0 && currentIndex < cameraFilters.length) {
                        const currentFilterId = cameraFilters[currentIndex].id;
                        if (currentFilterId !== '1') {
                          setShowMenuOptions(true);
                        } else {
                          setShowMenuOptions(false);
                          setFilterScrolling(false);
                        }
                      }
                    }}
                    onMomentumScrollEnd={onCameraFilterMomentumEnd}
                    scrollEventThrottle={16}
                    snapToInterval={FILTER_ITEM_INTERVAL}
                    decelerationRate="fast"
                    initialScrollIndex={0}
                    getItemLayout={(data, index) => ({
                      length: FILTER_ITEM_INTERVAL,
                      offset: FILTER_ITEM_INTERVAL * index,
                      index,
                    })}
                  />
                </View>
              </View>
            </View>

            {showMenuOptions && (
              <View style={styles.menuContainer}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handleCloseMenuOptions}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
                <FlatList
                  data={menuOptions}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.menuOption}>
                      <Text style={styles.menuOptionIcon}>{item.icon}</Text>
                      <Text style={styles.menuOptionLabel}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.menuScrollContent}
                  style={styles.menuFlatList}
                  nestedScrollEnabled={true}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  permissionText: {
    color: COLORS.white,
    marginTop: 16,
    fontSize: scale(16),
    fontFamily: Fonts.Medium,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageBackgroundContainer: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  topOverlay: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: scale(15),
    zIndex: 5,
    minHeight: scale(50),
  },
  avatarContainer: {
    width:scale(45),
    height:scale(45),
    borderRadius:moderateScale(25),
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontFamily:Fonts.SeniBold,
  },
  title: {
    color:COLORS.white,
    fontSize:scale(15),
    fontFamily:Fonts.Bold,
  },
  spacer: {
    width: 46,
  },
  faceIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(8),
  },
  faceIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: COLORS.white,
  },
  faceIconActive: {
    tintColor: COLORS.primory1 || '#FFAD43',
  },
  rightToolbar: {
    position: "absolute",
    right: 16,
    top: 140,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(24),
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  menuContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(24),
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(40),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 11,
    
  },
  closeButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(8),
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  menuFlatList: {
    flex: 1,
  },
  menuScrollContent: {
    alignItems: 'center',
    paddingRight: moderateScale(16),
  },
  menuOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(0),
    paddingVertical: verticalScale(8),
    marginHorizontal: moderateScale(4),
    minWidth: moderateScale(50),
  },
  menuOptionIcon: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(4),
    color: COLORS.white,
  },
  menuOptionLabel: {
    fontSize: moderateScale(11),
    fontFamily: Fonts.Medium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoriesScrollView: {
    marginBottom: 12,
  },
  propsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  propsScrollView: {
    marginBottom: 6,
  },
  // Snapchat-style Filter Carousel
  filterCarousel: {
    marginBottom: 16,
    maxHeight: scale(90),
  },
  filterCarouselContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryPillActive: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },
  categoryText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: scale(14),
  },
  categoryTextActive: {
    fontFamily: "Poppins-Bold",
  },
  propPill: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  propPillActive: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  propText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    fontSize: scale(12),
  },
  propTextActive: {
    fontFamily: "Poppins-SemiBold",
  },
  captureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
  captureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    bottom: verticalScale(50),
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius:moderateScale (40),
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  spacerSmall: {
    width: 30,
  },
  iconButtonRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  video: {
    flex: 1,
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  previewBottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  previewButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  previewButtonText: {
    color: COLORS.white,
    fontSize: scale(16),
    fontFamily: Fonts.Bold,
  },
  sendButton: {
    backgroundColor: COLORS.primory1 || '#FF6B6B',
    borderColor: COLORS.primory1 || '#FF6B6B',
  },
  sendButtonText: {
    color: COLORS.white,
  },
  sendIconText: {
    color: COLORS.white,
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  captureButtonRecording: {
    borderColor: '#FF0000',
    borderWidth: 5,
  },
  recordingButtonInner: {
    backgroundColor: '#FF0000',
    borderRadius: moderateScale(20),
  },
  filterControls: {
    width: '100%',
    marginBottom: verticalScale(70),
    height: verticalScale(100),
  },
  galleryWrapper: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -35 }],
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterItemsContainer: {
    position: 'absolute',
    bottom: verticalScale(100),
    left: 35,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 5,
    maxHeight: verticalScale(100),
  },
  filterItemsList: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterList: {
    paddingHorizontal: SCREEN_WIDTH / 2 - FILTER_ITEM_INTERVAL / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  snapCenterHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  snapCenterRing: {
    width: scale(85),
    height: scale(85),
    borderRadius: moderateScale(100),
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: 'transparent',
  },
  textOverlayContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    left: 0,
    right: 0,
  },
  textOverlayTouchable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOverlayWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical:verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textOverlay: {
    fontFamily: Fonts.Bold,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontSize:moderateScale(12)
    
  },
  deleteTextButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11,
  },
  deleteTextButtonText: {
    color: COLORS.white,
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  textInputModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textInputModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  textInputContainer: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  textInputScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  textInputScrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  textInputActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInputBackButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputBackIcon: {
    color: COLORS.white,
    fontSize: scale(24),
    fontWeight: 'bold',
  },
  textInputFormatButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputFormatIcon: {
    color: COLORS.white,
    fontSize: scale(18),
    fontWeight: '600',
  },
  suggestedWordsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestedWordButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  suggestedWordText: {
    color: COLORS.white,
    fontSize: scale(14),
    fontFamily: Fonts.Medium,
  },
  textInputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3A3A3C',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  textInputIconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  colorPickerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  textInputAtIcon: {
    color: COLORS.white,
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  textInputField: {
    flex: 1,
    color: COLORS.white,
    fontSize: scale(18),
    fontFamily: Fonts.Regular,
    paddingVertical: 8,
    minHeight: 40,
  },
  fontStyleButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  fontStyleButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  fontStyleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  fontStyleButtonText: {
    color: COLORS.white,
    fontSize: scale(12),
    fontFamily: Fonts.Regular,
  },
  fontStyleButtonTextBold: {
    fontFamily: Fonts.Bold,
    fontWeight: 'bold',
  },
  fontStyleButtonTextItalic: {
    fontStyle: 'italic',
  },
  fontStyleButtonTextOutline: {
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  fontStyleButtonTextActive: {
    color: COLORS.white,
  },
  backgroundColorSelectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  backgroundColorLabel: {
    color: COLORS.white,
    fontSize: scale(14),
    fontFamily: Fonts.Medium,
    marginBottom: 8,
  },
  backgroundColorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  backgroundColorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  backgroundColorOptionActive: {
    borderColor: COLORS.white,
    borderWidth: 3,
  },
  textInputSubmitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primory1 || '#FFAD43',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  textInputSubmitIcon: {
    color: COLORS.white,
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  saveShareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(16),
    gap: scale(16),
  },
  saveButton: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    minWidth: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: scale(16),
    fontFamily: Fonts.Bold,
  },
  shareButton: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
    backgroundColor: COLORS.primory1 || '#FFAD43',
    borderWidth: 1,
    borderColor: COLORS.primory1 || '#FFAD43',
    minWidth: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: scale(16),
    fontFamily: Fonts.Bold,
  },
});

export default FaceOverlay;