import React, { } from 'react';
import {
    Text,
    View
} from 'react-native';
import Constants from '../common/Constants';
import { Switch } from 'react-native-switch';
import StyledSlider from '../components/StyledSlider';

const FeatureItem = ({ item, onValueChange }) => {
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Constants.LAYOUT.SCREEN_WIDTH - 40, paddingVertical: 15 }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                    {item.title}
                </Text>
                {
                    item.title == 'Flex GPS' ?
                        <View />
                        :
                        <Switch
                            value={item.value}
                            onValueChange={onValueChange}
                            disabled={false}
                            activeText={''}
                            inActiveText={''}
                            circleSize={16}
                            barHeight={24}
                            circleBorderWidth={0}
                            backgroundActive={Constants.COLOR.PRIMARY}
                            backgroundInactive={Constants.COLOR.GRAY_LIGHT}
                            circleActiveColor={Constants.COLOR.WHITE}
                            circleInActiveColor={Constants.COLOR.WHITE}
                            renderInsideCircle={() => <View />} // custom component to render inside the Switch circle (Text, Image, etc.)
                            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                            outerCircleStyle={{}} // style for outer animated circle
                            renderActiveText={false}
                            renderInActiveText={false}
                            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                            switchWidthMultiplier={2.6} // multiplied by the `circleSize` prop to calculate total width of the Switch
                            switchBorderRadius={12} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                        />
                }
            </View>
            {
                item.title == 'Flex GPS' &&
                <StyledSlider
                    title={''}
                    disableRange={false}
                    lower={item.value['low']}
                    upper={item.value['high']}
                    suffix='miles'
                    min={0}
                    max={100}
                    values={[]}
                    containerStyle={{ marginTop: 0, marginBottom: 10, width: Constants.LAYOUT.SCREEN_WIDTH - 40 }}
                    onValueChanged={({ low, high }) => {
                        onValueChange({ low: low, high: high })
                    }} />
            }
        </View>
    )
}

export default FeatureItem;