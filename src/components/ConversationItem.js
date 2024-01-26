import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import Constants from '../common/Constants';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import { getS3StorageURL } from '../common/Functions';
import moment from 'moment';

const ConversationItem = ({ item, layout, index, onUserPress, onConversationPress }) => {
    const [user, setUser] = useState(null)
    const [oppentId, setOppentId] = useState(null)
    useEffect(() => {
        loadOpponent()
        return () => { };
    }, []);
    const loadOpponent = async () => {
        const opponentQbID = item.occupantsIds.filter((occupantsId) => occupantsId != global.qb_id)[0]
        const response = await axios.get(`apis/load_user_by_qb_id/${opponentQbID}`, { headers: { 'Auth-Token': global.token } })
        setOppentId(opponentQbID)
        setUser(response.data.user)
    }
    return (
        <TouchableOpacity onPress={() => onConversationPress(oppentId)} style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: index % 2 == 0 ? Constants.COLOR.WHITE : Constants.COLOR.BLUE_DIFF
        }}>
            <TouchableOpacity onPress={()=>onUserPress(user.id)} style={{
                width: layout == 'small' ? 45 : 53, height: layout == 'small' ? 45 : 53, borderRadius: 12,
                backgroundColor: Constants.COLOR.WHITE,
                ...Platform.select({
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
                <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    source={
                        user === null ?
                            require('../../assets/images/img_user_placeholder.png')
                            :
                            {
                                priority: FastImage.priority.high,
                                uri: getS3StorageURL(user.photos[0].photo)
                            }
                    } />
            </TouchableOpacity>
            <View style={{ flex: 1, paddingStart: layout == 'small' ? 30 : 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                        {user === null ? '...' : user.name}
                    </Text>
                    {
                        item.unreadMessagesCount > 0 &&
                        <View style={{ marginStart: 10, width: 40, height: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: Constants.COLOR.BLUE_SEPERATOR }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT11, color: Constants.COLOR.WHITE }}>
                                {'NEW'}
                            </Text>
                        </View>
                    }
                </View>
                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                    {item.lastMessage}
                </Text>
            </View>
            <Text style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT10, color: Constants.COLOR.BLACK }}>
                {moment(item.lastMessageDateSent).fromNow()}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.PRIMARY, justifyContent: 'center', alignItems: 'center', borderRadius: 7, flexDirection: 'row', paddingHorizontal: 20
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE, textAlign: 'center'
    }
})

export default ConversationItem;