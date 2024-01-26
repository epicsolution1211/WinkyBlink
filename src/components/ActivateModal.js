import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Modal, Text, Keyboard, LayoutAnimation, Platform } from 'react-native';
import Constants from '../common/Constants';
import StyledTextInput from './StyledTextInput';
import StyledButton from './StyledButton';

const ActivateModal = ({ title, content, insets, onClosePress, onActivatePress }) => {
    return (
        <Modal transparent style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} >
                <View style={{ paddingHorizontal: 30, backgroundColor: Constants.COLOR.WHITE, paddingTop: 25, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingBottom: insets.bottom + 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ flex: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClosePress}>
                            <Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../../assets/images/ic_close_about.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 24, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                        {content}
                    </Text>
                    <StyledButton
                        containerStyle={{ marginTop: 24 }}
                        textStyle={{}}
                        title={"ACTIVATE NOW"}
                        onPress={onActivatePress} />
                    <TouchableOpacity onPress={onClosePress} style={{ marginTop: 14, alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.PRIMARY }}>
                            {"Skip"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View >
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.PRIMARY, justifyContent: 'center', alignItems: 'center', borderRadius: 7
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE
    }
})

export default ActivateModal;