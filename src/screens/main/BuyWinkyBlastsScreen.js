import React, { useState } from 'react';
import {
    Image,
    Platform,
    StatusBar,
    Text,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import Carousel from 'react-native-snap-carousel';
import StyledPageControl from '../../components/StyledPageControl';

function BuyWinkyBlastsScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [packages, setPackages] = useState([
        { id: '0', label: '1 WinkyBlast', icon: require('../../../assets/images/ic_winky_one.png'), price: 2.99, height: 58 },
        { id: '1', label: '5 WinkyBlasts', icon: require('../../../assets/images/ic_winky_five.png'), price: 11.25, height: 81 },
        { id: '2', label: '15 WinkyBlasts', icon: require('../../../assets/images/ic_winky_fifteen.png'), price: 22.50, height: 135 },
        { id: '3', label: '25 WinkyBlasts', icon: require('../../../assets/images/ic_winky_twenty_five.png'), price: 31.25, height: 133 }])
    const [currentPackageIndex, setCurrentPackageIndex] = useState(0)
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onBuyNowPress = () => navigation.push('CheckOut')
    const PackageItem = ({ item, index }) => {
        return (
            <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 60, aspectRatio: 1.5, borderRadius: 12, backgroundColor: Constants.COLOR.WHITE, alignItems: 'center', justifyContent: 'center' }} >
                <Image style={{ height: item.height, resizeMode: 'contain' }} source={item.icon} />
                <Text style={{ marginLeft: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.SECONDARY, fontSize: Constants.FONT_SIZE.FT34, fontWeight: '700', color: Constants.COLOR.BLACK }}>
                    {`${item.label}`}
                </Text>
            </View>
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
                {'WinkyBlasts'}
            </Text>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: Constants.LAYOUT.SCREEN_WIDTH }}>
                        <Carousel
                            layout={"default"}
                            data={packages}
                            containerCustomStyle={{}}
                            loop={true}
                            renderItem={PackageItem}
                            firstItem={0}
                            sliderWidth={Constants.LAYOUT.SCREEN_WIDTH}
                            itemWidth={Constants.LAYOUT.SCREEN_WIDTH - 60}
                            inactiveSlideOpacity={0.7}
                            inactiveSlideScale={0.9}
                            inactiveSlideShift={0}
                            onSnapToItem={index => setCurrentPackageIndex(index)} />
                    </View>
                    <StyledPageControl
                        containerStyle={{ marginTop: 60 }}
                        count={packages.length}
                        activeIndex={currentPackageIndex}
                        activeColor={Constants.COLOR.PRIMARY}
                        inactiveColor={Constants.COLOR.PRIMARY_02} />
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE }}>
                    {`Price:`}
                </Text>
                <Text style={{ marginTop: 6, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT25, color: Constants.COLOR.WHITE }}>
                    {`$${packages[currentPackageIndex].price}`}
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

export default BuyWinkyBlastsScreen;