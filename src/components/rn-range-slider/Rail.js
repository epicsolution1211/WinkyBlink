import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from '../../common/Constants';

const Rail = ({ theme }) => {
    return (
        <View style={[styles.root, { backgroundColor: theme == 'dark' ? Constants.COLOR.GRAY : Constants.COLOR.GRAY_LIGHT, }]} />
    );
};

export default memo(Rail);

const styles = StyleSheet.create({
    root: {
        flex: 1,
        height: 5,
        borderRadius: 10,
    },
});
