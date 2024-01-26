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

function AboutScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const content = "WinkyBlinkTM has been designed to optimize and enhance your virtual dating experience without all of the nonsense you deal with on other dating apps. \n\n Everything from our three-level verification process, and our compatibility algorithm to our” Virtual Dates” has been set into place to keep your online dating experience seamless, safe, and successful. Our cutting-edge safety features have been put into place that ensure your privacy/safety, and that you are respected while using our app. \n\n For more information about how we use your data and other user polices, feel free to review our Privacy Policy and our Terms and Conditions. \n\n Thank you for letting WinkyBlinkTM be an integral part of your online dating experience!"
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Image style={{ marginTop: 45, alignSelf: 'center', width: 141, height: 135, resizeMode: 'contain' }} source={require('../../../assets/images/ic_main_logo.png')} />
            <View style={{ flex: 1, marginTop: 40, alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <ScrollView style={{ width: Constants.LAYOUT.SCREEN_WIDTH }} contentContainerStyle={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 0, flexDirection: "row", flexWrap: "wrap", width: Constants.LAYOUT.SCREEN_WIDTH - 50 }}>
                        {
                            content.split(" ").map((word, index) => {
                                if (word == "WinkyBlinkTM") {
                                    return (
                                        <View key={index.toString()} style={{ flexDirection: 'row' }}>
                                            <Text style={{ lineHeight: 26, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                                                {"WinkyBlink"}
                                            </Text>
                                            <Text style={{ lineHeight: 18, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}>
                                                {"TM"}
                                            </Text>
                                            <Text style={{ lineHeight: 26, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                                                {" "}
                                            </Text>
                                        </View>
                                    )
                                } else if (word.includes("\n\n")) {
                                    return (
                                        <View key={index.toString()} style={{ width: '100%', height: 28 }} />
                                    )
                                } else {
                                    return (
                                        <Text key={index.toString()} style={{ lineHeight: 26, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                                            {word}{(index == content.split(" ").length - 1 || content.split(" ")[index + 1] == "\n\n") ? "" : " "}
                                        </Text>
                                    )
                                }
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default AboutScreen;