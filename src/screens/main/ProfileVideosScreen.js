import React, { useEffect, useRef, useState } from 'react';
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
import InfoModal from '../../components/InfoModal';
import Spinner from '../../components/Spinner';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheetModal from '../../components/ActionSheetModal';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import Video from 'react-native-video';
import axios from 'axios';
import { getS3StorageURL, presentToastMessage } from '../../common/Functions';

function ProfileVideosScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [visibleIntroductionInfoModal, setVisibleIntroductionInfoModal] = useState(false)
    const [visibleVideoOptions, setVisibleVideoOptions] = useState(false)
    const [video, setVideo] = useState(null)
    const [introductionVideoClip, setIntroductionVideoClip] = useState(null)
    const [paused, setPaused] = useState(true)
    const [muted, setMuted] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const videoPlayerRef = useRef()
    const client = new S3Client({
        region: Constants.AWS.REGION,
        credentials: {
            accessKeyId: Constants.AWS.AWS_ACCESS_KEY_ID,
            secretAccessKey: Constants.AWS.AWS_SECRET_ACCESS_KEY
        }
    })
    useEffect(() => {
        loadUserVideo()
        return () => { }
    }, []);
    const loadUserVideo = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)
            setIntroductionVideoClip(response.data.user.introduction_video_clip)
            setVideo(response.data.user.introduction_video_clip)
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
    const onRemoveVideoPress = () => setVideo(null)
    const onVideoRecordingPress = () => setVisibleVideoOptions(true)
    const onIntroductionInfoPress = () => setVisibleIntroductionInfoModal(true)
    const onSavePress = async () => {
        try {
            setLoading(true)
            var parameters = {}
            if (video === null) {
                await client.send(new DeleteObjectCommand({ Bucket: Constants.AWS.BUCKET_NAME, Key: "dev/" + introductionVideoClip }))
                parameters['introduction_video_clip'] = '';
            } else {
                const extension = video.path.split('.').pop();
                const filename = new Date().getTime() + "." + extension;

                const response = await fetch(video.path);
                const blob = await response.blob();

                const key = "dev/" + filename
                const params = {
                    Bucket: Constants.AWS.BUCKET_NAME,
                    Key: key,
                    Body: blob,
                    ACL: "public-read"
                }
                await client.send(new PutObjectCommand(params))

                parameters['introduction_video_clip'] = filename
            }
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)
            if (parameters['introduction_video_clip'] !== '') {
                setIntroductionVideoClip(parameters['introduction_video_clip'])
                presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your introduction clip." })
            } else {
                setIntroductionVideoClip(null)
                presentToastMessage({ type: 'success', position: 'top', message: "You have successfully removed your introduction clip." })
            }
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const launchPicker = () => {
        ImagePicker.openPicker({
            mediaType: "video",
            compressVideoPreset: 'MediumQuality',
        }).then((video) => {
            setVideo(video)
        });
    }
    const launchCamera = () => {
        ImagePicker.openCamera({
            mediaType: 'video',
            compressVideoPreset: 'MediumQuality',
        }).then(video => {
            setVideo(video)
        });
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visibleVideoOptions &&
                <ActionSheetModal
                    insets={insets}
                    title={"Video Recording"}
                    cancel={"CANCEL"}
                    content={null}
                    options={["RECORD VIDEO", "PHOTO LIBRARY"]}
                    onOptionPress={(index) => {
                        setVisibleVideoOptions(false)
                        if (index === 0) {
                            setTimeout(() => {
                                launchCamera()
                            }, 100);
                        } else if (index === 1) {
                            setTimeout(() => {
                                launchPicker()
                            }, 100);
                        }
                    }}
                    onCancelPress={() => {
                        setVisibleVideoOptions(false)
                    }}
                />
            }
            {
                visibleIntroductionInfoModal &&
                <InfoModal
                    insets={insets}
                    title={"Info"}
                    content={"To better assist in the verification process, please feel free to add a short 2 second video clip for your future matches.  This will help other users get a feel for who you are, and it will automatically set your verification to Level 3."}
                    onClosePress={() => setVisibleIntroductionInfoModal(false)}
                />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {loaded ? 'Video' : "Video"}
            </Text>
            {
                loaded &&
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 25, paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' }}>
                        <View style={{ marginTop: 0, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                                    {"Introduction Clip (Optional)"}
                                </Text>
                                <TouchableOpacity onPress={onIntroductionInfoPress}>
                                    <Image style={{ width: 21, height: 21, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_info.png')} />
                                </TouchableOpacity>
                            </View>
                            {
                                video === null ?
                                    <StyledButton
                                        containerStyle={{ marginTop: 10, width: Constants.LAYOUT.SCREEN_WIDTH - 40, backgroundColor: Constants.COLOR.GRAY }}
                                        textStyle={{}}
                                        icon={
                                            <Image style={{ marginEnd: 8, marginBottom: 4, width: 19, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_clip.png')} />
                                        }
                                        title={"Record Video Now"}
                                        onPress={onVideoRecordingPress} /> :
                                    <View style={{ justifyContent: 'center' }}>
                                        <Video
                                            source={{ uri: video.path === undefined ? getS3StorageURL(video) : video.path }}   // Can be a URL or a local file.
                                            ref={videoPlayerRef}                // Store reference
                                            onBuffer={() => { }}                // Callback when remote video is buffering
                                            onError={() => { }}               // Callback when video cannot be loaded
                                            controls={false}
                                            repeat={true}
                                            paused={paused}
                                            muted={muted}
                                            onFullscreenPlayerDidDismiss={() => {
                                                setPaused(true)
                                            }}
                                            style={{ marginTop: 10, backgroundColor: Constants.COLOR.GRAY_DARK, width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 200 }} />
                                        <TouchableOpacity onPress={onRemoveVideoPress} style={{ position: 'absolute', top: 15, right: 5 }}>
                                            <Image style={{ width: 30, height: 30 }} source={require('../../../assets/images/ic_remove_pic.png')} />
                                        </TouchableOpacity>
                                        {
                                            paused &&
                                            <TouchableOpacity onPress={() => {
                                                setPaused(false)
                                            }} style={{ position: 'absolute', alignSelf: 'center' }}>
                                                <Image style={{ width: 96, height: 96, borderRadius: 48 }} source={require('../../../assets/images/icon_play.png')} />
                                            </TouchableOpacity>
                                        }
                                        {
                                            !paused &&
                                            <View style={{ position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity onPress={() => {
                                                    setPaused(true)
                                                }}>
                                                    <Image style={{ width: 28, height: 28, marginEnd: 10, tintColor: Constants.COLOR.WHITE }} source={require('../../../assets/images/icon_pause.png')} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    setMuted(!muted)
                                                }}>
                                                    <Image style={{ margin: 1, width: 26, height: 26, marginEnd: 10, tintColor: Constants.COLOR.WHITE }} source={muted ? require('../../../assets/images/icon_speaker_off.png') : require('../../../assets/images/icon_speaker_on.png')} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    videoPlayerRef.current.presentFullscreenPlayer()
                                                }}>
                                                    <Image style={{ margin: 3, width: 22, height: 22, resizeMode: 'contain', tintColor: Constants.COLOR.WHITE }} source={require('../../../assets/images/icon_full_screen.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                            }
                            <View style={{ flexDirection: 'row', marginTop: 16 }}>
                                <TouchableOpacity>
                                    <Image style={{ width: 21, height: 21, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_info.png')} />
                                </TouchableOpacity>
                                <Text style={{ marginStart: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                                    {"Supported format: \n.mp4, .wmv"}
                                </Text>
                            </View>
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

export default ProfileVideosScreen;