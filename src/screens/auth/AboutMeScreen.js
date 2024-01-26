import React, { useState } from 'react';
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
import StyledSlider from '../../components/StyledSlider';
import StyledDropdown from '../../components/StyledDropdown';
import StyledInterestsPicker from '../../components/StyledInterestsPicker';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { presentToastMessage } from '../../common/Functions';

function AboutMeScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
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
    const onNextPress = () => {
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
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            console.log(body)
            setLoading(true)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)
            setTimeout(() => {
                navigation.push("AboutMeBio")
            }, 100);
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onBackPress = () => navigation.pop()
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {`About Me`}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <StyledSlider
                        title={'My Height'}
                        disableRange={true}
                        lower={height}
                        upper={height}
                        min={53}
                        max={89}
                        values={Constants.HEIGHT_OPTIONS}
                        containerStyle={{ marginTop: 24 }}
                        onValueChanged={({ low }) => {
                            setHeight(low)
                        }} />
                    <StyledSlider
                        title={'My Body Type'}
                        disableRange={true}
                        lower={bodyType}
                        upper={bodyType}
                        min={0}
                        max={5}
                        values={Constants.BODY_OPTIONS}
                        containerStyle={{ marginTop: 24 }}
                        onValueChanged={({ low }) => {
                            setBodyType(low)
                        }} />
                    <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"I Drink"}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[0] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[0] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.DRINK_OPTIONS[0]}
                                onPress={() => setDrinkType(Constants.DRINK_OPTIONS[0])} />
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[1] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[1] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.DRINK_OPTIONS[1]}
                                onPress={() => setDrinkType(Constants.DRINK_OPTIONS[1])} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[2] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[2] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.DRINK_OPTIONS[2]}
                                onPress={() => setDrinkType(Constants.DRINK_OPTIONS[2])} />
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: drinkType == Constants.DRINK_OPTIONS[3] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: drinkType == Constants.DRINK_OPTIONS[3] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.DRINK_OPTIONS[3]}
                                onPress={() => setDrinkType(Constants.DRINK_OPTIONS[3])} />
                        </View>
                    </View>
                    <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"I Smoke"}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[0] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[0] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.SMOKE_OPTIONS[0]}
                                onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[0])} />
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[1] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[1] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.SMOKE_OPTIONS[1]}
                                onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[1])} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[2] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[2] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.SMOKE_OPTIONS[2]}
                                onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[2])} />
                            <StyledButton
                                containerStyle={{ marginTop: 10, width: (Constants.LAYOUT.SCREEN_WIDTH - 70) / 2, height: 60, borderRadius: 7, backgroundColor: smokeType == Constants.SMOKE_OPTIONS[3] ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: smokeType == Constants.SMOKE_OPTIONS[3] ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                title={Constants.SMOKE_OPTIONS[3]}
                                onPress={() => setSmokeType(Constants.SMOKE_OPTIONS[3])} />
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 24, marginBottom: 24 }} />
                    <StyledDropdown
                        title={educationLevel === '' ? "Education Level" : educationLevel}
                        value={educationLevel == '' ? [] : [educationLevel]}
                        containerStyle={{}}
                        type={"Single"}
                        options={Constants.EDUCATION_LEVEL_OPTIONS}
                        onValueChanged={(value) => setEducationLevel(value[0])} />
                    <StyledDropdown
                        title={considerMySelf === '' ? "I consider myself" : considerMySelf}
                        value={considerMySelf == '' ? [] : [considerMySelf]}
                        containerStyle={{ marginTop: 20 }}
                        type={"Single"}
                        options={Constants.CONSIDER_MYSELF_OPTIONS}
                        onValueChanged={(value) => setConsiderMySelf(value[0])} />
                    <StyledDropdown
                        title={ideaOfFun === '' ? "My idea of fun date is" : ideaOfFun}
                        value={ideaOfFun == '' ? [] : [ideaOfFun]}
                        containerStyle={{ marginTop: 20 }}
                        type={"Single"}
                        options={Constants.IDEA_OF_FUN_OPTIONS}
                        onValueChanged={(value) => setIdeaOfFun(value[0])} />
                    <StyledDropdown
                        title={culturalBackground.length === 0 ? "My Cultural Background" : culturalBackground.join(", ")}
                        containerStyle={{ marginTop: 20 }}
                        value={culturalBackground}
                        type={"Multiple"}
                        options={Constants.CULTURAL_BACKGROUND_OPTIONS}
                        onValueChanged={(value) => setCulturalBackground(value)} />
                    <StyledInterestsPicker
                        insets={insets}
                        value={favoriteMovies}
                        containerStyle={{ marginTop: 24 }}
                        title={"My Favorite Movies"}
                        onValueChanged={(value) => {
                            setFavoriteMovies(value)
                        }} />
                    <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                    <StyledInterestsPicker
                        insets={insets}
                        value={favoriteArtists}
                        containerStyle={{ marginTop: 24 }}
                        title={"My Favorite Music Artists"}
                        onValueChanged={(value) => {
                            setFavoriteArtists(value)
                        }} />
                    <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                    <StyledInterestsPicker
                        insets={insets}
                        value={[]}
                        containerStyle={{ marginTop: 24 }}
                        title={"Interests"}
                        onValueChanged={(value) => {
                            setInterests(value)
                        }} />
                    <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginTop: 8 }} />
                    <StyledInterestsPicker
                        insets={insets}
                        value={[]}
                        containerStyle={{ marginTop: 24 }}
                        title={"Hobbies"}
                        onValueChanged={(value) => {
                            setHobbies(value)
                        }} />
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

export default AboutMeScreen;