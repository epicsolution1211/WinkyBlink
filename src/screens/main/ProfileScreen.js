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
import StyledButton from '../../components/StyledButton';
import StyledPageControl from '../../components/StyledPageControl';
import { calculateAge, getS3StorageURL } from '../../common/Functions';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

function ProfileScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [photos, setPhotos] = useState([])
    const [name, setName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    useEffect(() => {
        loadUserProfile()
        return () => { }
    }, []);
    const loadUserProfile = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`apis/load_profile`, {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setName(response.data.user.name)
            setPhotos(response.data.user.photos)
            setDateOfBirth(response.data.user.date_of_birth)
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
    const onViewDetailsPress = () => navigation.push('ProfileDetail', {})
    const onMyPreferencesPress = () => navigation.push('ProfilePreferences', {})
    const onPhotosPress = () => navigation.push('ProfilePhotos', {})
    const onVideoPress = () => navigation.push('ProfileVideos', {})
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
                        <ScrollView bounces={true} contentContainerStyle={{ paddingBottom: insets.bottom + 25 }}>
                            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                                    {`${name}`}
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                                        {`, ${calculateAge(dateOfBirth)}`}
                                    </Text>
                                </Text>
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
                            </View>
                            <View>
                                <View style={{ marginTop: 20, alignSelf: 'center', width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 1, backgroundColor: Constants.COLOR.GRAY }} />
                                <TouchableOpacity onPress={onMyPreferencesPress} style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Constants.COLOR.GRAY_SEPERATOR, height: 54, paddingHorizontal: 20 }}>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                                        {"My Preferences"}
                                    </Text>
                                    <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_black.png')} />
                                </TouchableOpacity>
                                <Text style={{ marginTop: 15, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                                    {"Manage"}
                                </Text>
                                <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30 }}>
                                    <StyledButton
                                        containerStyle={{ height: 46, width: (Constants.LAYOUT.SCREEN_WIDTH - 75) / 2, backgroundColor: Constants.COLOR.GRAY_DARK }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}
                                        icon={
                                            <Image style={{ marginEnd: 8, marginBottom: 4, width: 19, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_clip.png')} />
                                        }
                                        title={"Photos"}
                                        onPress={onPhotosPress} />
                                    <StyledButton
                                        containerStyle={{ height: 46, width: (Constants.LAYOUT.SCREEN_WIDTH - 75) / 2, backgroundColor: Constants.COLOR.GRAY_DARK }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}
                                        icon={
                                            <Image style={{ marginEnd: 8, marginBottom: 4, width: 19, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_clip.png')} />
                                        }
                                        title={"Video"}
                                        onPress={onVideoPress} />
                                </View>
                                <StyledButton
                                    containerStyle={{ marginTop: 30, alignSelf: 'center' }}
                                    textStyle={{}}
                                    title={"VIEW DETAILS"}
                                    onPress={onViewDetailsPress} />
                            </View>
                        </ScrollView>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <ScrollView bounces={true} contentContainerStyle={{ paddingBottom: insets.bottom + 25 }}>
                            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                                    {`Loading...`}
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
            }
        </View >
    )
}

export default ProfileScreen;