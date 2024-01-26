import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Constants from './../common/Constants';
import Slider from 'rn-range-slider';
import Thumb from './../components/rn-range-slider/Thumb';
import Rail from './../components/rn-range-slider/Rail';
import RailSelected from './../components/rn-range-slider/RailSelected';

const StyledSlider = ({ values, theme = 'dark', title = '', containerStyle, disableRange, min, max, lower, upper, suffix = '', onValueChanged }) => {
    const [value, setValue] = useState({ low: lower, high: upper })
    const renderThumb = useCallback(() => <Thumb color={Constants.COLOR.PRIMARY} />, []);
    const renderRail = useCallback(() => <Rail theme={theme} />, []);
    const renderRailSelected = useCallback(() => <RailSelected color={Constants.COLOR.PRIMARY} />, []);
    const handleDistanceValueChange = useCallback((low, high) => {
        if (low !== upper || high !== upper) {
            setValue({ low: low, high: high })
        }
    }, []);
    useEffect(() => {
        onValueChanged({ low: value.low, high: value.high })
        return () => { }
    }, [value]);
    return (
        <View style={[styles.container, containerStyle]} >
            {
                title !== '' &&
                <Text style={[styles.label, { color: theme == 'dark' ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }]}>
                    {title}
                </Text>
            }
            <View style={{ marginTop: title !== '' ? 20 : 0, borderWidth: 1, borderColor: Constants.COLOR.GRAY_LIGHT, borderRadius: 12, alignItems: 'center' }}>
                <Slider
                    style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 120, marginTop: 18, marginBottom: 18 }}
                    min={min}
                    max={max}
                    low={value.low}
                    high={value.high}
                    step={1}
                    disableRange={disableRange}
                    allowLabelOverflow={true}
                    floatingLabel={false}
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    onValueChanged={(handleDistanceValueChange)}
                />
                <Text style={[styles.selected_text, { backgroundColor: theme == 'dark' ? Constants.COLOR.SECONDARY : Constants.COLOR.WHITE, color: theme == 'dark' ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }]}>
                    {disableRange ? values[value.low - min] : `${value.low}${suffix == '' ? '' : (' ' + suffix)} - ${value.high}${suffix == '' ? '' : (' ' + suffix)}`}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60
    },
    label: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE
    },
    selected_text: {
        top: -8, position: 'absolute', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE, paddingHorizontal: 8
    }
})

export default StyledSlider;