import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';
import FastImage from 'react-native-fast-image';
import { calculateAge, getS3StorageURL } from '../common/Functions';

const SwipeCard = ({ user, insets, onUndoPress, onBlastPress, onUpPress }) => {
    if (user === undefined) {
        return null
    }
    return (
        <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT - insets.top - Constants.LAYOUT.HEADER_BAR_HEIGHT, backgroundColor: Constants.COLOR.BLACK }}>
            <FastImage
                style={{ width: '100%', height: '100%' }}
                source={{
                    priority: FastImage.priority.high,
                    uri: getS3StorageURL(user.photo)
                }}
                resizeMode={FastImage.resizeMode.cover} />
            <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, position: 'absolute', top: 20, flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={onUndoPress} style={{}}>
                    <Image style={{ width: 32, height: 33, resizeMode: 'contain' }} source={require('../../assets/images/ic_undo.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onBlastPress} style={{}}>
                    <Image style={{ width: 47, height: 48, resizeMode: 'contain' }} source={require('../../assets/images/ic_blast_wish_list.png')} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onUpPress} style={{ position: 'absolute', bottom: 25, alignSelf: 'center' }}>
                <Image style={{ width: 47, height: 47, resizeMode: 'cover', tintColor: Constants.COLOR.WHITE }} source={require('../../assets/images/ic_swipe_up.png')} />
            </TouchableOpacity>
            <View style={{ position: 'absolute', right: 0, bottom: 96, backgroundColor: 'rgba(0,0,0,0.3)', borderTopLeftRadius: 14, borderBottomLeftRadius: 14, paddingTop: 15, paddingBottom: 15, paddingLeft: 25, paddingRight: 20, alignItems: 'flex-start' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                        {`${user.name}`}
                    </Text>
                    {
                        user.is_winky_badge_enabled === '1' &&
                        <View style={{ marginLeft: 20, marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ position: 'absolute', alignSelf: 'center', width: 24, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/ic_winky_premium.png')} />
                        </View>
                    }
                </View>
                <Text style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                    {`${calculateAge(user.date_of_birth)} yrs old`}
                </Text>
                <View style={{ marginTop: 10, backgroundColor: Constants.COLOR.PRIMARY, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT10, color: Constants.COLOR.WHITE }}>
                        {`Level ${user.verification_level} verified`}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default SwipeCard;