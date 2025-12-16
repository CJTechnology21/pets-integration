import React, { useState } from "react";
import { Image, View,StyleSheet, TouchableOpacity, Modal, ScrollView, Text } from "react-native";
import { Container } from "../../components/Container/Container";
import { COLORS } from "../../theme/Colors";
import CustomHeader from "../../components/Header/CustomHeader";
import { scale, verticalScale } from "../../utils/Scalling";
import { imgPath } from "../../assets";
import { Icons } from "../../assets";
import CustomTextInput from "../../components/textInput/CustomTextInput";
import Button from "../../components/buttons/Button";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const PetProfile = ()=> {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [petName, setPetName] = useState("");
    const [breed, setBreed] = useState("");
    const [species, setSpecies] = useState("");
    const [trait, setTrait] = useState("");
    const [pickerType, setPickerType] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);

    const BREEDS = ["Labrador Retriever", "German Shepherd", "Bulldog", "Poodle", "Beagle"];
    const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
    const TRAITS = ["Friendly", "Active", "Calm", "Playful", "Protective"];

    const openPicker = (type) => {
        setPickerType(type);
    };

    const closePicker = () => {
        setPickerType(null);
    };

    const getOptions = () => {
        if(pickerType === 'breed') return BREEDS;
        if(pickerType === 'species') return SPECIES;
        if(pickerType === 'trait') return TRAITS;
        return [];
    };

    const onSelectOption = (option) => {
        if(pickerType === 'breed') setBreed(option);
        if(pickerType === 'species') setSpecies(option);
        if(pickerType === 'trait') setTrait(option);
        closePicker();
    };

    const getSelectedValue = () => {
        if(pickerType === 'breed') return breed;
        if(pickerType === 'species') return species;
        if(pickerType === 'trait') return trait;
        return null;
    };

    const handleUploadPhoto = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 1,
                quality: 0.8,
            });
            if (!result.didCancel && result.assets && result.assets.length > 0) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (e) {
            // no-op
        } finally {
            setIsUploadOpen(false);
        }
    };

    const handleTakePhoto = async () => {
        try {
            const result = await launchCamera({
                mediaType: 'photo',
                saveToPhotos: true,
                quality: 0.8,
            });
            if (!result.didCancel && result.assets && result.assets.length > 0) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (e) {
            // no-op
        } finally {
            setIsUploadOpen(false);
        }
    };

    return(
        <Container backgroundColor={COLORS.white} statusBarBackgroundColor={COLORS.white}>
                        <CustomHeader title='Pet Profile' showBackButton={false}/>

            <ScrollView>

            <View style={{alignItems:'center',justifyContent:'center'}}>
                <Image source={imgPath.Rectangle} style={styles.rectangle}/>
            </View>

            <View style={styles.avatarWrap}>
                <Image source={avatarUri ? { uri: avatarUri } : imgPath.PetProfile} style={styles.dogs}/>
                <TouchableOpacity onPress={() => setIsUploadOpen(true)} style={styles.camBtn} activeOpacity={0.85}>
                    <Image source={Icons.Vector} style={styles.camIcon}/>
                </TouchableOpacity>
            </View>

            <View style={styles.formArea}>
                <CustomTextInput placeholder="Pet Name" value={petName} onChangeText={setPetName} />
                <CustomTextInput
                    placeholder="Breed"
                    value={breed}
                    editable={false}
                    onPress={() => openPicker('breed')}
                    rightIcon={<Image source={Icons.down} style={styles.rightArrow}/>} 
                />
                <CustomTextInput
                    placeholder="Species"
                    value={species}
                    editable={false}
                    onPress={() => openPicker('species')}
                    rightIcon={<Image source={Icons.down} style={styles.rightArrow}/>} 
                />
                <CustomTextInput
                    placeholder="Trait"
                    value={trait}
                    editable={false}
                    onPress={() => openPicker('trait')}
                    rightIcon={<Image source={Icons.down} style={styles.rightArrow}/>} 
                />

                <Button title="Create Profile" onPress={() => {}} style={styles.ctaBtn}/>
            </View>

            <Modal visible={isUploadOpen} transparent animationType="slide" onRequestClose={() => setIsUploadOpen(false)}>
                <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPressOut={() => setIsUploadOpen(false)}>
                    <View style={styles.sheetContainer}>
                        <View style={styles.sheetHandle}/>
                        <Button title="Upload Photo" onPress={handleUploadPhoto} style={styles.sheetButton}/>
                        <Button title="Take Photo" variant="secondary" onPress={handleTakePhoto} style={styles.sheetButton}/>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={!!pickerType} transparent animationType="fade" onRequestClose={closePicker}>
                <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPressOut={closePicker}>
                    <View style={styles.sheetContainer}>
                        <View style={styles.sheetHandle}/>
                        <ScrollView>
                            {getOptions().map((opt) => {
                                const selected = opt === getSelectedValue();
                                return (
                                    <TouchableOpacity key={opt} style={styles.optionRow} onPress={() => onSelectOption(opt)} activeOpacity={0.85}>
                                        <Text style={styles.optionText}>{opt}</Text>
                                        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                                            {selected ? <View style={styles.radioInner}/> : null}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
            </ScrollView>
        </Container>
    )
}

export default PetProfile;

const styles = StyleSheet.create({
    rectangle: {
        width:"100%",
        height: verticalScale(200),
        resizeMode: 'contain',
    },
    dogs: {
        width: scale(100),
        height: verticalScale(100),
        resizeMode: 'contain',
        borderRadius: scale(100),
        borderColor: COLORS.primary2,
    },
    avatarWrap:{
        alignItems:'center',
        justifyContent:'center',
        bottom:verticalScale(65)
    },
    camBtn:{
        position:'absolute',
        right:scale(115),
        bottom:verticalScale(6),
        backgroundColor:COLORS.white,
        borderRadius:scale(20),
        padding:scale(6),
        elevation:2
    },
    camIcon:{
        width:scale(20),
        height:scale(20),
        resizeMode:'contain'
    },
    formArea:{
        paddingHorizontal:scale(20),
        paddingBottom:verticalScale(50),
        bottom:verticalScale(60),
    },
    rightArrow:{
        width:scale(16),
        height:scale(16),
        resizeMode:'contain',
        tintColor:'#A0A0A0'
    },
    ctaBtn:{
        marginTop:verticalScale(12),
        borderRadius:scale(14),
        backgroundColor:COLORS.primary2
    },
    sheetOverlay:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:'flex-end'
    },
    sheetContainer:{
        backgroundColor:COLORS.white,
        borderTopLeftRadius:scale(20),
        borderTopRightRadius:scale(20),
        paddingHorizontal:scale(20),
        paddingTop:verticalScale(16),
        paddingBottom:verticalScale(24)
    },
    sheetHandle:{
        alignSelf:'center',
        width:scale(60),
        height:verticalScale(5),
        borderRadius:scale(3),
        backgroundColor:'#E0E0E0',
        marginBottom:verticalScale(16)
    },
    sheetButton:{
        marginBottom:verticalScale(12)
    },
    optionRow:{
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    optionText:{
        color: COLORS.black,
        fontSize: scale(14)
    },
    radioOuter:{
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        borderWidth: 2,
        borderColor: '#CFCFCF',
        alignItems:'center',
        justifyContent:'center'
    },
    radioOuterSelected:{
        borderColor: COLORS.primary2
    },
    radioInner:{
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: COLORS.primary2
    }
})