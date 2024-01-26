import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from '../../common/Constants';

const Label = ({ text, ...restProps }) => {
    return (
        <View style={styles.root} {...restProps}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 4,
        backgroundColor: '#4499ff',
        borderRadius: 4,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR
    },
});

export default memo(Label);
