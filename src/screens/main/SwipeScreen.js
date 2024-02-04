import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivateModal from '../../components/ActivateModal';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import SwipeCard from '../../components/SwipeCard';
import StyledButton from '../../components/StyledButton';
import SwipeCards from '../../components/react-native-swipe-cards/SwipeCards';
import { increaseSwipeCountAndNeedCompatibility } from '../../common/Functions';
import { useFocusEffect } from '@react-navigation/native';
import { presentToastMessage } from '../../common/Functions';
import { Send } from 'react-native-gifted-chat';

function SwipeScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [page, setPage] = useState(9)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [visibleActivateModal, setVisibleActivateModal] = useState(false)
    const [focused, setFocused] = useState(false)
    const swiperRef = useRef()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const [undocount,setUndocount ] = useState(2);

    const [plan, setPlan] = useState(null);
    const [swipecount, setSwipecount] = useState(null);
    const [useDate, setUseDate] = useState(null);

    var timeoutID = null
    useEffect(() => {
        if (page >= 0 && page <= 5) {
            timeoutID = setTimeout(() => {
                if (page >= 5) {
                    clearTimeout(timeoutID)
                    setVisibleActivateModal(true)
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
        displaySwipeTutorial()
        return () => { };
    }, []);
    useEffect(() => {
        if (focused) {
            loadSwipableUsers()
        }
        return () => { };
    }, [focused]);
    useFocusEffect(
        React.useCallback(() => {
            setFocused(true)
            return () => {
                setFocused(false)
            }
        }, [focused])
    );

    useFocusEffect(
        React.useCallback(() => {
            loadAboutMe()
          return () => {
          };
        }, [])
    );

    const displaySwipeTutorial = async () => {
        AsyncStorage.getItem('SWIPE_TUTORIAL_DISPLAYED')
            .then(result => {
                if (result === null) {
                    AsyncStorage.setItem('SWIPE_TUTORIAL_DISPLAYED', '1')
                    setPage(0)
                }
            })
            .catch(() => {

            });
    }
    const TutorialView = ({ page, onSkipPress, onNextPress }) => {
        const PageOneView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', paddingBottom: 40 }}>
                    <Image style={{ width: 200, height: 120, resizeMode: 'contain' }} source={require('../../../assets/images/ic_swipe_right_left.png')} />
                    <Text style={{ marginTop: 20, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`Uncover your potential matches by giving those members you like a "wink" by swiping right, and a "blink" to those you don't by swiping left.\n\nReminder:  Both members need to swipe right on each other in order to communicate with one another.`}
                    </Text>
                </View>
            )
        }
        const PageTwoView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', paddingBottom: 40 }}>
                    <Image style={{ width: 48, height: 122, resizeMode: 'contain' }} source={require('../../../assets/images/ic_swipe_up_level.png')} />
                    <Text style={{ marginTop: 20, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`To see additional profile information of your potential matches, please swipe up.`}
                    </Text>
                </View>
            )
        }
        const PageThreeView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', position: 'absolute', paddingBottom: 40 }}>
                    <View style={{ width: 60, height: 60, borderRadius: 60, position: 'absolute', left: 6, top: insets.top + 12.5 + Constants.LAYOUT.HEADER_BAR_HEIGHT, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 32, height: 33, resizeMode: 'contain' }} source={require('../../../assets/images/ic_undo.png')} />
                    </View>
                    <Image style={{ position: 'absolute', top: insets.top + 95 + Constants.LAYOUT.HEADER_BAR_HEIGHT, left: 50, width: 77, height: 65, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_left_arrow.png')} />
                    <Text style={{ marginTop: 300, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT30, color: Constants.COLOR.WHITE }}>
                        {`Undo`}
                    </Text>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`In the event you make a mistake, the undo button allows you to "undo" up to two swipes back.`}
                    </Text>
                </View>
            )
        }
        const PageFourView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', position: 'absolute', paddingBottom: 40 }}>
                    <View style={{ width: 60, height: 60, borderRadius: 60, position: 'absolute', right: 14, top: insets.top + 12.5 + Constants.LAYOUT.HEADER_BAR_HEIGHT, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 47, height: 48, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_wish_list.png')} />
                    </View>
                    <Image style={{ position: 'absolute', top: insets.top + 95 + Constants.LAYOUT.HEADER_BAR_HEIGHT, right: 80, width: 77, height: 65, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_right_arrow.png')} />
                    <Text style={{ marginTop: 300, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT30, color: Constants.COLOR.WHITE }}>
                        {`WinkyBlast`}
                    </Text>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`This button allows you to FastTrack into another person's inbox without matching.`}
                    </Text>
                    <Text style={{ marginTop: 30, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`Reminder:`}
                    </Text>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`The member that receives the blast from you still needs to swipe right, before you communicate with each other.`}
                    </Text>
                </View>
            )
        }
        const PageFiveView = ({ }) => {
            return (
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, paddingHorizontal: 50, alignItems: 'center', position: 'absolute', paddingBottom: 40 }}>
                    <View style={{ position: 'absolute', alignSelf: 'center', width: 169, height: 45, paddingVertical: 8, paddingHorizontal: 10, top: insets.top + 2, backgroundColor: Constants.COLOR.BLUE_LIGHT, borderRadius: 8 }}>
                        <Image style={{ width: 149, height: 29, resizeMode: 'contain' }} source={require('../../../assets/images/ic_nav_logo_black.png')} />
                    </View>
                    <Image style={{ position: 'absolute', top: insets.top + 25 + Constants.LAYOUT.HEADER_BAR_HEIGHT, right: Constants.LAYOUT.SCREEN_WIDTH / 2, width: 77, height: 65, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_right_arrow.png')} />
                    <Text style={{ marginTop: insets.top + 155, marginRight: 38, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {`Jump to home.`}
                    </Text>
                </View>
            )
        }
        return (
            <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT }}>
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
                {/* <TouchableOpacity onPress={onSkipPress} style={{ position: 'absolute', right: 15, top: insets.top + 12 }}>
                    <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                        {`Skip`}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onNextPress} style={{ position: 'absolute', right: 15, bottom: 25 }}>
                    <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                        {`Next`}
                    </Text>
                </TouchableOpacity> */}
            </View>
        )
    }

    const loadAboutMe = async () => {
        
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setPlan(response.data.user.subscribed_plan);
            loadswipecount(response.data.user.subscribed_plan,response.data.user.current_date);
            console.log('user_info========>',response.data.user.current_date)
            setLoading(false)
        } catch (error) {
            // console.log('load_profile', error)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    // AsyncStorage.setItem('usageCount', '25');
    const loadswipecount = async (subscribed_plan, current_date)=>{
        
        const storedCount = await AsyncStorage.getItem('usageCount');
        const storedDate = await AsyncStorage.getItem('lastUsageDate');
        const plan = await AsyncStorage.setItem('Plan',subscribed_plan);
        
        const currentdate = new Date().toLocaleDateString();

        if(subscribed_plan == "Basic"){
            if(storedCount == null || storedDate != current_date){
                
                await AsyncStorage.setItem('usageCount', '25');
                await AsyncStorage.setItem('lastUsageDate', current_date);
                
            }
        }else if(subscribed_plan == "Premium"){
            if(storedCount == null || storedDate != current_date){
                
                await AsyncStorage.setItem('usageCount','25');
                await AsyncStorage.setItem('lastUsageDate', current_date);

            }

        }else if(subscribed_plan == "Plus"){

        }
    }
    
    const saveswipecountdata = async (count,date)=>{

    }

    //loadswipeable user
    const loadSwipableUsers = async () => {
        try {
            const response = await axios.get('apis/load_swipeable_users/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setUsers(response.data.users)
            // console.log("swipeable users===============>" ,response.data);
        } catch (error) {
            console.log('load_swipeable_users', JSON.stringify(error))
        }
    }
    //active WinkyBadge
    const activateWinkyBadge = async () => {
        try {
            let parameters = {
                'is_winky_badge_enabled': 1
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            setLoading(true)
            setVisibleActivateModal(false)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    //detect undo event
    const onUndoPress = () => {

        const opponent_id = swiperRef.current.currentprevecard().id;
        if(undocount>0){
            swiperRef.current._goToPrevCard()
            undoswipe(swiperRef.current.currentprevecard().id);
            setUndocount(undocount-1);
        }
        else{
            console.log(undocount)
        }
    }
    //Undo swipe
    const undoswipe = async (opponent_id) =>{
        try{

            setLoading(true)

            const response =  await axios.post('apis/undo_swipe/',
                {
                    "opponent_id":opponent_id
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            console.log(response.data);
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: 'Returned successfully.' })
        }catch(e){
            setLoading(false)
            console.log("blastsend-error",error.code);
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    //user sends blast other user
    const onBlastsend = async (opponent_id) =>{
        swiperRef.current. _goToNextCard()
        if(undocount<2){
            setUndocount(undocount+1);
        }
        try{

            setLoading(true)

            const response =  await axios.post('apis/blast_user/',
                {
                    "opponent_id":opponent_id
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: response.data['success'] })
        }catch(e){
            setLoading(false)
            console.log("blastsend-error",error.code);
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    //detect swipe event
    const onSwipe = async ({ user, direction }) => {
        const swipecount = await AsyncStorage.getItem('usageCount');
        const Plan = await AsyncStorage.getItem('Plan');
        
        if(parseInt(swipecount)>0 && Plan != 'Plus'){
            await AsyncStorage.setItem('usageCount',(swipecount-1).toString());
            increaseSwipeCountAndNeedCompatibility()
            .then((needCompatibility) => {
                if (needCompatibility) {
                    navigation.navigate("NavigatorCompatiblityQuestions")
                }
            })
            .catch((error) => {
                console.log("increaseSwipe",error.code);
            })

            if(direction == 'Left')
                sendwink(user);
            if(direction == 'Right'){
                sendblink(user);
            }
        }else{
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message:"You have already consume your swipe." })
            }, 100);
        }
        
    }
    //user send swipe(Wink) othere user 
    const sendwink = async (user) =>{
        try{
            setLoading(true)
            // await axios.post('apis/swipe_wink_user/',
            //     {
            //         "opponent_id":user.id,
            //         "type":"Wink",
            //         "user_id":0
            //     },
            //     {
            //         headers: {
            //             'Auth-Token': token
            //         }
            //     }
            // )
            // console.log("sendswipe-try", response.data);
            setLoading(false);
            presentToastMessage({ type: 'success', position: 'top', message: "You swiped Wink succesfully." })
        } catch (error){
            console.log("sendswipe-catch", error.code);
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    // user sends swipe(blink) other user
    const sendblink = async (user) =>{
        try{
            setLoading(true)
            // response =  await axios.post('apis/swipe_blink_user/',
            //     {
            //         "opponent_id":user.id,
            //         "type":"Blink",
            //         "user_id":0
            //     },
            //     {
            //         headers: {
            //             'Auth-Token': token
            //         }
            //     }
            // )
            // console.log("sendswipe-try", response.data);
            setLoading(false);
            presentToastMessage({ type: 'success', position: 'top', message: "You swiped Blink succesfully." })
        } catch (error){
            console.log("sendswipe-catch", error.code);
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
                    content={"Swipe Activate now or at any time in your settings."}
                    onClosePress={() => {
                        setVisibleActivateModal(false)
                    }}
                    onActivatePress={() => {
                        activateWinkyBadge()
                    }}
                />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <View style={{ flex: 1 }}>
                <SwipeCards
                    ref={swiperRef}
                    cards={users}
                    containerStyle={{ backgroundColor: Constants.COLOR.BLACK }}
                    smoothTransition={true}
                    stack={true}
                    cardKey={'id'}
                    stackOffsetX={0}
                    stackOffsetY={0}
                    showYup={false}
                    showNope={false}
                    loop={true}
                    renderCard={(user) =>
                        <SwipeCard
                            key={user.id}
                            insets={insets}
                            user={user}
                            onUndoPress={onUndoPress}
                            onBlastPress={() => {
                                onBlastsend(user.id)
                            }}
                            onUpPress={() => {
                                navigation.push('User', { id: user.id ,usertype:'swipeable'})
                            }} />
                    }
                    renderNoMoreCards={() =>
                        <View style={{ alignItems: 'center', paddingHorizontal: 30 }}>
                            <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                                {'There is no one around you. Expand your preferences to see more people.'}
                            </Text>
                            <StyledButton
                                containerStyle={{ marginTop: 30, width: 200, height: 50, borderRadius: 25, alignSelf: 'center' }}
                                textStyle={{}}
                                title={"My Preferences"}
                                onPress={() => {
                                    navigation.navigate('NavigatorProfile')
                                }} />
                        </View>
                    }
                    handleYup={(user) => {
                        if(undocount<2){
                            setUndocount(undocount+1);
                        }
                        onSwipe({ user: user, direction: 'Right' })
                    }}
                    handleNope={(user) => {
                        if(undocount<2){
                            setUndocount(undocount+1);
                        }
                        onSwipe({ user: user, direction: 'Left' })
                    }}
                    handleMaybe={() => { }}
                    hasMaybeAction={false}
                />
                {/* <CardsSwipe
                    ref={swiperRef}
                    cards={users}
                    cardContainerStyle={{}}
                    animDuration={300}
                    lowerCardZoom={1}
                    loop={false}
                    renderYep={() => <View />}
                    renderNope={() => <View />}
                    renderNoMoreCard={() =>
                        <View style={{ alignItems: 'center', paddingHorizontal: 30 }}>
                            <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                                {'There is no one around you. Expand your preferences to see more people.'}
                            </Text>
                            <StyledButton
                                containerStyle={{ marginTop: 30, width: 200, height: 50, borderRadius: 25, alignSelf: 'center' }}
                                textStyle={{}}
                                title={"My Preferences"}
                                onPress={() => {
                                    navigation.navigate('NavigatorProfile')
                                }} />
                        </View>
                    }
                    renderCard={(card) =>
                        <SwipeCard
                            insets={insets}
                            user={card}
                            onUndoPress={() => {

                            }}
                            onBlastPress={() => {

                            }}
                            onUpPress={() => {
                                navigation.push('User', { id: card.id })
                            }} />
                    }
                    onNoMoreCards={() => {
                        loadSwipableUsers()
                    }}
                    onSwipedRight={(index) => {
                        // swipeJob(state.jobs[index], 'Right')
                    }}
                    onSwipedLeft={(index) => {
                        // swipeJob(state.jobs[index], 'Left')
                    }}
                /> */}
            </View>
            {
                page < 5 &&
                <TutorialView
                    page={page}
                    onNextPress={() => setPage(page + 1)}
                    onSkipPress={() => setPage(5)} />
            }
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default SwipeScreen;