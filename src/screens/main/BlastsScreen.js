import React, { useState,useEffect } from 'react';
import {
    FlatList,
    Platform,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import BlastItem from '../../components/BlastItem';
import { Switch } from 'react-native-switch';
import ActivateModal from '../../components/ActivateModal';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

function BlastsScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [winkyBadgeActivated, setWinkyBadgeActivated] = useState(false)
    const [visibleActivateModal, setVisibleActivateModal] = useState(false)
    const [blasts, setBlasts] = useState([])
    const [winkyblastscount, setwinkyblastscount] = useState(0);
    const [limit, setLimit] = useState(10);
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onRefresh = () => { }
    const onBuyPress = () => navigation.navigate('TabStore')
    const onActivatePress = () => {
        setVisibleActivateModal(true)
    };
    const onViewMorePress = () => { 
        console.log(limit);
        // limit = limit +10;
        // setLimit(prevLimit => prevLimit + 10);
        console.log(limit);
        loadblasts(limit);
     }

    useFocusEffect(
        React.useCallback(() => {
          loadAboutMe();
          return () => {
          };
        }, [])
    );
    
    // useFocusEffect(
    //     React.useCallback(() => {
    //         setLimit(10);
    //       return () => {
    //       };
    //     }, [])
    // );
    useFocusEffect(
        React.useCallback(() => {
            loadblasts(limit);
          return () => {
          };
        }, [])
    );

    const loadAboutMe = async () => {
        
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setwinkyblastscount(parseInt(response.data.user.winkyblasts_count)),
            setWinkyBadgeActivated(parseInt(response.data.user.is_winky_badge_enabled)===1)
            setLoading(false)
            // setLoaded(true)
            // console.log(response.data.user.is_winky_badge_enabled);
        } catch (error) {
            // console.log('load_profile', error)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const winkybadgee_disable = async (value)=>{
        try{
            var parameters = {
                'is_winky_badge_enabled': value
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            setLoading(true)
            const response = await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            // console.log(response.data)
            setLoading(false)
        }catch(error){
            // console.log('winky_badge_disable', error)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const loadblasts = async (limit) =>{
        try {
            setLoading(true)
            console.log("limit nu", limit)
            const response = await axios.get(`apis/load_blasts/${limit}`,{ 
                headers: {
                    'Auth-Token': global.token
                }
            });
            setBlasts(response.data.blasts);
            console.log('load_blasts_success', response.data)
            setLoading(false)
        } catch (error) {
            console.log('load_blasts', error)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visibleActivateModal &&
                <ActivateModal
                    insets={insets}
                    title={"WinkyBadge"}
                    content={"Blast Activate now or at any time in your settings."}
                    onClosePress={() => {
                        setVisibleActivateModal(false)
                    }}
                    onActivatePress={() => {
                        setVisibleActivateModal(false)
                        setWinkyBadgeActivated(true)
                        winkybadgee_disable(1);
                    }}
                />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                    {'WinkyBadge'}
                </Text>
                <View style={{ marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 25, height: 27, resizeMode: 'contain' }} source={require('../../../assets/images/ic_winky_profile.png')} />
                    <Image style={{ position: 'absolute', alignSelf: 'center', width: 24, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_winky_premium.png')} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Switch
                        value={winkyBadgeActivated}
                        onValueChange={(val) => {
                            if (val) {
                                onActivatePress()
                            } else {
                                setWinkyBadgeActivated(false)
                                winkybadgee_disable(val)
                            }
                        }}
                        disabled={false}
                        activeText={''}
                        inActiveText={''}
                        circleSize={16}
                        barHeight={24}
                        circleBorderWidth={0}
                        backgroundActive={Constants.COLOR.PRIMARY}
                        backgroundInactive={Constants.COLOR.GRAY_LIGHT}
                        circleActiveColor={Constants.COLOR.WHITE}
                        circleInActiveColor={Constants.COLOR.WHITE}
                        renderInsideCircle={() => <View />} // custom component to render inside the Switch circle (Text, Image, etc.)
                        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                        outerCircleStyle={{}} // style for outer animated circle
                        renderActiveText={false}
                        renderInActiveText={false}
                        switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        switchWidthMultiplier={2.6} // multiplied by the `circleSize` prop to calculate total width of the Switch
                        switchBorderRadius={12} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    />
                </View>
            </View>
            <View style={{ marginHorizontal: 20, opacity: 0.1, height: 1, backgroundColor: Constants.COLOR.BLACK }} />
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                {'WinkyBlasts'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Constants.COLOR.BLUE_DIFF, paddingHorizontal: 20, paddingVertical: 10 }}>
                <Image style={{ width: 53, height: 48, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_wish_list.png')} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.GRAY }}>
                        {'Remaining'}
                    </Text>
                    <Text style={{ marginTop: 6, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                        {winkyblastscount}
                    </Text>
                </View>
                <StyledButton
                    containerStyle={{ width: 110, height: 34, paddingHorizontal: 10 }}
                    textStyle={{ fontSize: Constants.FONT_SIZE.FT16 }}
                    title={"BUY MORE"}
                    onPress={onBuyPress} />
            </View>
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                {'Blasts Received'}
            </Text>
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + Constants.LAYOUT.BOTTOM_BAR_HEIGHT }}
                data={blasts}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 0, backgroundColor: Constants.COLOR.BLACK }} />}
                renderItem={({ item, index }) =>
                    <BlastItem
                        item={item}
                        index={index}
                        layout={'big'}
                        onUserPress={() => navigation.push('User', {id:item.user_id})}
                        onBlastPress={() => { }} />}
                keyExtractor={item => item.id}
                ListFooterComponent={() => (
                    <View style={{ paddingTop: 10, paddingBottom: 20, alignItems: 'center' }}>
                        <TouchableOpacity onPress={onViewMorePress}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.GRAY }}>
                                {'View More'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}

export default BlastsScreen;