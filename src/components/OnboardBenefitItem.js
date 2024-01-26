import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';

const OnboardBenefitItem = ({ text, containerStyle, }) => {
    return (
        <View style={[styles.container, containerStyle]} >
            <Image style={{ width: 20, height: 15, resizeMode: 'contain' }} source={require('../../assets/images/ic_plan_allow.png')} />
            <Text style={[styles.text]}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    text: {
        marginStart: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE
    }
})

export default OnboardBenefitItem;