import React from "react";
import { View } from "react-native";
import { Container } from '../../components/Container/Container';
import CustomHeader from '../../components/Header/CustomHeader';
import { COLORS } from "../../theme/Colors";


const Profile = ()=> {
    return(
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
          <CustomHeader title='Profile' showBackButton={false}/>
        </Container>
    )
}

export default Profile;