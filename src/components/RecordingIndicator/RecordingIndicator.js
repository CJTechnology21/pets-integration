import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale } from '../../utils/Scalling';

const RecordingIndicator = ({ recordingTime }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.recordingIndicator}>
      <View style={styles.recordingDot} />
      <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  recordingIndicator: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginRight: 6,
  },
  recordingTime: {
    color: COLORS.white,
    fontSize: scale(14),
    fontFamily: Fonts.Bold,
  },
});

export default RecordingIndicator;

