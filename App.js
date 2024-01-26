import React, { useEffect, useMemo, useReducer, useState } from 'react';
import {
    StatusBar,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    Platform,
    NativeEventEmitter,
} from 'react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import auth from "@react-native-firebase/auth";

import AuthContext from './src/common/Auth';
import ToastConfig from './src/common/ToastConfig';
import Constants from './src/common/Constants';
import { Base64, calculateAge, getS3StorageURL, presentToastMessage } from './src/common/Functions';
import {
    NavigationContainer,
    getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import HomeScreen from './src/screens/main/HomeScreen';
import StoreScreen from './src/screens/main/StoreScreen';
import WinkyBlinkingScreen from './src/screens/main/WinkyBlinkingScreen.js';
import SwipeScreen from './src/screens/main/SwipeScreen';
import SplashScreen from './src/screens/auth/SplashScreen';
import LogInScreen from './src/screens/auth/LogInScreen';
import AuthScreen from './src/screens/auth/AuthScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import StartScreen from './src/screens/auth/StartScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import AddPhoneScreen from './src/screens/auth/AddPhoneScreen';
import VerificationScreen from './src/screens/auth/VerificationScreen';
import CreatePasswordScreen from './src/screens/auth/CreatePasswordScreen';
import AddBasicInformationScreen from './src/screens/auth/AddBasicInformationScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import PickPlanScreen from './src/screens/auth/PickPlanScreen';
import PlanDetailScreen from './src/screens/auth/PlanDetailScreen';
import CreateProfileScreen from './src/screens/auth/CreateProfileScreen';
import PrivacyPolicyScreen from './src/screens/auth/PrivacyPolicyScreen';
import AboutMeScreen from './src/screens/auth/AboutMeScreen';
import MyPreferencesScreen from './src/screens/auth/MyPreferencesScreen';
import TermsOfConditionsScreen from './src/screens/auth/TermsOfConditionsScreen';
import CompatibilityQuestionsScreen from './src/screens/main/CompatibilityQuestionsScreen';
import NotificationsScreen from './src/screens/main/NotificationsScreen';
import BlastsScreen from './src/screens/main/BlastsScreen';
import ConversationsScreen from './src/screens/main/ConversationsScreen';
import ConversationScreen from './src/screens/main/ConversationScreen';
import UserScreen from './src/screens/main/UserScreen';
import BuyWinkyBlastsScreen from './src/screens/main/BuyWinkyBlastsScreen';
import BuyFlexGPSModeScreen from './src/screens/main/BuyFlexGPSModeScreen';
import BuyVirtualDatesScreen from './src/screens/main/BuyVirtualDatesScreen';
import BuyWinkBlinkingScreen from './src/screens/main/BuyWinkBlinkingScreen';
import BuyInAppAudioChatScreen from './src/screens/main/BuyInAppAudioChatScreen';
import BuyTravelModeScreen from './src/screens/main/BuyTravelModeScreen';
import BuyGhostModeScreen from './src/screens/main/BuyGhostModeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import AccountSettingsScreen from './src/screens/main/AccountSettingsScreen';
import FeatureSettingsScreen from './src/screens/main/FeatureSettingsScreen';
import FaqsScreen from './src/screens/main/FaqsScreen';
import AboutScreen from './src/screens/main/AboutScreen';
import HelpScreen from './src/screens/main/HelpScreen';
import CheckOutScreen from './src/screens/main/CheckOutScreen';
import ConfirmOrderScreen from './src/screens/main/ConfirmOrderScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import ProfileDetailScreen from './src/screens/main/ProfileDetailScreen';
import MatchesScreen from './src/screens/main/MatchesScreen';
import WinkyBlinkingsScreen from './src/screens/main/WinkyBlinkingsScreen';
import VirtualDatesScreen from './src/screens/main/VirtualDatesScreen';
import VirtualDateScreen from './src/screens/main/VirtualDateScreen';
import ProfileAboutMeScreen from './src/screens/main/ProfileAboutMeScreen';
import ProfilePreferencesScreen from './src/screens/main/ProfilePreferencesScreen';
import ProfilePhotosScreen from './src/screens/main/ProfilePhotosScreen';
import ProfileVideosScreen from './src/screens/main/ProfileVideosScreen';
import ScheduleVirtualDateScreen from './src/screens/main/ScheduleVirtualDateWhenScreen';
import ScheduleVirtualDateOpponentScreen from './src/screens/main/ScheduleVirtualDateOpponentScreen';
import ScheduleVirtualDateWhenScreen from './src/screens/main/ScheduleVirtualDateWhenScreen';
import VirtualDatesRequestsScreen from './src/screens/main/VirtualDatesRequestsScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import AboutMeBioScreen from './src/screens/auth/AboutMeBioScreen';
import AboutMePhotoScreen from './src/screens/auth/AboutMePhotoScreen';
import CompleteProfileScreen from './src/screens/auth/CompleteProfileScreen';
import FastImage from 'react-native-fast-image';
import QB from 'quickblox-react-native-sdk';
// import { useFocusEffect } from '@react-navigation/native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import PushNotification from "react-native-push-notification";




if (Text.defaultProps == null) { Text.defaultProps = {} };
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) { TextInput.defaultProps = {} };
TextInput.defaultProps.allowFontScaling = false;

axios.defaults.baseURL = Constants.SERVER.URL + 'winkyblink/index.php/api_v1/';
axios.defaults.timeout = 6000;
axios.defaults.headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'X-API-KEY': 'CLOUDTENLABS_WANG',
    Authorization:
        'Basic ' +
        Base64({
            type: 'btoa',
            input: `${Constants.KEY.USER}:${Constants.KEY.PASSWORD}`,
        }),
};

global.token = null;

function TabHome() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen key={'Home'} name="Home" component={HomeScreen} />
            <Stack.Screen
                key={'Notifications'}
                name="Notifications"
                component={NotificationsScreen}
            />
            <Stack.Screen key={'User'} name="User" component={UserScreen} />
            <Stack.Screen key={'Matches'} name="Matches" component={MatchesScreen} />
            <Stack.Screen
                key={'Conversations'}
                name="Conversations"
                component={ConversationsScreen}
            />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function TabStore() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Store'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen key={'Store'} name="Store" component={StoreScreen} />
            <Stack.Screen
                key={'BuyWinkyBlasts'}
                name="BuyWinkyBlasts"
                component={BuyWinkyBlastsScreen}
            />
            <Stack.Screen
                key={'BuyFlexGPSMode'}
                name="BuyFlexGPSMode"
                component={BuyFlexGPSModeScreen}
            />
            <Stack.Screen
                key={'BuyVirtualDates'}
                name="BuyVirtualDates"
                component={BuyVirtualDatesScreen}
            />
            <Stack.Screen
                key={'BuyWinkBlinking'}
                name="BuyWinkBlinking"
                component={BuyWinkBlinkingScreen}
            />
            <Stack.Screen
                key={'BuyInAppAudioChat'}
                name="BuyInAppAudioChat"
                component={BuyInAppAudioChatScreen}
            />
            <Stack.Screen
                key={'BuyTravelMode'}
                name="BuyTravelMode"
                component={BuyTravelModeScreen}
            />
            <Stack.Screen
                key={'BuyGhostMode'}
                name="BuyGhostMode"
                component={BuyGhostModeScreen}
            />
            <Stack.Screen
                key={'CheckOut'}
                name="CheckOut"
                component={CheckOutScreen}
            />
        </Stack.Navigator>
    );
}

function TabBlasts() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Blasts'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen key={'Blasts'} name="Blasts" component={BlastsScreen} />
            <Stack.Screen key={'User'} name="User" component={UserScreen} />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function TabSwipe() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Swipe'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen key={'Swipe'} name="Swipe" component={SwipeScreen} />
            <Stack.Screen key={'User'} name="User" component={UserScreen} />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorConversations() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Conversations'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                key={'Conversations'}
                name="Conversations"
                component={ConversationsScreen}
            />
            <Stack.Screen key={'User'} name="User" component={UserScreen} />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorWinkyBlinkings() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'WinkyBlinkings'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                key={'WinkyBlinkings'}
                name="WinkyBlinkings"
                component={WinkyBlinkingsScreen}
            />
            <Stack.Screen
                key={'WinkyBlinking'}
                name="WinkyBlinking"
                component={WinkyBlinkingScreen}
            />
            <Stack.Screen key={'User'} name="User" component={UserScreen} />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorVirtualDates() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'VirtualDates'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                key={'VirtualDates'}
                name="VirtualDates"
                component={VirtualDatesScreen}
            />
            <Stack.Screen
                key={'VirtualDate'}
                name="VirtualDate"
                component={VirtualDateScreen}
            />
            <Stack.Screen
                key={'ScheduleVirtualDateWhen'}
                name="ScheduleVirtualDateWhen"
                component={ScheduleVirtualDateWhenScreen}
            />
            <Stack.Screen
                key={'ScheduleVirtualDateOpponent'}
                name="ScheduleVirtualDateOpponent"
                component={ScheduleVirtualDateOpponentScreen}
            />
            <Stack.Screen
                key={'VirtualDatesRequests'}
                name="VirtualDatesRequests"
                component={VirtualDatesRequestsScreen}
            />
            <Stack.Screen key={'User'} name="User" component={UserScreen} />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorCompatiblityQuestions() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'CompatibilityQuestions'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                key={'CompatibilityQuestions'}
                name="CompatibilityQuestions"
                component={CompatibilityQuestionsScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorHelp() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Help'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen key={'Help'} name="Help" component={HelpScreen} />
            <Stack.Screen
                key={'Conversation'}
                name="Conversation"
                component={ConversationScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorProfile() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Profile'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen key={'Profile'} name="Profile" component={ProfileScreen} />
            <Stack.Screen
                key={'ProfileDetail'}
                name="ProfileDetail"
                component={ProfileDetailScreen}
            />
            <Stack.Screen
                key={'ProfileAboutMe'}
                name="ProfileAboutMe"
                component={ProfileAboutMeScreen}
            />
            <Stack.Screen
                key={'ProfilePreferences'}
                name="ProfilePreferences"
                component={ProfilePreferencesScreen}
            />
            <Stack.Screen
                key={'ProfilePhotos'}
                name="ProfilePhotos"
                component={ProfilePhotosScreen}
            />
            <Stack.Screen
                key={'ProfileVideos'}
                name="ProfileVideos"
                component={ProfileVideosScreen}
            />
        </Stack.Navigator>
    );
}

function NavigatorTab() {
    const insets = useSafeAreaInsets();
    const Stack = createBottomTabNavigator();
    const TabBarItem = ({ navigation, target, icon, width, height, focused }) => {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                }}>
                <View style={{ height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(target);
                        }}
                        style={{
                            width: Constants.LAYOUT.SCREEN_WIDTH / 4,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{
                                    marginTop: 0,
                                    width: width,
                                    height: height,
                                    resizeMode: 'contain',
                                    tintColor:
                                        target != 'TabSwipe' && target != 'TabBlasts'
                                            ? 'rgba(61,60,61,1)'
                                            : null,
                                }}
                                source={icon}
                            />
                            <View
                                style={{
                                    marginTop: 5,
                                    width: 50,
                                    height: 5,
                                    borderRadius: 3,
                                    backgroundColor: focused
                                        ? Constants.COLOR.PRIMARY
                                        : Constants.COLOR.TRANSPARENT,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const getTabBarVisibility = (tab, route) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const screensWithTab = {
            TabHome: [undefined, 'Home'],
            TabStore: [undefined, 'Store'],
            TabBlasts: [undefined, 'Blasts'],
        };
        return screensWithTab[tab].indexOf(routeName) > -1;
    };
    return (
        <Stack.Navigator
            screenOptions={({ navigation, route }) => ({
                tabBarIcon: ({ focused }) => {
                    let icon;
                    if (route.name === 'TabHome') {
                        icon = !focused
                            ? require('./assets/images/ic_tab_home.png')
                            : require('./assets/images/ic_tab_home.png');
                    } else if (route.name === 'TabStore') {
                        icon = !focused
                            ? require('./assets/images/ic_tab_store.png')
                            : require('./assets/images/ic_tab_store.png');
                    } else if (route.name === 'TabBlasts') {
                        icon = !focused
                            ? require('./assets/images/ic_tab_blasts.png')
                            : require('./assets/images/ic_tab_blasts.png');
                    } else if (route.name === 'TabSwipe') {
                        icon = !focused
                            ? require('./assets/images/ic_tab_logo.png')
                            : require('./assets/images/ic_tab_logo.png');
                    }
                    switch (route.name) {
                        case 'TabHome':
                            return (
                                <TabBarItem
                                    navigation={navigation}
                                    target={'TabHome'}
                                    icon={icon}
                                    width={20}
                                    height={23}
                                    focused={focused}
                                />
                            )
                        case 'TabStore':
                            return (
                                <TabBarItem
                                    navigation={navigation}
                                    target={'TabStore'}
                                    icon={icon}
                                    width={25}
                                    height={23}
                                    focused={focused}
                                />
                            )
                        case 'TabBlasts':
                            return (
                                <TabBarItem
                                    navigation={navigation}
                                    target={'TabBlasts'}
                                    icon={icon}
                                    width={28}
                                    height={28}
                                    focused={focused}
                                />
                            )
                        case 'TabSwipe':
                            return (
                                <TabBarItem
                                    navigation={navigation}
                                    target={'TabSwipe'}
                                    icon={icon}
                                    width={26}
                                    height={21}
                                    focused={focused}
                                />
                            )
                        default:
                            return <View />
                    }
                },
                tabBarLabel: () => {
                    return null;
                },
            })}
            initialRouteName={'TabSwipe'}>
            <Stack.Screen
                name="TabHome"
                component={TabHome}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        left: 0,
                        bottom: 0,
                        borderTopWidth: 0,
                        backgroundColor: Constants.COLOR.BLUE_LIGHT,
                        display: getTabBarVisibility('TabHome', route) ? 'none' : 'none',
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: -3,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 4.59,
                            },
                            android: {
                                elevation: 5,
                            },
                        }),
                    },
                })}
            />
            <Stack.Screen
                name="TabStore"
                component={TabStore}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        left: 0,
                        bottom: 0,
                        borderTopWidth: 0,
                        backgroundColor: Constants.COLOR.BLACK,
                        display: getTabBarVisibility('TabStore', route) ? 'flex' : 'none',
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: -3,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 4.59,
                            },
                            android: {
                                elevation: 5,
                            },
                        }),
                    },
                })}
            />
            <Stack.Screen
                name="TabBlasts"
                component={TabBlasts}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        left: 0,
                        bottom: 0,
                        borderTopWidth: 0,
                        backgroundColor: Constants.COLOR.BLUE_LIGHT,
                        display: getTabBarVisibility('TabBlasts', route) ? 'flex' : 'none',
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: -3,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 4.59,
                            },
                            android: {
                                elevation: 5,
                            },
                        }),
                    },
                })}
            />
            <Stack.Screen
                name="TabSwipe"
                component={TabSwipe}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                        width: Constants.LAYOUT.SCREEN_WIDTH,
                        left: 0,
                        bottom: 0,
                        borderTopWidth: 0,
                        backgroundColor: Constants.COLOR.BLUE_LIGHT,
                        display: 'none',
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: -3,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 4.59,
                            },
                            android: {
                                elevation: 5,
                            },
                        }),
                    },
                })}
            />
        </Stack.Navigator>
    );
}

function NavigatorDrawer() {
    const { sessionClose } = React.useContext(AuthContext);
    const Stack = createDrawerNavigator();
    useEffect(() => {
        const emitter = new NativeEventEmitter(QB.chat);
        const newMessageEmitter = emitter.addListener(QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE, receivedNewMessage);
        // emitter.addListener(QB.chat.EVENT_TYPE.MESSAGE_DELIVERED, messageStatusHandler);
        // emitter.addListener(QB.chat.EVENT_TYPE.MESSAGE_READ, messageStatusHandler);
        // emitter.addListener(QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE, systemMessageHandler);
        // emitter.addListener(QB.chat.EVENT_TYPE.USER_IS_TYPING, userTypingHandler);
        // emitter.addListener(QB.chat.EVENT_TYPE.USER_STOPPED_TYPING, userTypingHandler);
        return () => {
            newMessageEmitter.remove()
        };
    }, []);
    function receivedNewMessage(event) {
        event.payload.senderId.toString() !== global.qb_id && presentToastMessage({ type: 'success', position: 'top', message: event.payload.body })
    }
    function CustomDrawerContent(props) {
        useEffect(() => {
            if (global.token !== null) {
                loadUserProfile()
            }
            return () => { }
        }, []);
        const [name, setName] = useState('')
        const [photo, setPhoto] = useState('')
        const [dateOfBirth, setDateOfBirth] = useState('')
        const MenuItem = ({ icon, title, onPress }) => {
            return (
                <TouchableOpacity
                    onPress={onPress}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 15,
                    }}>
                    <Image
                        style={{ width: 16, height: 16, resizeMode: 'contain' }}
                        source={icon}
                    />
                    <Text
                        style={{
                            marginLeft: 25,
                            fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
                            fontSize: Constants.FONT_SIZE.FT20,
                            color: Constants.COLOR.BLACK,
                        }}>
                        {title}
                    </Text>
                </TouchableOpacity>
            );
        };
        const onLogOutPress = async () => {
            QB.auth.logout()
            .then(function () {
                console.log("logged out");            
            })
            .catch(function (e) {
                console.log(e);
            });

            if (auth().currentUser !== null) {
                
                auth().signOut()
                .then(() => {
                    global.qb_id = null;
                    global.token = null;
                    sessionClose();
                })
            } else {
                global.qb_id = null;
                global.token = null;
                sessionClose();
            }
        };
        const loadUserProfile = async () => {
            try {
                const response = await axios.get('apis/load_profile/', {
                    headers: {
                        'Auth-Token': global.token
                    }
                })
                setName(response.data.user.name)
                setPhoto(response.data.user.photos[0].photo)
                setDateOfBirth(response.data.user.date_of_birth)
            } catch (error) {
                console.log('load_profile', JSON.stringify(error))
            }
        }
        return (
            <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false} >
                <View
                    style={{ paddingTop: 24, paddingBottom: 24, paddingHorizontal: 40 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{
                                fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                                fontSize: Constants.FONT_SIZE.FT28,
                                color: Constants.COLOR.BLACK,
                            }}>
                            {'Menu'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.closeDrawer();
                            }}>
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require('./assets/images/ic_close_black.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.closeDrawer();
                                props.navigation.navigate('NavigatorProfile');
                            }}>
                            <FastImage
                                style={{ width: 64, height: 64, borderRadius: 11, }}
                                source={{
                                    uri: getS3StorageURL(photo),
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 20 }}>
                            <Text
                                style={{
                                    fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD,
                                    fontSize: Constants.FONT_SIZE.FT22,
                                    color: Constants.COLOR.BLACK,
                                }}>
                                {name}
                            </Text>
                            <Text
                                style={{
                                    marginTop: 6,
                                    fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
                                    fontSize: Constants.FONT_SIZE.FT18,
                                    color: Constants.COLOR.BLACK,
                                }}>
                                {dateOfBirth === '' ? '' : `${calculateAge(dateOfBirth)} yrs old`}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 25,
                            marginBottom: 15,
                            height: 1,
                            backgroundColor: Constants.COLOR.GRAY_SEPERATOR,
                        }}
                    />
                    <View>
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_home.png')}
                            title={'Home'}
                            target={'NavigatorTab'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorTab');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_profile.png')}
                            title={'Profile'}
                            target={'Profile'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorProfile');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_account_setting.png')}
                            title={'Account Settings'}
                            target={'AccountSettings'}
                            onPress={() => {
                                props.navigation.navigate('AccountSettings');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_feature_setting.png')}
                            title={'Feature Settings'}
                            target={'FeatureSettings'}
                            onPress={() => {
                                props.navigation.navigate('FeatureSettings');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_compatiblity.png')}
                            title={'Compatibility Questions'}
                            target={'CompatibilityQuestions'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorCompatiblityQuestions');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_visit_store.png')}
                            title={'Visit Store'}
                            target={'TabStore'}
                            onPress={() => {
                                props.navigation.navigate('TabStore');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_wink_blinking.png')}
                            title={'WinkBlinking'}
                            target={'NavigatorWinkyBlinkings'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorWinkyBlinkings');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_wink_blinking.png')}
                            title={'Virtual Dates'}
                            target={'NavigatorVirtualDates'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorVirtualDates');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_my_blasts.png')}
                            title={'Manage My Blasts'}
                            target={'Blasts'}
                            onPress={() => {
                                props.navigation.navigate('TabBlasts');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_my_conversations.png')}
                            title={'My Conversations'}
                            target={'Conversations'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorConversations');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_swipe_feed.png')}
                            title={'Swipe feed'}
                            target={'TabSwipe'}
                            onPress={() => {
                                props.navigation.navigate('TabSwipe');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_faq.png')}
                            title={'FAQs'}
                            target={'Faqs'}
                            onPress={() => {
                                props.navigation.navigate('Faqs');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_help.png')}
                            title={'Help'}
                            target={'Help'}
                            onPress={() => {
                                props.navigation.navigate('NavigatorHelp');
                            }}
                        />
                        <MenuItem
                            icon={require('./assets/images/ic_sidemenu_about.png')}
                            title={'About'}
                            target={'About'}
                            onPress={() => {
                                props.navigation.navigate('About');
                            }}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 15,
                            marginBottom: 15,
                            height: 1,
                            backgroundColor: Constants.COLOR.GRAY_SEPERATOR,
                        }}
                    />
                    <TouchableOpacity
                        onPress={onLogOutPress}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 10,
                        }}>
                        <Image
                            style={{ width: 16, height: 16, resizeMode: 'contain' }}
                            source={require('./assets/images/ic_sidemenu_logout.png')}
                        />
                        <Text
                            style={{
                                marginLeft: 25,
                                fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
                                fontSize: Constants.FONT_SIZE.FT20,
                                color: Constants.COLOR.BLACK,
                            }}>
                            {'Log Out'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
        );
    }
    return (
        <Stack.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerType: 'front',
                headerShown: false,
                drawerStyle: {
                    width: Constants.LAYOUT.SCREEN_WIDTH - 40,
                },
            }}
            initialRouteName={'NavigatorTab'}
            drawerContent={props => <CustomDrawerContent {...props} />}>
            <Stack.Screen name="NavigatorTab" component={NavigatorTab} />
            <Stack.Screen name="NavigatorProfile" component={NavigatorProfile} />
            <Stack.Screen
                key={'NavigatorWinkyBlinkings'}
                name="NavigatorWinkyBlinkings"
                component={NavigatorWinkyBlinkings}
            />
            <Stack.Screen
                key={'NavigatorCompatiblityQuestions'}
                name="NavigatorCompatiblityQuestions"
                component={NavigatorCompatiblityQuestions}
            />
            <Stack.Screen
                key={'NavigatorConversations'}
                name="NavigatorConversations"
                component={NavigatorConversations}
            />
            <Stack.Screen
                key={'NavigatorVirtualDates'}
                name="NavigatorVirtualDates"
                component={NavigatorVirtualDates}
            />
            <Stack.Screen
                key={'NavigatorHelp'}
                name="NavigatorHelp"
                component={NavigatorHelp}
            />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
            <Stack.Screen name="FeatureSettings" component={FeatureSettingsScreen} />
            <Stack.Screen name="Faqs" component={FaqsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
    );
}

function NavigatorSplash() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Splash'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
    );
}

function NavigatorAuth() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={'Auth'}
            screenOptions={({ navigation, route }) => ({ headerShown: false })}>
            <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ animationEnabled: false }}
            />
            <Stack.Screen name="LogIn" component={LogInScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
                name="Start"
                component={StartScreen}
                options={{ animationEnabled: false }}
            />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="AddPhone" component={AddPhoneScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
            <Stack.Screen
                name="AddBasicInformation"
                component={AddBasicInformationScreen}
            />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="PickPlan" component={PickPlanScreen} />
            <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
            <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen
                name="AboutMe"
                component={AboutMeScreen}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="AboutMeBio" component={AboutMeBioScreen} />
            <Stack.Screen name="AboutMePhoto" component={AboutMePhotoScreen} />
            <Stack.Screen
                name="MyPreferences"
                component={MyPreferencesScreen}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen
                name="TermsOfConditions"
                component={TermsOfConditionsScreen}
            />
        </Stack.Navigator>
    );
}

function App({ navigation }) {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        token: action.token,
                        loading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        token: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        token: null,
                    };
            }
        },
        {
            loading: true,
            token: null,
        },
    );
    const authContext = useMemo(
        () => ({
            sessionStart: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-token' });
            },
            sessionClose: () => dispatch({ type: 'SIGN_OUT' }),
        }),
        [],
    );
    const initQuickBlox = async () => {
        try {
            const qbinit = await QB.settings.init(Constants.QUICKBLOX_APP_SETTINGS)
            await QB.settings.enableAutoReconnect({ enable: true })
            // console.log("qbinit",qbinit);
            dispatch({ type: 'RESTORE_TOKEN', token: null });
        } catch (error) {
            console.log('init quickblox', JSON.stringify(error))
        }
    }
    useEffect(() => {
        initQuickBlox()
        return () => {

        };
    }, []);

    const [subscriptionresult, SetSubscriptionresult] = useState(false);

    // useFocusEffect(
    //     React.useCallback(() => {
            
    //       return () => {
    //       };
    //     }, [])
    // );

    //  useEffect(() => {
        
    //     return () => {

    //     };
    // }, []);

    PushNotification.configure({
        // get token
        // onRegister: function (token) {
            // console.log('TOKEN:', token);
        //     // console.log(global.token)
        //     const config = Platform.OS === 'ios' ? {deviceToken:token, pushChannel:QB.subscriptions.PUSH_CHANNEL.APNS_VOIP} : {deviceToken:token.token}
        //     console.log(config)
        //     QB.subscriptions.create(config).then((result) => {

        //         console.log('create subscription result',result);
        //         // SetSubscriptionresult(result.subscription_id);
        //         global.pushsubscription_id = result.id;
        //     }).catch((error) => {
        //         console.log('create subscription error',error);
        //     });
        // },



        //when receive notification from sender.
        onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);
            // notification.finish(PushNotificationIOS.FetchResult.NoData);
            // process the notification
        },
        // onAction: function (notification) {
        //     console.log('ACTION:', notification.action);
        //     console.log('notification:',notification);
        //     // process the action
        // },
        // onRegistrationError: function (err) {
        //     console.error(err.message, err);
        // },
        // permissions: {
        //     alert: true,
        //     badge: true,
        //     sound: true,
        // },
        popInitialNotification: true,
        requestPermissions: true,
    });
    return (
        <AuthContext.Provider value={authContext}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor={Constants.COLOR.WHITE}
                    />
                    {state.loading ? (
                        <NavigatorSplash navigation={navigation} />
                    ) : state.token !== null ? (
                        <NavigatorDrawer navigation={navigation} />
                    ) : (
                        <NavigatorAuth navigation={navigation} />
                    )}
                </NavigationContainer>
                <Toast config={ToastConfig} />
            </SafeAreaProvider>
        </AuthContext.Provider>
    );
}

export default App;
