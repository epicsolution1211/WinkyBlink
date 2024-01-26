import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Modal, Text, Keyboard, LayoutAnimation, Platform } from 'react-native';
import Constants from '../common/Constants';
import StyledTextInput from './StyledTextInput';

const AddInterestModal = ({ title, insets, placeholder, onClosePress, onAdd }) => {
    const [value, setValue] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const valueTextField = useRef()
    useEffect(() => {
        valueTextField.current.focus()

        const showSubscription = Keyboard.addListener(Platform.OS == 'ios' ? "keyboardWillShow" : "keyboardDidShow", (e) => keyboardDidShow(e));
        const hideSubscription = Keyboard.addListener(Platform.OS == 'ios' ? "keyboardWillHide" : "keyboardDidHide", (e) => keyboardDidHide(e));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const keyboardDidShow = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(event.endCoordinates.height)
    };
    const keyboardDidHide = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    };
    return (
        <Modal transparent style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} >
                <View style={{ paddingHorizontal: 30, backgroundColor: Constants.COLOR.BLACK, borderTopWidth: 1, borderTopColor: Constants.COLOR.PRIMARY, borderLeftWidth: 1, borderLeftColor: Constants.COLOR.PRIMARY, borderRightWidth: 1, borderRightColor: Constants.COLOR.PRIMARY, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingTop: 25, paddingBottom: insets.bottom + (keyboardHeight == 0 ? 24 : 0) + keyboardHeight }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ flex: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClosePress}>
                            <Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../../assets/images/ic_close_white.png')} />
                        </TouchableOpacity>
                    </View>
                    <StyledTextInput
                        ref={valueTextField}
                        containerStyle={{ marginTop: 30 }}
                        placeholder={placeholder}
                        returnKeyType={'done'}
                        value={value}
                        autoCorrect={true}
                        onChangeText={(text) => setValue(text)}
                        onSubmitEditing={() => value.trim() != '' && onAdd(value.trim())} />
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

export default AddInterestModal;