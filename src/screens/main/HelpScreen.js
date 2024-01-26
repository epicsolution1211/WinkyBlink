import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import TicketReportModal from '../../components/TicketReportModal';

function HelpScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [visiblTicketReportModal, setVisiblTicketReportModal] = useState(false)
    const [tickets, setTickets] = useState([
        { id: '0' },
        { id: '1' },
        { id: '2' },
    ])
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onReportPress = () => setVisiblTicketReportModal(true)
    const onRefresh = () => { }
    const TicketItem = ({ item, index, onPress }) => {
        return (
            <TouchableOpacity onPress={onPress} style={{ width: Constants.LAYOUT.SCREEN_WIDTH - 40, paddingVertical: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {'Issue Ticket Here'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 6, height: 6, borderRadius: 6, backgroundColor: 'rgba(89,234,18,1)' }} />
                        <Text style={{ marginLeft: 6, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT15, color: Constants.COLOR.GRAY_LIGHT }}>
                            {'12:45 PM'}
                        </Text>
                    </View>
                </View>
                <Text style={{ marginTop: 8, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                    {'Neque porro quisquam...'}
                </Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visiblTicketReportModal &&
                <TicketReportModal
                    insets={insets}
                    onClosePress={() => setVisiblTicketReportModal(false)}
                    onSubmitPress={() => {
                        setVisiblTicketReportModal(false)
                        setTimeout(() => {
                            navigation.push('Conversation', { type: 'support' })
                        }, 100);
                    }} />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {'Help'}
            </Text>
            <View style={{ flex: 1, marginTop: 15, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    data={tickets}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ItemSeparatorComponent={() => <View style={{ marginHorizontal: 0, opacity: 0.2, height: 1, backgroundColor: Constants.COLOR.WHITE }} />}
                    renderItem={({ item, index }) =>
                        <TicketItem
                            item={item}
                            index={index}
                            onPress={() => navigation.push('Conversation', { type: 'support' })} />}
                    keyExtractor={item => item.id}
                />
                <StyledButton
                    containerStyle={{ marginTop: 30, alignSelf: 'center' }}
                    textStyle={{}}
                    title={"REPORT AN ISSUE"}
                    onPress={onReportPress} />
            </View>
        </View>
    )
}

export default HelpScreen;