import React, { useRef, useState } from 'react';
import {
    Image,
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
import PicturesLayout from '../../components/PicturesLayout';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheetModal from '../../components/ActionSheetModal';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import Spinner from '../../components/Spinner';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';
import PictureEditLayout from '../../components/PictureEditLayout';

function AboutMePhotoScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const pictureEditLayoutRef = useRef()
    const [pictures, setPictures] = useState([])
    const [visiblePhotoOptions, setVisiblePhotoOptions] = useState(false)
    const [loading, setLoading] = useState(false)
    const client = new S3Client({
        region: Constants.AWS.REGION,
        credentials: {
            accessKeyId: Constants.AWS.AWS_ACCESS_KEY_ID,
            secretAccessKey: Constants.AWS.AWS_SECRET_ACCESS_KEY
        }
    })
    const onNextPress = () => {
        // if (pictures.length < 2) {
        //     return presentToastMessage({ type: 'success', position: 'top', message: "Please upload at least 2 profile pictures." })
        // }
        // uploadImagesToS3()

        setTimeout(() => {
            navigation.push("MyPreferences")
        }, 100);
    }
    const onBackPress = () => navigation.pop()
    const launchPicker = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            forceJpg: true,
            cropping: true
        }).then((image) => {
            setPictures([...pictureEditLayoutRef.current.state.images.filter((picture) => picture !== 'ADD'), image.path])
        }).catch((error) => {
            console.log(error)
        })
    }
    const launchCamera = () => {
        ImagePicker.openCamera({
            mediaType: 'photo',
            forceJpg: true,
            cropping: true
        }).then(image => {
            setPictures([...pictureEditLayoutRef.current.state.images.filter((picture) => picture !== 'ADD'), image.path])
        });
    }
    const uploadImageToS3 = async (file) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(file.path);
                const blob = await response.blob();

                const key = "dev/" + file.name
                const params = {
                    Bucket: Constants.AWS.BUCKET_NAME,
                    Key: key,
                    Body: blob,
                    ACL: "public-read"
                }
                await client.send(new PutObjectCommand(params))
                resolve({ uploaded: file });
            } catch (error) {
                reject(error);
            }
        });
    };
    const uploadImagesToS3 = async () => {
        const files = []
        const filenames = []
        pictures.map((picture, i) => {
            const name = new Date().getTime() + i + "." + picture.split('.').pop();
            filenames.push(name)
            files.push({ name: name, path: picture })
        });

        let promises = [];
        files.map((file, i) => {
            promises.push(uploadImageToS3(file));
        });

        setLoading(true)
        Promise.all(promises)
            .then(() => {
                saveAboutMePhotos(filenames)
            })
            .catch(error => {
                console.log(error)
                console.log('upload_photos', JSON.stringify(error))
                setLoading(false)
                presentToastMessage({ type: 'success', position: 'top', message: (error !== null && error.response !== undefined && error.response.data !== null) ? error.response.data : "Some problems occurred, please try again." })
            })
    }
    const saveAboutMePhotos = async (filenames) => {
        try {
            setLoading(true)
            await axios.post('apis/set_user_photos/',
                { photos: filenames.join("||") },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            setLoading(false)
            setTimeout(() => {
                navigation.push("MyPreferences")
            }, 100);
        } catch (error) {
            console.log('set_user_photos', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visiblePhotoOptions &&
                <ActionSheetModal
                    insets={insets}
                    title={"Profile Picture"}
                    cancel={"CANCEL"}
                    content={null}
                    options={["TAKE PHOTO", "PHOTO LIBRARY"]}
                    onOptionPress={(index) => {
                        setVisiblePhotoOptions(false)
                        if (index === 0) {
                            setTimeout(() => {
                                launchCamera()
                            }, 500);
                        } else if (index === 1) {
                            setTimeout(() => {
                                launchPicker()
                            }, 500);
                        }
                    }}
                    onCancelPress={() => {
                        setVisiblePhotoOptions(false)
                    }}
                />
            }
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {`About Me`}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 20, width: Constants.LAYOUT.SCREEN_WIDTH }}>
                    <View style={{ marginTop: 24, paddingHorizontal: 30 }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"Upload your profile pictures"}
                        </Text>
                        <Text style={{ marginTop: 16, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"We require that you upload a minimum of 2 profile pictures to help show that you are a real person"}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        <PictureEditLayout
                            ref={pictureEditLayoutRef}
                            cellWidth={(Constants.LAYOUT.SCREEN_WIDTH - 75) / 2}
                            padding={15}
                            pictures={pictures}
                            onAddButtonPress={(m, i) => {
                                setVisiblePhotoOptions(true)
                            }}
                            onRemoveButtonPress={(uri) => {
                                setPictures([...pictureEditLayoutRef.current.state.images.filter((picture) => picture !== 'ADD' && picture !== uri)])
                            }} />
                    </View>
                    <View style={{ alignSelf: 'flex-start', marginLeft: 30, flexDirection: 'row', marginTop: 16 }}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image style={{ width: 21, height: 21, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_info.png')} />
                        </TouchableOpacity>
                        <Text style={{ marginStart: 10, marginTop: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                            {"Supported format: \n.jpg, .png"}
                        </Text>
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

export default AboutMePhotoScreen;