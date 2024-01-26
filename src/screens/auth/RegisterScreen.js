import React, { useEffect, useState,ReactElement, useRef } from 'react';
import {
    Image,
    Platform,
    StatusBar,
    Text,
    Button,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';

import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import appleAuth, { } from '@invertase/react-native-apple-authentication';
import auth from "@react-native-firebase/auth";
import Spinner from '../../components/Spinner';
import { presentToastMessage } from '../../common/Functions';
import QB from 'quickblox-react-native-sdk';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinkedInModal from '@gcou/react-native-linkedin';
// import { useLinkedIn } from 'react-linkedin-login-oauth2';

GoogleSignin.configure({
    webClientId: "1012302153983-47lk38ita4oqj48aqqcd8s3qr5veif0d.apps.googleusercontent.com",
});

function RegisterScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState('')
    const [page, setPage] = useState(4)
    const onRegisterPress = () => navigation.push('AddPhone')
    const onBackPress = () => navigation.pop()
    
    // const onLinkedInPress = ({
        // clientId: '86vhj2q7ukf83q',
        // redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
        // onSuccess: (code) => {
        //   console.log(code);
        // },
        // onError: (error) => {
        //   console.log(error);
        // },
    // });

    const onLinkedInPress = () => {

    }

    const onApplePress = async () => {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });
            const {
                nonce,
                identityToken,
                realUserStatus,
                fullName,
            } = appleAuthRequestResponse;

            if (identityToken) {
            } else {
                presentToastMessage({ title: 'success', position: 'top', message: 'Some problems occurred, please try again.' })
            }

            if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                console.log("I'm a real person!");
            }

            const credential = auth.AppleAuthProvider.credential(identityToken, nonce)

            setLoading(true)
            // Firebase LogIn
            const createUser = await auth().signInWithCredential(credential)

            // Server LogIn
            var params = { uid: createUser.user.uid, verification_level: "3" }
            if (fullName.familyName !== null && fullName.givenName !== null) {
                params['name'] = fullName.givenName + " " + fullName.familyName
            }
            const response = await axios.post('apis/login_social/', params)

            // QuickBlox Create User
            var qbId = response.data.qb_id
            if (qbId === null) {
                const qbUser = await QB.users.create({ login: createUser.user.uid, password: Constants.QUICKBLOX_PASSWORD })
                qbId = qbUser.id

                let parameters = { 'qb_id': qbId }
                var body = [];
                for (let property in parameters) {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(parameters[property]);
                    body.push(encodedKey + "=" + encodedValue);
                }
                await axios.put('apis/update_user/', body.join("&"), { headers: { 'Auth-Token': response.data.token } })
            }

            // QuickBloxk LogIn
            await QB.auth.login({ login: response.data.uid, password: Constants.QUICKBLOX_PASSWORD })
            const connected = await QB.chat.isConnected()
            if (!connected) {
                await QB.chat.connect({ userId: qbId, password: Constants.QUICKBLOX_PASSWORD })
            }

            setLoading(false)

            global.token = response.data.token
            global.qb_id = qbId

            onSuccess(response)
        } catch (error) {
            console.log('login_social', JSON.stringify(error))
            setLoading(false)
            if (auth().currentUser !== null) {
                auth().signOut().then(() => console.log('user signed out!'))
            }
            if (error.code === appleAuth.Error.CANCELED) {
                console.warn('User canceled Apple Sign in.');
            } else {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 100);
            }
        }
    }
    const onGooglePress = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            const { user, idToken } = await GoogleSignin.signIn();
            const credential = auth.GoogleAuthProvider.credential(idToken);

            setLoading(true)
            // Firebase LogIn
            const createUser = await auth().signInWithCredential(credential)

            // Server LogIn
            var params = { uid: createUser.user.uid, verification_level: "3" }
            if (user.name !== null) {
                params['name'] = user.name
            }
            const response = await axios.post('apis/login_social/', params)

            // QuickBlox Create User
            var qbId = response.data.qb_id
            if (qbId === null) {
                const qbUser = await QB.users.create({ login: createUser.user.uid, password: Constants.QUICKBLOX_PASSWORD })
                qbId = qbUser.id

                let parameters = { 'qb_id': qbId }
                var body = [];
                for (let property in parameters) {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(parameters[property]);
                    body.push(encodedKey + "=" + encodedValue);
                }
                await axios.put('apis/update_user/', body.join("&"), { headers: { 'Auth-Token': response.data.token } })
            }

            // QuickBloxk LogIn
            await QB.auth.login({ login: response.data.uid, password: Constants.QUICKBLOX_PASSWORD })
            const connected = await QB.chat.isConnected()
            if (!connected) {
                await QB.chat.connect({ userId: qbId, password: Constants.QUICKBLOX_PASSWORD })
            }

            setLoading(false)

            global.token = response.data.token
            global.qb_id = qbId

            onSuccess(response)
        } catch (error) {
            console.log('login_social', JSON.stringify(error))
            setLoading(false)
            if (auth().currentUser !== null) {
                auth().signOut().then(() => console.log('user signed out!'))
            }
            if (error.code === appleAuth.Error.CANCELED) {
                console.warn('User canceled Apple Sign in.');
            } else {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 100);
            }
        }
    }
    const onSuccess = (response) => {
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
    }
    useEffect(() => {
        displayRegisterTutorial()
        return () => { };
    }, []);
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (page >= 4) {
                clearTimeout(timeoutID)
            } else {
                setPage(page + 1)
            }
        }, Constants.ANIMATION.DURATION);
        return () => {
            clearTimeout(timeoutID)
        };
    }, [page]);
    const displayRegisterTutorial = async () => {
        AsyncStorage.getItem('REGISTER_TUTORIAL_DISPLAYED')
            .then(result => {
                if (result === null) {
                    AsyncStorage.setItem('REGISTER_TUTORIAL_DISPLAYED', '1')
                    setPage(-1)
                }
            })
            .catch(() => {

            });
    }
    const TutorialView = ({ page, onNext }) => {
        if (page == -1 || page >= 4) return null
        return (
            <View style={{ position: 'absolute', width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', paddingBottom: insets.bottom + 62 }}>
                <Text style={{ marginTop: insets.top + Constants.LAYOUT.HEADER_BAR_HEIGHT, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {"Verification Levels"}
                </Text>
                <Text style={{ marginTop: 20, marginHorizontal: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE, textAlign: 'center' }}>
                    {page == 0 ? "By selecting this option you will receive a Level 1 Verification." :
                        page == 1 ? "By selecting this option, you will receive a Level 2 verification." :
                            page == 2 ? "By selecting this option, you will receive a Level 3 verification." :
                                page == 3 ? "By selecting one of these options you will receive different levels of verification." : ""}
                </Text>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 0 }}>
                    {
                        (page == 0 || page == 3) &&
                        <View style={{}}>
                            <View style={{ position: 'absolute', alignSelf: 'center', top: -74, alignItems: 'center' }}>
                                <Text style={{ marginRight: page == 0 ? 0 : 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                                    {"Level 1 Verification"}
                                </Text>
                                <Image style={{ marginTop: 4, width: 34, height: 52, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_down.png')} />
                            </View>
                            <View style={{ marginTop: 8, width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 84, borderWidth: 1, borderRadius: 16, borderColor: 'rgba(112,112,112,1)', alignItems: 'center', justifyContent: 'center', marginBottom: page == 3 ? 0 : 85 }}>
                                <StyledButton
                                    containerStyle={{}}
                                    textStyle={{}}
                                    title={"REGISTER WITH SMS"}
                                    onPress={onNext} />
                            </View>
                        </View>
                    }
                    <View style={{ marginTop: 74, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {
                            (page == 1 || page == 3) &&
                            <View style={{ position: 'absolute', alignSelf: 'center', top: 89, left: 55, flexDirection: 'row' }}>
                                <Image style={{ width: 43, height: 49, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_left.png')} />
                                <Text style={{ marginTop: 32, marginLeft: 6, width: 160, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                                    {"Level 2 Verification"}
                                </Text>
                            </View>
                        }
                        {
                            (page == 2 || page == 3) &&
                            <View style={{ position: 'absolute', alignSelf: 'center', bottom: 89, right: 55, flexDirection: 'row' }}>
                                <Text numberOfLines={1} style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                                    {"Level 3 Verification"}
                                </Text>
                                <Image style={{ marginLeft: 6, width: 36, height: 51, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_down.png')} />
                            </View>
                        }
                        {
                            (page == 1 || page == 3) ?
                                <View style={{ width: 110, height: 84, borderWidth: 1, borderRadius: 16, borderColor: 'rgba(112,112,112,1)', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={onNext} style={{ width: 90, height: 60, backgroundColor: Constants.COLOR.GRAY, justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                                        <Image style={{ width: 24, height: 24, resizeMode: 'contain' }} source={require('../../../assets/images/ic_linkedin.png')} />
                                    </TouchableOpacity>
                                </View> : <View style={{ width: 110 }} />
                        }
                        {
                            (page == 2 || page == 3) ?
                                <View style={{ marginStart: 2, width: 110, height: 84, borderWidth: 1, borderRadius: 16, borderColor: 'rgba(112,112,112,1)', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={onNext} style={{ width: 90, height: 60, backgroundColor: Constants.COLOR.GRAY, justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                                        {
                                            Platform.OS === 'ios' ?
                                                <Image style={{ width: 20, height: 24, resizeMode: 'contain' }} source={require('../../../assets/images/ic_apple.png')} /> :
                                                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../../assets/images/icon_google.png')} />
                                        }
                                    </TouchableOpacity>
                                </View> : <View style={{ marginStart: 2, width: 110 }} />
                        }
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                withLogo={true}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: 44, paddingBottom: insets.bottom + 74 }}>
                <Image style={{ width: 188, height: 180, resizeMode: 'contain' }} source={require('../../../assets/images/ic_main_logo.png')} />
                <View style={{ alignItems: 'center' }}>
                    <StyledButton
                        containerStyle={{}}
                        textStyle={{}}
                        title={"REGISTER WITH SMS"}
                        onPress={onRegisterPress} />
                    <Text style={{ marginTop: 34, lineHeight: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {"Or with"}
                    </Text>
                    <View style={{ marginTop: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={onLinkedInPress} style={{ width: 90, height: 60, backgroundColor: Constants.COLOR.GRAY, justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                            <Image style={{ width: 24, height: 24, resizeMode: 'contain' }} source={require('../../../assets/images/ic_linkedin.png')} />
                        </TouchableOpacity>
                        {
                            Platform.OS === 'ios' ?
                                <TouchableOpacity onPress={onApplePress} style={{ width: 90, height: 60, backgroundColor: Constants.COLOR.GRAY, justifyContent: 'center', alignItems: 'center', borderRadius: 7, marginStart: 22 }}>
                                    <Image style={{ width: 20, height: 24, resizeMode: 'contain' }} source={require('../../../assets/images/ic_apple.png')} />
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={onGooglePress} style={{ width: 90, height: 60, backgroundColor: Constants.COLOR.GRAY, justifyContent: 'center', alignItems: 'center', borderRadius: 7, marginStart: 22 }}>
                                    <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../../assets/images/icon_google.png')} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
            <TutorialView
                page={page}
                onNext={() => {
                    // setPage(page + 1)
                }} />
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default RegisterScreen;