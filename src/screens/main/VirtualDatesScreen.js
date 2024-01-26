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

function VirtualDatesScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [virtualDates, setVirtualDates] = useState([{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }])
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onSchedulePress = () => navigation.push('ScheduleVirtualDateWhen')
    const onRefresh = () => { }
    const onManageRequestsPress = () => navigation.push('VirtualDatesRequests')
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
                {'Virtual Dates'}
            </Text>
            <TouchableOpacity onPress={onManageRequestsPress} style={{ marginStart: 20, marginTop: 20, width: Constants.LAYOUT.SCREEN_WIDTH - 40, height: 34, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.2)' }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.BLACK }}>
                    {'No pending requests'}
                </Text>
                <Image style={{ width: 8, height: 13, resizeMode: 'contain' }} source={require('../../../assets/images/ic_next_black.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginTop: 10, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <FlatList
                    style={{ flex: 1, width: Constants.LAYOUT.SCREEN_WIDTH }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    data={virtualDates}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 1, backgroundColor: Constants.COLOR.BLACK }} />}
                    renderItem={({ item, index }) =>
                        <VirtualDateItem
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

export default VirtualDatesScreen;