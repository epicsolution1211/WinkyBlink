import React, { useState} from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import Constants from '../common/Constants';
import { calculateAge, getS3StorageURL, inchesToHumanReadable, presentToastMessage } from '../common/Functions';
import FastImage from 'react-native-fast-image';
import Geocoder from 'react-native-geocoder';
import { useFocusEffect } from '@react-navigation/native';

const BlastItem = ({ item, layout, index, onUserPress, onBlastPress }) => {
    
    const [adminarea, setAdminarea] = useState('');
    const [country, setCountry] = useState('');

    const getCityName = async () => {
        var NY = { 
            lat: parseFloat(item.latitude), 
            lng: parseFloat(item.longtidue) 
        }
        try {
            const res = await Geocoder.geocodePosition(NY);
            setAdminarea(res[0].adminArea);
            setCountry(res[0].country);
            // console.log("adminarea", res);
        } catch (error) {
            // console.log("getCityName error", error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getCityName();
          return () => {
          };
        }, [])
    );

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: index % 2 == 0 ? Constants.COLOR.WHITE : Constants.COLOR.BLUE_DIFF
        }}>
            <TouchableOpacity onPress={onUserPress} style={{
                width: layout == 'small' ? 45 : 53, height: layout == 'small' ? 45 : 53, borderRadius: 10,
                backgroundColor: Constants.COLOR.WHITE, ...Platform.select({
                    ios: {
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 3,
                            height: 3,
                        },
                        shadowOpacity: 0.28,
                        shadowRadius: 4.59,
                    },
                    android: {
                        elevation: 5,
                    },
                })
            }}>
                {/* <Image style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} source={require('../../assets/images/img_demo_profile.png')} /> */}

                <FastImage
                                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                source={{
                                    uri: getS3StorageURL(item.user_photo),
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
            </TouchableOpacity>
            <View style={{ flex: 1, paddingStart: layout == 'small' ? 30 : 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                        {item.user_name}
                    </Text>
                    {
                        // index == 0 &&
                        item.is_newly_added==1 &&
                        <View style={{ marginStart: 10, width: 40, height: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: Constants.COLOR.BLUE_SEPERATOR }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT11, color: Constants.COLOR.WHITE }}>
                                {'NEW'}
                            </Text>
                        </View>
                    }
                </View>
                <Text numberOfLines={1} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                {adminarea+","+country}
                </Text>
            </View>
            <TouchableOpacity onPress={onBlastPress}>
                <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../assets/images/ic_next_black.png')} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.WHITE, justifyContent: 'flex-between', alignItems: 'center', borderRadius: 7, flexDirection: 'row', paddingHorizontal: 20
    },
    text: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK, flex: 1
    }
})

export default BlastItem;