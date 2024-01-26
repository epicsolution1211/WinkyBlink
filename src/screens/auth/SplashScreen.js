import React from 'react';
import {
    Platform,
    StatusBar,
    View
} from 'react-native';
import Constants from '../../common/Constants';

function SplashScreen({ }) {
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
        </View>
    )
}

export default SplashScreen;