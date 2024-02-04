/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, Text } from 'react-native';
// import {RNVoiceMessagePlayer} from 'react-native-voice-message-player';
// import RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';
import { Avatar, Bubble, SystemMessage, Message, Day, MessageText, MessageImage, TouchableOpacity } from 'react-native-gifted-chat';
import moment from 'moment'
import Constants from '../../common/Constants';

export const renderAvatar = (props) => (
    <Avatar
        {...props}
        containerStyle={{ left: { marginRight: 0 }, right: {} }}
        imageStyle={{ left: {}, right: {} }}
    />
);

export const renderBubble = (props) => (
    <Bubble
        {...props}
        // renderTicks={() => <Text>Ticks</Text>}
        renderTime={() =>
            <Text style={{ lineHeight: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT12, color: Constants.COLOR.GRAY_LIGHT }}>
                {moment(props.currentMessage.createdAt).format('LT')}
            </Text>
        }
        containerStyle={{
            left: {
                borderColor: Constants.COLOR.TRANSPARENT, borderWidth: 0, marginLeft: 0, marginRight: 0
            },
            right: {
                borderColor: Constants.COLOR.TRANSPARENT, borderWidth: 0, marginLeft: 0, marginRight: 0
            },
        }}
        wrapperStyle={{
            left: {
                backgroundColor: Constants.COLOR.TRANSPARENT, borderColor: Constants.COLOR.WHITE, borderWidth: 0, marginRight: 20
            },
            right: {
                backgroundColor: Constants.COLOR.TRANSPARENT, borderColor: Constants.COLOR.WHITE, borderWidth: 0, marginRight: 20
            },
        }}
        bottomContainerStyle={{
            left: {
                borderColor: Constants.COLOR.BLUE_LIGHT, borderWidth: 0
            },
            right: {
                borderColor: Constants.COLOR.BLUE_LIGHT, borderWidth: 0
            },
        }}
        tickStyle={{}}
        usernameStyle={{
            color: Constants.COLOR.BLACK, fontSize: 0
        }}
        containerToNextStyle={{
            left: {},
            right: {},
        }}
        containerToPreviousStyle={{
            left: {},
            right: {},
        }}
    />
);

export const renderSystemMessage = (props) => (
    <SystemMessage
        {...props}
        containerStyle={{ backgroundColor: Constants.COLOR.BLACK }}
        wrapperStyle={{ backgroundColor: Constants.COLOR.BLACK }}
        textStyle={{ color: Constants.COLOR.GRAY_LIGHT, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14 }}
    />
);

export const renderMessage = (props) => (
    <Message
        {...props}
        renderDay={renderDay}
        containerStyle={{
            left: {},
            right: {},
        }}
    />
);

export const renderDay = (props) => (
    <Day
        {...props}
        containerStyle={{ alignItems: 'center' }}
        wrapperStyle={{}}
        textStyle={{ textAlign: 'center', fontWeight: '500', color: Constants.COLOR.GRAY_LIGHT, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT14, marginTop: 15 }}
    />
);

export const renderMessageText = (props) => 
(
    
    <MessageText
        {...props}
        containerStyle={{
            left: { backgroundColor: '#F2F2F2', padding: 0, borderRadius: 15, borderBottomLeftRadius: 0, paddingVertical: 7, paddingHorizontal: 7 },
            right: { backgroundColor: '#A6E1E4', padding: 0, borderRadius: 15, borderBottomRightRadius: 0, paddingVertical: 7, paddingHorizontal: 7 },
        }}
        textStyle={{
            left: { color: Constants.COLOR.BLACK, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16 },
            right: { color: Constants.COLOR.BLACK, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16 },
        }}
        linkStyle={{
            left: { color: Constants.COLOR.BLACK, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16 },
            right: { color: Constants.COLOR.BLACK, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16 },
        }}
        customTextStyle={{ fontSize: Constants.FONT_SIZE.FT16, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM }}
    />
);

export const renderMessageImage = (props) => (
    <MessageImage
        {...props}
        containerStyle={{
            backgroundColor: Constants.COLOR.TRANSPARENT
        }}
        imageStyle={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            marginBottom: 0,
            width: Constants.LAYOUT.SCREEN_WIDTH - 150,
            height: 150,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            backgroundColor: Constants.COLOR.TRANSPARENT,
            resizeMode: "cover",
            overflow: 'hidden',
        }}
        lightboxProps={{
            // renderHeader(close) { 
            //     return (
            //         <TouchableOpacity style={{position: 'absolute', right: 15, top: 15, backgroundColor: Constants.COLOR.WHITE}} onPress={close}>
            //         </TouchableOpacity>   
            //     )
            // },
            springConfig: { tension: 90000, friction: 90000 }
        }}
    />
)

// export const renderMessageAudio = (props) => (
//     <MessageAudio {...props}/>
// )

export const renderCustomView = (props) => {
    return null
}

export const renderFooter = (props) => {
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            </View>
        </View>
    )
}