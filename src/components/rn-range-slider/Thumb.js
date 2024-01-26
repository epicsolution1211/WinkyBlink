import React, { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Constants from '../../common/Constants';

const THUMB_RADIUS = 18;

const Thumb = (props) => {
    return (
        <View style={[styles.root, { backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }]} >
            <Image
                style={{ width: 36, height: 28, resizeMode: 'contain' }}
                source={require('../../../assets/images/ic_slider_thumb.png')} />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        borderRadius: THUMB_RADIUS,
        backgroundColor: Constants.COLOR.TRANSPARENT,
        zIndex: 1000,
    },
});

export default memo(Thumb);
