import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import AuthContext from '../../common/Auth';

function StartScreen({ navigation }) {
    const LOGO_WIDTH = 173
    const LOGO_HEIGHT = 135
    const WINKY_WIDTH = 82
    const WINKY_HEIGHT = 37
    const BLINK_WIDTH = 93
    const BLINK_HEIGHT = 37
    const insets = useSafeAreaInsets()
    const onRegisterPress = () => navigation.push('Welcome')
    const onSignInPress = () => navigation.push('LogIn')
    const position1 = useRef(new Animated.ValueXY({ x: (Constants.LAYOUT.SCREEN_WIDTH - LOGO_WIDTH) / 2.0, y: -LOGO_HEIGHT })).current;
    const position2 = useRef(new Animated.ValueXY({ x: -WINKY_WIDTH, y: 400 })).current;
    const position3 = useRef(new Animated.ValueXY({ x: Constants.LAYOUT.SCREEN_WIDTH, y: 400 })).current;
    const position4 = useRef(new Animated.ValueXY({ x: 0, y: -200 })).current;
    useEffect(() => {
        setTimeout(() => {
            startLogoAnimation()
        }, 100)
        setTimeout(() => {
            startButtonAnimation()
        }, 1200)
        return () => { };
    }, []);
    const startLogoAnimation = () => {
        Animated.timing(position1, {
            toValue: { x: (Constants.LAYOUT.SCREEN_WIDTH - LOGO_WIDTH) / 2.0, y: 300 },
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(position2, {
            toValue: { x: (Constants.LAYOUT.SCREEN_WIDTH - LOGO_WIDTH) / 2.0 + 6, y: 300 + LOGO_HEIGHT + 8 },
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(position3, {
            toValue: { x: (Constants.LAYOUT.SCREEN_WIDTH - LOGO_WIDTH) / 2.0 + WINKY_WIDTH + 11, y: 300 + LOGO_HEIGHT + 8 },
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };
    const startButtonAnimation = () => {
        Animated.timing(position4, {
            toValue: { x: 0, y: 40 },
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: insets.bottom + 24, marginTop: 0 }}>
                <Animated.View style={[{ position: 'absolute', left: position1.x, top: position1.y, width: LOGO_WIDTH, height: LOGO_HEIGHT }]}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../../../assets/images/ic_splash_blink_logo.png')} />
                </Animated.View>
                <Animated.View style={[{ position: 'absolute', left: position2.x, top: position2.y, width: WINKY_WIDTH, height: WINKY_HEIGHT }]}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../../../assets/images/ic_winky.png')} />
                </Animated.View>
                <Animated.View style={[{ position: 'absolute', left: position3.x, top: position3.y, width: BLINK_WIDTH, height: BLINK_HEIGHT }]}>
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('../../../assets/images/ic_blinky.png')} />
                </Animated.View>
                <Animated.View style={[{ position: 'absolute', left: position4.x, bottom: position4.y, width: Constants.LAYOUT.SCREEN_WIDTH, alignItems: 'center' }]}>
                    <StyledButton
                        containerStyle={{}}
                        textStyle={{}}
                        title={"I WANT TO REGISTER"}
                        onPress={onRegisterPress} />
                    <Text style={{ marginTop: 24, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE }}>
                        {"Already have an account?"}
                        <Text onPress={onSignInPress} style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT25, color: Constants.COLOR.PRIMARY }}>
                            {" Sign In"}
                        </Text>
                    </Text>
                </Animated.View>
            </View>
        </View>
    )
}

export default StartScreen;