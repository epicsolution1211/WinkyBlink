import React, { useEffect, useState } from 'react'
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Constants from '../common/Constants';

const Spinner = (props: { visible: boolean; textContent: string, textStyle: any }) => {
    if (props.visible) {
        return (
            <Modal transparent style={{ flex: 1 }}>
                <View style={[styles.container, { backgroundColor: Constants.COLOR.BLACK_01 }]} >
                    <ActivityIndicator animating={props.visible} size="large" color={Constants.COLOR.WHITE} />
                    <Text style={[styles.message, { color: Constants.COLOR.WHITE }]}>
                        {props.textContent}
                    </Text>
                </View >
            </Modal>
        )
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
    },
    message: {
        textAlign: 'center', marginTop: 10, fontSize: Constants.FONT_SIZE.FT22, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR
    }
})

export default Spinner;