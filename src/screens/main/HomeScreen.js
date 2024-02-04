import React, { useEffect, useState } from 'react';
import {
    Platform,
    StatusBar,
    View,
    SectionList,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    NativeEventEmitter,
    LogBox,
    PermissionsAndroid
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlastItem from '../../components/BlastItem';
import ConversationItem from '../../components/ConversationItem';
import MatchItem from '../../components/MatchItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QB from 'quickblox-react-native-sdk';
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';
import { useFocusEffect } from '@react-navigation/native';
// import Geolocation from '@react-native-community/geolocation';
// import Geocoder from 'react-native-geocoder';

//ignore  "new native eventemitter" warning.
/** but this now working now.
    There are warnings follow.
**/

//WARN`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
//WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.

/** This is code. **/
// LogBox.ignoreLogs(['new NativeEventEmitter']);

function HomeScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [matches, setMatches] = useState([])
    const [blasts, setBlasts] = useState([])
    const [page, setPage] = useState(9)
    const [dialogs, setDialogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [focused, setFocused] = useState(false)
    
    /* This is gps start part*/

    // const [currentLongtitude, setCurrentLongitude] = useState('..');
    // const [currentLatitude, setCurrentLatitude] = useState('..');
    // const [locationStatus, setLocationStatus] = useState('..');

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const requestLocationPermission = async () => {
    //             if(Platform.OS === 'ios') {
    //                 getOneTimeLocation();
    //                 // subscribeLocationLocation();
    //             } else {
    //                 // try{
    //                     // const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //                     //     {
    //                     //         title:"Location Access Rquired",
    //                     //         message:"This App need to Access your location",
    //                     //     }
    //                     // );
                        
    //                     // if(granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                         getOneTimeLocation();

                            
    //                         // subscribeLocationLocation();
    //                     // } else {
    //                     //     setLocationStatus('Permission Denied');
    //                     // }
    //                 // } catch(err) {
    //                 //     console.log("requestLocationPermission err", err);
    //                 // }
    //             }
    //         };
    
    //         requestLocationPermission();

    //       return () => {
    //         //  Geolocation.clearWatch(watchID);
    //       };
    //     }, [])
    // );


    // useEffect(() =>{
    //     const requestLocationPermission = async () => {
    //         if(Platform.OS === 'ios') {
    //             getOneTimeLocation();
    //             subscribeLocationLocation();
    //         } else {
    //             try{
    //                 const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //                     {
    //                         title:"Location Access Rquired",
    //                         message:"This App need to Access your location",
    //                     }
    //                 );
                    
    //                 if(granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                     getOneTimeLocation();
    //                     subscribeLocationLocation();
    //                 } else {
    //                     setLocationStatus('Permission Denied');
    //                 }
    //             } catch(err) {
    //                 console.log(err);
    //             }
    //         }
    //     };

    //     requestLocationPermission();

    //     return ()=> {
    //         Geolocation.clearWatch(watchID);
    //     };
    // },[]);

    // const getOneTimeLocation = async () => {
    //     setLocationStatus('Getting Location...');

    //     Geolocation.getCurrentPosition(
    //         async (position) => {
    //             setLocationStatus('You are Here');

    //             const currentLongtitude = JSON.stringify(position.coords.longitude);
    //             const currentLatitude = JSON.stringify(position.coords.latitude);

    //             setCurrentLongitude(currentLongtitude);
    //             setCurrentLatitude(currentLatitude);

    //             var NY = { 
    //                 lat: parseFloat(currentLatitude), 
    //                 lng: parseFloat(currentLongtitude) 
    //             };
                
    //             try {
    //                 // console.log(currentLatitude);
    //                 const res = await Geocoder.geocodePosition(NY);
    //                 // console.log("City", res[0]);

    //                 // const res = await Geocoder.geocodeAddress('London');
    //             } catch (err) {
    //                 console.log("get city name error", err);
    //             }
    //         },
    //         (error) => {
    //             setLocationStatus('Error', error.message);
    //             console.log("getcurrentPosition error", error);
    //         },
    //         { enableHighAccuracy: true, timeout: 30000, maximumAge: 500 }
    //     );
    // };


    // const subscribeLocationLocation = () => {
    //     watchID = Geolocation.watchPosition(
    //         (position) => {
    //             setLocationStatus('You are Here');
    //             const currentLongtitude = JSON.stringify(position.coords.longitude);
    //             const currentLatitude = JSON.stringify(position.coords.latitude);
    //             setCurrentLongitude(currentLongtitude);
    //             setCurrentLatitude(currentLatitude);
    //         },
    //         (error) => {
    //             setLocationStatus('Error', error.message);
    //         },
    //         { enableHighAccuracy: false, maximumAge: 1000 },
    //     );
    //     return watchID;
    //     // console.log(watchID);
    // };


    /* This is gps end part*/

    var timeoutID = null

    useEffect(() => {
        if (page >= 0 && page <= 8) {
            timeoutID = setTimeout(() => {
                if (page >= 8) {
                    clearTimeout(timeoutID)
                } else {
                    setPage(page + 1)
                }
            }, Constants.ANIMATION.DURATION);
        }
        return () => {
            timeoutID !== null && clearTimeout(timeoutID)
        };
    }, [page]);

    useEffect(() => {
        displayHomeTutorial()
        return () => { };
    }, []);
    
    //loat recent chatting history
    useFocusEffect(
        React.useCallback(() => {
            loadConversations()
          return () => {
          };
        }, [])
    );

    // useEffect(() => {
    //     loadConversations()
    //     return () => { };
    // }, []);

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
    const loadConversations = async () => {
        const result = await QB.chat.getDialogs({limit:2})
        // console.log(result)
        setDialogs(result.dialogs)
    }
    function receivedNewMessage(event) {
        if (getIndexOfDialog(event.payload.dialogId) === -1) {
            loadConversations()
        } else {
            setDialogs(dialogs.map((dialog) => {
                if (dialog.id === event.payload.dialogId) {
                    dialog.lastMessage = event.payload.body
                    dialog.lastMessageDateSent = event.payload.dateSent
                    dialog.unreadMessagesCount = dialog.unreadMessagesCount + 1
                }
                return dialog
            }))
        }
    }
    const getIndexOfDialog = (dialogId) => {
        const index = dialogs.findIndex((dialog) => dialog.id == dialogId)
        return index
    }
    const displayHomeTutorial = async () => {
        AsyncStorage.getItem('HOME_TUTORIAL_DISPLAYED')
            .then(result => {
                if (result === null) {
                    AsyncStorage.setItem('HOME_TUTORIAL_DISPLAYED', '1')
                    setPage(0)
                }
            })
            .catch(() => {

            });
    }


    // useEffect(() => {
    //     if (focused) {
    //         // loadSwipableUsers()
    //         loadmatchs()
    //     }
    //     return () => { };
    // }, [focused]);
    
    // useFocusEffect(
    //     React.useCallback(() => {
    //         setFocused(true)
    //         return () => {
    //             setFocused(false)
    //         }
    //     }, [focused])
    // );

    // useEffect(() => {
    //     loadmatchs()
    //     return () => { };
    // }, []);

    // useEffect(() => {
    //     loadblasts()
    //     return () => { };
    // }, []);


    useFocusEffect(
        React.useCallback(() => {
            loadmatchs()
          return () => {
          };
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            loadblasts()
          return () => {
          };
        }, [])
    );

    const loadmatchs = async () =>{
        try {
            setLoading(true);
            const response =  await axios.get('apis/load_matches_preview/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            // console.log(global.token)
            setMatches(response.data.matches);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const loadblasts = async () =>{
        try {
            setLoading(true)
            
            const response = await axios.get('apis/load_blasts_preview/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setBlasts(response.data.blasts);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setTimeout(() => {
                // presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const onNotificationPress = () => navigation.push('Notifications')
    const onMenuPress = () => navigation.openDrawer()
    const onRefresh = () => { }
    const SectionHeader = ({ title, onViewAllPress }) => {
        return (
            <View style={{ paddingBottom: 5, backgroundColor: Constants.COLOR.WHITE }}>
                <View style={{ height: 10, backgroundColor: Constants.COLOR.BLUE_SEPERATOR }} />
                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text numberOfLines={1} style={{ fontFamily: Constants.FONT_FAMILY.SECONDARY, fontSize: Constants.FONT_SIZE.FT30, color: Constants.COLOR.BLACK, fontWeight: '800', flex: 1 }}>
                        {title}
                    </Text>
                    <TouchableOpacity onPress={onViewAllPress}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                            {'View All'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const TutorialView = ({ page, onSkipPress, onNextPress }) => {
        const PageOneView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', position: 'absolute', top: insets.top + 10 }}>
                    <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE }}>
                        {`Welcome to your\nhome page.`}
                    </Text>
                    <View style={{ marginTop: 8, backgroundColor: Constants.COLOR.WHITE, width: Constants.LAYOUT.SCREEN_WIDTH - 20, borderRadius: 15 }}>
                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.SECONDARY, fontSize: Constants.FONT_SIZE.FT30, color: Constants.COLOR.BLACK, fontWeight: '800', flex: 1 }}>
                                {"My Matches"}
                            </Text>
                            <View >
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                                    {'View All'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15 }}>
                            <View style={{
                                width: 45, height: 45, borderRadius: 10,
                                backgroundColor: Constants.COLOR.WHITE, ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 3,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.28,
                                        shadowRadius: 4.59,
                                    },
                                    android: {
                                        elevation: 5,
                                    },
                                })
                            }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} source={require('../../../assets/images/img_demo_profile.png')} />
                            </View>
                            <View style={{ flex: 1, paddingStart: 30 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                                        {'James'}
                                    </Text>
                                </View>
                                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                                    {'Brooklyn, NY'}
                                </Text>
                            </View>
                            <View>
                                <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_black.png')} />
                            </View>
                        </View>
                    </View>
                    <Text style={{ marginTop: 20, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This is the section where you will find those members you have matched with.`}
                    </Text>
                </View>
            )
        }
        const PageTwoView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', position: 'absolute', top: insets.top + 10 }}>
                    <View style={{ marginTop: 270, backgroundColor: Constants.COLOR.WHITE, width: Constants.LAYOUT.SCREEN_WIDTH - 20, borderRadius: 15 }}>
                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.SECONDARY, fontSize: Constants.FONT_SIZE.FT30, color: Constants.COLOR.BLACK, fontWeight: '800', flex: 1 }}>
                                {"Blasts Received"}
                            </Text>
                            <View >
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                                    {'View All'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15 }}>
                            <View style={{
                                width: 45, height: 45, borderRadius: 10,
                                backgroundColor: Constants.COLOR.WHITE, ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 3,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.28,
                                        shadowRadius: 4.59,
                                    },
                                    android: {
                                        elevation: 5,
                                    },
                                })
                            }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} source={require('../../../assets/images/img_demo_profile.png')} />
                            </View>
                            <View style={{ flex: 1, paddingStart: 30 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                                        {'James'}
                                    </Text>
                                </View>
                                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                                    {'Brooklyn, NY'}
                                </Text>
                            </View>
                            <View>
                                <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_black.png')} />
                            </View>
                        </View>
                    </View>
                    <Text style={{ marginTop: 20, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This is the section where you will find those members you have purchased a blast to get to you.`}
                    </Text>
                </View>
            )
        }
        const PageThreeView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', position: 'absolute', top: insets.top + 10 }}>
                    <Text style={{ position: 'absolute', top: 380, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This is the section where you will find those members you have messaged and or have messaged you.`}
                    </Text>
                    <View style={{ marginTop: 491, backgroundColor: Constants.COLOR.WHITE, width: Constants.LAYOUT.SCREEN_WIDTH - 20, borderRadius: 15 }}>
                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.SECONDARY, fontSize: Constants.FONT_SIZE.FT30, color: Constants.COLOR.BLACK, fontWeight: '800', flex: 1 }}>
                                {"My Conversations"}
                            </Text>
                            <View >
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                                    {'View All'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15 }}>
                            <View style={{
                                width: 45, height: 45, borderRadius: 10,
                                backgroundColor: Constants.COLOR.WHITE, ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 3,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.28,
                                        shadowRadius: 4.59,
                                    },
                                    android: {
                                        elevation: 5,
                                    },
                                })
                            }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} source={require('../../../assets/images/img_demo_profile.png')} />
                            </View>
                            <View style={{ flex: 1, paddingStart: 30 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                                        {'James'}
                                    </Text>
                                </View>
                                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                                    {'Brooklyn, NY'}
                                </Text>
                            </View>
                            <View>
                                <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_black.png')} />
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        const PageFourView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, alignItems: 'center', position: 'absolute', top: insets.top }}>
                    <View style={{ width: '100%', height: Constants.LAYOUT.HEADER_BAR_HEIGHT, justifyContent: 'center' }}>
                        <View style={{ position: 'absolute', right: 12, backgroundColor: Constants.COLOR.WHITE, width: 32, height: 32, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 24, height: 20, alignItems: 'center', justifyContent: 'center' }} >
                                <Image style={{ width: 24, height: 17, resizeMode: 'contain' }} source={require('../../../assets/images/ic_nav_menu.png')} />
                            </View>
                        </View>
                    </View>
                    <Image style={{ position: 'absolute', right: 20, top: 52, width: 36, height: 51, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_up.png')} />
                    <Text style={{ marginHorizontal: 25, position: 'absolute', top: 108, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This menu button provides you access to change your account and feature settings.`}
                    </Text>
                </View>
            )
        }
        const PageFiveView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, alignItems: 'center', }}>
                    <View style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4 - 55) / 2, bottom: insets.bottom, backgroundColor: Constants.COLOR.WHITE, width: 55, height: 55, borderRadius: 55, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{
                                    marginTop: 0,
                                    width: 20,
                                    height: 23,
                                    resizeMode: 'contain',
                                }}
                                source={require('../../../assets/images/ic_tab_home.png')} />
                            <View style={{ marginTop: 5, width: 50, height: 5, borderRadius: 3, backgroundColor: Constants.COLOR.PRIMARY }} />
                        </View>
                    </View>
                    <Text style={{ marginHorizontal: 25, position: 'absolute', bottom: insets.bottom + 118, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This button allows you to access the dashboard.`}
                    </Text>
                    <Image style={{ position: 'absolute', left: 35, bottom: insets.bottom + 65, width: 36, height: 51, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_down_left.png')} />
                </View>
            )
        }
        const PageSixView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, alignItems: 'center', }}>
                    <View style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4) + (Constants.LAYOUT.SCREEN_WIDTH / 4 - 55) / 2, bottom: insets.bottom, backgroundColor: Constants.COLOR.WHITE, width: 55, height: 55, borderRadius: 55, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{
                                    marginTop: 0,
                                    width: 25,
                                    height: 23,
                                    resizeMode: 'contain',
                                }}
                                source={require('../../../assets/images/ic_tab_store.png')} />
                            <View style={{ marginTop: 5, width: 50, height: 5, borderRadius: 3, backgroundColor: Constants.COLOR.TRANSPARENT }} />
                        </View>
                    </View>
                    <Text style={{ marginHorizontal: 25, position: 'absolute', bottom: insets.bottom + 118, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This button allows you to access the store.`}
                    </Text>
                    <Image style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4) + 35, bottom: insets.bottom + 65, width: 36, height: 51, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_down_left.png')} />
                </View>
            )
        }
        const PageSevenView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, alignItems: 'center', }}>
                    <View style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4 * 2) + (Constants.LAYOUT.SCREEN_WIDTH / 4 - 55) / 2, bottom: insets.bottom, backgroundColor: Constants.COLOR.WHITE, width: 55, height: 55, borderRadius: 55, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{
                                    marginTop: 0,
                                    width: 28,
                                    height: 28,
                                    resizeMode: 'contain',
                                }}
                                source={require('../../../assets/images/ic_tab_blasts.png')} />
                            <View style={{ marginTop: 5, width: 50, height: 5, borderRadius: 3, backgroundColor: Constants.COLOR.TRANSPARENT }} />
                        </View>
                    </View>
                    <Text style={{ marginHorizontal: 25, position: 'absolute', bottom: insets.bottom + 118, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This button allows you access to manage your WinkyBlasts.`}
                    </Text>
                    <Image style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4 * 2) + 15, bottom: insets.bottom + 65, width: 35, height: 52, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_down.png')} />
                </View>
            )
        }
        const PageEightView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, alignItems: 'center', }}>
                    <View style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4 * 3) + (Constants.LAYOUT.SCREEN_WIDTH / 4 - 55) / 2, bottom: insets.bottom, backgroundColor: Constants.COLOR.WHITE, width: 55, height: 55, borderRadius: 55, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                style={{
                                    marginTop: 0,
                                    width: 26,
                                    height: 21,
                                    resizeMode: 'contain',
                                }}
                                source={require('../../../assets/images/ic_tab_logo.png')} />
                            <View style={{ marginTop: 5, width: 50, height: 5, borderRadius: 3, backgroundColor: Constants.COLOR.TRANSPARENT }} />
                        </View>
                    </View>
                    <Text style={{ marginHorizontal: 25, position: 'absolute', bottom: insets.bottom + 118, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This button allows you to access the swipe.`}
                    </Text>
                    <Image style={{ position: 'absolute', left: (Constants.LAYOUT.SCREEN_WIDTH / 4 * 3) + 15, bottom: insets.bottom + 65, width: 35, height: 52, resizeMode: 'contain' }} source={require('../../../assets/images/ic_curve_arrow_down.png')} />
                </View>
            )
        }
        return (
            <TouchableOpacity onPress={onNextPress} style={{ position: 'absolute', top: 0, backgroundColor: 'rgba(0,0,0,0.7)', width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT }}>
                {
                    page == 0 && <PageOneView />
                }
                {
                    page == 1 && <PageTwoView />
                }
                {
                    page == 2 && <PageThreeView />
                }
                {
                    page == 3 && <PageFourView />
                }
                {
                    page == 4 && <PageFiveView />
                }
                {
                    page == 5 && <PageSixView />
                }
                {
                    page == 6 && <PageSevenView />
                }
                {
                    page == 7 && <PageEightView />
                }
                {/* <TouchableOpacity onPress={onSkipPress} style={{ position: 'absolute', right: 15, top: insets.top + 12 }}>
                    <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                        {`Skip`}
                    </Text>
                </TouchableOpacity> */}
            </TouchableOpacity>
        )
    }
    const BottomBar = () => {
        const TabBarItem = ({ navigation, target, icon, width, height, focused }) => {
            return (
                <View
                    style={{
                        height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom
                    }} >
                    <View style={{ height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT }} >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(target)
                            }}
                            style={{
                                width: Constants.LAYOUT.SCREEN_WIDTH / 4,
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} >
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{
                                        marginTop: 0,
                                        width: width,
                                        height: height,
                                        resizeMode: 'contain',
                                        tintColor: (target != 'TabSwipe' && target != 'TabBlasts') ? 'rgba(61,60,61,1)' : null
                                    }}
                                    source={icon} />
                                <View style={{ marginTop: 5, width: 50, height: 5, borderRadius: 3, backgroundColor: focused ? Constants.COLOR.PRIMARY : Constants.COLOR.TRANSPARENT }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return (
            <View style={{
                width: Constants.LAYOUT.SCREEN_WIDTH,
                height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                backgroundColor: Constants.COLOR.BLUE_LIGHT,
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
                })
            }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TabBarItem
                        navigation={navigation}
                        target={"TabHome"}
                        icon={require('../../../assets/images/ic_tab_home.png')}
                        width={20}
                        height={23}
                        focused={true}
                    />
                    <TabBarItem
                        navigation={navigation}
                        target={"TabStore"}
                        icon={require('../../../assets/images/ic_tab_store.png')}
                        width={25}
                        height={23}
                        focused={false}
                    />
                    <TabBarItem
                        navigation={navigation}
                        target={"TabBlasts"}
                        icon={require('../../../assets/images/ic_tab_blasts.png')}
                        width={28}
                        height={28}
                        focused={false}
                    />
                    <TabBarItem
                        navigation={navigation}
                        target={"TabSwipe"}
                        icon={require('../../../assets/images/ic_tab_logo.png')}
                        width={26}
                        height={21}
                        focused={false}
                    />
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onNotificationPress={onNotificationPress}
                onMenuPress={onMenuPress} />
            <SectionList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + Constants.LAYOUT.BOTTOM_BAR_HEIGHT }}
                sections={[
                    {
                        id: 'Match',
                        title: 'My Matches',
                        data: matches,
                    },
                    {
                        id: 'Blast',
                        title: 'Blasts Received',
                        data: blasts,
                    },
                    {
                        id: 'Conversation',
                        title: 'My Conversations',
                        data: dialogs,
                    },
                ]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 0, backgroundColor: Constants.COLOR.BLACK }} />}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item, index, section }) => (
                    section.id == 'Match' ?
                        <MatchItem
                            item={item}
                            index={index}
                            layout={'small'}
                            onUserPress={() => navigation.push('User', {id:item.opponent_id,usertype:'match'})}
                            onMatchPress={() => {  }} /> :
                        section.id == 'Blast' ?
                            <BlastItem
                                item={item}
                                index={index}
                                layout={'small'}
                                onUserPress={() => navigation.push('User', {id:item.user_id,usertype:'blast'})}
                                onBlastPress={() => { }} /> :
                            <ConversationItem
                                item={item}
                                index={index}
                                layout={'small'}
                                onUserPress={(userid) => navigation.push('User', {id:userid,usertype:'conversation'})}
                                onConversationPress={
                                    (opponentQbID) => navigation.push('Conversation', { type: 'user', id: opponentQbID })
                                } 
                            />
                )}
                renderSectionHeader={({ section: { id, title } }) => (
                    <SectionHeader
                        title={title}
                        onViewAllPress={() => {
                            id === 'Match' ? navigation.push('Matches', {}) : id === 'Blast' ? navigation.navigate('TabBlasts', {}) : navigation.push('Conversations', {})
                        }} />
                )}
            />
            <BottomBar />
            {
                page < 8 &&
                <TutorialView
                    page={page}
                    onNextPress={() => {
                        setPage(page + 1)
                    }}
                    onSkipPress={() => {
                        setPage(8)
                    }} />
            }
        </View>
    )
}

const styles = StyleSheet.create({

});

export default HomeScreen;