import React from 'react';
import {
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

function WelcomeScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const onNextPress = () => navigation.push("Register")
    const onBackPress = () => navigation.pop()
    const content = "Welcome to WinkyBlinkTM , where our primary goal is to keep your online dating experience seamless and safe. No more catfish or having to worry about weeding through a bunch of undesirables. \n\n Everything from our proprietary verification and matching process, to our “WinkyBadge”, “Virtual Dates”, and “WinkBlinking”, have been set into place to help connect you with real people; like yourself, that share the same interests, and relationship goals. \n\n Be sure to read through our “In-App Features” pages to learn more about the many features that make WinkyBlinkTM unique. \n\n HappyDating!"
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 25, paddingBottom: 20 }}>
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
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"NEXT"}
                    onPress={onNextPress} />
            </View >
        </View >
    )
}

export default WelcomeScreen;