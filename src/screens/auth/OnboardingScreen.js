import React, { useRef } from 'react';
import {
    Image,
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
import OnboardBenefitItem from '../../components/OnboardBenefitItem';
import FastImage from 'react-native-fast-image'

function OnboardingScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [page, setPage] = React.useState(0)
    const contentScrollViewRef = useRef()
    const onBackPress = () => navigation.pop()
    const onNextPress = () => {
        if (page === 5) {
            navigation.push('PickPlan')
        } else {
            contentScrollViewRef.current && contentScrollViewRef.current.scrollTo({ x: Constants.LAYOUT.SCREEN_WIDTH * (page + 1), y: 0, animated: true })
            setPage(page + 1)
        }
    }
    const onScroll = (event) => {
        setPage(Math.round(event.nativeEvent.contentOffset.x / Constants.LAYOUT.SCREEN_WIDTH))
    }
    const PageControl = ({ count }) => {
        const DotItem = ({ current, index }) => {
            return (
                <View style={{ marginStart: index == 0 ? 0 : 6, width: current ? 20 : 12, height: 8, borderRadius: 4, backgroundColor: current ? Constants.COLOR.WHITE : Constants.COLOR.GRAY }} />
            )
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {
                    [...Array(count).keys()].map((index) => <DotItem key={index.toString()} current={page == index} index={index} />)
                }
            </View>
        )
    }
    const OnboardItem = ({ title, subtitle, image, benefits }) => {
        return (
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {title}
                </Text>
                <ScrollView style={{ width: Constants.LAYOUT.SCREEN_WIDTH }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center', width: Constants.LAYOUT.SCREEN_WIDTH }}>

                    <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 235, marginTop: 20 }}>
                        <View style={{ opacity: 0.4, position: 'absolute', right: 0, top: 0, width: Constants.LAYOUT.SCREEN_WIDTH - 65, height: 230, borderRadius: 20, backgroundColor: Constants.COLOR.PRIMARY }} />
                        <FastImage
                            style={{ position: 'absolute', left: 0, bottom: 0, width: Constants.LAYOUT.SCREEN_WIDTH - 65, height: 230, borderRadius: 20, borderWidth: 2, borderColor: Constants.COLOR.PRIMARY, }} source={image}
                            resizeMode={FastImage.resizeMode.cover} />
                    </View>
                    <Text style={{ marginTop: 40, marginBottom: 22, alignSelf: 'flex-start', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                        {subtitle}
                    </Text>
                    {
                        benefits.map((value, index) =>
                            <OnboardBenefitItem
                                key={index.toString()}
                                containerStyle={{ marginTop: 18, alignSelf: 'flex-start' }}
                                text={value} />)
                    }
                </ScrollView>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <ScrollView ref={contentScrollViewRef} scrollEventThrottle={16} onScroll={onScroll} horizontal bounces={false} pagingEnabled showsHorizontalScrollIndicator={false} style={{ flex: 1 }} >
                    <OnboardItem
                        title={"WinkyBlasts"}
                        subtitle={"Give yourself the advantage of instant visibility by using WinkyBlasts."}
                        image={require('../../../assets/images/img_winky_blasts.jpg')}
                        benefits={[
                            "WinkyBlasts allow you to fast-track into another member's inbox without matching.",
                            "The recipient of the “WinkyBlast” still has to “swipe right”/match with you before you are able to chat with them.",
                            "Bundles are available at a lower cost through our in-app store.",
                            "Available on Plus and Premium memberships only."
                        ]} />
                    <OnboardItem
                        title={"WinkyBadge"}
                        subtitle={"Expand your reach and gain the advantage of matching with more members by activating your WinkyBadge."}
                        image={require('../../../assets/images/img_winky_badge.png')}
                        benefits={[
                            "This badge let's other members get to you quickly by sponsoring them to fast-track into your inbox even if they don't have blasts of their own.",
                            "You can activate or deactivate your badge at any time.",
                            "Available on Plus and Premium memberships only."
                        ]} />
                    <OnboardItem
                        title={"Virtual Dates"}
                        subtitle={"Get to know someone better through our “Virtual Date” feature:"}
                        image={require('../../../assets/images/img_virtual_dates.jpg')}
                        benefits={[
                            "Schedule a “video date” at your convenience through our app without having to give out your personal information (i.e., phone number).",
                            "By purchasing and scheduling our in app live stream video date, you can avoid the awkwardness of meeting blindly in person.",
                            "You can choose between a 30-minute to 60-minute live stream video sessions.",
                            "Available on Plus and Premium memberships only."
                        ]} />
                    <OnboardItem
                        title={"WinkBlinking"}
                        subtitle={"Meet more people you otherwise wouldn't meet through our in-app virtual speed dating sessions:"}
                        image={require('../../../assets/images/img_wink_blinking.jpg')}
                        benefits={[
                            "Enhance your virtual dating experience by participating in our in-app live stream video speed dating sessions.",
                            "Sessions will be held up to twice a month (where available).",
                            "Talk for up to 2 minutes per person.",
                            "Available on Plus and Premium memberships only."
                        ]} />
                    <OnboardItem
                        title={"Additional Features"}
                        subtitle={"Get more out of your virtual dating experience by using our in-app features:"}
                        image={require('../../../assets/images/img_in_app_features.jpg')}
                        benefits={[
                            "Flex GPS: Allows you to set your location parameters as close or as far as you would like from your home.",
                            "Ghost Mode: Allows you to hide yourself while searching for potential matches. Only those you swipe right on or blast will have visibility to your profile.",
                            "Travel Mode: Allows you to view potential matches while you are out of town.",
                            "All In-App features are available on Plus and Premium memberships only."
                        ]} />
                    <OnboardItem
                        title={"Flashing Violations"}
                        subtitle={"Avoid unsolicited nudity through our Flashing Violations:"}
                        image={require('../../../assets/images/img_flashing_violations.jpeg')}
                        benefits={[
                            "Any member who sends an unsolicited nude or profane image via text or video can be reported anytime at your discretion.",
                            "Members who violate this policy more than once will be subject to permanent removal from the app.",
                            "Available on Plus and Premium memberships only.",
                        ]} />
                </ScrollView>
                <View style={{ width: '100%', backgroundColor: Constants.COLOR.TRANSPARENT, paddingBottom: insets.bottom + 24, paddingHorizontal: 0, alignItems: 'center' }} >
                    <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 0 }}>
                        {/* <PageControl
                            page={page}
                            count={6} /> */}
                        <StyledButton
                            // containerStyle={{ width: 174 }}
                            textStyle={{}}
                            title={"NEXT"}
                            onPress={onNextPress} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default OnboardingScreen;