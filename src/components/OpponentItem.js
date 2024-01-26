import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';

const OpponentItem = ({ item, index, onUserPress, onBlastPress }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 }}>
            <TouchableOpacity onPress={onUserPress} style={{
                width: 53, height: 53, borderRadius: 10,
                backgroundColor: Constants.COLOR.WHITE, ...Platform.select({
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
                <Image style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} source={require('../../assets/images/img_demo_profile.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1, paddingStart: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                        {'James'}
                    </Text>
                </View>
                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                    {'Brooklyn, NY'}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.WHITE, justifyContent: 'flex-between', alignItems: 'center', borderRadius: 7, flexDirection: 'row', paddingHorizontal: 20
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK, flex: 1
    }
})

export default OpponentItem;