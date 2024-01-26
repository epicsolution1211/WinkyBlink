import React from 'react';
import {
    Platform,
    StatusBar,
    View,
    Image,
    TouchableOpacity,
    Text,
    ImageBackground
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';

function WinkyBlinkingsScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onStartPress = () => navigation.push('WinkyBlinking')
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 30 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE, textAlign: 'center' }}>
                        {"Your next WinkyBlinking Session will be in:"}
                    </Text>
                    <View style={{ alignSelf: 'center', marginTop: 34 }}>
                        <Image style={{ width: 182, height: 77, resizeMode: 'contain' }} source={require('../../../assets/images/ic_countdown.png')} />
                        <View style={{ position: 'absolute', top: 0, width: 182 }}>
                            <View style={{ width: 82, height: 77, position: 'absolute', left: 0, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.CLOCK, fontSize: 70, color: Constants.COLOR.WHITE }}>
                                    {"01"}
                                </Text>
                            </View>
                            <View style={{ width: 82, height: 77, position: 'absolute', right: 0, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.CLOCK, fontSize: 70, color: Constants.COLOR.WHITE }}>
                                    {"06"}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.WHITE, width: 82, textAlign: 'center' }}>
                                {"Days"}
                            </Text>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.WHITE, width: 82, textAlign: 'center' }}>
                                {"Hours"}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"START WINKBLINKING"}
                    onPress={onStartPress} />
            </View>
        </View>
    )
}

export default WinkyBlinkingsScreen;