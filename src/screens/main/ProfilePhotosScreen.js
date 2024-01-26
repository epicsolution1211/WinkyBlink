import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
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
import Spinner from '../../components/Spinner';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheetModal from '../../components/ActionSheetModal';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import axios from 'axios';
import { getFilenameFromS3StorageURL, getS3StorageURL, presentToastMessage } from '../../common/Functions';
import PictureEditLayout from '../../components/PictureEditLayout';

function ProfilePhotosScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const pictureEditLayoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [visiblePhotoOptions, setVisiblePhotoOptions] = useState(false)
    const [pictures, setPictures] = useState([])
    const client = new S3Client({
        region: Constants.AWS.REGION,
        credentials: {
            accessKeyId: Constants.AWS.AWS_ACCESS_KEY_ID,
            secretAccessKey: Constants.AWS.AWS_SECRET_ACCESS_KEY
        }
    })
    useEffect(() => {
        loadUserPhotos()
        return () => { }
    }, []);
    const loadUserPhotos = async () => {
        try {
            setLoading(true)
            const response = await axios.get('apis/load_profile/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setPictures(response.data.user.photos.map(function (photo) {
                return getS3StorageURL(photo.photo);
            }))
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
    const launchPicker = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            forceJpg: true,
            cropping: true
        }).then((image) => {
            setPictures([...pictureEditLayoutRef.current.state.images.filter((picture) => picture !== 'ADD'), image.path])
        });
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
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onSavePress = () => {
        if (pictures.length < 2) {
            return presentToastMessage({ type: 'success', position: 'top', message: "Please upload at least 2 profile pictures." })
        }
        uploadImagesToS3()
    }
    const uploadImageToS3 = async (file) => {
        if (file.path.startsWith("https://s3.")) {
            return ({ uploaded: getFilenameFromS3StorageURL(file.path) });
        }
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
        pictureEditLayoutRef.current.state.images.map((picture, i) => {
            if (picture !== 'ADD') {
                var name = ""
                if (picture.startsWith("https://s3.")) {
                    name = getFilenameFromS3StorageURL(picture)
                } else {
                    name = new Date().getTime() + i + "." + picture.split('.').pop();
                }
                filenames.push(name)
                files.push({ name: name, path: picture })
            }
        });

        let promises = [];
        files.map((file, i) => {
            promises.push(uploadImageToS3(file));
        });

        setLoading(true)
        Promise.all(promises)
            .then(() => {
                saveUserPhotos(filenames)
            })
            .catch(error => {
                console.log(error)
                console.log('upload_photos', JSON.stringify(error))
                setLoading(false)
                presentToastMessage({ type: 'success', position: 'top', message: (error !== null && error.response !== undefined && error.response.data !== null) ? error.response.data : "Some problems occurred, please try again." })
            })
    }
    const saveUserPhotos = async (filenames) => {
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
            setPictures(filenames.map(function (filename) {
                return getS3StorageURL(filename);
            }))
            setLoading(false)
            presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your pictures." })
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
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
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
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {loaded ? 'Photos' : 'Photos'}
            </Text>
            {
                loaded &&
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 25, paddingLeft: 5, paddingRight: 20, paddingBottom: 20 }}>
                        <Text style={{ marginLeft: 15, flex: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {"We require that you upload a minimum of 2 profile pictures to help show that you are a real person"}
                        </Text>
                        <PictureEditLayout
                            ref={pictureEditLayoutRef}
                            cellWidth={(Constants.LAYOUT.SCREEN_WIDTH - 55) / 2}
                            padding={15}
                            pictures={pictures}
                            onAddButtonPress={(m, i) => {
                                setVisiblePhotoOptions(true)
                            }}
                            onRemoveButtonPress={(uri) => {
                                setPictures([...pictureEditLayoutRef.current.state.images.filter((picture) => picture !== 'ADD' && picture !== uri)])
                            }} />
                        <View style={{ marginLeft: 15, flexDirection: 'row', marginTop: 16 }}>
                            <View>
                                <Image style={{ width: 21, height: 21, resizeMode: 'contain' }} source={require('../../../assets/images/ic_about_info.png')} />
                            </View>
                            <Text style={{ marginStart: 10, marginTop: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                                {"Supported format: \n.jpg, .png"}
                            </Text>
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

export default ProfilePhotosScreen;