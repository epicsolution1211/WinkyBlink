import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';
import StyledButton from './StyledButton';

const EmptyView = ({ message, containerStyle, onRefreshPress = null }) => {
    return (
        <View style={[containerStyle, { alignItems: 'center' }]}>
            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT16, color: Constants.COLOR.BLACK }}>
                {message}
            </Text>
            {
                onRefreshPress !== null &&
                <StyledButton
                    containerStyle={{ marginTop: 16, width: 110, paddingHorizontal: 10, height: 36, borderRadius: 6 }}
                    textStyle={{ fontSize: Constants.FONT_SIZE.FT16, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI }}
                    title={"REFRESH"}
                    onPress={onRefreshPress} />
            }
        </View>
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

export default EmptyView;