// import { Vibration } from "react-native"
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification  from'react-native-push-notification';
export const LocalNotification =() =>{
    PushNotification.localNotification({
        channelId : "Roni_channel",
        autoCancel:true,
        bigText:'This is localnotifiation demo in React Native app.',
        subText:'Local Notification Title',
        title:'Local Notification Title',
        message:'Expand me to see more',
        Vibration:300,
        playSound:true,
        soundName:'default',
        actions:'["Yes", "No"]'
    })
}