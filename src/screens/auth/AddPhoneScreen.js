import React, { useRef, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import StyledTextInput from '../../components/StyledTextInput';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import auth from "@react-native-firebase/auth";

function AddPhoneScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const nameRef = useRef()
    const phoneRef = useRef()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const onRegisterPress = () => {
        if (name === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your name" })
        }
        if (phone === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your phone number" })
        }
        checkPhoneExist()
    }
    const onBackPress = () => navigation.pop()
    const checkPhoneExist = async () => {
        try {
            setLoading(true)
            const email = phone.replace(/[^0-9]/g, '') + "@winkyblink.com"
            const response =  await auth().signInWithEmailAndPassword(email, "FAKE_PASSWORD")
            if (auth().currentUser !== null) {
                auth().signOut().then(() => console.log('user signed out!'))
            }
            console.log(response.data);
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: "The phone number is currently in use by another user." })
        } catch (error) {
            setLoading(false)
            console.log(error.code);
            if (error.code === 'auth/user-not-found') {
                setTimeout(() => {
                    navigation.push("Verification", { type: 'register', name: name, phone: phone.replace(/[^0-9]/g, '') })
                }, 100);
            } else {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "The phone number is currently in use by another user." })
                }, 100);
            }
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {"Please Enter"}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <StyledTextInput
                        ref={nameRef}
                        containerStyle={{ marginTop: 30 }}
                        placeholder={"Name"}
                        autoCapitalize={'words'}
                        value={name}
                        returnKeyType={'next'}
                        onSubmitEditing={() => phoneRef.current._inputElement.focus()}
                        onChangeText={(text) => setName(text)} />
                    <StyledTextInput
                        ref={phoneRef}
                        type={"cel-phone"}
                        keyboardType={'phone-pad'}
                        containerStyle={{ marginTop: 20 }}
                        placeholder={"Mobile Number"}
                        value={phone}
                        onChangeText={(text) => setPhone(text)} />
                    <Text style={{ marginTop: 30, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {"We Will Send You A One-Time Verification Code For Authentication."}
                    </Text>
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"REGISTER"}
                    onPress={onRegisterPress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default AddPhoneScreen;