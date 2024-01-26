import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    // Extrapolate,
    Extrapolation,
    interpolateColor,
    runOnJS,
} from 'react-native-reanimated';
import { useState } from 'react';
import Constants from '../common/Constants';

const BUTTON_WIDTH = Constants.LAYOUT.SCREEN_WIDTH - 60;
const BUTTON_HEIGHT = 60;
const BUTTON_PADDING = 5;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - BUTTON_PADDING * 2;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

Animated.Extrapolate = Extrapolation

const SwipeButton = ({ onToggle }) => {
    // Animated value for X translation
    const X = useSharedValue(0);
    // Toggled State
    const [toggled, setToggled] = useState(false);

    // Fires when animation ends
    const handleComplete = (isToggled) => {
        if (isToggled !== toggled) {
            setToggled(isToggled);
            onToggle(isToggled);
            setToggled(!isToggled)
        }
    };

    // Gesture Handler Events
    const animatedGestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.completed = toggled;
        },
        onActive: (e, ctx) => {
            let newValue;
            if (ctx.completed) {
                newValue = H_SWIPE_RANGE + e.translationX;
            } else {
                newValue = e.translationX;
            }

            if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
                X.value = newValue;
            }
        },
        onEnd: () => {
            if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
                X.value = withSpring(0);
                runOnJS(handleComplete)(false);
            } else {
                X.value = withSpring(H_SWIPE_RANGE);
                X.value = withSpring(0);
                runOnJS(handleComplete)(true);
            }
        },
    });

    const InterpolateXInput = [0, H_SWIPE_RANGE];
    const AnimatedStyles = {
        swipeCont: useAnimatedStyle(() => {
            return {};
        }),
        colorWave: useAnimatedStyle(() => {
            return {
                width: H_WAVE_RANGE + X.value,
                opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
            };
        }),
        swipeable: useAnimatedStyle(() => {
            return {
                backgroundColor: interpolateColor(X.value, [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING], ['#fff', '#fff']),
                transform: [{ translateX: X.value }],
            };
        }),
        swipeText: useAnimatedStyle(() => {
            return {
                opacity: interpolate(X.value, InterpolateXInput, [1, 0], Animated.Extrapolate.CLAMP),
                transform: [
                    {
                        translateX: interpolate(X.value, InterpolateXInput, [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS], Animated.Extrapolate.CLAMP),
                    },
                ],
            };
        }),
    };

    return (
        <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
            <PanGestureHandler onGestureEvent={animatedGestureHandler}>
                <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} >
                    <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require("../../assets/images/ic_delete_swipe.png")} />
                </Animated.View>
            </PanGestureHandler>
            <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
                {'DELETE ACCOUNT'}
            </Animated.Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    swipeCont: {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        borderRadius: BUTTON_HEIGHT,
        padding: BUTTON_PADDING,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Constants.COLOR.TRANSPARENT
    },
    colorWave: {
        position: 'absolute',
        left: 0,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
    },
    swipeable: {
        position: 'absolute',
        left: BUTTON_PADDING,
        height: SWIPEABLE_DIMENSIONS,
        width: SWIPEABLE_DIMENSIONS,
        borderRadius: 7,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    swipeText: {
        alignSelf: 'center',
        fontSize: 20,
        zIndex: 2,
        color: Constants.COLOR.WHITE,
        marginStart: 25,
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI,
        fontSize: Constants.FONT_SIZE.FT20
    },
});

export default SwipeButton;