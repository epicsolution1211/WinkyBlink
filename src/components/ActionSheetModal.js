import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Modal, Text, Keyboard, LayoutAnimation, Platform } from 'react-native';
import Constants from '../common/Constants';
import StyledTextInput from './StyledTextInput';
import StyledButton from './StyledButton';

const ActionSheetModal = ({ title, cancel, content = null, options, insets, onCancelPress, onOptionPress }) => {
    return (
        <Modal transparent style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} >
                <View style={{ paddingHorizontal: 30, backgroundColor: Constants.COLOR.WHITE, paddingTop: 30, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingBottom: insets.bottom + 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                            {title}
                        </Text>
                    </View>
                    {
                        content !== null &&
                        <Text style={{ marginTop: 24, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                            {content}
                        </Text>
                    }
                    <View style={{ marginTop: 24 }}>
                        {
                            options.map((option, index) =>
                                <StyledButton
                                    key={index.toString()}
                                    containerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, borderRadius: 7, backgroundColor: Constants.COLOR.PRIMARY, marginTop: index == 0 ? 0 : 8 }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE }}
                                    title={option}
                                    onPress={() => onOptionPress(index)} />
                            )
                        }
                        <StyledButton
                            containerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, borderRadius: 7, backgroundColor: Constants.COLOR.GRAY_DARK, marginTop: 16 }}
                            textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE }}
                            title={cancel}
                            onPress={onCancelPress} />
                    </View>
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

export default ActionSheetModal;