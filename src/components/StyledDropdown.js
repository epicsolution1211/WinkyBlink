import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Text, FlatList } from 'react-native';
import Constants from '../common/Constants';
import { Menu } from 'react-native-material-menu';

const StyledDropdown = ({ title, value = [], type, options, containerStyle, textStyle, onValueChanged }) => {
    const [visibleDropDown, setVisibleDropDown] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState(value)
    useEffect(() => {
        if (JSON.stringify(selectedOptions) !== JSON.stringify(value)) {
            setSelectedOptions(value)
        }
        return () => { }
    }, [value]);
    useEffect(() => {
        if (JSON.stringify(selectedOptions) !== JSON.stringify(value)) {
            onValueChanged(selectedOptions)
        }
        return () => { }
    }, [selectedOptions]);
    const SingleOptionItem = ({ option, index }) => {
        return (
            <TouchableOpacity
                style={{
                    width: (containerStyle !== undefined && containerStyle.width !== undefined) ? containerStyle.width : Constants.LAYOUT.SCREEN_WIDTH - 60,
                    height: 55,
                    paddingHorizontal: 20,
                    justifyContent: 'center',
                    borderTopWidth: index == 0 ? 0 : 1,
                    borderTopColor: Constants.COLOR.GRAY_SEPERATOR
                }}
                onPress={() => {
                    setSelectedOptions([option])
                    setVisibleDropDown(false)
                }}
            >
                <Text numberOfLines={1} style={{ color: selectedOptions.includes(option) ? Constants.COLOR.PRIMARY : Constants.COLOR.BLACK, fontSize: Constants.FONT_SIZE.FT20, fontFamily: selectedOptions.includes(option) ? Constants.FONT_FAMILY.PRIMARY_DEMI : Constants.FONT_FAMILY.PRIMARY_MEDIUM }}>
                    {option}
                </Text>
            </TouchableOpacity>
        )
    }
    const MultiOptionItems = ({ options, index }) => {
        const MultiOptionItem = ({ option }) => {
            return (
                <TouchableOpacity
                    style={{
                        width: (containerStyle !== undefined && containerStyle.width !== undefined) ? (containerStyle.width - 40) / 2 : (Constants.LAYOUT.SCREEN_WIDTH - 100) / 2,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        if (selectedOptions.includes(option)) {
                            const updated = selectedOptions.filter((item) => item != option)
                            setSelectedOptions(updated)
                        } else {
                            const updated = [...selectedOptions, option]
                            setSelectedOptions(updated)
                        }
                    }} >
                    <View style={{ width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: Constants.COLOR.GRAY_LIGHT, alignItems: 'center', justifyContent: 'center' }} >
                        <Image style={{ width: 11, height: 8, tintColor: selectedOptions.includes(option) ? Constants.COLOR.SECONDARY : Constants.COLOR.TRANSPARENT, resizeMode: 'contain' }} source={require('../../assets/images/ic_pass_verify.png')} />
                    </View>
                    <Text numberOfLines={1} style={{ marginLeft: 6, color: Constants.COLOR.BLACK, fontSize: Constants.FONT_SIZE.FT14, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM }}>
                        {option}
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', width: (containerStyle !== undefined && containerStyle.width !== null) ? containerStyle.width : Constants.LAYOUT.SCREEN_WIDTH - 60, paddingHorizontal: 20 }}>
                {
                    options.map((option) =>
                        <MultiOptionItem key={option} option={option} />
                    )
                }
            </View>
        )
    }
    return (
        <View style={{ marginTop: containerStyle.marginTop }}>
            <Menu
                visible={visibleDropDown}
                anchor={
                    <TouchableOpacity onPress={() => setVisibleDropDown(true)} style={[styles.container, containerStyle, { marginTop: 0 }]} >
                        <Text numberOfLines={1} style={[styles.text, textStyle]}>
                            {(type === 'Single' && selectedOptions.length > 0) ? selectedOptions[0] : title}
                        </Text>
                        <Image style={{ width: 13, height: 8, resizeMode: 'contain' }} source={require('../../assets/images/ic_down_arrow.png')} />
                    </TouchableOpacity>
                }
                onRequestClose={() => setVisibleDropDown(false)}
                style={{ marginTop: 61, borderRadius: 7 }}
            >
                {
                    type === 'Single' ?
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {
                                options.map((option, index) => <SingleOptionItem key={index.toString()} index={index} option={option} />)
                            }
                        </ScrollView> :
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }} >
                            {
                                options.map((option, index) => {
                                    if (index % 2 == 0) {
                                        if (options.length - 1 == index) {
                                            return <MultiOptionItems key={index.toString()} options={[option]} />
                                        }
                                        return null
                                    } else {
                                        return <MultiOptionItems key={index.toString()} options={[options[index - 1], option]} />
                                    }
                                })
                            }
                        </ScrollView>
                }
            </Menu>
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

export default StyledDropdown;