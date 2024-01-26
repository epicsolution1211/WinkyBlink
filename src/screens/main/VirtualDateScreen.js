import React from 'react';
import {
    Platform,
    StatusBar,
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function VirtualDateScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <View style={{ flex: 1 }}>
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: '100%' }}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../../assets/images/img_demo_user.png')} />
                    <TouchableOpacity onPress={() => navigation.push('User', {})} style={{ width: Constants.LAYOUT.SCREEN_WIDTH, position: 'absolute', top: 20, paddingLeft: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                                {`James`}
                            </Text>
                            <Image style={{ marginLeft: 15, width: 12, height: 20, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_white.png')} />
                        </View>
                        <Text style={{ marginTop: 4, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                            {`16 miles away`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: 'absolute', right: 25, bottom: insets.bottom + 90, width: 115, height: 145, borderRadius: 10, overflow: 'hidden' }}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../../assets/images/img_demo_profile.png')} />
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', alignSelf: 'center', bottom: insets.bottom, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: 74, height: 58, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: Constants.COLOR.GRAY_DARK }}>
                            <Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../../../assets/images/ic_close_white.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 20 }}>
                            <Image style={{ width: 74, height: 58, resizeMode: 'contain' }} source={require('../../../assets/images/ic_logo_membership.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default VirtualDateScreen;