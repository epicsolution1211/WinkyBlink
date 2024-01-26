import React, { useEffect, useState } from 'react';
import {
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
import AuthContext from '../../common/Auth';
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';
import Spinner from '../../components/Spinner';
import QB from 'quickblox-react-native-sdk';
import DeviceInfo, { isEmulator } from 'react-native-device-info';
import auth from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

function LogInScreen({ navigation }) {
    const { sessionStart } = React.useContext(AuthContext);
    const insets = useSafeAreaInsets()
    const [phone, setPhone] = useState('')
    // const [phone, setPhone] = useState('2063862134')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        loadSavedPassword()
        return () => { };
    }, []);
    const loadSavedPassword = () => {
        AsyncStorage.getItem('PASSWORD')
            .then(result => {
                if (result !== null) {
                    setPassword(result)
                }
            })
            .catch(() => {
            });
    }
    const setTempLogIn = async () => {
        const isEmulator = await DeviceInfo.isEmulator()
        if (isEmulator) {
            const model = DeviceInfo.getModel()
            if (model === "iPhone 15") {
                setPhone("(206) 342-8631")
                setPassword("Zaq12345!@#")
            } else if (model === "iPhone 15 Pro") {
                setPhone("(434) 119-9521")
                setPassword("Zaq12345!@#")
            }
        }
    }
    const onLogInPress = () => {
        if (phone === "") {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your phone number." })
        }
        if (password === "") {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your password." })
        }
        loginToAccount()
    }
    const onForgotPress = () => navigation.push("ForgotPassword")
    const onBackPress = () => navigation.pop()
    const loginToAccount = async () => {
        try {
            setLoading(true)

            const email = phone.replace(/[^0-9]/g, '') + "@winkyblink.com"
            const result = await auth().signInWithEmailAndPassword(email, Constants.FIREBASE_PASSWORD)
            console.log("fblogin", password, result.user.uid);
            const response = await axios.post('apis/login/', { uid: result.user.uid, password: password })
            console.log("backendlogin", response);
            const qblogin =  await QB.auth.login({ login: response.data.uid, password: Constants.QUICKBLOX_PASSWORD })
            console.log('qblogin', qblogin);
            const connected = await QB.chat.isConnected()
            if (!connected) {
                await QB.chat.connect({ userId: response.data.qb_id, password: Constants.QUICKBLOX_PASSWORD })
            }

            setLoading(false)

            global.token = response.data.token
            global.qb_id = response.data.qb_id
            if (response.data.profile_completion === 'COMPLETED') {
                setTimeout(() => {
                    sessionStart()
                }, 100);
            } else if (response.data.profile_completion === 'NEED_NAME') {
                setTimeout(() => {
                    navigation.push("AddBasicInformation", { name_required: true })
                }, 100);
            } else if (response.data.profile_completion === 'NEED_BASIC_INFORMATION') {
                setTimeout(() => {
                    navigation.push("AddBasicInformation", { name_required: false })
                }, 100);
            } else if (response.data.profile_completion === 'NEED_MEMBERSHIP') {
                setTimeout(() => {
                    navigation.push('Onboarding')
                }, 100);
            } else if (response.data.profile_completion === 'NEED_ABOUT_ME') {
                setTimeout(() => {
                    navigation.push('CreateProfile')
                }, 100);
            } else if (response.data.profile_completion === 'NEED_ABOUT_ME_FUN_FACT') {
                setTimeout(() => {
                    navigation.push('AboutMeBio')
                }, 100);
            } else if (response.data.profile_completion === 'NEED_ABOUT_ME_PHOTO') {
                setTimeout(() => {
                    navigation.push('AboutMePhoto')
                }, 100);
            } else if (response.data.profile_completion === 'NEED_PREFERENCES') {
                setTimeout(() => {
                    navigation.push('MyPreferences')
                }, 100);
            } else if (response.data.profile_completion === 'NEED_ABOUT_ME_TERMS_ACCEPANCE') {
                setTimeout(() => {
                    navigation.push('CompleteProfile')
                }, 100);
            }
            console.log('login', response.data.profile_completion);
        } catch (error) {
            console.log('login', error,phone)
            setLoading(false)
            if (auth().currentUser !== null) {
                auth().signOut().then(() => console.log('user signed out!'))
            }
            if (error.code === 'auth/user-not-found') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "We couldn't find an account with that email address." })
                }, 100);
            } else if (error.code === 'auth/wrong-password') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Your password is incorrect." })
                }, 100);
            } else if (error.code === 'auth/user-disabled') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Your account has been deactivated." })
                }, 100);
            } else {
                setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 300);
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
                    {"Login"}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <StyledTextInput
                        type={"cel-phone"}
                        containerStyle={{ marginTop: 30 }}
                        placeholder={"Mobile Number"}
                        value={phone}
                        onChangeText={(text) => setPhone(text)} />
                    <StyledTextInput
                        containerStyle={{ marginTop: 20 }}
                        placeholder={"Password"}
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)} />
                    <TouchableOpacity onPress={onForgotPress} style={{ marginTop: 30 }}>
                        <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                            {"Forgot Your Password?"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"LOGIN"}
                    onPress={onLogInPress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default LogInScreen;