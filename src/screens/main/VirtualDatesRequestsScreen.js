import React, { useState } from 'react';
import {
    Platform,
    StatusBar,
    View,
    Image,
    TouchableOpacity,
    Text,
    ImageBackground,
    FlatList
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import VirtualDateItem from '../../components/VirtualDateItem';
import VirtualDateRequestReceived from '../../components/VirtualDateRequestReceived';
import VirtualDateRequestSent from '../../components/VirtualDateRequestSent';

function VirtualDatesRequestsScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [tabIndex, setTabIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [sentRequests, setSentRequests] = useState([{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }])
    const [receiveRequests, setReceiveRequests] = useState([{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }])
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onSchedulePress = () => navigation.push('ScheduleVirtualDateWhen')
    const onRefresh = () => { }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                {'Virtual Date Requests'}
            </Text>
            <View style={{ marginStart: 20, marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 34, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => setTabIndex(0)} style={{ width: '50%', alignItems: 'center', borderBottomColor: tabIndex == 0 ? Constants.COLOR.PRIMARY : Constants.COLOR.GRAY_SEPERATOR, borderBottomWidth: 2, height: 34 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                        {'Received'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTabIndex(1)} style={{ width: '50%', alignItems: 'center', borderBottomColor: tabIndex == 1 ? Constants.COLOR.PRIMARY : Constants.COLOR.GRAY_SEPERATOR, borderBottomWidth: 2, height: 34 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                        {'Sent'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 10, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <FlatList
                    style={{ flex: 1, width: Constants.LAYOUT.SCREEN_WIDTH }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    data={tabIndex == 0 ? receiveRequests : sentRequests}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 1, backgroundColor: Constants.COLOR.BLACK }} />}
                    renderItem={({ item, index }) =>
                        tabIndex == 0 ?
                            <VirtualDateRequestReceived
                                item={item}
                                index={index}
                                onUserPress={() => navigation.push('User', {})} /> :
                            <VirtualDateRequestSent
                                item={item}
                                index={index}
                                onUserPress={() => navigation.push('User', {})} />
                    }
                    keyExtractor={item => item.id}
                />
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{ height: 76 }}
                    textStyle={{}}
                    title={"SCHEDULE\nVIRTUAL DATE"}
                    onPress={onSchedulePress} />
            </View>
        </View>
    )
}

export default VirtualDatesRequestsScreen;