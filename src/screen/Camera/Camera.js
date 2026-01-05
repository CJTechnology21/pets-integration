import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Container } from '../../components/Container/Container';
import { COLORS } from "../../theme/Colors";
import BanubaCamera from '../../components/BanubaCamera/BanubaCamera';
import { Icons } from '../../assets';
import { moderateScale, scale, verticalScale } from '../../utils/Scalling';
import { useTabBar } from '../../context/TabBarContext';

const Camera = () => {
  const { setImageCaptured } = useTabBar();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [flashMode, setFlashMode] = useState('off');
  const banubaCameraRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const handleCapture = (photo) => {
    // Handle captured photo
    console.log('Photo captured:', photo);
    setImageCaptured(true);
    // You can pass the captured photo to other parts of your app
  };

  const handleVideoRecorded = (video) => {
    // Handle recorded video
    console.log('Video recorded:', video);
    setImageCaptured(true);
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleRecordingStop = (video) => {
    handleVideoRecorded(video);
  };

  const toggleFlash = () => {
    const modes = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flashMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setFlashMode(nextMode);
    
    if (banubaCameraRef.current) {
      banubaCameraRef.current.setFlashMode(nextMode);
    }
  };

  const toggleCamera = () => {
    if (banubaCameraRef.current) {
      banubaCameraRef.current.toggleCamera();
    }
  };

  const handleCapturePress = async () => {
    if (banubaCameraRef.current && !isRecording) {
      await banubaCameraRef.current.capturePhoto();
    }
  };

  const handleRecordPress = async () => {
    if (banubaCameraRef.current) {
      if (isRecording) {
        await banubaCameraRef.current.stopRecording();
      } else {
        await banubaCameraRef.current.startRecording();
      }
    }
  };

  return (
    <Container backgroundColor={COLORS.black} statusBarBackgroundColor={COLORS.black}>
      <View style={styles.container}>
        <BanubaCamera
          ref={banubaCameraRef}
          onCapture={handleCapture}
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
          selectedFilter={selectedFilter}
        />
        
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleFlash}
          >
            <Text style={styles.iconButtonText}>
              {flashMode === 'off' ? '⚡' : flashMode === 'on' ? '💡' : '📸'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Camera</Text>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleCamera}
          >
            <Text style={styles.iconButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={styles.galleryButton}
            onPress={() => Alert.alert('Gallery', 'Open gallery functionality')}
          >
            <Text style={styles.galleryButtonText}>🖼️</Text>
          </TouchableOpacity>
          
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.captureButton,
                isRecording && styles.recordingButton
              ]}
              onPress={handleRecordPress}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.spacer} />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: scale(50),
    zIndex: 10,
  },
  title: {
    color: COLORS.white,
    fontSize: scale(18),
    fontFamily: 'Poppins-Bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: COLORS.white,
    fontSize: 18,
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(24),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: {
    fontSize: 20,
  },
  captureButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recordingButton: {
    borderColor: '#FF0000',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.white,
  },
  spacer: {
    width: 50, // Same width as gallery button for alignment
  },
});

export default Camera;