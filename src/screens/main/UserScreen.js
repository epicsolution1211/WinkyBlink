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
import TagSelect from '../../components/react-native-tag-select/TagSelect';
import StyledPageControl from '../../components/StyledPageControl';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { calculateAge, getS3StorageURL, inchesToHumanReadable, presentToastMessage } from '../../common/Functions';
import FastImage from 'react-native-fast-image';

function UserScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (navigation !== undefined) {
            const parentNavigator = navigation.getParent()
            parentNavigator.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                    width: Constants.LAYOUT.SCREEN_WIDTH,
                    display: 'none'
                }
            })
        }
        return () => { };
    }, [navigation]);
    useEffect(() => {
        loadUser()
        return () => { };
    }, []);
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onMessagePress = () => {
        navigation.push('Conversation', { type: 'user', id: user.qb_id })
    }

    const onBlastsend = async () =>{
        
        try{

            setLoading(true)

            const response =  await axios.post('apis/blast_user/',
                {
                    "opponent_id":route.params.id
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: response.data['success'] })
        }catch(e){
            setLoading(false)
            console.log("blastsend-error",error.code);
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    } 

    const loadUser = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`apis/load_user/${route.params.id}`, {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setUser(response.data.user)
            setLoading(false)
        } catch (error) {
            console.log('load_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);

        }
    }
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
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                    {title}
                </Text>
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
                user !== null &&
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ width: Constants.LAYOUT.SCREEN_WIDTH }}>
                        <View style={{}}>
                            <ScrollView
                                style={{ borderBottomLeftRadius: 15, borderBottomRightRadius: 15, overflow: 'hidden' }}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}
                                bounces={false}
                                onScroll={onPhotoScroll}
                                scrollEventThrottle={16}
                                horizontal={true}>
                                {
                                    user.photos.map((photo, index) =>
                                        <PhotoItem
                                            key={index.toString()}
                                            item={photo}
                                            index={index} />)
                                }
                            </ScrollView>

                            <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, position: 'absolute', top: 20, flexDirection: 'row', paddingHorizontal: 20, alignItems: 'left', justifyContent: 'flex-end' }}>
                                {/* <TouchableOpacity  style={{}}>
                                    <Image style={{ width: 32, height: 33, resizeMode: 'contain' }} source={require('../../../assets/images/ic_undo.png')} />
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={onBlastsend} style={{}}>
                                    <Image style={{ width: 47, height: 48, resizeMode: 'contain' }} source={require('../../../assets/images/ic_blast_wish_list.png')} />
                                </TouchableOpacity>
                            </View>
                            <StyledPageControl
                                containerStyle={{ position: 'absolute', bottom: 20 }}
                                count={user.photos.length}
                                activeIndex={currentPhotoIndex}
                                activeColor={Constants.COLOR.WHITE}
                                inactiveColor={Constants.COLOR.WHITE_04} />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                                    {`${user.name} `}
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.BLACK }}>
                                        {`, ${calculateAge(user.date_of_birth)}`}
                                    </Text>
                                </Text>
                                {
                                    user.is_winky_badge_enabled === '1' &&
                                    <View style={{ marginLeft: 30, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 25, height: 27, resizeMode: 'contain' }} source={require('../../../assets/images/ic_winky_profile.png')} />
                                        <Image style={{ position: 'absolute', alignSelf: 'center', width: 24, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_winky_premium.png')} />
                                    </View>
                                }
                            </View>
                            <StyledButton
                                containerStyle={{ marginLeft: 20, marginTop: 10, marginBottom: 25, width: 135, height: 34, borderRadius: 3, paddingHorizontal: 0 }}
                                textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT15, color: Constants.COLOR.WHITE }}
                                title={`Level ${user.verification_level} verified`} />
                            <View style={{ position: 'absolute', marginTop: 40, right: 25, top: 25, alignItems: 'center' }}>
                                <TouchableOpacity onPress={onMessagePress} style={{}}>
                                    <Image style={{ width: 41, height: 41, resizeMode: 'contain' }} source={require('../../../assets/images/ic_message_me.png')} />
                                </TouchableOpacity>
                                <Text style={{ textAlign: 'center', marginTop: 4, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT13, color: Constants.COLOR.BLACK }}>
                                    {"Message\nme"}
                                </Text>
                            </View>
                            <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 1, backgroundColor: Constants.COLOR.GRAY_DARK }} />
                                <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: Constants.COLOR.WHITE, position: 'absolute' }}>
                                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT17, color: Constants.COLOR.BLACK }}>
                                        {"Show Less"}
                                    </Text>
                                    <Image style={{ marginLeft: 10, width: 11, height: 10, resizeMode: 'contain' }} source={require('../../../assets/images/ic_show_more.png')} />
                                </TouchableOpacity>
                            </View>
                            <InformationItem
                                containerStyle={{ marginTop: 30 }}
                                title={"Fun 1 Facts About Me"}
                                content={user.fun_fact_about_me}
                                backgroundColor={Constants.COLOR.BLUE} />
                            <InformationItem
                                containerStyle={{ marginTop: -34 }}
                                title={"Favorite Music"}
                                content={user.favorite_artists.split("||").join(", ")}
                                backgroundColor={Constants.COLOR.WHITE} />
                            <InformationItem
                                containerStyle={{ marginTop: -34 }}
                                title={"Hobbies"}
                                content={user.hobbies.split("||").join(", ")}
                                backgroundColor={Constants.COLOR.BLUE} />
                            <InformationItem
                                containerStyle={{ marginTop: -34 }}
                                title={"Interests"}
                                content={user.interests.split("||").join(", ")}
                                backgroundColor={Constants.COLOR.WHITE} />
                            <InformationItem
                                containerStyle={{ marginTop: -34 }}
                                title={"Favorite Movies"}
                                content={user.favorite_movies.split("||").join(", ")}
                                backgroundColor={Constants.COLOR.BLUE} />
                            <InformationItem
                                containerStyle={{ marginTop: -34 }}
                                title={"Cultural Background"}
                                content={user.cultural_background.split("||").join(", ")}
                                backgroundColor={Constants.COLOR.WHITE} />
                            <InformationItem
                                containerStyle={{ marginTop: -34 }}
                                title={"Additional Information"}
                                tags={[
                                    { id: 'height', label: inchesToHumanReadable(parseInt(user.height)) },
                                    { id: 'bodyType', label: user.body_type },
                                    { id: 'smokeType', label: user.smoke_type },
                                    { id: 'drinkType', label: user.drink_type },
                                    { id: 'educationLevel', label: user.education_level },
                                    { id: 'considerMySelf', label: `I consider myself as ${user.consider_myself}` },
                                    { id: 'ideaOfFun', label: user.idea_of_fun },
                                ]}
                                backgroundColor={Constants.COLOR.BLUE} />
                        </View>
                    </ScrollView>
                </View>
            }
            {loading && <Spinner visible={true} />}
        </View >
    )
}

export default UserScreen;