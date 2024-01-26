import {
    Alert
} from 'react-native';
import Constants, { Key } from './Constants';
import Toast, { } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const presentAlertMessage = ({ title = null, message }) => {
    Alert.alert(
        title,
        message
    );
}

export const presentToastMessage = ({ type, position, title = null, message }) => {
    Toast.show({
        type: type,
        position: position,
        text1: title,
        text2: message,
    });
}

export const getS3StorageURL = (filename) => {
    return "https://s3." + Constants.AWS.REGION + ".amazonaws.com/" + Constants.AWS.BUCKET_NAME + "/dev/" + filename
}

export const getFilenameFromS3StorageURL = (url) => {
    return url.replace("https://s3." + Constants.AWS.REGION + ".amazonaws.com/" + Constants.AWS.BUCKET_NAME + "/dev/", "")
}

export const isEmailValid = ({ email }) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email) === false) {
        return false;
    } else {
        return true;
    }
}

export const increaseSwipeCountAndNeedCompatibility = async () => {
    try {
        const result = await AsyncStorage.getItem("SWIPE_COUNT")
        if (result === null) {
            await AsyncStorage.setItem('SWIPE_COUNT', '1')
            return false
        } else {
            const swipeCount = parseInt(result) + 1
            await AsyncStorage.setItem('SWIPE_COUNT', swipeCount.toString())
            return swipeCount % 35 == 0
        }
    } catch (error) {
        throw error
    }
}

export const calculateAge = (birthdate) => {
    if (birthdate === '') {
        return ''
    }
    const today = new Date();
    const birthDate = new Date(birthdate);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the birthdate's month and day are later in the year than today's month and day, subtract one year.
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

export const inchesToHumanReadable = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;

    let result = '';

    if (feet > 0) {
        result += `${feet}'`;
    }

    if (remainingInches > 0) {
        if (feet > 0) {
            result += ' ';
        }
        result += `${remainingInches}"`;
    }

    if (result === '') {
        result = '';
    }

    return result;
}

export const Base64 = ({ type, input = '' }) => {
    if (type == 'btoa') {
        let str = input;
        let output = '';

        for (let block = 0, charCode, i = 0, map = Constants.KEY.CHARS;
            str.charAt(i | 0) || (map = '=', i % 1);
            output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

            charCode = str.charCodeAt(i += 3 / 4);

            if (charCode > 0xFF) {
                throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
            }

            block = block << 8 | charCode;
        }

        return output;
    } else if (type == 'atob') {
        let str = input.replace(/=+$/, '');
        let output = '';

        if (str.length % 4 == 1) {
            // throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
            return ""
        }
        for (let bc = 0, bs = 0, buffer, i = 0;
            buffer = str.charAt(i++);

            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            buffer = Constants.KEY.CHARS.indexOf(buffer);
        }

        return output;
    } else {
        return ""
    }
}