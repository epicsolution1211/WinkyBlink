import React, { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';

function BuyInAppAudioChatScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onBuyNowPress = () => navigation.push('CheckOut',{description:'In-App Audio Chat',price:5.99,type:'subscription'})
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Image style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: (320 / 480) * Constants.LAYOUT.SCREEN_WIDTH, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} source={require('../../../assets/images/img_hand_phone.jpeg')} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <View style={{ flex: 1, paddingTop: 30, width: Constants.LAYOUT.SCREEN_WIDTH, paddingHorizontal: 30 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={{ alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {'In-app Audio Chat'}
                        </Text>
                        <Text style={{ marginTop: 25, textAlign: 'center', alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {'Enjoy unlimited in-app audio chat capabilities that will allow you to speak with other members without giving out your phone number.'}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE }}>
                    {`Price:`}
                </Text>
                <Text style={{ marginTop: 6, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT25, color: Constants.COLOR.WHITE }}>
                    {`$5.99/month`}
                </Text>
                <StyledButton
                    containerStyle={{ marginTop: 20 }}
                    textStyle={{}}
                    title={"BUY NOW"}
                    onPress={onBuyNowPress} />
            </View>

        </View>
    )
}

export default BuyInAppAudioChatScreen;