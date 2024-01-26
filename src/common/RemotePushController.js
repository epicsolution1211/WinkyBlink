import React, {useEffect} from'react';
import PushNotification from'react-native-push-notification'

const RemotePushController = () => {
    useEffect(() => {
        PushNotification.configure({
            onRegister: function (token) {
                // console.log('TOKEN:', token);
            },
            onNotification: function (notification) {
                console.log('Remote NOTIFICATION:', notification);
            },
            senderIDL:'1012302153983',
            popInitialNotification: true,
            requestPermissions: true,
        })
    },[])
    return null;
}

export default RemotePushController;