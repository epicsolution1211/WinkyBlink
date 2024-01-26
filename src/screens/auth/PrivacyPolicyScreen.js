import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';
import Spinner from '../../components/Spinner';

function PrivacyPolicyScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [agree, setAgree] = useState(false)
    const onDonePress = () => {
        if (!agree) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please confirm your agreement to our privacy policy." })
        }
        savePrivacyPolicyAccepted()
    }
    const savePrivacyPolicyAccepted = async () => {
        try {
            let parameters = {
                'is_privacy_accepted': 1
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
            setLoading(false)
            setTimeout(() => {
                navigation.push("TermsOfConditions")
            }, 100);
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onBackPress = () => navigation.pop()
    const onAgreePress = () => setAgree(!agree)
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {`Privacy Policy`}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nMagna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
                    </Text>
                </ScrollView>
                <View style={{ backgroundColor: Constants.COLOR.GRAY, width: '100%', alignItems: 'center', paddingTop: 20, paddingHorizontal: 30, paddingBottom: insets.bottom + 20 }}>
                    <TouchableOpacity onPress={onAgreePress} style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: Constants.COLOR.WHITE, alignItems: 'center', justifyContent: 'center' }} >
                            <Image style={{ width: 11, height: 8, tintColor: agree ? Constants.COLOR.SECONDARY : Constants.COLOR.TRANSPARENT, resizeMode: 'contain' }} source={require('../../../assets/images/ic_pass_verify.png')} />
                        </View>
                        <Text style={{ marginStart: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                            {"I agree"}
                        </Text>
                    </TouchableOpacity>
                    <StyledButton
                        containerStyle={{ marginTop: 20 }}
                        textStyle={{}}
                        title={"DONE"}
                        onPress={onDonePress} />
                </View>
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default PrivacyPolicyScreen;