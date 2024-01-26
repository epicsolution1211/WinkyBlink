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

function BuyVirtualDatesScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onBuyNowPress = () => navigation.push('CheckOut')
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Image style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: (320 / 480) * Constants.LAYOUT.SCREEN_WIDTH, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} source={require('../../../assets/images/img_virtual_dates.jpg')} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <View style={{ flex: 1, paddingTop: 30, width: Constants.LAYOUT.SCREEN_WIDTH, paddingHorizontal: 30 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={{ alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {'Virtual Dates'}
                        </Text>
                        <Text style={{ marginTop: 25, textAlign: 'center', alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"Enhance your online dating experience by purchasing a live stream video dating session today.\nLeverage our in-app technology to get to know your future dates better."}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY }} />
                <StyledButton
                    containerStyle={{ marginTop: 30, height: 77 }}
                    textStyle={{}}
                    title={"BUY A 30-MINUTE\nSESSION: $14.99"}
                    onPress={onBuyNowPress} />
                <StyledButton
                    containerStyle={{ marginTop: 20, height: 77 }}
                    textStyle={{}}
                    title={"BUY A 60-MINUTE\nSESSION: $29.99"}
                    onPress={onBuyNowPress} />
            </View>
        </View>
    )
}

export default BuyVirtualDatesScreen;