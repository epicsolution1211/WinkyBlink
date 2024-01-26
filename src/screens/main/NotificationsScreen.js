import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';

function NotificationsScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [notifications, setNotifications] = useState([{ id: '0', type: 'Virtual Date Invite' }, { id: '1', type: 'Message' }, { id: '2', type: 'Message' }, { id: '3', type: 'Message' }, { id: '4', type: 'Message' }, { id: '5', type: 'Message' }, { id: '6', type: 'Message' }, { id: '7', type: 'Message' }, { id: '8', type: 'Message' }])
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onRefresh = () => { }
    useEffect(() => {
        if (navigation !== undefined) {
            const parentNavigator = navigation.getParent()
            parentNavigator.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    height: Constants.LAYOUT.BOTTOM_BAR_HEIGHT + insets.bottom,
                    width: Constants.LAYOUT.SCREEN_WIDTH,
                    display: 'none'
                }
            })
        }
        return () => { };
    }, [navigation]);
    const NotificationItem = ({ item, index, onUserPress, onConversationPress }) => {
        const MessageItem = ({ item, index, onUserPress, onConversationPress }) => {
            return (
                <TouchableOpacity
                    onPress={onConversationPress}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                    }}>
                    <TouchableOpacity onPress={onUserPress} style={{
                        width: 45, height: 45, borderRadius: 12,
                        backgroundColor: Constants.COLOR.WHITE,
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 3,
                                    height: 3,
                                },
                                shadowOpacity: 0.28,
                                shadowRadius: 4.59,
                            },
                            android: {
                                elevation: 5,
                            },
                        })
                    }}>
                        <Image style={{ width: 53, height: 53, borderRadius: 10, resizeMode: 'contain' }} source={require('../../../assets/images/img_demo_profile.png')} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, paddingStart: 20, paddingEnd: 10 }}>
                        <Text numberOfLines={2} style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                            {'Lorem Ipsum is simply dummy text of the printing'}
                        </Text>
                    </View>
                    {
                        index == 3 &&
                        <View style={{ marginEnd: 10, width: 40, height: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: Constants.COLOR.BLUE_SEPERATOR }}>
                            <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT11, color: Constants.COLOR.WHITE }}>
                                {'NEW'}
                            </Text>
                        </View>
                    }
                    <Text style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT10, color: Constants.COLOR.BLACK }}>
                        {'12:45 PM'}
                    </Text>
                </TouchableOpacity>
            )
        }
        const VirtualDateItem = ({ item, index, onUserPress }) => {
            const onAcceptPress = () => { }
            const onReschedulePress = () => { }
            return (
                <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                        <TouchableOpacity onPress={onUserPress} style={{
                            width: 45, height: 45, borderRadius: 12,
                            backgroundColor: Constants.COLOR.WHITE, ...Platform.select({
                                ios: {
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 3,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.28,
                                    shadowRadius: 4.59,
                                },
                                android: {
                                    elevation: 5,
                                },
                            })
                        }}>
                            <Image style={{ width: 53, height: 53, borderRadius: 10, resizeMode: 'contain' }} source={require('../../../assets/images/img_demo_profile.png')} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, paddingStart: 20, paddingEnd: 10 }}>
                            <Text style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                                {'James has sent you a Virtual Date invite scheduled for: \nFriday, May 20th, at 7PM EST.'}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 5, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT10, color: Constants.COLOR.BLACK }}>
                            {'12:45 PM'}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 20, flexDirection: 'row', marginTop: 12 }}>
                        <StyledButton
                            containerStyle={{ width: 96, paddingHorizontal: 10, height: 36, borderRadius: 5, backgroundColor: Constants.COLOR.PRIMARY, alignSelf: 'flex-end' }}
                            textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}
                            title={"ACCEPT"}
                            onPress={onAcceptPress} />
                        <StyledButton
                            containerStyle={{ width: 116, marginLeft: 12, paddingHorizontal: 10, height: 36, borderRadius: 5, backgroundColor: Constants.COLOR.BLACK, alignSelf: 'flex-end' }}
                            textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT14, color: Constants.COLOR.WHITE }}
                            title={"RESCHEDULE"}
                            onPress={onReschedulePress} />
                    </View>
                </View>
            )
        }
        return (
            <View style={{
                backgroundColor: index % 2 == 0 ? Constants.COLOR.WHITE : Constants.COLOR.BLUE_DIFF,
            }}>
                {
                    item.type === 'Message' ?
                        <MessageItem
                            item={item}
                            index={index}
                            onUserPress={onUserPress}
                            onConversationPress={onConversationPress}
                        /> : item.type === 'Virtual Date Invite' ?
                            <VirtualDateItem
                                item={item}
                                index={index}
                                onUserPress={onUserPress}
                            /> : null
                }
            </View>
        )
    }
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
                {'Notifications'}
            </Text>
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                data={notifications}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 0, backgroundColor: Constants.COLOR.BLACK }} />}
                renderItem={({ item, index }) =>
                    <NotificationItem
                        item={item}
                        index={index}
                        onUserPress={() => navigation.push('User', {})}
                        onConversationPress={() => navigation.push('Conversation', { type: 'user' })} />}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default NotificationsScreen;