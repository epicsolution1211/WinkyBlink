import React, { useEffect } from 'react';
import {
    Platform,
    StatusBar,
    Text,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import AuthContext from '../../common/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import auth from "@react-native-firebase/auth";
import QB from 'quickblox-react-native-sdk';

export default function AuthScreen({ navigation }) {
    const { sessionStart } = React.useContext(AuthContext);
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user != null) {
                if (user.providerData[0].providerId === 'password') {
                    loadSavedPassword(user.uid, user.providerData[0].providerId)
                } else {
                    loginToAccount(user.uid, null, user.providerData[0].providerId)
                }
            } else {
                navigation.replace('Start')
            }
        })
        return () => {
            unsubscribe();
        };
    }, []);
    const loadSavedPassword = (uid, providerId) => {
        AsyncStorage.getItem('PASSWORD')
            .then(result => {
                if (result === null) {
                    if (auth().currentUser !== null) {
                        auth().signOut().then(() => console.log('user signed out!'))
                    }
                } else {
                    loginToAccount(uid, result, providerId)
                }
            })
            .catch(() => {
                if (auth().currentUser !== null) {
                    auth().signOut().then(() => console.log('user signed out!'))
                }
            });
    }
    const loginToAccount = async (uid, password, providerId) => {
        try {
            const response = await axios.post(providerId === 'password' ? 'apis/login/' : 'apis/login_social/', providerId === 'password' ? { uid: uid, password: password } : { uid: uid })
            await QB.auth.login({ login: response.data.uid, password: Constants.QUICKBLOX_PASSWORD })

            const connected = await QB.chat.isConnected()
            if (!connected) {
                await QB.chat.connect({ userId: response.data.qb_id, password: Constants.QUICKBLOX_PASSWORD })
            }

            if (response.data.profile_completion === 'COMPLETED') {
                global.token = response.data.token
                global.qb_id = response.data.qb_id

                sessionStart()
            } else {
                navigation.replace('Start')
            }
        } catch (error) {
            navigation.replace('Start')
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
        </View>
    )
}