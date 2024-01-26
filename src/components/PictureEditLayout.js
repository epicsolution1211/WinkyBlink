import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';
import { DynamicCollage } from "../components/react-native-images-collage/index";
import Constants from '../common/Constants';

const PictureEditLayout = forwardRef(({ pictures, cellWidth, padding, onAddButtonPress, onRemoveButtonPress }, ref) => {
    const [source, setSource] = useState({ images: ["ADD", "ADD"], matrix: [2] })
    const [reset, setReset] = useState(false)
    useEffect(() => {
        setReset(true)
        return () => { }
    }, [pictures]);
    useEffect(() => {
        if (reset) {
            const images = pictures.length % 2 === 0 ? [...pictures, "ADD", "ADD"] : [...pictures, "ADD"]
            const matrix = []
            for (let i = 0; i < parseInt(images.length / 2); i++) {
                matrix.push(2)
            }
            setSource({
                images: images,
                matrix: matrix
            })
            setReset(false)
        }
        return () => { }
    }, [reset]);
    if (reset) {
        return null
    }
    return (
        <DynamicCollage
            ref={ref}
            width={(cellWidth + padding) * 2}
            height={(cellWidth + padding) * source.matrix.length}
            images={source.images}
            matrix={source.matrix}
            direction={"column"}
            containerStyle={{}}
            imageContainerStyle={{ marginStart: padding, marginTop: padding, borderRadius: 12, overflow: 'hidden', backgroundColor: Constants.COLOR.WHITE }}
            imageFocussedStyle={{}}
            imageSwapStyle={{}}
            imageSelectedStyle={{}}
            imageSwapStyleReset={{}}
            separatorStyle={{}}
            imageStyle={{}}
            scaleAmplifier={1}
            isEditButtonVisible={true}
            EditButtonComponent={() =>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Constants.COLOR.WHITE, top: -20, right: -20 }}>
                    <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/images/ic_remove_pic.png')} />
                </View>
            }
            editButtonPosition={'top-right'}
            onEditButtonPress={(uri) => {
                onRemoveButtonPress(uri)
            }}
            onAddButtonPress={(m, i) => {
                onAddButtonPress(m, i)
            }} />
    )
})

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.PRIMARY, justifyContent: 'center', alignItems: 'center', borderRadius: 7, flexDirection: 'row', paddingHorizontal: 20
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE, textAlign: 'center'
    }
})

export default PictureEditLayout;