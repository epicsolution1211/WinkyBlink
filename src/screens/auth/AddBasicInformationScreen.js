import React, { useEffect, useRef, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import StyledTextInput from '../../components/StyledTextInput';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { presentToastMessage } from '../../common/Functions';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';

function AddBasicInformationScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [gender, setGender] = useState('Male')
    const [zipCode, setZipCode] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const emailTextFieldRef = useRef()
    const zipcodeTextFieldRef = useRef()
    const [currentLongtitude, setCurrentLongtitude] = useState('..');
    const [currentLatitude, setCurrentLatitude] = useState('..');

    useEffect(() => {
        getOneTimeLocation();
    }, [])

    const getOneTimeLocation  = async () =>{
        Geolocation.getCurrentPosition(
            async (position) => {
                const currentLongtitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);

                setCurrentLongtitude(currentLongtitude);
                setCurrentLatitude(currentLatitude);
            },(error) => {
                console.log("getcurrentPosition error", error);
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 500 }
        )
    }

    const onNextPress = () => {
        if (route.params.name_required && name === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your name." })
        }
        if (email === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your email address." })
        }
        if (zipCode === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter your zip code." })
        }
        if (dateOfBirth === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please choose your birthday." })
        }
        saveUserInformation()
    }
    const saveUserInformation = async () => {
        try {
            let parameters = {
                'gender': gender,
                'email': email,
                'zip_code': zipCode,
                'date_of_birth': moment(dateOfBirth).format('YYYY-MM-DD'),
                'latitude':currentLatitude,
                'longtide':currentLongtitude
            }
            if (route.params.name_required) {
                parameters['name'] = name
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            setLoading(true)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)
            setTimeout(() => {
                navigation.push("Onboarding")
            }, 100);
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {"Basic Information"}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <View style={{ marginTop: 40, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"I am a:"}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: gender == 'Male' ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: gender == 'Male' ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={"Male"}
                                onPress={() => setGender('Male')} />
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: gender == 'Female' ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: gender == 'Female' ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={"Female"}
                                onPress={() => setGender('Female')} />
                        </View>
                    </View>
                    {
                        route.params.name_required &&
                        <StyledTextInput
                            containerStyle={{ marginTop: 30 }}
                            placeholder={"Name"}
                            autoCapitalize={'words'}
                            value={name}
                            returnKeyType={'next'}
                            onSubmitEditing={() => zipcodeTextFieldRef.current.focus()}
                            onChangeText={(text) => setName(text)} />
                    }
                    <StyledTextInput
                        ref={emailTextFieldRef}
                        containerStyle={{ marginTop: route.params.name_required ? 20 : 30 }}
                        placeholder={"Email"}
                        value={email}
                        keyboardType={'email-address'}
                        returnKeyType={'next'}
                        onSubmitEditing={() => zipcodeTextFieldRef.current.focus()}
                        onChangeText={(text) => setEmail(text)} />
                    <StyledTextInput
                        ref={zipcodeTextFieldRef}
                        containerStyle={{ marginTop: 20 }}
                        placeholder={"Zip code"}
                        value={zipCode}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        onChangeText={(text) => setZipCode(text)} />
                    <Text style={{ marginTop: 20, alignSelf: 'flex-start', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                        {"Date of Birth"}
                    </Text>
                    <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18 }}>
                        <StyledTextInput
                            type={'datetime'}
                            mode={'date'}
                            format={'MM'}
                            minimumDate={moment().add(-100, 'year').startOf('year').toDate()}
                            maximumDate={moment().add(-18, 'year').endOf('year').toDate()}
                            defaultDate={moment().add(-19, 'year').startOf('year').toDate()}
                            containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 96) / 3 }}
                            textStyle={{ textAlign: 'center' }}
                            placeholder={"MM"}
                            value={dateOfBirth}
                            onChangeText={(text) => setDateOfBirth(text)} />
                        <StyledTextInput
                            type={'datetime'}
                            mode={'date'}
                            format={'DD'}
                            minimumDate={moment().add(-100, 'year').toDate()}
                            maximumDate={moment().add(-18, 'year').toDate()}
                            defaultDate={moment().add(-19, 'year').startOf('year').toDate()}
                            containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 96) / 3 }}
                            textStyle={{ textAlign: 'center' }}
                            placeholder={"DD"}
                            value={dateOfBirth}
                            onChangeText={(text) => setDateOfBirth(text)} />
                        <StyledTextInput
                            type={'datetime'}
                            mode={'date'}
                            format={'YY'}
                            minimumDate={moment().add(-100, 'year').toDate()}
                            maximumDate={moment().add(-18, 'year').toDate()}
                            defaultDate={moment().add(-19, 'year').startOf('year').toDate()}
                            containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 96) / 3 }}
                            textStyle={{ textAlign: 'center' }}
                            placeholder={"YY"}
                            value={dateOfBirth}
                            onChangeText={(text) => setDateOfBirth(text)} />
                    </View>
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"NEXT"}
                    onPress={onNextPress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default AddBasicInformationScreen;