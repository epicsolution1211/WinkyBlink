import React, { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    View,
    Text,
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import StyledButton from '../../components/StyledButton';
import StyledSlider from '../../components/StyledSlider';
import StyledTextInput from '../../components/StyledTextInput';
import StyledDropdown from '../../components/StyledDropdown';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';
import { useFocusEffect } from '@react-navigation/native';

function ProfilePreferencesScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [lookingFor, setLookingFor] = useState(Constants.PREFERENCE_LOOKING_FOR_OPTIONS[2])
    const [ageRange, setAgeRange] = useState({ low: 18, high: 70 })
    const [distanceRange, setDistanceRange] = useState({ low: 0, high: 100 })
    const [heightRequirement, setHeightRequirement] = useState({ min: '', max: '' })
    const [hopeToFind, setHopeToFind] = useState([])
    const [ideaOfFun, setIdeaOfFun] = useState([])
    const [bodyType, setBodyType] = useState([])
    const [smokeType, setSmokeType] = useState([])
    const [drinkType, setDrinkType] = useState([])
    const [educationLevel, setEducationLevel] = useState([])
    const [politicalPreference, setPoliticalPreference] = useState([])
    const [culturalBackground, setCulturalBackground] = useState([])
    // useEffect(() => {
    //     loadUserPreferences()
    //     return () => { }
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadUserPreferences()
          return () => {
          };
        }, [])
    );


    const loadUserPreferences = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLookingFor(response.data.user.preferences.looking_for)
            setAgeRange({ low: response.data.user.preferences.age_min, high: response.data.user.preferences.age_max })
            setDistanceRange({ low: response.data.user.preferences.distance_min, high: response.data.user.preferences.distance_max })
            setHeightRequirement({ min: response.data.user.preferences.height_min, max: response.data.user.preferences.height_max })
            setHopeToFind(response.data.user.preferences.hoping_to_find.split("||"))
            setIdeaOfFun(response.data.user.preferences.idea_of_fun.split("||"))
            setBodyType(response.data.user.preferences.body_types.split("||"))
            setSmokeType(response.data.user.preferences.smoke_types.split("||"))
            setDrinkType(response.data.user.preferences.drink_types.split("||"))
            setEducationLevel(response.data.user.preferences.education_levels.split("||"))
            setPoliticalPreference(response.data.user.preferences.political_preferences.split("||"))
            setCulturalBackground(response.data.user.preferences.cultural_background.split("||"))
            setLoaded(true)
            setLoading(false)
        } catch (error) {
            console.log('load_profile', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onSavePress = () => {
        if (heightRequirement['min'] === '' || heightRequirement['max'] === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter the minimum and maximum height requirements." })
        }
        savePreferences()
    }
    const savePreferences = async () => {
        try {
            setLoading(true)
            await axios.post('apis/set_user_preferences/',
                {
                    'looking_for': lookingFor,
                    'age_min': ageRange['low'],
                    'age_max': ageRange['high'],
                    'distance_min': distanceRange['low'],
                    'distance_max': distanceRange['high'],
                    'height_min': heightRequirement['min'],
                    'height_max': heightRequirement['max'],
                    'hoping_to_find': hopeToFind.join("||"),
                    'idea_of_fun': ideaOfFun.join("||"),
                    'body_types': bodyType.join("||"),
                    'smoke_types': smokeType.join("||"),
                    'drink_types': drinkType.join("||"),
                    'education_levels': educationLevel.join("||"),
                    'political_preferences': politicalPreference.join("||"),
                    'cultural_background': culturalBackground.join("||")
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your preferences." })
        } catch (error) {
            console.log('set_user_preferences', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            {
                loaded ?
                    <View style={{ flex: 1, alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                        <Text style={{ alignSelf: 'flex-start', marginStart: 30, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {'My Preferences'}
                        </Text>
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                            <View style={{ marginTop: 25, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"I am looking for"}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: lookingFor == Constants.PREFERENCE_LOOKING_FOR_OPTIONS[0] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: lookingFor == Constants.PREFERENCE_LOOKING_FOR_OPTIONS[0] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_LOOKING_FOR_OPTIONS[0]}
                                        onPress={() => setLookingFor(Constants.PREFERENCE_LOOKING_FOR_OPTIONS[0])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: lookingFor == Constants.PREFERENCE_LOOKING_FOR_OPTIONS[1] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: lookingFor == Constants.PREFERENCE_LOOKING_FOR_OPTIONS[1] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_LOOKING_FOR_OPTIONS[1]}
                                        onPress={() => setLookingFor(Constants.PREFERENCE_LOOKING_FOR_OPTIONS[1])} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: lookingFor == Constants.PREFERENCE_LOOKING_FOR_OPTIONS[2] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: lookingFor == Constants.PREFERENCE_LOOKING_FOR_OPTIONS[2] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_LOOKING_FOR_OPTIONS[2]}
                                        onPress={() => setLookingFor(Constants.PREFERENCE_LOOKING_FOR_OPTIONS[2])} />
                                </View>
                            </View>
                            <StyledSlider
                                title={'Age range'}
                                disableRange={false}
                                lower={ageRange['low']}
                                upper={ageRange['high']}
                                min={18}
                                max={70}
                                values={[]}
                                containerStyle={{ marginTop: 25 }}
                                onValueChanged={({ low, high }) => {
                                    setAgeRange({ low: low, high: high })
                                }} />
                            <StyledSlider
                                title={'Location Preferences'}
                                disableRange={false}
                                lower={distanceRange['low']}
                                upper={distanceRange['high']}
                                suffix='miles'
                                min={0}
                                max={100}
                                values={[]}
                                containerStyle={{ marginTop: 25 }}
                                onValueChanged={({ low, high }) => {
                                    setDistanceRange({ low: low, high: high })
                                }} />
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"Height Requirement"}
                                </Text>
                                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <StyledTextInput
                                        containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2 }}
                                        placeholder={"Min"}
                                        value={heightRequirement['min']}
                                        returnKeyType={'done'}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => setHeightRequirement({ ...heightRequirement, min: text })} />
                                    <StyledTextInput
                                        containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2 }}
                                        placeholder={"Max"}
                                        value={heightRequirement['max']}
                                        returnKeyType={'done'}
                                        keyboardType={'number-pad'}
                                        onChangeText={(text) => setHeightRequirement({ ...heightRequirement, max: text })} />
                                </View>
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"I am hoping to find "}
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}>
                                        {"(SELECT TWO)"}
                                    </Text>
                                </Text>
                                {
                                    Constants.PREFERENCE_HOPING_TO_FIND_OPTIONS.map((option, index) =>
                                        <StyledButton
                                            key={index.toString()}
                                            containerStyle={{ marginTop: 10, height: 60, borderRadius: 7, backgroundColor: hopeToFind.includes(option) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                            textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: hopeToFind.includes(option) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                            title={option}
                                            onPress={() => hopeToFind.includes(option) ? setHopeToFind(hopeToFind.filter((item) => item != option)) : hopeToFind.length >= 2 ? null : setHopeToFind([...hopeToFind, option])} />
                                    )
                                }
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"My idea of a fun date is "}
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}>
                                        {"(SELECT TWO)"}
                                    </Text>
                                </Text>
                                {
                                    Constants.IDEA_OF_FUN_OPTIONS.map((option, index) =>
                                        <StyledButton
                                            key={index.toString()}
                                            containerStyle={{ marginTop: 10, height: 60, borderRadius: 7, backgroundColor: ideaOfFun.includes(option) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                            textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: ideaOfFun.includes(option) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                            title={option}
                                            onPress={() => ideaOfFun.includes(option) ? setIdeaOfFun(ideaOfFun.filter((item) => item != option)) : ideaOfFun.length >= 2 ? null : setIdeaOfFun([...ideaOfFun, option])} />
                                    )
                                }
                            </View>
                            <View style={{ width: '100%', marginTop: 24, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ position: 'absolute', width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY }} />
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE, backgroundColor: Constants.COLOR.BLACK, paddingHorizontal: 4 }}>
                                    {"Select all that apply"}
                                </Text>
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"What body type do you prefer?"}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[0]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[0]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[0]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[0]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[0])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[0]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[1]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[1]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[1]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[1]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[1])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[1]])} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[2]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[2]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[2]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[2]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[2])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[2]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[3]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[3]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[3]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[3]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[3])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[3]])} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[4]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[4]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[4]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[4]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[4])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[4]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[5]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[5]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[5]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[5]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[5])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[5]])} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[6]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[6]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[6]}
                                        onPress={() => bodyType.includes(Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[6]) ? setBodyType(bodyType.filter((item) => item != Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[6])) : setBodyType([...bodyType, Constants.PREFERENCE_BODY_OPTIONS_OPTIONS[6]])} />
                                </View>
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"I prefer someone who"}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[0]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[0]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_SMOKE_OPTIONS[0]}
                                        onPress={() => smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[0]) ? setSmokeType(smokeType.filter((item) => item != Constants.PREFERENCE_SMOKE_OPTIONS[0])) : setSmokeType([...smokeType, Constants.PREFERENCE_SMOKE_OPTIONS[0]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[1]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[1]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_SMOKE_OPTIONS[1]}
                                        onPress={() => smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[1]) ? setSmokeType(smokeType.filter((item) => item != Constants.PREFERENCE_SMOKE_OPTIONS[1])) : setSmokeType([...smokeType, Constants.PREFERENCE_SMOKE_OPTIONS[1]])} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[2]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[2]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_SMOKE_OPTIONS[2]}
                                        onPress={() => smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[2]) ? setSmokeType(smokeType.filter((item) => item != Constants.PREFERENCE_SMOKE_OPTIONS[2])) : setSmokeType([...smokeType, Constants.PREFERENCE_SMOKE_OPTIONS[2]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[3]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[3]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_SMOKE_OPTIONS[3]}
                                        onPress={() => smokeType.includes(Constants.PREFERENCE_SMOKE_OPTIONS[3]) ? setSmokeType(smokeType.filter((item) => item != Constants.PREFERENCE_SMOKE_OPTIONS[3])) : setSmokeType([...smokeType, Constants.PREFERENCE_SMOKE_OPTIONS[3]])} />
                                </View>
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"I prefer someone who"}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[0]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[0]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_DRINK_OPTIONS[0]}
                                        onPress={() => drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[0]) ? setDrinkType(drinkType.filter((item) => item != Constants.PREFERENCE_DRINK_OPTIONS[0])) : setDrinkType([...drinkType, Constants.PREFERENCE_DRINK_OPTIONS[0]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[1]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[1]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_DRINK_OPTIONS[1]}
                                        onPress={() => drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[1]) ? setDrinkType(drinkType.filter((item) => item != Constants.PREFERENCE_DRINK_OPTIONS[1])) : setDrinkType([...drinkType, Constants.PREFERENCE_DRINK_OPTIONS[1]])} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[2]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[2]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_DRINK_OPTIONS[2]}
                                        onPress={() => drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[2]) ? setDrinkType(drinkType.filter((item) => item != Constants.PREFERENCE_DRINK_OPTIONS[2])) : setDrinkType([...drinkType, Constants.PREFERENCE_DRINK_OPTIONS[2]])} />
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[3]) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[3]) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={Constants.PREFERENCE_DRINK_OPTIONS[3]}
                                        onPress={() => drinkType.includes(Constants.PREFERENCE_DRINK_OPTIONS[3]) ? setDrinkType(drinkType.filter((item) => item != Constants.PREFERENCE_DRINK_OPTIONS[3])) : setDrinkType([...drinkType, Constants.PREFERENCE_DRINK_OPTIONS[3]])} />
                                </View>
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"Education Level"}
                                </Text>
                                <StyledDropdown
                                    title={educationLevel.length === 0 ? "Select" : educationLevel.join(", ")}
                                    containerStyle={{ marginTop: 20 }}
                                    type={"Multiple"}
                                    options={Constants.EDUCATION_LEVEL_OPTIONS}
                                    onValueChanged={(value) => setEducationLevel(value)} />
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"Political Preferences"}
                                </Text>
                                <StyledDropdown
                                    title={politicalPreference.length === 0 ? "Select" : politicalPreference.join(", ")}
                                    containerStyle={{ marginTop: 20 }}
                                    type={"Multiple"}
                                    options={Constants.PREFERENCE_EDUCATION_LEVEL_OPTIONS}
                                    onValueChanged={(value) => setPoliticalPreference(value)} />
                            </View>
                            <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"What ethnicities/cultural\nbackgrounds do you prefer?"}
                                </Text>
                                <StyledDropdown
                                    title={culturalBackground.length === 0 ? "Select" : culturalBackground.join(", ")}
                                    containerStyle={{ marginTop: 20 }}
                                    type={"Multiple"}
                                    options={Constants.PREFERENCE_CULTURAL_BACKGROUND_OPTIONS}
                                    onValueChanged={(value) => setCulturalBackground(value)} />
                            </View>
                        </ScrollView>
                        <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                        <StyledButton
                            containerStyle={{}}
                            textStyle={{}}
                            title={"SAVE"}
                            onPress={onSavePress} />
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                        <Text style={{ alignSelf: 'flex-start', marginStart: 30, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {'My Preferences'}
                        </Text>
                    </View>
            }
            {loading && <Spinner visible={true} />}
        </View >
    )
}

export default ProfilePreferencesScreen;