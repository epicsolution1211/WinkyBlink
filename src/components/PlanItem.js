import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';

const PlanItem = ({ plan, index, selected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ marginTop: 35, width: Constants.LAYOUT.SCREEN_WIDTH - 60, paddingBottom: 20, borderRadius: 12, backgroundColor: Constants.COLOR.WHITE, alignItems: 'center', borderWidth: 4, borderColor: selected ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}>
            <Image style={{ position: 'absolute', top: -10, width: 74, height: 58, resizeMode: 'contain' }} source={require('../../assets/images/ic_logo_membership.png')} />
            <Text style={{ marginTop: 70, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.SECONDARY, fontWeight: '800', fontSize: Constants.FONT_SIZE.FT40, color: Constants.COLOR.BLACK }}>
                {plan.title}
            </Text>
            <Text style={{ marginTop: 4, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                {plan.subtitle}
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

export default PlanItem;