import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import Constants from '../common/Constants';
import StyledButton from './StyledButton';

const VirtualDateRequestReceived = ({ item, index, onUserPress, onBlastPress }) => {
    return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <StyledButton
                    containerStyle={{ width: 96, paddingHorizontal: 10, height: 36, borderRadius: 5, backgroundColor: Constants.COLOR.PRIMARY, alignSelf: 'flex-end' }}
                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}
                    title={"ACCEPT"}
                    onPress={() => { }} />
                <StyledButton
                    containerStyle={{ width: 116, marginLeft: 12, paddingHorizontal: 10, height: 36, borderRadius: 5, backgroundColor: Constants.COLOR.BLACK, alignSelf: 'flex-end' }}
                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}
                    title={"RESCHEDULE"}
                    onPress={() => { }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
})

export default VirtualDateRequestReceived;