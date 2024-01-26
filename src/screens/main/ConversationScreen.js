import React, { useEffect, useRef, useState } from 'react';
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
import { renderInputToolbar, renderActions, renderComposer, renderSend, renderLoadEarlier, MessageInputBar } from '../../components/react-native-gifted-chat/InputToolbar';
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


LogBox.ignoreLogs(['new NativeEventEmitter']);
// LogBox.ignoreAllLogs();
function ConversationScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [visibleReportModal, setVisibleReportModal] = useState(false)
    const [visibleBlockModal, setVisibleBlockModal] = useState(false)
    const [visiblePhotoOptions, setVisiblePhotoOptions] = useState(false)
    const [userphoto, setUserphoto] = useState();
    const [user, setUser] = useState(null)
    const [dialog, setDialog] = useState(null)
    const [loading, setLoading] = useState(false)
    const giftedChatRef = useRef()
    const messageInputBarRef = useRef()
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [loadEarlier, setLoadEarlier] = useState(false)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [focused, setFocused] = useState(false)
    const [currentmessage, setCurrentmessage] = useState();
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onUserPress = () => navigation.push('User', {})
    const onReportPress = () => setVisibleReportModal(true)
    const onBlockPress = () => setVisibleBlockModal(true)
    // const [attachmentsfile, setAttachmentsfile] = useState([{id:'fce3d990b5894f8abffc46463262a63100',type:'image'}]); 
    const [attachmentsfile, setAttachmentsfile] = useState([{}]); 


    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", (e) => keyboardDidShow(e));
        const hideSubscription = Keyboard.addListener("keyboardWillHide", (e) => keyboardDidHide(e));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    
    PushNotification.configure({
    //     //when receive notification from sender.
        onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);
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
    useEffect(() => {
        if (focused) {
            loadUser();
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


    useEffect(() => {
        dialog !== null && loadChatHistory(0)
        return () => { };
    }, [dialog]);

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

    const keyboardDidShow = (e) => {
        let height = e.endCoordinates.height;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(height)
    };
    
    const keyboardDidHide = (e) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    };

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
            
            setUser(response.data.user)
            setUserphoto(response.data.user.photos[0].photo);
            dialog !== undefined && setDialog(dialog)
            setLoading(false)
        } catch (error) {
            console.log('load_user_by_qb_id', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    //load chatting history
    const loadChatHistory = async (skip) => {
        try {
            //get chat log 
            const result = await QB.chat.getDialogMessages({
                dialogId: dialog.id,
                sort: {
                    ascending: false,
                    field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT
                },
                skip: skip,
                markAsRead: false
            })
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
                if (item.attachments) {
                    const contentGetFileUrlParams = { uid: item.attachments[0]['id'] };
                    
                    await QB.content
                    .getPrivateURL(contentGetFileUrlParams)
                    .then(function (url) {  
                        imageurl = url;            
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
                    image: imageurl
                };
            }));
    
            setMessages(messages);
        } catch (error) {
            console.log("load chat history error",error)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
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
            console.log(error)
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

            imageUpload(image)

            setCurrentmessage('');
            setAttachmentsfile('');
            setLoading(false);
        }).catch((error) => {
            console.log(error)
        })
        setLoading(false)
    }

    const imageUpload = async (image)=>{
        const contentUploadParams = {
            url: image.path, // path to file in local file system
            public: false,
        };
        setLoading(true)
        await QB.content
            .upload(contentUploadParams)
            .then(function (file) {
                setAttachmentsfile({
                    id:file.uid,
                    type:file.contentType.includes("image") ? "image" : "file",
                });
                console.log("pick image",attachmentsfile);
                
                QB.chat.sendMessage({
                    attachments : [{id:file.uid,type:'image'}], 
                    // attachments:attachmentsfile,
                    dialogId : dialog.id, 
                    body : currentmessage, 
                    saveToHistory : true 
                });
                
                setAttachmentsfile('');
                messageInputBarRef.current.clear()

            })
            .catch(function (error) {
                setLoading(false)
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 100);
            });
            // sendMessage(currentmessage);
        setLoading(false)
    }
                // const contentGetFileUrlParams = { uid: 'fce3d990b5894f8abffc46463262a63100' };
                
                // QB.content.getPrivateURL(contentGetFileUrlParams).then(function(url){
                //     console.log("receive",url);

                // }).catch(function(err){
                //     console.log("receive err",attachimage);
                // })
                
    //send message to opponent
    const sendMessage = async (message) => {
        if (dialog !== null) {
            setLoading(true)
            // LocalNotification();
            // send message when dialog exist.
            // console.log("send",attachmentsfile)
            console.log("send",attachmentsfile)
            await QB.chat.sendMessage({
                // attachments : [{id:'fce3d990b5894f8abffc46463262a63100',type:'image'}], 
                attachments:attachmentsfile,
                dialogId : dialog.id, 
                body : message, 
                saveToHistory : true 
            });
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
                await QB.chat.sendMessage({ dialogId: dialog.id, body: message, saveToHistory: true })
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
    
    await loadUser()
    const url = event.payload['attachments'] ? await QB.content.getPrivateURL({uid:event.payload['attachments'][0]['id']}) : null;
    setMessages(prevMessages => (GiftedChat.append(prevMessages, [{
        _id: event.payload.id,
        text: event.payload.body,
        createdAt: moment(event.payload.dateSent).toDate(),
        user: {
            _id: event.payload.senderId.toString(),
            avatar: event.payload.senderId.toString() === global.qb_id ? null : getS3StorageURL(user.photos[0].photo)
        },
        image:url

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
                        setVisibleReportModal(false)
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
                            <GiftedChat
                                messageContainerRef={giftedChatRef}
                                messages={messages}
                                isKeyboardInternallyHandled={false}
                                text={text}
                                onInputTextChanged={setText}
                                onLoadEarlier={() => loadChatHistory(messages.length)}
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
                                renderSystemMessage={renderSystemMessage}
                                renderMessage={renderMessage}
                                renderMessageText={renderMessageText}
                                renderMessageImage={renderMessageImage}
                                renderCustomView={renderCustomView}
                                renderChatFooter={messages.length == 0 ? renderFooter : null}
                                minComposerHeight={0}
                                maxComposerHeight={0}
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
                            onCameraPress={(sms) => {
                                setVisiblePhotoOptions(true)
                                setCurrentmessage(sms);
                                console.log(currentmessage, 'MESSAGE========>')
                            }}
                            onSendPress={(message) => {
                                message.trim() !== "" && sendMessage(message.trim())
                            }} />
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
}

export default ConversationScreen;