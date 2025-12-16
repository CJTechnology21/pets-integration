import React from "react";
import { View } from "react-native";
import { Container } from '../../components/Container/Container';
import { COLORS } from "../../theme/Colors";
import { imgPath } from "../../assets/index.ts";
import FaceOverlay from "../../components/FaceOverlay/FaceOverlay";

const Home = ()=> {
    return(
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
          <FaceOverlay
            title="Face Enrollment"
            imageSource={imgPath.Dogs}
            onCapture={() => {}}
          />
        </Container>
    )
}

export default Home;