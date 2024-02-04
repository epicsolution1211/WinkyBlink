import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import StyledTextInput from '../../components/StyledTextInput';
import PasswordValidItem from '../../components/PasswordValidItem';
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';
import Spinner from '../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QB from 'quickblox-react-native-sdk';
import auth from "@react-native-firebase/auth";

function CreatePasswordScreen({ navigation, route }) {
    const UPPER_REGEX = /[A-Z]/;
    const NUMBER_REGEX = /\d/;
    const SPECIAL_REGEX = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;

    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLength, setPasswordLength] = useState(false)
    const [passwordUpperCase, setPasswordUpperCase] = useState(false)
    const [passwordNumber, setPasswordNumber] = useState(false)
    const [passwordSpecialCharacter, setPasswordSpecialCharacter] = useState(false)
    const [rememberPassword, setRememberPassword] = useState(false)
    const onSavePress = () => {
        if (password === "") {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter the password." })
        }
        if (password.length < 6 || password.length > 12) {
            return presentToastMessage({ type: 'success', position: 'top', message: "The password length should range between 6 and 12 characters." })
        }
        if (!UPPER_REGEX.test(password)) {
            return presentToastMessage({ type: 'success', position: 'top', message: "The password must include at least one uppercase letter." })
        }
        if (!NUMBER_REGEX.test(password)) {
            return presentToastMessage({ type: 'success', position: 'top', message: "The password must include at least one numeric digit." })
        }
        if (!SPECIAL_REGEX.test(password)) {
            return presentToastMessage({ type: 'success', position: 'top', message: "The password must include at least one special character." })
        }
        if (confirmPassword === "") {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter the confirm password." })
        }
        if (password !== confirmPassword) {
            return presentToastMessage({ type: 'success', position: 'top', message: "The password and the confirm password do not match." })
        }
        if (route.params.type === 'register') {
            createAccount()
        } else if (route.params.type === 'reset') {
            resetPassword()
        }
    }
    const onRememberPress = () => setRememberPassword(!rememberPassword)
    const onBackPress = () => navigation.pop()
    const createAccount = async () => {
        try {
            setLoading(true)
            
            const email = route.params.phone.replace(/[^0-9]/g, '') + "@winkyblink.com"
            console.log("email",email);
            const fbUser = await auth().createUserWithEmailAndPassword(email, Constants.FIREBASE_PASSWORD)
            console.log("fbuser",fbUser);
            const qbUser = await QB.users.create({ login: fbUser.user.uid, password: Constants.QUICKBLOX_PASSWORD })
            console.log("qbuser",qbUser);
            const response = await axios.post('apis/sign_up/', { uid: fbUser.user.uid, qb_id: qbUser.id, name: route.params.name, verification_level: "1", password: password })
            console.log("response", response);
            await QB.auth.login({ login: qbUser.login, password: Constants.QUICKBLOX_PASSWORD })
            const connected = await QB.chat.isConnected()
            if (!connected) {
                await QB.chat.connect({ userId: qbUser.id, password: Constants.QUICKBLOX_PASSWORD })
            }

            setLoading(false)

            rememberPassword && await AsyncStorage.setItem('PASSWORD', password)

            global.token = response.data.token
            global.qb_id = qbUser.id

            setTimeout(() => {
                navigation.push("AddBasicInformation", { name_required: false })
            }, 100);
        } catch (error) {
            console.log('sign_up-error', (error))
            setLoading(false)
            if (auth().currentUser !== null) {
                auth().signOut().then(() => console.log('user signed out!'))
            }
            if (error.code === 'auth/email-already-in-use') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "That email address is already in use." })
                }, 100);
            } else if (error.code === 'auth/invalid-email') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Please enter a valid email address." })
                }, 100);
            } else if (error.code === 'auth/weak-password') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "That password is weak." })
                }, 100);
            } else {
                
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message:"Some problems occurred, please try again." })
                }, 100);
            }
            // else {
            //     if(error != false)
            //     setTimeout(() => {
            //         presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            //     }, 100);
            // }
        }
    }
    const resetPassword = async () => {
        try {
            setLoading(true)
            await axios.post('apis/reset_password/', { uid: route.params.uid, password: password })
            setLoading(false)

            rememberPassword && await AsyncStorage.setItem('PASSWORD', password)

            setTimeout(() => {
                navigation.pop(3)
            }, 100);
        } catch (error) {
            console.log('reset_password', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
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
                    {"Create New Password"}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <StyledTextInput
                        containerStyle={{ marginTop: 30 }}
                        placeholder={"Password"}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setPassword(text)
                            setPasswordLength(text.length >= 6 && text.length <= 12)
                            setPasswordUpperCase(text.length > 1 && UPPER_REGEX.test(text))
                            setPasswordNumber(text.length > 1 && NUMBER_REGEX.test(text))
                            setPasswordSpecialCharacter(text.length > 1 && SPECIAL_REGEX.test(text))
                        }} />
                    <StyledTextInput
                        containerStyle={{ marginTop: 20 }}
                        placeholder={"Confirm Password"}
                        value={confirmPassword}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setConfirmPassword(text)
                        }} />
                    <PasswordValidItem
                        containerStyle={{ alignSelf: 'flex-start', marginTop: 30 }}
                        valid={passwordLength}
                        text={"Minimum 6 char - max 12"} />
                    <PasswordValidItem
                        containerStyle={{ alignSelf: 'flex-start', marginTop: 8 }}
                        valid={passwordUpperCase}
                        text={"1 Upper Case"} />
                    <PasswordValidItem
                        containerStyle={{ alignSelf: 'flex-start', marginTop: 8 }}
                        valid={passwordNumber}
                        text={"1 Number"} />
                    <PasswordValidItem
                        containerStyle={{ alignSelf: 'flex-start', marginTop: 8 }}
                        valid={passwordSpecialCharacter}
                        text={"1 Special character"} />
                    <TouchableOpacity onPress={onRememberPress} style={{ marginTop: 30, flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: Constants.COLOR.WHITE, alignItems: 'center', justifyContent: 'center' }} >
                            <Image style={{ width: 11, height: 8, tintColor: rememberPassword ? Constants.COLOR.SECONDARY : Constants.COLOR.TRANSPARENT, resizeMode: 'contain' }} source={require('../../../assets/images/ic_pass_verify.png')} />
                        </View>
                        <Text style={{ marginStart: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                            {"Remember password"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"SAVE"}
                    onPress={onSavePress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default CreatePasswordScreen;