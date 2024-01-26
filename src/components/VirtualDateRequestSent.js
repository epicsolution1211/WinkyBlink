import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import Constants from '../common/Constants';
import StyledButton from './StyledButton';

const VirtualDateRequestSent = ({ item, index, onUserPress, onBlastPress }) => {
    return (
        <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
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
            </View>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <StyledButton
                    containerStyle={{ width: 116, paddingHorizontal: 10, height: 36, borderRadius: 5, backgroundColor: Constants.COLOR.BLACK, alignSelf: 'flex-end' }}
                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}
                    title={"RESCHEDULE"}
                    onPress={() => { }} />
                <StyledButton
                    containerStyle={{ width: 108, marginLeft: 12, paddingHorizontal: 10, height: 36, borderRadius: 5, backgroundColor: Constants.COLOR.WHITE, borderWidth: 1, alignSelf: 'flex-end' }}
                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.BLACK }}
                    title={"WITHDRAW"}
                    onPress={() => { }} />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
})

export default VirtualDateRequestSent;