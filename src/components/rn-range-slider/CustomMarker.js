import React from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from '../../common/Constants';

class CustomMarker extends React.Component {
    render() {
        return (
            <View style={styles.image} />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 20,
        width: 20,
        backgroundColor: Constants.COLOR.PRIMARY,
        borderRadius: 10,
        borderColor: Constants.COLOR.WHITE,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        zIndex: 1000,
    },
});

export default CustomMarker;