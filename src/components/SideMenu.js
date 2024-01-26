import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Constants from '../common/Constants';

const SideMenu = ({ insets, onBackPress }) => {
    return (
        <View style={[styles.container, { height: Constants.LAYOUT.HEADER_BAR_HEIGHT + insets.bottom }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.left_icon_container} onPress={onBackPress} >
                    <Image style={styles.left_icon} source={require('../../assets/images/ic_back_white.png')} />
                </TouchableOpacity>
                <Image style={styles.logo} source={require('../../assets/images/ic_nav_logo_white.png')} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH, justifyContent: 'flex-end', backgroundColor: Constants.COLOR.SECONDARY
    },
    left_icon_container: {
        width: 20, height: 20, position: 'absolute', left: 16
    },
    left_icon: {
        width: 12, height: 20, resizeMode: 'contain'
    },
    logo: {
        marginTop: 5, width: 149, height: 40, resizeMode: 'contain'
    },
    header: {
        width: '100%', height: Constants.LAYOUT.HEADER_BAR_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
})

export default SideMenu;