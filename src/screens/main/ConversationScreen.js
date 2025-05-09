import React, { useCallback, useEffect, useRef, useState ,memo} from 'react';
import {
    Image,
    Platform,
    StatusBar,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    Keyboard,
    ScrollView,
    LayoutAnimation,
    StyleSheet,
    PermissionsAndroid,
    LogBox
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import ConfirmationModal from '../../components/ConfirmationModal';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { getS3StorageURL, presentToastMessage } from '../../common/Functions';
import FastImage from 'react-native-fast-image';
import { GiftedChat } from 'react-native-gifted-chat';
import { 
    renderInputToolbar, 
    renderActions, 
    renderComposer, 
    renderSend, 
    renderLoadEarlier, 
    MessageInputBar 
} from '../../components/react-native-gifted-chat/InputToolbar';
import {
    renderAvatar,
    renderBubble,
    renderSystemMessage,
    renderMessage,
    renderMessageText,
    renderCustomView,
    renderMessageImage,
    renderDay,
    renderFooter,
    renderMessageAudio
} from '../../components/react-native-gifted-chat/MessageContainer';
import EmptyView from '../../components/EmptyView';
import QB from 'quickblox-react-native-sdk';
import moment from 'moment';
import { NativeEventEmitter } from 'react-native';
import ActionSheetModal from '../../components/ActionSheetModal';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect } from '@react-navigation/native';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification ,{Importance} from'react-native-push-notification';
import { LocalNotification } from '../../common/LocationNotification';
import RemotePushController from '../../common/RemotePushController';

import AudioRecorderPlayer, {
     AVEncoderAudioQualityIOSType,
     AVEncodingOption,
     AudioEncoderAndroidType,
     AudioSet,
     AudioSourceAndroidType,
    } from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';
import ConfirmOrderScreen from './ConfirmOrderScreen';
import 
        RNVoiceMessagePlayer, 
        {
            ProfileComponent,
            TrackerLineComponent,
            LeftActionComponent,
            BottomTimesComponent
        } 
        from '@carchaze/react-native-voice-message-player';
// import {Video} from'expo-av';
import {AudioPlayer} from 'react-native-simple-audio-player';

// import AudioMessageComponent from '../../components/AudioMessage';

LogBox.ignoreLogs(['new NativeEventEmitter']);
// LogBox.ignoreAllLogs();
const audioRecorderPlayer = new AudioRecorderPlayer;
function ConversationScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [visibleReportModal, setVisibleReportModal] = useState(false)
    const [visibleBlockModal, setVisibleBlockModal] = useState(false)
    const [visiblePhotoOptions, setVisiblePhotoOptions] = useState(false)
    // const [userphoto, setUserphoto] = useState();
    const [limit,setLimit] = useState(10);

    const [user, setUser] = useState(null)
    const [dialog, setDialog] = useState(null)
    const [loading, setLoading] = useState(false)
    const giftedChatRef = useRef()
    const messageInputBarRef = useRef()
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [loadEarlier, setLoadEarlier] = useState(true)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [focused, setFocused] = useState(false)
    const [currentmessage, setCurrentmessage] = useState();
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('Home')

    const onMenuPress = () => navigation.openDrawer()
    const onUserPress = () => navigation.push('User', {id:user.id,usertype:'conversation'})
    const onReportPress = () => setVisibleReportModal(true)
    const onBlockPress = () => setVisibleBlockModal(true)
    // const [attachmentsfile, setAttachmentsfile] = useState([{id:'fce3d990b5894f8abffc46463262a63100',type:'image'}]); 
    const [attachmentsfile, setAttachmentsfile] = useState([]); 
    const [imagepreview, setImagepreview] = useState(null);
    let userphoto;
    const [recordingPosition, setRecordingPosition] = useState('00:00');
    const [recording,setRecording] = useState(false);

        // const PlayButton = () => {
        //     return ( 
                // <View>
                // <TouchableOpacity>
                //     <Image 
                //     source={require('../../../assets/images/ic_play_white.png')} 
                //     style={{width: 15, height: 15}} />
                // </TouchableOpacity>
                // <Slider
                //     miniumValue={0}
                //     maxiumValue={100}
                //     // trackStyle={}
                //     value={50}
                //     minimumTrackTintColor="#93A8B3"
                //     // onValueChange={(e) => {}
                // />
                // </View>
        //     )
        // }
        const renderMessageAudio = (props) => {
            // const isAlreadyPlay = useRef();
            // const [duration, setDuration] = useState('00:00:00');
            // const [timeElapsed, setTimeElapsed] = useState('00:00:00');
            // const [percent,setPercet] = useState(0);
            // const [current_track,setCurrent_track] = useState(0);
            // const [inprogress,setInprogress] = useState(false);

            

            // const onstartplay = async (e)=>{
            //     const path = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
            //     const result = await audioRecorderPlayer.startPlayer(path);
            //     audioRecorderPlayer.setVolume(1.0);
            //     audioRecorderPlayer.addPlayBackListener((e) => {
            //         console.log('playing=======>', e.currentPosition);
            //         return;
            //     })
            // }
            
            let { currentMessage } = props;
            let audio = currentMessage.audio;
            // console.log("current message========>", currentMessage.user["_id"]);
            // console.log("route id==========>",route.params.id);
            // console.log(currentMessage.user["_id"] === route.params.id)
            return (
                // <AudioMessageComponent audio={audio} />
                // <RNVoiceMessagePlayer source={audio} autoDownload={false} />
                <View
                    style={{
                        backgroundColor: parseInt(currentMessage.user["_id"]) === parseInt(route.params.id) ? '#F2F2F2' : '#A6E1E4',
                        width:150,
                        borderTopRightRadius:13,
                        borderTopLeftRadius:9,
                        borderBottomLeftRadius:11,
                        marginBottom:10
                    }}>
                    <AudioPlayer url={audio}/>
                </View>
            )
        }
//console.log(renderMessageAudio)
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", (e) => keyboardDidShow(e));
        const hideSubscription = Keyboard.addListener("keyboardWillHide", (e) => keyboardDidHide(e));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    /**Request premission**/
    if (Platform.OS === 'android') {
        const check = async ()=>{
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);        
                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    // console.log('Permissions granted');
                } else {
                    // console.log('All required permissions not granted');
                    return;
                }
            } catch (err) {
                console.warn(err);
            return;
            }
        }
        check();
    }
    /** Record Audio **/
    
    /** Start recording*/
    const startRecording = async (message) => {
        try{
            setLoading(true)
            const result = await audioRecorderPlayer.startRecorder();
            setLoading(false);
            audioRecorderPlayer.addRecordBackListener((e) => {
                setRecordingPosition(audioRecorderPlayer.mmssss(
                    e.currentPosition,
                ));
                setRecording(true);
                setCurrentmessage(message)
                // console.log('recording=======>', e.currentPosition);
                return;
            });
            console.log(result);
        }catch(error){
            // console.log('start recording error ========>', error);
        }
    };
    
    /* Stop recording */
    const stopRecording = async (message) => {
        try{
            setLoading(true);
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener(setRecording(false));
            const contentUploadParams = {
                url: result, // path to file in local file system
                public: false,
            };
            console.log('audio recording stop=========>',result);
            await QB.content.upload(contentUploadParams)
            .then(function(file){
                if(dialog!=null){
                    console.log('upload_success', file)
                    QB.chat.sendMessage({
                        attachments : [{id:file.uid,type:'audio'}], 
                        dialogId : dialog.id, 
                        body : message, 
                        saveToHistory : true 
                    });        
                    messageInputBarRef.current.clear()
                }
                else{
                    QB.chat.createDialog({ type: QB.chat.DIALOG_TYPE.CHAT, occupantsIds: [user.qb_id] })
                    .then(function(){
                        QB.chat.sendMessage({
                            attachments : [{id:file.uid,type:'audio'}], 
                            dialogId : dialog.id, 
                            body : message, 
                            saveToHistory : true 
                        })
                    }).catch(function(err){
                        setLoading(false)
                        setTimeout(() => {
                            presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
                        }, 100);
                    })
                    
                }
            }).catch(function(err){
                console.log('audio upload_fail',err)
                setLoading(false)
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
                }, 100);
            })
            setLoading(false);
        }catch{
            console.log(result);
            setLoading(false);
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
            }, 100);
        }
    };

    // const path = Environment.getExternalStoragePublicDirectory(
    //     Environment.DIRECTORY_MOVIES);
    // File file = new File(path, "/" + fname);

    // const path = 'hello1.aac'
    // const startRecording = async () =>{
    //     const audioSet = {
    //     AudioEncoderAndroid:AudioEncoderAndroidType.AAC,
    //     AudioSourceAndroid:AudioSourceAndroidType.MIC,
    //     AVEncoderAudioQualityKeyIOS:AVEncoderAudioQualityIOSType.high,
    //     AVNumberOfChannelsKeyIOS:2,
    //     AVFormatIDKeyIOS:AVEncodingOption.aac
    //     }
    //     // console.log("audioSet",path);
    //     try{
    //         const uri = await audioRecorderPlayer.startRecorder(JSON.stringify(audioSet));
    //         audioRecorderPlayer.addRecordBackListener((e) => {
    //             console.log("current time", e.currentPosition);
    //         })
    //         console.log('uri',uri);
    //     }catch(error){
    //         console.log('starting recording error',error)
    //     }
    // }

    /**Push notification**/
    PushNotification.configure({
    //     //when receive notification from sender.
        onNotification: function (notification) {
            // console.log('NOTIFICATION:', notification);
    //         notification.finish(PushNotificationIOS.FetchResult.NoData);
    //         // process the notification
        },
    //     onAction: function (notification) {
    //         console.log('ACTION:', notification.action);
    //         console.log('notification:',notification, global.qb_id);
    //         // process the action
    //     },
    //     onRegistrationError: function (err) {
    //         console.error(err.message, err);
    //     },
    //     permissions: {
    //         alert: true,
    //         badge: true,
    //         sound: true,
    //     },
    //     popInitialNotification: true,
    //     requestPermissions: true,
    });

    // PushNotification.createChannel(
    //     {
    //       channelId: "Roni_channel", // (required)
    //       channelName: "My channel", // (required)
    //       channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    //       playSound: false, // (optional) default: true
    //       soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    //     },
    //     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    //   );

    useEffect(() => {
        if (navigation !== undefined) {
            const parentNavigator = navigation.getParent()
            parentNavigator.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                    width: Constants.LAYOUT.SCREEN_WIDTH,
                    display: 'none'
                }
            })
        }
        return () => { };
    }, [navigation]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         loadUser()
    //       return () => {
    //       };
    //     }, [])
    // );
    
    //Load opponent user
    // useEffect(() => {
    //     if (focused) {
    //         loadUser();
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


    useEffect(() => {
        dialog !== null && loadChatHistory(limit)
        return () => { };
    }, [dialog]);

    useEffect(() => {
        const emitter = new NativeEventEmitter(QB.chat);
        Promise.all(loadUser())
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

    const keyboardDidShow = (e) => {
        let height = e.endCoordinates.height;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(height)
    };
    
    const keyboardDidHide = (e) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    };

    const blockrequest = async ()=>{
        try{
            setLoading(true);
            await axios.post('apis/block_user/',
            {
                'opponent_id':user.id
            },
            {
                headers:{
                    'Auth-Token':token
                }
            })

            setLoading(false);
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message:"You have blocked this user." })
            }, 100);
        }catch(error){
            console.log('block request error', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const reportrequest = async ()=>{
        try{
            setLoading(true);
            await axios.post('apis/report_user/',
            {
                'opponent_id':user.id
            },
            {
                headers:{
                    'Auth-Token':token
                }
            })

            setLoading(false);
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message:"You have reported this user." })
            }, 100);
        }catch(error){
            console.log('report request error', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    //load opponent user
    const loadUser = async () => {
        try {
            setLoading(true)
    
            //get opponent user's info
            const response = await axios.get(`apis/load_user_by_qb_id/${route.params.id}`, {
                headers: {
                    'Auth-Token': global.token
                }
            })

            //get all chat log according to self from QuickBlox
            const result = await QB.chat.getDialogs({})
            //Filter chat log according to opponent user
            const dialog = result.dialogs.find((dialog) => dialog.type === QB.chat.DIALOG_TYPE.CHAT && dialog.occupantsIds.includes(parseInt(route.params.id)) && dialog.occupantsIds.includes(parseInt(global.qb_id)));
            
            setUser(response.data.user);
            userphoto = response.data.user.photos[0].photo;
            dialog !== undefined && setDialog(dialog)
            setLoading(false)
        } catch (error) {
            console.log('load_user_by_qb_id',error.code)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
                // presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    //load chatting history
    const loadChatHistory = async (limit) => {
        try {
            //get chat log 
            setLoading(true)
            const result = await QB.chat.getDialogMessages({
                dialogId: dialog.id,
                sort: {
                    ascending: false,
                    field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT
                },
                // markAsRead:true,
                // skip: 10,
                limit:10,
                markAsRead: true
            })
            setLimit(limit+10)
            // geturl()
            //change message state
            // setMessages(result.messages.map(item => {

                
            //     let imageurl = geturl(item);
            //     // if(item.attachments){
            //     // const { attachments } = item
            //     // const [attachment] = attachments
            //     // const contentGetFileUrlParams = { uid: attachment.id };
                
            //     // QB.content
            //     // .getPrivateURL(contentGetFileUrlParams)
            //     // .then(function(url){ 
            //     //     imageurl = url
            //     //     // console.log(imageurl)
            //     //  })
            //     // .catch(function(err){
            //     //     console.log(err)
            //     // })
            //     // // console.log("receive",imageurl);
            //     // }
            //     console.log(imageurl);
            //     return {
            //         _id: item.id,
            //         text: item.body,
            //         createdAt: moment(item.dateSent).toDate(),
            //         user: {
            //             _id: item.senderId.toString(),
            //             avatar: item.senderId.toString() === global.qb_id ? null : getS3StorageURL(user.photos[0].photo)
            //         },
            //         // image:'https://api.quickblox.com/blobs/fce3d990b5894f8abffc46463262a63100?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOjEwMjQ4MCwiaWF0IjoxNzA2MjY0MzIwMTU5OTk5fQ.JVrsRqXtGb0Cpd4V3PeL2gFaVzsdyl-T8D_5x5kf99Tg5JewJCZODA8K3gB_9NJA--EWJls-5QJqIjvBmV4HWA'
            //         image:''
            //     };
            // }))
            const messages = await Promise.all(result.messages.map(async (item) => {
                let imageurl;
                let audiourl;
                if (item.attachments) {
                    const contentGetFileUrlParams = { uid: item.attachments[0]['id'] };

                    await QB.content
                    .getPrivateURL(contentGetFileUrlParams)
                    .then(function (url) {
                        if(item.attachments[0].type === 'image'){
                            imageurl = url;
                        }else{
                            audiourl = url;
                        }
                    })
                } 
                return {
                    _id: item.id,
                    text: item.body,
                    createdAt: moment(item.dateSent).toDate(),
                    user: {
                        _id: item.senderId.toString(),
                        avatar: item.senderId.toString() === global.qb_id ? null : getS3StorageURL(user.photos[0].photo)
                    },
                    image: imageurl,
                    audio: audiourl
                    // video:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
                    // audio:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'

                };
            }));
            setLoading(false)
            setMessages(messages);
            console.log("message======>",messages.length)
        } catch (error) {
            setLoading(false)
            console.log("load chat history error",error)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: "Some problems occurred, please try again." })
            }, 100);
        }
    }
    // const params = { id: 11471862 };

    // QB.content
    //   .getInfo(params)
    //   .then((file) => {
    //     console.log(file)
    //   })
    //   .catch(e => {
    //     // handle error
    //   })
    

    // const contentGetFileUrlParams = { uid: 'fce3d990b5894f8abffc46463262a63100' };
           
    // QB.content
    // .getPrivateURL(contentGetFileUrlParams)
    // .then(function (url) {  
    //     // imaurl = url 
    //     console.log(url)
    // })
    // .catch(function (err) { 
    //     console.log("get url err",err);
    //     return '';
    // })

    //Pick picture
    const launchPicker = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            forceJpg: true,
        }).then((image) => {
            setLoading(true)

            imageUpload(image)

            setCurrentmessage('');
            setAttachmentsfile('');

            setLoading(false);
        }).catch((error) => {
            console.log('pick image in gallery error==========>',error)
        })
    }

    //running camera
    const launchCamera = async () => {
        setLoading(true)
        ImagePicker.openCamera({
            mediaType: 'photo',
            forceJpg: true,
        }).then(image => {
            // console.log(image.path)
            setLoading(true)

            imageget(image)

            setCurrentmessage('');
            setAttachmentsfile('');
            setLoading(false);
        }).catch((error) => {
            console.log('pick image using camera error===========>', error)
        })
        setLoading(false)
    }

    const imageget = async (image)=>{
        const contentUploadParams = {
            url: image.path, // path to file in local file system
            public: false,
        };
        setImagepreview(image.path);
        
        // await QB.content
        //     .upload(contentUploadParams)
        //     .then(function (file) {
        //         setAttachmentsfile({
        //             id:file.uid,
        //             type:file.contentType.includes("image") ? "image" : "file",
        //         });
        //         console.log("pick image",attachmentsfile);
                
        //         QB.chat.sendMessage({
        //             attachments : [{id:file.uid,type:'image'}], 
        //             dialogId : dialog.id, 
        //             body : currentmessage, 
        //             saveToHistory : true 
        //         });
                
        //         setAttachmentsfile('');
        //         messageInputBarRef.current.clear()

        //     })
        //     .catch(function (error) {
        //         setLoading(false)
        //         setTimeout(() => {
        //             presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
        //         }, 100);
        //     });
        //     // sendMessage(currentmessage);
        // setLoading(false)
    }
                // const contentGetFileUrlParams = { uid: 'fce3d990b5894f8abffc46463262a63100' };
                
                // QB.content.getPrivateURL(contentGetFileUrlParams).then(function(url){
                //     console.log("receive",url);

                // }).catch(function(err){
                //     console.log("receive err",attachimage);
                // })
    
    const imageUpload = async (image)=>{
        const contentUploadParams = {
            url: imagepreview, // path to file in local file system
            public: false,
        };
        setLoading(true);
        await QB.content.upload(contentUploadParams)
        .then(function (file) {
            
            setAttachmentsfile({
                id:file.uid,
                type:file.contentType.includes("image") ? "image" : "file",
            });            
            QB.chat.sendMessage({
                attachments : [{id:file.uid,type:'image'}], 
                dialogId : dialog.id, 
                body : currentmessage, 
                saveToHistory : true 
            });
            imagepreview = null;
            setAttachmentsfile('');
            messageInputBarRef.current.clear()
            setLoading(false);
        })
        .catch(function (error) {
            console.log("upload err",error)
            
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        });
        setLoading(false);
    };
    //send message to opponent
    const sendMessage = async (message) => {
        console.log("send message",message)
        if (dialog !== null) {
            setLoading(true);
            // LocalNotification();
            // send message when dialog exist.
            
            imagepreview ? imageUpload(): await QB.chat.sendMessage({attachments:attachmentsfile,dialogId : dialog.id, body : message, saveToHistory : true });
            setImagepreview(null);
            setAttachmentsfile('');
            messageInputBarRef.current.clear()
            
            //send push notification
            // const event = {
            //     notificationType:QB.events.NOTIFICATION_TYPE.PUSH,
            //     payload:Platform.OS === 'ios' ? {
            //         ios_voip:1,
            //         message:message
            //     } : {
            //         message:message
            //     },
            //     recipientsIds:[parseInt(user.qb_id)],
            //     senderId:83596385,
            //     type:QB.events.NOTIFICATION_EVENT_TYPE.ONE_SHOT
            // }
            // // console.log(global.pushsubscription_id,)
            // await QB.events.create(event)
            // .then(function(result) {
            //     console.log("send success", result);
            //  }).catch(function(err){
            //     console.log("messege sendpush notificationerror", err,global.qb_id);
            //  })
            // console.log(parseFloat(global.qb_id))
            setLoading(false)
        } else {
            try {
                // Create and send message when dialog does not exist
                setLoading(true)
                //create dialog using opponent's qb_id
                const dialog = await QB.chat.createDialog({ type: QB.chat.DIALOG_TYPE.CHAT, occupantsIds: [user.qb_id] })
                
                //send message
                imageUpload();
                setImagepreview(null);
                setAttachmentsfile('');
                // await QB.chat.sendMessage({ dialogId: dialog.id, body: message, saveToHistory: true })
                messageInputBarRef.current.clear()
                
                setDialog(dialog)
                setLoading(false)
            } catch (error) {
                console.log("Send message error",error.code)
                setLoading(false)
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 100);
            }
        }
    };

    //remove push notification
    // const removepush = async() => {

    //     const subscriptionsRemoveParams = { id:global.pushsubscription_id };
        
    //     await QB.subscriptions
    //     .remove(subscriptionsRemoveParams)
    //     .then(() => {
    //         console.log("pushnotification subscription removed")
    //     })
    //     .catch(function (e) {
    //         console.log("pushnotification subscription removed",error.code)
    //     });
    // };
    
    //receive messages
    async function receivedNewMessage(event) {
    let imageurl = null;
    let audiourl = null;
    // await loadUser()
        if(event.payload['attachments']){
            if(event.payload['attachments'][0]['type'] === 'image'){
                imageurl = await QB.content.getPrivateURL({uid:event.payload['attachments'][0]['id']});
            }else{
                audiourl = await QB.content.getPrivateURL({uid:event.payload['attachments'][0]['id']});
            }

        }else{
            const url = null;
        }
        setMessages(prevMessages => (GiftedChat.append(prevMessages, [{
            _id: event.payload.id,
            text: event.payload.body,
            createdAt: moment(event.payload.dateSent).toDate(),
            user: {
                _id: event.payload.senderId.toString(),
                avatar: event.payload.senderId.toString() === global.qb_id ? null : getS3StorageURL(userphoto)
            },
            image:imageurl,
            audio:audiourl
            // audio:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            // video:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'

            // image: event.payload.attachments ? QB.content.getPrivateURL(event.payload['attachments'][0]['id']).then(url =>url).catch(err=>{ return null}) : null
        }])));
    }
    function messageStatusHandler(event) {
        // handle message status change
    }
    function systemMessageHandler(event) {
        // handle system message
    }
    function userTypingHandler(event) {
        // handle user typing / stopped typing event
    }

    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visiblePhotoOptions &&
                <ActionSheetModal
                    insets={insets}
                    title={"Send Photo"}
                    cancel={"CANCEL"}
                    content={null}
                    options={["TAKE PHOTO", "PHOTO LIBRARY"]}
                    onOptionPress={(index) => {
                        setVisiblePhotoOptions(false)
                        if (index === 0) {
                            setTimeout(() => {
                                launchCamera()
                            }, 500);
                        } else if (index === 1) {
                            setTimeout(() => {
                                launchPicker()
                            }, 500);
                        }
                    }}
                    onCancelPress={() => {
                        setVisiblePhotoOptions(false)
                    }}
                />
            }
            {
                visibleReportModal &&
                <ConfirmationModal
                    insets={insets}
                    title={"Report"}
                    content={"Are you sure you want to report this user?"}
                    onPositivePress={() => {
                        // console.log(1)
                        setVisibleReportModal(false)
                        reportrequest();
                    }}
                    onNegativePress={() => {
                        setVisibleReportModal(false)
                    }}
                    onClosePress={() => setVisibleReportModal(false)}
                />
            }
            {
                visibleBlockModal &&
                <ConfirmationModal
                    insets={insets}
                    title={"Block"}
                    content={"Are you sure you want to block this user?"}
                    onPositivePress={() => {
                        setVisibleBlockModal(false)
                        blockrequest();
                    }}
                    onNegativePress={() => {
                        setVisibleBlockModal(false)
                    }}
                    onClosePress={() => setVisibleBlockModal(false)}
                />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            {
                user !== null ?
                    <View style={{ flex: 1, paddingBottom: keyboardHeight, backgroundColor: Constants.COLOR.BLUE_LIGHT }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 25, borderBottomWidth: 0.5, borderBottomColor: Constants.COLOR.GRAY_SEPERATOR, backgroundColor: Constants.COLOR.WHITE }}>
                            <TouchableOpacity onPress={onUserPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FastImage
                                    style={{ width: 30, height: 30, borderRadius: 7 }}
                                    source={{
                                        uri: getS3StorageURL(user.photos[0].photo),
                                        priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <Text style={{ marginLeft: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                                    {route.params.type == 'user' ? `${user.name.split(" ")[0]}` : "Support Person"}
                                </Text>
                            </TouchableOpacity>
                            {
                                route.params.type == 'user' &&
                                <View style={{ flexDirection: 'row' }}>
                                    <StyledButton
                                        containerStyle={{ width: 65, height: 28, borderRadius: 4, paddingHorizontal: 0 }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.WHITE }}
                                        title={"Report"}
                                        onPress={onReportPress} />
                                    <StyledButton
                                        containerStyle={{ marginLeft: 7, width: 60, height: 28, borderRadius: 4, backgroundColor: Constants.COLOR.GRAY_DARK, paddingHorizontal: 0 }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.WHITE }}
                                        title={"Block"}
                                        onPress={onBlockPress} />
                                </View>
                            }
                        </View>
                        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }}>
                        {/* <AudioMessageComponent/> */}
                            {recording ? <View style={{
                                position: 'absolute', 
                                top: 0, left: 0, 
                                right: 0, bottom: 0, 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                zIndex:10,
                                flexDirection: 'row'}}>
                                    <TouchableOpacity >
                                        <Image style={{ width: 28, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/mic.png')} />
                                    </TouchableOpacity>
                                    <Text style={{fontSize:Constants.FONT_SIZE.FT20,color:'red'}}>{'Recording'+recordingPosition}</Text>
                            </View>: null }

                            <GiftedChat
                                messageContainerRef={giftedChatRef}
                                messages={messages}
                                isKeyboardInternallyHandled={false}
                                text={text}
                                onInputTextChanged={setText}
                                onLoadEarlier={() => loadChatHistory(limit)}
                                user={{
                                    _id: global.qb_id,
                                }}
                                keyboardShouldPersistTaps={'handled'}
                                wrapInSafeArea={true}
                                alignTop={false}
                                alwaysShowSend={false}
                                showUserAvatar={false}
                                showAvatarForEveryMessage={false}
                                renderAvatarOnTop={true}
                                bottomOffset={22}
                                onPressAvatar={console.log}
                                loadEarlier={loadEarlier}
                                // isLoadingEarlier={true}
                                renderLoadEarlier={renderLoadEarlier}
                                // renderInputToolbar={(props) => renderInputToolbar(props, insets)}
                                renderInputToolbar={(props) => null}
                                renderActions={renderActions}
                                renderComposer={renderComposer}
                                renderSend={renderSend}
                                renderDay={renderDay}
                                renderAvatar={renderAvatar}
                                renderBubble={renderBubble}
                                renderSystemMessage={()=>{renderSystemMessage; consoe.log(1)}}
                                renderMessage={renderMessage}
                                renderMessageText={renderMessageText}
                                renderMessageImage={renderMessageImage}
                                renderMessageAudio={renderMessageAudio}
                                renderCustomView={renderCustomView}
                                renderChatFooter={messages.length == 0 ? renderFooter : null}
                                minComposerHeight={0}
                                maxComposerHeight={0}
                                shouldUpdateMessage={(props, nextProps) =>{
                                    props.extraData !== nextProps.extraData
                                }}
                                
                                minInputToolbarHeight={0}
                                multiline={false}
                                renderChatEmpty={() =>
                                    <EmptyView
                                        containerStyle={{ paddingBottom: 50, transform: [{ scaleY: -1 }] }}
                                        message={"No messages"}
                                        onRefreshPress={() => { }} />
                                }
                                scrollToBottomStyle={{ backgroundColor: Constants.COLOR.BLUE_DIFF, width: 32, height: 32, right: 30 }}
                                scrollToBottom={true}
                                messagesContainerStyle={{ marginBottom: -50, paddingBottom: 0 }}
                                lightboxProps={{ springConfig: { tension: 90000, friction: 90000 } }}
                                parsePatterns={(linkStyle) => [
                                    {
                                        pattern: /#(\w+)/,
                                        style: linkStyle,
                                        onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                                    },
                                ]}
                            />
                        </View>
                        <MessageInputBar
                            ref={messageInputBarRef}
                            insets={insets}
                            bottom={keyboardHeight == 0 ? 22 : 0}
                            preview = {imagepreview}
                            onCameraPress={(sms) => {
                                setVisiblePhotoOptions(true)
                                setCurrentmessage(sms);
                                // console.log(currentmessage, 'MESSAGE========>')
                            }}
                            onSendPress={(message) => {
                                // message.trim() !== "" && sendMessage(message.trim())
                                // imagepreview !== null || message.trim() !=="" && 
                                if(imagepreview !== null || message.trim() !==""){
                                    sendMessage(message.trim())
                                }

                            }} 
                            onRecorderPress = {
                                (message) =>{
                                    // setCurrentmessage(message)
                                    // onStartRecord()
                                    startRecording(message);
                                }
                            }
                            onPausePress = {
                                (message) =>{
                                    // setCurrentmessage(message)
                                    stopRecording(message);
                                }
                            }
                            />
                    </View> :
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 25, borderBottomWidth: 0.5, borderBottomColor: Constants.COLOR.GRAY_SEPERATOR }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginLeft: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                                    {route.params.type == 'user' ? "Loading..." : "Support Person"}
                                </Text>
                            </View>
                        </View>
                    </View>
            }
            {loading && <Spinner visible={true} />}
            <RemotePushController/>
        </View>
    )
};
export default ConversationScreen;