import React from 'react';
import {
    Platform,
    StatusBar,
    View,
    Text,
    ScrollView
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

function ScheduleVirtualDateWhenScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onSchedulePress = () => navigation.push('ScheduleVirtualDateOpponent')
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {'Select Date & Time'}
            </Text>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <View style={{ flex: 1, marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH }}>
                    <View style={{ alignItems: 'center' }}>
                        <Calendar
                            style={{
                                borderWidth: 0,
                                borderColor: Constants.COLOR.TRANSPARENT,
                                height: 350,
                                width: Constants.LAYOUT.SCREEN_WIDTH - 12,
                                backgroundColor: Constants.COLOR.TRANSPARENT,
                            }}
                            current={moment().format('YYYY-MM-DD')}
                            onDayPress={day => {
                                console.log('selected day', day);
                            }}
                            markedDates={{
                                '2012-03-01': { selected: true, marked: true, selectedColor: 'blue' },
                                '2012-03-02': { marked: true },
                                '2012-03-03': { selected: true, marked: true, selectedColor: 'blue' }
                            }}
                            theme={{
                                backgroundColor: Constants.COLOR.TRANSPARENT,
                                calendarBackground: Constants.COLOR.TRANSPARENT,
                                textSectionTitleColor: Constants.COLOR.WHITE,
                                selectedDayBackgroundColor: Constants.COLOR.PRIMARY,
                                selectedDayTextColor: Constants.COLOR.WHITE,
                                todayTextColor: Constants.COLOR.PRIMARY,
                                dayTextColor: Constants.COLOR.WHITE,
                                textDisabledColor: Constants.COLOR.GRAY,
                                monthTextColor: Constants.COLOR.WHITE,
                                arrowColor: Constants.COLOR.WHITE,
                                textDayFontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                                textDayFontWeight: '500',
                                textDayHeaderFontSize: Constants.FONT_SIZE.FT12,
                                textMonthFontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                                textMonthFontWeight: '800',
                                textMonthFontSize: Constants.FONT_SIZE.FT16,
                                textDayHeaderFontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR,
                                textDayHeaderFontWeight: '500',
                                textDayFontSize: Constants.FONT_SIZE.FT22,
                            }}
                        />
                    </View>
                    <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 40, marginHorizontal: 20, marginTop: 34 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <StyledButton
                                containerStyle={{ width: 134, height: 52, borderRadius: 8, backgroundColor: Constants.COLOR.WHITE }}
                                textStyle={{ color: Constants.COLOR.BLACK }}
                                title={"08:30 am"}
                                onPress={() => { }} />
                            <StyledButton
                                containerStyle={{ marginLeft: 6, width: 134, height: 52, borderRadius: 8, backgroundColor: Constants.COLOR.WHITE }}
                                textStyle={{ color: Constants.COLOR.BLACK }}
                                title={"09:00 am"}
                                onPress={() => { }} />
                            <StyledButton
                                containerStyle={{ marginLeft: 6, width: 134, height: 52, borderRadius: 8, backgroundColor: Constants.COLOR.WHITE }}
                                textStyle={{ color: Constants.COLOR.BLACK }}
                                title={"09:30 am"}
                                onPress={() => { }} />
                            <StyledButton
                                containerStyle={{ marginLeft: 6, width: 134, height: 52, borderRadius: 8, backgroundColor: Constants.COLOR.WHITE }}
                                textStyle={{ color: Constants.COLOR.BLACK }}
                                title={"10:00 am"}
                                onPress={() => { }} />
                            <StyledButton
                                containerStyle={{ marginLeft: 6, width: 134, height: 52, borderRadius: 8, backgroundColor: Constants.COLOR.WHITE }}
                                textStyle={{ color: Constants.COLOR.BLACK }}
                                title={"10:30 am"}
                                onPress={() => { }} />
                        </ScrollView>
                    </View>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"SCHEDULE"}
                    onPress={onSchedulePress} />
            </View>
        </View>
    )
}

export default ScheduleVirtualDateWhenScreen;