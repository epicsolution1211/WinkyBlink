import React, { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { presentToastMessage } from '../../common/Functions';
import FeatureItem from '../../components/FeatureItem';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

function FeatureSettingsScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [flexGPSRange, setFlexGPSRange] = useState({ low: 0, high : 100 })
    const [flexGPSEnabled, setFlexGPSEnabled] = useState(false)
    const [ghostModeEnabled, setGhostModeEnabled] = useState(false)
    const [travelModeEnabled, setTravelModeEnabled] = useState(false)
    const [winkyBadgeEnabled, setWinkyBadgeEnabled] = useState(false)
    const [promotionalNotificationEnabled, setPromotionalNotificationEnabled] = useState(false)
    const [messageNotificationEnabled, setMessageNotificationEnabled] = useState(false)
    const [winkyBlastsNotificationEnabled, setWinkyBlastsNotificationEnabled] = useState(false)
    const [speedDatingNotificationEnabled, setSpeedDatingNotificationEnabled] = useState(false)
    const [virtualDateNotificationEnabled, setVirtualDateNotificationEnabled] = useState(false)
    const [subscribedplan,setSubscribedplan] = useState('');
    const [audiochatsubscribeddate,setAudiochatsubscribeddate] = useState('');
    const [winkyblinksubscribeddate,setWinkyblinksubscribeddate] = useState('');
    const [travelmodesubscribeddate,setTravelmodesubscribeddate] = useState('');
    const [ghostmodesubscribeddate, setGhostmodeSubscribeddate] = useState('');
    const [currentdate,setCurrentdate] = useState('');

    // useEffect(() => {
    //     loadFeatureSettings()
    //     return () => { }
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadFeatureSettings()
          return () => {
          };
        }, [])
    );


    const loadFeatureSettings = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            });
            
            setFlexGPSRange({ low: parseInt(response.data.user.preferences.distance_min), high: parseInt(response.data.user.preferences.distance_max) })
            setFlexGPSEnabled(response.data.user.is_flex_gps_enabled === '1')
            setGhostModeEnabled(response.data.user.is_ghost_mode_enabled === '1')
            setTravelModeEnabled(response.data.user.is_travel_mode_enabled === '1')
            setWinkyBadgeEnabled(response.data.user.is_winky_badge_enabled === '1')
            setPromotionalNotificationEnabled(response.data.user.is_notification_promotional_enabled === '1')
            setMessageNotificationEnabled(response.data.user.is_notification_message_enabled === '1')
            setWinkyBlastsNotificationEnabled(response.data.user.is_notification_winkyblasts_enabled === '1')
            setSpeedDatingNotificationEnabled(response.data.user.is_notification_speed_dating_enabled === '1')
            setVirtualDateNotificationEnabled(response.data.user.is_notification_virtual_dates_enabled === '1')
            setSubscribedplan(response.data.user.subscribed_plan)
            setCurrentdate(response.data.user.current_date);
            setTravelmodesubscribeddate(response.data.user.travel_mode_subscribed_date);
            setWinkyblinksubscribeddate(response.data.user.subscribed_date);
            setGhostmodeSubscribeddate(response.data.user.ghost_mode_subscribed_date);

            setLoading(false)
            setLoaded(true)
        } catch (error) {
            console.log('load_profile', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onUpdatePress = async () => {
        try {
            var parameters = {
                'is_ghost_mode_enabled': ghostModeEnabled ? '1' : '0',
                'is_travel_mode_enabled': travelModeEnabled ? '1' : '0',
                'is_winky_badge_enabled': winkyBadgeEnabled ? '1' : '0',
                'is_notification_promotional_enabled': promotionalNotificationEnabled ? '1' : '0',
                'is_notification_message_enabled': messageNotificationEnabled ? '1' : '0',
                'is_notification_winkyblasts_enabled': winkyBlastsNotificationEnabled ? '1' : '0',
                'is_notification_speed_dating_enabled': speedDatingNotificationEnabled ? '1' : '0',
                'is_notification_virtual_dates_enabled': virtualDateNotificationEnabled ? '1' : '0',
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            setLoading(true)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })

            const result =  await axios.post('apis/set_user_preferences/',
                {
                    'distance_min': flexGPSRange['low'],
                    'distance_max': flexGPSRange['high'],
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            console.log(result.data);
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your feature settings." })
        } catch (error) {
            console.log(error)
            console.log('update_user + set_user_preferences', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
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
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {loaded ? 'Feature Settings' : 'Feature Settings'}
            </Text>
            {
                loaded &&
                <View style={{ flex: 1, alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                    <ScrollView style={{ width: Constants.LAYOUT.SCREEN_WIDTH }} contentContainerStyle={{ alignItems: 'center', paddingTop: 25 }}>
                        <View>
                            {
                                !flexGPSEnabled &&
                                <FeatureItem item={{ title: 'Flex GPS', value: flexGPSRange }} onValueChange={({high,low}) => { setFlexGPSRange({high,low }) }}/>
                            }
                            <FeatureItem 
                                item={{ title: 'Ghost Mode', value: ghostModeEnabled }} 
                                onValueChange={
                                    (value) => {                                    
                                        if(subscribedplan=='Basic'){
                                            presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                        }else if(subscribedplan=='Plus' && moment(currentdate,'YYYY-MM-DD').isAfter(moment(ghostmodesubscribeddate,'YYYY-MM-DD').add(1, 'months'))){
                                            presentToastMessage({ type: 'success', position: 'top', message: "Please buy ghost mode in store" })
                                        }else if(subscribedplan == 'Premium'){
                                            setGhostModeEnabled(value)
                                        }
                                    }
                                }
                            />
                            <FeatureItem 
                                item={{ title: 'Travel Mode', value: travelModeEnabled }} 
                                onValueChange={
                                    (value) => {
                                        if(subscribedplan=='Basic'){
                                            presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                        }else if(subscribedplan=='Plus' && moment(currentdate,'YYYY-MM-DD').isAfter(moment(travelmodesubscribeddate,'YYYY-MM-DD').add(1, 'months'))){
                                            presentToastMessage({ type: 'success', position: 'top', message: "Please buy ghost mode in store" })
                                        }else if(subscribedplan == 'Premium'){
                                            setTravelModeEnabled(value)
                                        }
                                    }
                                } 
                            />
                            <FeatureItem 
                                item={{ title: 'Display Winky Badge', value: winkyBadgeEnabled }} 
                                onValueChange={
                                    (value) => {
                                        if(subscribedplan=='Basic'){
                                            presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                        }else {
                                            setWinkyBadgeEnabled(value)
                                        }
                                    }
                                } 
                            />
                        </View>
                        <Text style={{ alignSelf: 'flex-start', marginStart: 20, marginTop: 40, marginBottom: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {'Notifications'}
                        </Text>
                        <View>
                            <FeatureItem 
                                item={{ title: 'Promotional', value: promotionalNotificationEnabled }} 
                                onValueChange={(value) => setPromotionalNotificationEnabled(value)} />
                            <FeatureItem 
                                item={{ title: 'Message Notification', value: messageNotificationEnabled }} 
                                onValueChange={(value) => {
                                    if(subscribedplan=='Basic'){
                                        presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                    }else{
                                        setMessageNotificationEnabled(value)
                                    }
                                    }} />
                            <FeatureItem 
                                item={{ title: 'WinkyBlasts', value: winkyBlastsNotificationEnabled }} 
                                onValueChange={(value) => {
                                    if(subscribedplan=='Basic'){
                                        presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                    }else{
                                        setWinkyBlastsNotificationEnabled(value)
                                    }
                                    }} />
                            <FeatureItem 
                                item={{ title: 'Speed Dating', value: speedDatingNotificationEnabled }} 
                                onValueChange={(value) => {
                                    if(subscribedplan=='Basic'){
                                        presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                    }else{
                                        setSpeedDatingNotificationEnabled(value)
                                    }
                                    }} />
                            <FeatureItem 
                                item={{ title: 'Virtual Dates', value: virtualDateNotificationEnabled }} 
                                onValueChange={(value) => {
                                    if(subscribedplan=='Basic'){
                                        presentToastMessage({ type: 'success', position: 'top', message: "You can't enable this feature in plan you selected." })
                                    }else{
                                        setVirtualDateNotificationEnabled(value)
                                    }
                                }} />
                        </View>
                        <StyledButton
                            containerStyle={{ marginTop: 30, alignSelf: 'center' }}
                            textStyle={{}}
                            title={"UPDATE"}
                            onPress={onUpdatePress} />
                    </ScrollView>
                </View>
            }
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default FeatureSettingsScreen;