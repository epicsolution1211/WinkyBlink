import React, { forwardRef, useState } from 'react';
import { Image, Platform, View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { InputToolbar, Composer, Send, LoadEarlier } from 'react-native-gifted-chat';
import Constants from '../../common/Constants';

export const MessageInputBar = forwardRef(({ message_content,bottom, onSendPress, onCameraPress }, ref) => {
    const [message, setMessage] = useState('')
    return (
        <View
            style={{
                backgroundColor: Constants.COLOR.BLUE_LIGHT,
                width: Constants.LAYOUT.SCREEN_WIDTH,
                height: 90 + bottom,
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
            }}>
            <View style={{ minHeight: 56, width: Constants.LAYOUT.SCREEN_WIDTH - 50, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(241,241,241,1)', borderRadius: 10, alignSelf: 'center', marginTop: 17, paddingLeft: 10, paddingRight: 17 }}>
                <TouchableOpacity onPress={()=>onCameraPress(message)}>
                    <Image style={{ width: 28, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_chat_camera.png')} />
                </TouchableOpacity>
                {/* <View style={{}}> <View/> */}
                {/* <Image style={{ width: 28, height: 100, resizeMode: 'contain' }} src={'https://api.quickblox.com/blobs/fce3d990b5894f8abffc46463262a63100?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOjEwMjQ4MCwiaWF0IjoxNzA2Mjc4MTA2MzA5NjEzfQ.EQOQNSuePwAHfCrtE0rJuzEAZDxfyMHWsqf6QPssgYNRZM1111p-jFz-vmpdaA-CbonHX9Q0C8A7YxWqL8zu1A'} /> */}
                <TextInput
                    ref={ref}
                    value={message}
                    message_content = {message}
                    placeholder={'Write a message...'}
                    onChangeText={(text) => setMessage(text)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    keyboardType={'default'}
                    returnKeyType={'send'}
                    style={{ flex: 1, marginLeft: 13, marginRight: 13, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}
                    selectionColor={Constants.COLOR.BLACK}
                    placeholderTextColor={Constants.COLOR.BLACK} />
                <TouchableOpacity onPress={() => onSendPress(message)}>
                    <Image style={{ width: 19, height: 16, resizeMode: 'contain' }} source={require('../../../assets/images/ic_send.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
})

export const renderInputToolbar = (props) => {
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                backgroundColor: Constants.COLOR.BLUE_LIGHT,
                paddingHorizontal: 20,
                paddingTop: 17,
                paddingBottom: 5,
                borderTopWidth: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
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
            primaryStyle={{ alignItems: 'center' }}
        />
    )
}

export const renderLoadEarlier = (props) => (
    <LoadEarlier
        {...props}
        containerStyle={{
            backgroundColor: Constants.COLOR.TRANSPARENT,
        }}
        wrapperStyle={{
            backgroundColor: Constants.COLOR.TRANSPARENT,
        }}
        textStyle={{
            color: Constants.COLOR.BLACK,
            paddingHorizontal: 4,
            fontSize: Constants.FONT_SIZE.FT12,
            fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR
        }}
        label={'Load earlier messages'}
        activityIndicatorColor={Constants.COLOR.BLACK}
    />
)

export const renderActions = (props) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%', backgroundColor: Constants.COLOR.WHITE }}>
            <TouchableOpacity onPress={() => props.onAttachmentImagePress()} style={{ marginStart: 6, width: 36, height: 36, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 28, height: 25, resizeMode: 'contain' }} source={require('../../../assets//images/ic_chat_camera.png')} />
            </TouchableOpacity>
        </View>
    )
}

export const renderComposer = (props) => (
    <Composer
        {...props}
        textInputStyle={{
            backgroundColor: Constants.COLOR.WHITE,
            paddingStart: 13,
            height: 22,
            backgroundColor: 'gray',
            paddingEnd: 62,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 10,
            paddingBottom: 10,
            fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM,
            fontSize: Constants.FONT_SIZE.FT22,
            color: Constants.COLOR.BLACK
        }}
        textInputProps={{
            selectionColor: Constants.COLOR.BLACK,
            placeholderTextColor: Constants.COLOR.GRAY_LIGHT
        }}
        placeholder={'Write a message'}
    />
);

export const renderSend = (props) => (
    <Send
        {...props}
        disabled={!props.text}
        containerStyle={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 6,
            bottom: 6,
            overflow: 'visible',
            backgroundColor: 'red'
        }}
    >
        <Image source={require('../../../assets//images/ic_send.png')} style={{ width: 19, height: 16 }} />
    </Send>
);