import React, { useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import StyledTextInput from '../../components/StyledTextInput';
import InfoModal from '../../components/InfoModal';
import { presentToastMessage } from '../../common/Functions';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheetModal from '../../components/ActionSheetModal';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import Video from 'react-native-video';

function AboutMeBioScreen({ navigation,route }) {
    const insets = useSafeAreaInsets()
    const [funFactAboutMe, setFunFactAboutMe] = useState('')
    const [video, setVideo] = useState(null)
    const [paused, setPaused] = useState(true)
    const [muted, setMuted] = useState(true)
    const [loading, setLoading] = useState(false)
    const videoPlayerRef = useRef()
    const [visibleIntroductionInfoModal, setVisibleIntroductionInfoModal] = useState(false)
    const [visibleVideoOptions, setVisibleVideoOptions] = useState(false)
    const client = new S3Client({
        region: Constants.AWS.REGION,
        credentials: {
            accessKeyId: Constants.AWS.AWS_ACCESS_KEY_ID,
            secretAccessKey: Constants.AWS.AWS_SECRET_ACCESS_KEY
        }
    })
    const onNextPress = () => {
        if (funFactAboutMe === '') {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please write fun facts about yourself." })
        }
        saveAboutMeBio()
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
    const saveAboutMeBio = async () => {
        try {
            setLoading(true)
            var parameters = {
                'fun_fact_about_me': funFactAboutMe,
            }
            var introduction_video_clip = null
            if (video !== null) {
                const extension = video.path.split('.').pop();
                introduction_video_clip = new Date().getTime() + "." + extension;

                const response = await fetch(video.path);
                const blob = await response.blob();

                const key = "dev/" + introduction_video_clip
                const params = {
                    Bucket: Constants.AWS.BUCKET_NAME,
                    Key: key,
                    Body: blob,
                    ACL: "public-read"
                }
                await client.send(new PutObjectCommand(params))
            }

            if (introduction_video_clip !== null) {
                parameters['introduction_video_clip'] = introduction_video_clip
            }
            console.log(parameters)
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
            setTimeout(() => {
                navigation.push("AboutMePhoto",{plan:route.params.plan})
            }, 100);
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error !== null && error.response !== undefined && error.response.data !== null) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onRemoveVideoPress = () => setVideo(null)
    const onVideoRecordingPress = () => setVisibleVideoOptions(true)
    const onBackPress = () => navigation.pop()
    const onIntroductionInfoPress = () => setVisibleIntroductionInfoModal(true)
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
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
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {`About Me`}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"Fun facts about me"}
                        </Text>
                        <StyledTextInput
                            containerStyle={{ marginTop: 10, height: 250, paddingTop: 20, paddingBottom: 20 }}
                            placeholder={'Minimum 4 words,\nMaximum 50 words'}
                            returnKeyType={'done'}
                            value={funFactAboutMe}
                            autoCorrect={true}
                            multiline={true}
                            onChangeText={(text) => setFunFactAboutMe(text)}
                            onSubmitEditing={() => Keyboard.dismiss()} />
                    </View>
                    <View style={{ marginTop: 24, width: Constants.LAYOUT.SCREEN_WIDTH - 60 }}>
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
                                    containerStyle={{ marginTop: 10, backgroundColor: Constants.COLOR.GRAY }}
                                    textStyle={{}}
                                    icon={
                                        <Image style={{ marginEnd: 8, marginBottom: 4, width: 19, height: 25, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_clip.png')} />
                                    }
                                    title={"Video Recording"}
                                    onPress={onVideoRecordingPress} /> :
                                <View style={{ justifyContent: 'center' }}>
                                    <Video
                                        source={{ uri: video.path }}   // Can be a URL or a local file.
                                        ref={videoPlayerRef}                                      // Store reference
                                        onBuffer={() => { }}                // Callback when remote video is buffering
                                        onError={() => { }}               // Callback when video cannot be loaded
                                        controls={false}
                                        repeat={true}
                                        paused={paused}
                                        muted={muted}
                                        onFullscreenPlayerDidDismiss={() => {
                                            setPaused(true)
                                        }}
                                        style={{ marginTop: 10, backgroundColor: Constants.COLOR.GRAY_DARK, width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 200 }} />
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
                    title={"NEXT"}
                    onPress={onNextPress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default AboutMeBioScreen;