import React, { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';
import Spinner from '../../components/Spinner';

function VerificationScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [verificationCode, setVerificationCode] = useState(route.params.verification_code)
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const codeRef = useBlurOnFulfill({ value, cellCount: 4 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    useEffect(() => {
        sendVerificationCode()
    }, []);
    const onVerifyPress = () => {
        console.log(verificationCode)
        if (value === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter the verification code" })
        }
        if (value.toString() !== verificationCode.toString()) {
            return presentToastMessage({ 
                type: 'success', position: 'top', message: "The verification code you entered is invalid" })
        }
        navigation.push("CreatePassword", { type: route.params.type, name: route.params.name, phone: route.params.phone, uid: route.params.uid })
    }
    const onBackPress = () => navigation.pop()
    const onResendVerificationCodePress = async () => {
        sendVerificationCode()
    }
    const sendVerificationCode = async () => {
        try {
            setLoading(true)
            const response = await axios.post('apis/send_verification_code/', { phone: route.params.phone })
            console.log(response.data)
            setVerificationCode(response.data.verification_code)
            setLoading(false)
        } catch (error) {
            console.log('send_verification_code',error)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ 
                    type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
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
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 30, paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <Text style={{ marginTop: 30, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                        {"Please enter the verification code we have sent to your mobile number."}
                    </Text>
                    <Text style={{ marginTop: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`+ ${route.params.phone}`}
                    </Text>
                    <View style={{ height: 80, width: Constants.LAYOUT.SCREEN_WIDTH - 60, marginTop: 30 }}>
                        <CodeField
                            ref={codeRef}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            cellCount={4}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            )}
                        />
                    </View>
                    <TouchableOpacity onPress={onResendVerificationCodePress} style={{ marginTop: 60 }}>
                        <Text style={{ textDecorationLine: 'underline', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                            {"Resend Verification Code"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"VERIFY"}
                    onPress={onVerifyPress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

const styles = StyleSheet.create({
    codeFieldRoot: {},
    cell: {
        width: 68,
        height: 60,
        borderRadius: 7,
        lineHeight: 60,
        paddingTop: 2,
        color: Constants.COLOR.BLACK,
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI,
        fontSize: Constants.FONT_SIZE.FT32,
        borderWidth: 0,
        borderColor: Constants.COLOR.PRIMARY,
        backgroundColor: Constants.COLOR.WHITE,
        overflow: 'hidden',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});

export default VerificationScreen;