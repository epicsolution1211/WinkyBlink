import React, { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    View,
    Text,
    LayoutAnimation,
    Keyboard,
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import StyledButton from '../../components/StyledButton';
import StyledSlider from '../../components/StyledSlider';
import StyledDropdown from '../../components/StyledDropdown';
import StyledInterestsPicker from '../../components/StyledInterestsPicker';
import StyledTextInput from '../../components/StyledTextInput';
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';
import Spinner from '../../components/Spinner';
import moment from 'moment';

function ProfileAboutMeScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [height, setHeight] = useState(53)
    const [bodyType, setBodyType] = useState(0)
    const [drinkType, setDrinkType] = useState(Constants.DRINK_OPTIONS[0])
    const [smokeType, setSmokeType] = useState(Constants.SMOKE_OPTIONS[0])
    const [educationLevel, setEducationLevel] = useState('')
    const [considerMySelf, setConsiderMySelf] = useState('')
    const [ideaOfFun, setIdeaOfFun] = useState('')
    const [culturalBackground, setCulturalBackground] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [interests, setInterests] = useState([])
    const [hobbies, setHobbies] = useState([])
    const [favoriteArtists, setFavoriteArtists] = useState([])
    const [funFactAboutMe, setFunFactAboutMe] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    useEffect(() => {
        loadAboutMe()
        return () => { }
    }, []);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", (event) => keyboardDidShow(event));
        const hideSubscription = Keyboard.addListener("keyboardWillHide", (event) => keyboardDidHide(event));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, []);
    const keyboardDidShow = (event) => {
        let height = event.endCoordinates.height;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(height)
    }
    const keyboardDidHide = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    }
    const loadAboutMe = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setHeight(parseInt(response.data.user.height))
            setDateOfBirth(moment(response.data.user.date_of_birth).toDate())
            setFunFactAboutMe(response.data.user.fun_fact_about_me)
            setFavoriteArtists(response.data.user.favorite_artists.split("||"))
            setFavoriteMovies(response.data.user.favorite_movies.split("||"))
            setInterests(response.data.user.interests.split("||"))
            setHobbies(response.data.user.hobbies.split("||"))
            setEducationLevel(response.data.user.education_level)
            setBodyType(Constants.BODY_OPTIONS.indexOf(response.data.user.body_type))
            setDrinkType(response.data.user.drink_type)
            setSmokeType(response.data.user.smoke_type)
            setConsiderMySelf(response.data.user.consider_myself)
            setIdeaOfFun(response.data.user.idea_of_fun)
            setCulturalBackground(response.data.user.cultural_background.split("||"))
            setLoading(false)
            setLoaded(true)
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
        if (dateOfBirth === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please choose your birthday." })
        }
        if (educationLevel === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please choose your education level." })
        }
        if (considerMySelf === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please choose what you consider yourself." })
        }
        if (ideaOfFun === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please choose your idea of fun date." })
        }
        if (culturalBackground.length === 0) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please choose your cultural background." })
        }
        if (favoriteMovies.length === 0) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please add your favorite movies." })
        }
        if (interests.length === 0) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please add your favorite music artis." })
        }
        if (hobbies.length === 0) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please add your interests." })
        }
        if (favoriteArtists.length === 0) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please add your hobbies." })
        }
        saveAboutMe()
    }
    const saveAboutMe = async () => {
        Keyboard.dismiss()
        try {
            let parameters = {
                'height': height,
                'body_type': Constants.BODY_OPTIONS[bodyType],
                'drink_type': drinkType,
                'smoke_type': smokeType,
                'education_level': educationLevel,
                'consider_myself': considerMySelf,
                'idea_of_fun': ideaOfFun,
                'cultural_background': culturalBackground.join("||"),
                'favorite_movies': favoriteMovies.join("||"),
                'favorite_artists': favoriteArtists.join("||"),
                'interests': interests.join("||"),
                'hobbies': hobbies.join("||"),
                'fun_fact_about_me': funFactAboutMe,
                'date_of_birth': moment(dateOfBirth).format('YYYY-MM-DD')
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
            presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your profile." })
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
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {loaded ? 'About Me' : 'About Me'}
            </Text>
            {
                loaded &&
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: keyboardHeight == 0 ? (insets.bottom + 24) : (keyboardHeight + 20) }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 25, paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'flex-start', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"Date of Birth"}
                        </Text>
                        <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18 }}>
                            <StyledTextInput
                                type={'datetime'}
                                mode={'date'}
                                format={'MM'}
                                minimumDate={moment().add(-100, 'year').startOf('year').toDate()}
                                maximumDate={moment().add(-18, 'year').endOf('year').toDate()}
                                defaultDate={moment().add(-19, 'year').startOf('year').toDate()}
                                containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 66) / 3 }}
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
                                containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 66) / 3 }}
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
                                containerStyle={{ width: (Constants.LAYOUT.SCREEN_WIDTH - 66) / 3 }}
                                textStyle={{ textAlign: 'center' }}
                                placeholder={"YY"}
                                value={dateOfBirth}
                                onChangeText={(text) => setDateOfBirth(text)} />
                        </View>
                        <StyledSlider
                            title={'My Height'}
                            disableRange={true}
                            lower={height}
                            upper={height}
                            min={53}
                            max={89}
                            values={Constants.HEIGHT_OPTIONS}
                            containerStyle={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            onValueChanged={({ low }) => {
                                if (low !== height) {
                                    setHeight(low)
                                }
                            }} />
                        <StyledSlider
                            title={'My Body Type'}
                            disableRange={true}
                            lower={bodyType}
                            upper={bodyType}
                            min={0}
                            max={5}
                            values={Constants.BODY_OPTIONS}
                            containerStyle={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            onValueChanged={({ low }) => {
                                if (low !== bodyType) {
                                    setBodyType(low)
                                }
                            }} />
                        <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                {"I Drink"}
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[0] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[0] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.DRINK_OPTIONS[0]}
                                    onPress={() => setDrinkType(Constants.DRINK_OPTIONS[0])} />
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[1] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[1] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.DRINK_OPTIONS[1]}
                                    onPress={() => setDrinkType(Constants.DRINK_OPTIONS[1])} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[2] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[2] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.DRINK_OPTIONS[2]}
                                    onPress={() => setDrinkType(Constants.DRINK_OPTIONS[2])} />
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[3] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[3] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.DRINK_OPTIONS[3]}
                                    onPress={() => setDrinkType(Constants.DRINK_OPTIONS[3])} />
                            </View>
                        </View>
                        <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                {"I Smoke"}
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[0] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[0] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.SMOKE_OPTIONS[0]}
                                    onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[0])} />
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[1] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[1] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.SMOKE_OPTIONS[1]}
                                    onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[1])} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[2] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[2] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.SMOKE_OPTIONS[2]}
                                    onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[2])} />
                                <StyledButton
                                    containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 50) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[3] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                    textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[3] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                    title={Constants.SMOKE_OPTIONS[3]}
                                    onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[3])} />
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 24, marginBottom: 24 }} />
                        <StyledDropdown
                            title={educationLevel === '' ? "Education Level" : educationLevel}
                            containerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            type={"Single"}
                            value={educationLevel === '' ? [] : [educationLevel]}
                            options={Constants.EDUCATION_LEVEL_OPTIONS}
                            onValueChanged={(value) => setEducationLevel(value[0])} />
                        <StyledDropdown
                            title={considerMySelf === '' ? "I consider myself" : considerMySelf}
                            containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            type={"Single"}
                            value={considerMySelf === '' ? [] : [considerMySelf]}
                            options={Constants.CONSIDER_MYSELF_OPTIONS}
                            onValueChanged={(value) => setConsiderMySelf(value[0])} />
                        <StyledDropdown
                            title={ideaOfFun === '' ? "My idea of fun date is" : ideaOfFun}
                            containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            type={"Single"}
                            value={ideaOfFun === '' ? [] : [ideaOfFun]}
                            options={Constants.IDEA_OF_FUN_OPTIONS}
                            onValueChanged={(value) => setIdeaOfFun(value[0])} />
                        <StyledDropdown
                            title={culturalBackground.length === 0 ? "My Cultural Background" : culturalBackground.join(", ")}
                            containerStyle={{ marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            type={"Multiple"}
                            value={culturalBackground}
                            options={Constants.CULTURAL_BACKGROUND_OPTIONS}
                            onValueChanged={(value) => setCulturalBackground(value)} />
                        <StyledInterestsPicker
                            insets={insets}
                            value={favoriteMovies}
                            containerStyle={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            title={"My Favorite Movies"}
                            onValueChanged={(value) => setFavoriteMovies(value)} />
                        <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                        <StyledInterestsPicker
                            insets={insets}
                            value={favoriteArtists}
                            containerStyle={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            title={"My Favorite Music Artists"}
                            onValueChanged={(value) => setFavoriteArtists(value)} />
                        <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                        <StyledInterestsPicker
                            insets={insets}
                            value={interests}
                            containerStyle={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            title={"Interests"}
                            onValueChanged={(value) => setInterests(value)} />
                        <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                        <StyledInterestsPicker
                            insets={insets}
                            value={hobbies}
                            containerStyle={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                            title={"Hobbies"}
                            onValueChanged={(value) => setHobbies(value)} />
                        <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                        <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                {"Fun facts about me"}
                            </Text>
                            <StyledTextInput
                                containerStyle={{ marginTop: 10, height: 250, paddingTop: 20, paddingBottom: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                                placeholder={'Minimum 4 words,\nMaximum 50 words'}
                                returnKeyType={'done'}
                                value={funFactAboutMe}
                                autoCorrect={true}
                                multiline={true}
                                onChangeText={(text) => setFunFactAboutMe(text)}
                                onSubmitEditing={() => Keyboard.dismiss()} />
                        </View>
                    </ScrollView>
                    <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                    <StyledButton
                        containerStyle={{}}
                        textStyle={{}}
                        title={"SAVE"}
                        onPress={onSavePress} />
                </View>
            }
            {loading && <Spinner visible={true} />}
        </View >
    )
}

export default ProfileAboutMeScreen;