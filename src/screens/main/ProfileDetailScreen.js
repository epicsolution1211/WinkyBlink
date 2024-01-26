import React, { useEffect, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import TagSelect from '../../components/react-native-tag-select/TagSelect';
import StyledPageControl from '../../components/StyledPageControl';
import axios from 'axios';
import { calculateAge, getS3StorageURL, inchesToHumanReadable } from '../../common/Functions';
import FastImage from 'react-native-fast-image';
import Spinner from '../../components/Spinner';

function ProfileDetailScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [photos, setPhotos] = useState([])
    const [name, setName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [funFactAboutMe, setFunFactAboutMe] = useState('')
    const [favoriteArtists, setFavoriteArtists] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [interests, setInterests] = useState([])
    const [hobbies, setHobbies] = useState([])
    const [height, setHeight] = useState(0)
    const [bodyType, setBodyType] = useState('')
    const [drinkType, setDrinkType] = useState(Constants.DRINK_OPTIONS[0])
    const [smokeType, setSmokeType] = useState(Constants.SMOKE_OPTIONS[0])
    const [educationLevel, setEducationLevel] = useState('')
    const [considerMySelf, setConsiderMySelf] = useState('')
    const [ideaOfFun, setIdeaOfFun] = useState('')
    const [culturalBackground, setCulturalBackground] = useState([])
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    useEffect(() => {
        loadUserProfile()
        return () => { }
    }, []);
    const loadUserProfile = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setName(response.data.user.name)
            setPhotos(response.data.user.photos)
            setDateOfBirth(response.data.user.date_of_birth)
            setFunFactAboutMe(response.data.user.fun_fact_about_me)
            setFavoriteArtists(response.data.user.favorite_artists.split("||"))
            setFavoriteMovies(response.data.user.favorite_movies.split("||"))
            setInterests(response.data.user.interests.split("||"))
            setHobbies(response.data.user.hobbies.split("||"))
            setHeight(response.data.user.height)
            setEducationLevel(response.data.user.education_level)
            setBodyType(response.data.user.body_type)
            setDrinkType(response.data.user.drink_type)
            setSmokeType(response.data.user.smoke_type)
            setConsiderMySelf(response.data.user.consider_myself)
            setIdeaOfFun(response.data.user.idea_of_fun)
            setCulturalBackground(response.data.user.cultural_background.split("||"))
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
    const PhotoItem = ({ item, index }) => {
        return (
            <View style={{}}>
                <FastImage
                    style={{ width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_WIDTH }}
                    source={{
                        uri: getS3StorageURL(item.photo),
                        priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
        )
    }
    const onPhotoScroll = (event) => {
        setCurrentPhotoIndex(Math.round(event.nativeEvent.contentOffset.x / Constants.LAYOUT.SCREEN_WIDTH))
    }
    const InformationItem = ({ title, content = "", tags = [], backgroundColor, containerStyle }) => {
        return (
            <View
                style={[{
                    backgroundColor: backgroundColor,
                    borderTopLeftRadius: 34,
                    borderTopRightRadius: 34,
                    paddingHorizontal: 25,
                    paddingTop: 25,
                    paddingBottom: 54,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: -3,
                            },
                            shadowOpacity: 0.18,
                            shadowRadius: 4.59,
                        },
                        android: {
                            elevation: 5,
                        },
                    })
                }, containerStyle]} >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                        {title}
                    </Text>
                    <TouchableOpacity onPress={onAboutMeEditPress}>
                        <Image style={{ width: 19, height: 19 }} source={require('../../../assets/images/ic_edit_profile.png')} />
                    </TouchableOpacity>
                </View>
                {
                    content !== "" &&
                    <Text style={{ marginTop: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                        {content}
                    </Text>
                }
                {
                    tags.length > 0 &&
                    <TagSelect
                        value={[]}
                        labelAttr={'label'}
                        data={tags.filter((tag, index) => tag.label !== '')}
                        max={0}
                        removeable={false}
                        containerStyle={{ alignSelf: 'flex-start', marginTop: 16 }}
                        itemStyle={{ height: 40, borderRadius: 7, justifyContent: 'center', paddingVertical: 0, paddingHorizontal: 10, backgroundColor: Constants.COLOR.WHITE, borderWidth: 0 }}
                        itemStyleSelected={{ height: 40, borderRadius: 7, justifyContent: 'center', paddingVertical: 0, paddingHorizontal: 10, backgroundColor: Constants.COLOR.WHITE, borderWidth: 0 }}
                        itemLabelStyle={{ color: Constants.COLOR.BLACK, fontSize: Constants.FONT_SIZE.FT18, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR }}
                        itemLabelStyleSelected={{ color: Constants.COLOR.BLACK, fontSize: Constants.FONT_SIZE.FT18, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR }} />
                }
            </View>
        )
    }
    const onPhotoEditPress = () => navigation.push('ProfilePhotos')
    const onAboutMeEditPress = () => navigation.push('ProfileAboutMe')
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            {
                loaded ?
                    <View style={{ flex: 1 }}>
                        <ScrollView bounces={false}>
                            <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                                        {`${name}`}
                                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                                            {`, ${calculateAge(dateOfBirth)}`}
                                        </Text>
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={onAboutMeEditPress}>
                                    <Image style={{ width: 19, height: 19 }} source={require('../../../assets/images/ic_edit_profile.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <ScrollView
                                    style={{ borderRadius: 15, overflow: 'hidden' }}
                                    showsHorizontalScrollIndicator={false}
                                    pagingEnabled={true}
                                    bounces={false}
                                    onScroll={onPhotoScroll}
                                    scrollEventThrottle={16}
                                    horizontal={true}>
                                    {
                                        photos.map((photo, index) =>
                                            <PhotoItem
                                                key={index.toString()}
                                                item={photo}
                                                index={index} />)
                                    }
                                </ScrollView>
                                <StyledPageControl
                                    containerStyle={{ position: 'absolute', bottom: 20 }}
                                    count={photos.length}
                                    activeIndex={currentPhotoIndex}
                                    activeColor={Constants.COLOR.WHITE}
                                    inactiveColor={Constants.COLOR.WHITE_04} />
                                <TouchableOpacity onPress={onPhotoEditPress} style={{ position: 'absolute', right: 20, top: 20 }}>
                                    <Image style={{ width: 19, height: 19 }} source={require('../../../assets/images/ic_edit_profile.png')} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View style={{ marginTop: 20, alignSelf: 'center', width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 1, backgroundColor: Constants.COLOR.GRAY }} />
                                <InformationItem
                                    containerStyle={{ marginTop: 30 }}
                                    title={"Fun Facts About Me"}
                                    content={funFactAboutMe}
                                    backgroundColor={Constants.COLOR.BLUE} />
                                <InformationItem
                                    containerStyle={{ marginTop: -34 }}
                                    title={"Favorite Music"}
                                    content={favoriteArtists.join(", ")}
                                    backgroundColor={Constants.COLOR.WHITE} />
                                <InformationItem
                                    containerStyle={{ marginTop: -34 }}
                                    title={"Hobbies"}
                                    content={hobbies.join(", ")}
                                    backgroundColor={Constants.COLOR.BLUE} />
                                <InformationItem
                                    containerStyle={{ marginTop: -34 }}
                                    title={"Interests"}
                                    content={interests.join(", ")}
                                    backgroundColor={Constants.COLOR.WHITE} />
                                <InformationItem
                                    containerStyle={{ marginTop: -34 }}
                                    title={"Favorite Movies"}
                                    content={favoriteMovies.join(", ")}
                                    backgroundColor={Constants.COLOR.BLUE} />
                                <InformationItem
                                    containerStyle={{ marginTop: -34 }}
                                    title={"Cultural Background"}
                                    content={culturalBackground.join(", ")}
                                    backgroundColor={Constants.COLOR.WHITE} />
                                <InformationItem
                                    containerStyle={{ marginTop: -34 }}
                                    title={"Additional Information"}
                                    tags={[
                                        { id: 'height', label: inchesToHumanReadable(height) },
                                        { id: 'bodyType', label: bodyType },
                                        { id: 'smokeType', label: smokeType },
                                        { id: 'drinkType', label: drinkType },
                                        { id: 'educationLevel', label: educationLevel },
                                        { id: 'considerMySelf', label: `I consider myself as ${considerMySelf}` },
                                        { id: 'ideaOfFun', label: ideaOfFun },
                                    ]}
                                    backgroundColor={Constants.COLOR.BLUE} />
                            </View>
                        </ScrollView>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <ScrollView bounces={false}>
                            <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                                        {`Loading...`}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
            }
            {loading && <Spinner visible={true} />}
        </View >
    )
}

export default ProfileDetailScreen;