import React, { } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Constants from '../common/Constants';

const NavigationHeaderSecondary = ({ insets, backgroundColor, onBackPress = null, onNotificationPress = null, onHomePress = null, onMenuPress = null, backType = 'Back' }) => {
    return (
        <View style={[styles.container, { height: Constants.LAYOUT.HEADER_BAR_HEIGHT + insets.top, backgroundColor: backgroundColor }]}>
            <View style={styles.header}>
                {
                    onBackPress !== null &&
                    <TouchableOpacity style={styles.left_icon_container} onPress={onBackPress} >
                        <Image style={backType == 'Back' ? styles.back_icon : styles.close_icon} source={backType == 'Back' ? require('../../assets/images/ic_back_black.png') : require('../../assets/images/ic_close_about.png')} />
                    </TouchableOpacity>
                }
                <Image style={[styles.logo, onBackPress !== null ? {} : { position: 'absolute', left: 20 }]} source={require('../../assets/images/ic_nav_logo_black.png')} />
                {
                    onNotificationPress != null &&
                    <TouchableOpacity style={styles.notification_icon_container} onPress={onNotificationPress} >
                        <Image style={styles.notification_icon} source={require('../../assets/images/ic_nav_notification.png')} />
                    </TouchableOpacity>
                }
                {
                    onHomePress != null &&
                    <TouchableOpacity style={styles.home_icon_container} onPress={onHomePress} >
                        <Image style={styles.home_icon} source={require('../../assets/images/ic_nav_home.png')} />
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.menu_icon_container} onPress={onMenuPress} >
                    <Image style={styles.menu_icon} source={require('../../assets/images/ic_nav_menu.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH, justifyContent: 'flex-end', backgroundColor: Constants.COLOR.BLUE_LIGHT,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.18,
                shadowRadius: 4.59,
            },
            android: {
                elevation: 5,
            },
        })
    },
    left_icon_container: {
        width: 20, height: 20, position: 'absolute', left: 16
    },
    back_icon: {
        width: 12, height: 20, resizeMode: 'contain'
    },
    close_icon: {
        width: 16, height: 16, resizeMode: 'contain'
    },
    notification_icon_container: {
        width: 22, height: 23, bottom: 14, position: 'absolute', right: 56
    },
    notification_icon: {
        width: 22, height: 23, resizeMode: 'contain'
    },
    home_icon_container: {
        width: 20, height: 23, bottom: 14, position: 'absolute', right: 56
    },
    home_icon: {
        width: 20, height: 23, resizeMode: 'contain'
    },
    menu_icon_container: {
        width: 24, height: 20, position: 'absolute', right: 16
    },
    menu_icon: {
        width: 24, height: 17, resizeMode: 'contain'
    },
    logo: {
        width: 149, height: 29, resizeMode: 'contain'
    },
    header: {
        width: '100%', height: Constants.LAYOUT.HEADER_BAR_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
})

export default NavigationHeaderSecondary;