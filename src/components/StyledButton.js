import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';

const StyledButton = ({ title, icon = null, containerStyle, textStyle, onPress }) => {
    return (
        <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
            {
                icon !== null && icon
            }
            <Text style={[styles.text, textStyle]}>
                {title}
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

export default StyledButton;