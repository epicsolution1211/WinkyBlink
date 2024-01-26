import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import Constants from '../common/Constants';

const VirtualDateItem = ({ item, index, onUserPress, onBlastPress }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 }}>
            <TouchableOpacity
                onPress={onUserPress}
                style={{
                    width: 53,
                    height: 53,
                    borderRadius: 10,
                    backgroundColor: Constants.COLOR.WHITE,
                }}>
                <Image style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} source={require('../../assets/images/img_demo_profile.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1, paddingStart: 20 }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                    {'Christian'}
                </Text>
                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                    {'Friday, May 20th, at 7PM EST'}
                </Text>
                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                    {'Duration: 30 mins'}
                </Text>
            </View>
            <TouchableOpacity onPress={onBlastPress}>
                <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../assets/images/ic_next_black.png')} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
})

export default VirtualDateItem;