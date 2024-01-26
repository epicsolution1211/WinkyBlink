import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';

const PasswordValidItem = ({ valid, text, containerStyle, }) => {
    return (
        <View style={[styles.container, containerStyle]} >
            <Image style={{ width: valid ? 11 : 11, height: valid ? 8 : 11, resizeMode: 'contain' }} source={valid ? require('../../assets/images/ic_pass_verify.png') : require('../../assets/images/ic_pass_not_verify.png')} />
            <Text style={[styles.text]}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center'
    },
    text: {
        marginStart: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE
    }
})

export default PasswordValidItem;