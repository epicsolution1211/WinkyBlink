import * as React from 'react';
import { View, Text, TouchableOpacity, Image, StyleProp, TextStyle, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Constants from '../common/Constants';

export default function DateTimePickerModal({ value, mode, minimumDate, maximumDate, defaultDate, onSelect, onCancel }) {
    const [date, setDate] = React.useState(value)
    const onSelectPress = () => {
        onSelect((date === null || date === '') ? defaultDate : date)
    }
    const onCancelPress = () => {
        onCancel()
    }
    const onChange = (event: any, selectedDate: React.SetStateAction<Date>) => {
        setDate(selectedDate)
    }
    return (
        <Modal transparent visible={true} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: Constants.COLOR.WHITE, borderBottomColor: Constants.COLOR.BLACK_01, borderTopLeftRadius: 7, borderTopRightRadius: 7 }}>
                    <View style={{ height: 48, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: Constants.COLOR.BLACK_01 }}>
                        <TouchableOpacity onPress={onCancelPress} style={{ height: 48, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.GRAY }}>
                                {"Cancel"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSelectPress} style={{ height: 48, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.PRIMARY }}>
                                {"Select"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={(date === null || date === '') ? defaultDate : date}
                        mode={mode}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        display={'spinner'}
                        is24Hour={true}
                        onChange={onChange} />
                </View>
            </View>
        </Modal>
    )
}