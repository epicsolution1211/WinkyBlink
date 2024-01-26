import React,{useEffect,useState} from 'react';
import {
    Platform,
    StatusBar,
    View,
    Image,
    TouchableOpacity,
    Text,
    NativeEventEmitter
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QB from 'quickblox-react-native-sdk';
import WebRTCView from 'quickblox-react-native-sdk/RTCView';

function WinkyBlinkingScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const [sessionId, setSessionId] = useState();
    const [userId, setUserId] = useState();

    const [calling, setCalling] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const v_connected = QB.webrtc.init();
    if(!v_connected) {
        QB.webrtc.init();
    }
    
    const id = [139353310,139353254];
    const opponent_id = id.filter(id=> id != global.qb_id)[0];

    useEffect(() => {
        const emitter = new NativeEventEmitter(QB.webrtc)
        const newcallEmitter = emitter.addListener(QB.webrtc.EVENT_TYPE.CALL, onCall);
        const newcallAccept =  emitter.addListener(QB.webrtc.EVENT_TYPE.ACCEPT, onCallAccept);
        const newcallHangUp =  emitter.addListener(QB.webrtc.EVENT_TYPE.HANG_UP, onHangUp)
    
        return () => {
            newcallEmitter.remove()
            newcallAccept.remove()
            newcallHangUp.remove()
        };
    }, []);

  
    async function onCall (event) {
        const {
            type, // type of the event (i.e. `@QB/CALL` or `@QB/REJECT`)
            payload
          } = event
          const {
            userId, // id of QuickBlox user who initiated this event (if any)
            session // current or new session
          } = payload
          setSessionId(session.id);
          setUserId(userId);
          setCalling(true);
        //   setAccepbutton(true);
        console.log("this is calling",event,global.qb_id);

    }
      
    async function onCallAccept (event) {
        const {
            type, // type of the event (i.e. `@QB/CALL` or `@QB/REJECT`)
            payload
          } = event
          const {
            userId, // id of QuickBlox user who initiated this event (if any)
            session // current or new session
          } = payload
          setSessionId(session.id);
          setUserId(userId);
          setAccepted(true);
          setCalling(false);
        // const enableVideoParams = { sessionId, enable: false };
        // await QB.webrtc.enableVideo(enableVideoParams)
        console.log("this is accep part",event)
    }

    async function onHangUp (event) {
        const {
          type, // "@QB/HANG_UP"
          payload
        } = event
        const {
          userId, // id of QuickBlox user
          session, // session
          userInfo // custom data (object)
        } = payload
        setSessionId(session.id);
        setUserId(userId);
        setAccepted(false);
        setCalling(false);
        // handle as necessary
      }
    
    const call = async ()=>{
        await QB.webrtc.init();

        const params = {
            opponentsIds:[opponent_id],
            type: QB.webrtc.RTC_SESSION_TYPE.AUDIO
        }
    
        const response = await QB.webrtc.call(params);
        console.log("click call",response,opponent_id,global.qb_id)
    }

    const voicecall = async ()=>{
        await QB.webrtc.init();

        const params = {
            opponentsIds:[opponent_id],
            type: QB.webrtc.RTC_SESSION_TYPE.AUDIO
        }
    
        const response = await QB.webrtc.call(params);
        console.log("click call",response,opponent_id,global.qb_id)
    }

    const accept = async ()=>{
        const acceptParams = {
            sessionId,
            userInfo: {
                "qb_id":global.qb_id
            }
        };
        await QB.webrtc.accept(acceptParams)
        // const enableVideoParams = { sessionId, enable: false };
        // await QB.webrtc.enableVideo(enableVideoParams)
        setAccepted(true);
        setCalling(false);
        console.log("click accept",global.qb_id,sessionId);

    }

    const hangup = async () => {
        const hangUpParams = {
            sessionId,
            userInfo: {
                "qb_id":global.qb_id
            }
        };
        setAccepted(false);
        setCalling(false);
        QB.webrtc.hangUp(hangUpParams)
    }

    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <View style={{ flex: 1 }}>
                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: '100%' }}>
                    {accepted==false ? (<Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../../assets/images/img_demo_user.png')} />)
                    :(<WebRTCView
                        mirror={true}
                        sessionId = {sessionId}
                        userId = {userId}
                        style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                    />)}
                    <TouchableOpacity onPress={() => navigation.push('User', {})} style={{ width: Constants.LAYOUT.SCREEN_WIDTH, position: 'absolute', top: 20, paddingLeft: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                                {`James`}
                            </Text>
                            <Image style={{ marginLeft: 15, width: 12, height: 20, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_white.png')} />
                        </View>
                        <Text style={{ marginTop: 4, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                            {`16 miles away`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: 'absolute', right: 25, bottom: insets.bottom + 90, width: 115, height: 145, borderRadius: 10, overflow: 'hidden' }}>
                        {accepted==false ? (<Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={require('../../../assets/images/img_demo_profile.png')} />)
                        : (
                            <WebRTCView
                            mirror={true}
                            sessionId = {sessionId}
                            userId = {global.qb_id}
                            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                        />)} 
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', alignSelf: 'center', bottom: insets.bottom, flexDirection: 'row', alignItems: 'center' }}>
                        {calling == true ? <TouchableOpacity onPress={accept} style={{ marginLeft: 20 }}>
                            <Image style={{ width: 47, height: 48, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_wish_list.png')} />
                        </TouchableOpacity> : null}
                        {accepted == true ? <TouchableOpacity onPress={hangup} style={{ width: 74, height: 58, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: Constants.COLOR.GRAY_DARK }}>
                            <Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../../../assets/images/ic_close_white.png')} />
                        </TouchableOpacity> : null}
                        {accepted == false ? <TouchableOpacity onPress={call} style={{ marginLeft: 20 }}>
                            <Image style={{ width: 74, height: 58, resizeMode: 'contain' }} source={require('../../../assets/images/ic_logo_membership.png')} />
                        </TouchableOpacity>: null}
                        {accepted == false ? <TouchableOpacity onPress={voicecall} style={{ marginLeft: 20 }}>
                            <Image style={{ width: 74, height: 58, resizeMode: 'contain' }} source={require('../../../assets/images/icon_speaker_on.png')} />
                        </TouchableOpacity>: null}
                        
                    </View>
                </View>
            </View>
        </View>
    )
}

export default WinkyBlinkingScreen;