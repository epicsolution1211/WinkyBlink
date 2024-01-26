import React, { useState } from 'react';
import {
    Linking,
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
import AuthContext from '../../common/Auth';

function CompleteProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const onNextPress = () => navigation.push("PrivacyPolicy")
    const onBackPress = () => navigation.pop()
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {`Complete Your Profile`}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {"All date that you just entered in the previous sections are solely for the purpose of the WinkyBlink Dating App.\n\nBefore you continue, please review our\n\n"}
                        <Text style={{ textDecorationLine: 'underline', fontWeight: '700' }}>
                            {"\"Privacy Policy\""}
                        </Text>
                        {"\n\n&\n\n"}
                        <Text style={{ textDecorationLine: 'underline', fontWeight: '700' }}>
                            {"\"Terms and Conditions\""}
                        </Text>
                    </Text>
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"NEXT"}
                    onPress={onNextPress} />
            </View>

        </View>
    )
}

export default CompleteProfileScreen;