import React from 'react';
import { View } from 'react-native';
import { Container } from '../../components/Container/Container';
import { COLORS } from "../../theme/Colors";
import FaceOverlay from "../../components/FaceOverlay/FaceOverlay";

const Camera = () => {
  return (
    <Container backgroundColor={COLORS.black} statusBarBackgroundColor={COLORS.black}>
      <FaceOverlay
        title="Camera"
        onCapture={() => {}}
      />
    </Container>
  );
};

export default Camera;