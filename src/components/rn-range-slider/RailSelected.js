import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from '../../common/Constants';

const RailSelected = (props) => {
    return (
        <View style={[styles.root, { backgroundColor: props.color }]} />
    );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
    root: {
        height: 5,
        borderRadius: 10,
        backgroundColor: Constants.COLOR.PRIMARY,
    },
});
