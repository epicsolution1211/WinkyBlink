import React from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StoreScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const items = [
        { title: "WinkyBlasts", target: "BuyWinkyBlasts" },
        { title: "In-App Audio Chat", target: "BuyInAppAudioChat" },
        { title: "Virtual Dates", target: "BuyVirtualDates" },
        { title: "WinkBlinking", target: "BuyWinkBlinking" },
        // { title: "Flex GPS Mode", target: "BuyFlexGPSMode" },
        { title: "Travel Mode", target: "BuyTravelMode" },
        { title: "Ghost Mode", target: "BuyGhostMode" },
    ]
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const StoreItem = ({ item, index, onPress }) => {
        return (
            <TouchableOpacity onPress={onPress} key={index.toString()} style={{ marginTop: 8, height: 70, width: Constants.LAYOUT.SCREEN_WIDTH, backgroundColor: Constants.COLOR.WHITE, flexDirection: 'row', paddingHorizontal: 30, alignItems: 'center', justifyContent: 'space-between' }} >
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                    {item.title}
                </Text>
                <TouchableOpacity onPress={onPress}>
                    <Image style={{ width: 8, height: 14, resizeMode: 'contain' }} source={require('../../../assets/images/ic_right_arrow.png')} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginLeft: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {'Winky Store'}
            </Text>
            <Text style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE_08 }}>
                {'Select features you would like to purchase'}
            </Text>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + Constants.LAYOUT.BOTTOM_BAR_HEIGHT }}>
                    {
                        items.map((item, index) =>
                            <StoreItem
                                key={index.toString()}
                                index={index}
                                item={item}
                                onPress={() => navigation.push(item.target)} />
                        )
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default StoreScreen;