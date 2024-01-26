import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from '../common/Constants';
import { getS3StorageURL } from '../common/Functions';
import FastImage from 'react-native-fast-image';

const PicturesLayout = ({ pictures, containerStyle, onAddPress, onRemovePress }) => {
    const [photos, setPhotos] = useState(pictures)
    const rowCount = (photos.length % 2 == 0) ? (photos.length / 2 + 1) : ((photos.length + 1) / 2)
    useEffect(() => {
        setPhotos(pictures)
    }, [pictures]);
    const PictureItem = ({ index }) => {
        return (
            <View style={{ width: (containerStyle.width - 15) / 2, aspectRatio: 1 }}>
                {
                    photos.length > index ?
                        <View style={{ width: '100%', height: '100%' }}>
                            <FastImage style={{ width: '100%', height: '100%', borderRadius: 12 }} source={{ priority: FastImage.priority.high, uri: (photos[index]).includes("/") ? photos[index] : getS3StorageURL(photos[index]) }} />
                            <TouchableOpacity onPress={() => onRemovePress(index)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Constants.COLOR.WHITE, position: 'absolute', top: -14, right: -10 }}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/images/ic_remove_pic.png')} />
                            </TouchableOpacity>
                        </View> :
                        <TouchableOpacity onPress={onAddPress} style={{ width: '100%', height: '100%', borderRadius: 12, backgroundColor: Constants.COLOR.GRAY, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 36, height: 32, resizeMode: 'contain' }} source={require('../../assets/images/ic_about_camera.png')} />
                        </TouchableOpacity>
                }
            </View>
        )
    }
    return (
        <View style={[styles.container, containerStyle]} >
            {
                Array.from({ length: rowCount }, (_, index) => index).map((index) =>
                    <View key={index.toString()} style={{ marginTop: index == 0 ? 0 : 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <PictureItem key={(index * 2).toString()} index={index * 2} />
                        <PictureItem key={(index * 2 + 1).toString()} index={index * 2 + 1} />
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE
    }
})

export default PicturesLayout;