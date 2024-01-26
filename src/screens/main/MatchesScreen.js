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
import BlastItem from '../../components/BlastItem';
import MatchItem from '../../components/MatchItem';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';

function MatchesScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [matches, setMatches] = useState([]);
    // const [blasts, setBlasts] = useState([{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }])
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

    useEffect(() => {
        loadmatchs()
        return () => { };
    }, []);

    const loadmatchs = async () =>{
        try {
            setLoading(true)
            
            const response =  await axios.get('apis/load_matches/', {
                headers: {
                    'Auth-Token': global.token
                }
            })
            
            setMatches(response.data.matches);
            setLoading(false)
        } catch (error) {
            console.log('load_matches', error)
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
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
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                {'My Matches'}
            </Text>
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                data={matches}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 20, opacity: 0.1, height: 0, backgroundColor: Constants.COLOR.BLACK }} />}
                renderItem={({ item, index }) =>
                    <MatchItem
                        item={item}
                        index={index}
                        layout={'big'}
                        onUserPress={() => navigation.push('User', {id:item.opponent_id})}
                        onBlastPress={() => { }} />}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default MatchesScreen;