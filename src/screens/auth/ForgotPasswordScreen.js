import React, { useState } from 'react';
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
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';
import Spinner from '../../components/Spinner';
import auth from "@react-native-firebase/auth";

function ForgotPasswordScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const onSetPress = () => {
        checkPhoneValid()
    }
    const onBackPress = () => navigation.pop()
    const checkPhoneValid = async () => {
        try {
            setLoading(true)
            const email = phone.replace(/[^0-9]/g, '') + "@winkyblink.com"
            const result = await auth().signInWithEmailAndPassword(email, Constants.FIREBASE_PASSWORD)
            await auth().signOut()

            setLoading(false)
            setTimeout(() => {
                navigation.push("Verification", { type: 'reset', phone: phone, uid: result.user.uid })
            }, 100);
        } catch (error) {
            console.log('Forgot Password', error)
            setLoading(false)
            if (error.code === 'auth/user-not-found') {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "We could not find any account associated with the phone number." })
                }, 100);
            } else {
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
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
                    {"Forgot Your Password?"}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 20, alignItems: 'center' }}>
                    <Text style={{ marginTop: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {"Please Enter Your Mobile Number"}
                    </Text>
                    <StyledTextInput
                        type={"cel-phone"}
                        containerStyle={{ marginTop: 30 }}
                        placeholder={"Mobile Number"}
                        value={phone}
                        onChangeText={(text) => setPhone(text)} />
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"SET NEW PASSWORD"}
                    onPress={onSetPress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default ForgotPasswordScreen;