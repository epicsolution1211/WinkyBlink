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
            })
            console.log(response.data.user.preferences.distance_min)
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
            setLoading(false)
            setLoaded(true)
            console.log(flexGPSRange);
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
                            <FeatureItem item={{ title: 'Ghost Mode', value: ghostModeEnabled }} onValueChange={(value) => setGhostModeEnabled(value)} />
                            <FeatureItem item={{ title: 'Travel Mode', value: travelModeEnabled }} onValueChange={(value) => setTravelModeEnabled(value)} />
                            <FeatureItem item={{ title: 'Display Winky Badge', value: winkyBadgeEnabled }} onValueChange={(value) => setWinkyBadgeEnabled(value)} />
                        </View>
                        <Text style={{ alignSelf: 'flex-start', marginStart: 20, marginTop: 40, marginBottom: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {'Notifications'}
                        </Text>
                        <View>
                            <FeatureItem item={{ title: 'Promotional', value: promotionalNotificationEnabled }} onValueChange={(value) => setPromotionalNotificationEnabled(value)} />
                            <FeatureItem item={{ title: 'Message Notification', value: messageNotificationEnabled }} onValueChange={(value) => setMessageNotificationEnabled(value)} />
                            <FeatureItem item={{ title: 'WinkyBlasts', value: winkyBlastsNotificationEnabled }} onValueChange={(value) => setWinkyBlastsNotificationEnabled(value)} />
                            <FeatureItem item={{ title: 'Speed Dating', value: speedDatingNotificationEnabled }} onValueChange={(value) => setSpeedDatingNotificationEnabled(value)} />
                            <FeatureItem item={{ title: 'Virtual Dates', value: virtualDateNotificationEnabled }} onValueChange={(value) => setVirtualDateNotificationEnabled(value)} />
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