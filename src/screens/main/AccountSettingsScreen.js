import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    LayoutAnimation,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import StyledTextInput from '../../components/StyledTextInput';
import SwipeButton from '../../components/SwipeButton';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { presentToastMessage } from '../../common/Functions';
import ConfirmationModal from '../../components/ConfirmationModal';
import AuthContext from '../../common/Auth';
import auth from "@react-native-firebase/auth";

function AccountSettingsScreen({ navigation, route }) {
    const { sessionClose } = React.useContext(AuthContext);
    const insets = useSafeAreaInsets()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const emailTextFieldRef = useRef()
    const nameTextFieldRef = useRef()
    const phoneTextFieldRef = useRef()
    const zipTextFieldRef = useRef()
    useEffect(() => {
        loadAccountSettings()
        return () => { }
    }, []);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", (event) => keyboardDidShow(event));
        const hideSubscription = Keyboard.addListener("keyboardWillHide", (event) => keyboardDidHide(event));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, []);
    const keyboardDidShow = (event) => {
        let height = event.endCoordinates.height;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(height)
    }
    const keyboardDidHide = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    }
    const loadAccountSettings = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setName(response.data.user.name)
            setEmail(response.data.user.email)
            if (auth().currentUser.providerData[0].providerId === 'password') {
                setPhone(auth().currentUser.email.replace("@winkyblink.com", ""))
            }
            setZipcode(response.data.user.zip_code)
            setLoading(false)
            setLoaded(true)
            // console.log(response);
        } catch (error) {
            console.log('load_profile', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const reauthenticate = (password) => {
        var credential = auth.EmailAuthProvider.credential(auth().currentUser.email, password)
        return auth().currentUser.reauthenticateWithCredential(credential);
    }
    const saveAccountSettings = async () => {
        try {
            let parameters = {
                'name': name,
                'email': email,
                'zip_code': zipcode
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            setLoading(true)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })

            if (auth().currentUser.providerData[0].providerId === 'password') {
                const email = phone.replace(/[^0-9]/g, '') + "@winkyblink.com"
                if (auth().currentUser.email !== email) {
                    await reauthenticate(Constants.FIREBASE_PASSWORD)
                    await auth().currentUser.updateEmail(email)
                }
            }

            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your account settings." })
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            if (error.code == 'auth/invalid-email') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Please enter a valid email address." })
                }, 100);
            } else if (error.code == 'auth/email-already-in-use') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Your email address is already in use by another user." })
                }, 100);
            } else {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 100);
            }
        }
    }
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onUpdatePress = () => {
        if (name === "") {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your name" })
        }
        if (email === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your email address." })
        }
        if (auth().currentUser.providerData[0].providerId === 'password' && phone === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your phone number" })
        }
        if (zipcode === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your zip code." })
        }
        saveAccountSettings()
    }
    const deleteAccount = async () => {
        try {
            let parameters = {
                'is_deleted': 1
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            setLoading(true)
            setVisibleDeleteModal(false)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)

            global.token = null
            global.qb_id = null

            setTimeout(() => {
                sessionClose()
            }, 100);
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setVisibleDeleteModal(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onDeleteAccount = () => {
        setVisibleDeleteModal(true)
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visibleDeleteModal &&
                <ConfirmationModal
                    insets={insets}
                    title={"Delete Account"}
                    content={"Are you sure you want to delete this account?"}
                    onPositivePress={() => {
                        deleteAccount()
                    }}
                    onNegativePress={() => setVisibleDeleteModal(false)}
                    onClosePress={() => setVisibleDeleteModal(false)}
                />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {loaded ? 'Account Settings' : 'Account Settings'}
            </Text>
            {
                loaded &&
                <View style={{ flex: 1, alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                    <ScrollView style={{ width: Constants.LAYOUT.SCREEN_WIDTH }} contentContainerStyle={{ paddingBottom: keyboardHeight, alignItems: 'center', paddingTop: 25 }}>
                        <StyledTextInput
                            ref={nameTextFieldRef}
                            containerStyle={{ marginTop: 0, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            label={"Name"}
                            placeholder={""}
                            value={name}
                            autoCapitalize={'words'}
                            returnKeyType={'next'}
                            onSubmitEditing={() => emailTextFieldRef.current.focus()}
                            onChangeText={(text) => setName(text)} />
                        <StyledTextInput
                            ref={emailTextFieldRef}
                            containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            label={"Email"}
                            placeholder={""}
                            value={email}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            onSubmitEditing={() => phoneTextFieldRef.current._inputElement.focus()}
                            onChangeText={(text) => setEmail(text)} />
                        {
                            auth().currentUser.providerData[0].providerId === 'password' &&
                            <StyledTextInput
                                ref={phoneTextFieldRef}
                                type={"cel-phone"}
                                containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                                label={"Phone"}
                                keyboardType={'phone-pad'}
                                placeholder={""}
                                value={phone}
                                returnKeyType={'done'}
                                onSubmitEditing={() => zipTextFieldRef.current.focus()}
                                onChangeText={(text) => setPhone(text)} />
                        }
                        <StyledTextInput
                            ref={zipTextFieldRef}
                            containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            label={"Zipcode"}
                            placeholder={""}
                            value={zipcode}
                            keyboardType={'number-pad'}
                            returnKeyType={'done'}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            onChangeText={(text) => setZipcode(text)} />
                        <StyledButton
                            containerStyle={{ marginTop: 60, alignSelf: 'center' }}
                            textStyle={{}}
                            title={"UPDATE"}
                            onPress={onUpdatePress} />
                        <View
                            style={{
                                marginTop: 35,
                                width: Constants.LAYOUT.SCREEN_WIDTH - 60,
                                alignSelf: 'center',
                                height: 60,
                                borderRadius: 7,
                                backgroundColor: Constants.COLOR.GRAY,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} >
                            <SwipeButton onToggle={onDeleteAccount} />
                        </View>
                    </ScrollView>
                </View>
            }
            {loading && <Spinner visible={true} />}
        </View >
    )
}

export default AccountSettingsScreen;