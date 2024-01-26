import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image,
    NativeEventEmitter,
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConversationItem from '../../components/ConversationItem';
import QB from 'quickblox-react-native-sdk';
import EmptyView from '../../components/EmptyView';

function ConversationsScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [dialogs, setDialogs] = useState([])
    useEffect(() => {
        loadConversations()
        return () => { };
    }, []);
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
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onRefresh = () => { loadConversations() }
    const loadConversations = async () => {
        const result = await QB.chat.getDialogs({})
        setDialogs(result.dialogs)
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
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                {'My Conversations'}
            </Text>
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                data={dialogs}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 0, backgroundColor: Constants.COLOR.BLACK }} />}
                renderItem={({ item, index }) =>
                    <ConversationItem
                        item={item}
                        index={index}
                        layout={'big'}
                        onUserPress={() => navigation.push('User', {})}
                        onConversationPress={(opponentQbID) => navigation.push('Conversation', { type: 'user', id: opponentQbID })} />
                }
                keyExtractor={item => item.id}
                ListEmptyComponent={() =>
                    <EmptyView
                        containerStyle={{ paddingTop: 50 }}
                        message={"No converstaions"}
                        onRefreshPress={loadConversations}
                    />
                }
            />
        </View>
    )
}

export default ConversationsScreen;