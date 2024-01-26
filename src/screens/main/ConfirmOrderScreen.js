import React from 'react';
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
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import StyledButton from '../../components/StyledButton';

function ConfirmOrderScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onContinuePress = () => navigation.popToTop()
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ backgroundColor: Constants.COLOR.WHITE, borderRadius: 12, width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 200, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ position: 'absolute', top: -30, width: 74, height: 58, resizeMode: 'contain' }} source={require('../../../assets/images/ic_logo_membership.png')} />
                        <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                            {`Thank you for your purchase.`}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"CONTINUE"}
                    onPress={onContinuePress} />
            </View>
        </View>
    )
}

export default ConfirmOrderScreen;