import React, { useState } from 'react';
import {
    FlatList,
    Platform,
    StatusBar,
    View,
    Text,
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import OpponentItem from '../../components/OpponentItem';
import SuccessModal from '../../components/SuccessModal';

function ScheduleVirtualDateOpponentScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [visibleSuccessModal, setVisibleSuccessModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [opponents, setOpponents] = useState([{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }])
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onSendPress = () => setVisibleSuccessModal(true)
    const onRefresh = () => { }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visibleSuccessModal &&
                <SuccessModal
                    insets={insets}
                    onClosePress={() => {
                        setVisibleSuccessModal(false)
                        navigation.pop(2)
                    }}
                    title={"Thank you"}
                    content={"Your Virtual Date request has been sent"} />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                {'Select Opponent'}
            </Text>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <FlatList
                    style={{ flex: 1, width: Constants.LAYOUT.SCREEN_WIDTH }}
                    contentContainerStyle={{ paddingBottom: insets.bottom + Constants.LAYOUT.BOTTOM_BAR_HEIGHT }}
                    data={opponents}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 1, backgroundColor: Constants.COLOR.BLACK }} />}
                    renderItem={({ item, index }) =>
                        <OpponentItem
                            item={item}
                            index={index}
                            onUserPress={() => navigation.push('User', {})} />
                    }
                    keyExtractor={item => item.id}
                />
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"SEND REQUEST"}
                    onPress={onSendPress} />
            </View>
        </View>
    )
}

export default ScheduleVirtualDateOpponentScreen;