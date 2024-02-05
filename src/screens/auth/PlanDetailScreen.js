import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Constants from '../../common/Constants';
import NavigationHeaderPrimary from '../../components/NavigationHeaderPrimary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import StyledTextInput from '../../components/StyledTextInput';
import moment from 'moment';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { presentToastMessage } from '../../common/Functions';

function PlanDetailScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const onContinuePress = () => {
        saveUserSubscription()
    }
    const saveUserSubscription = async () => {
        let parameters;
        if(route.params.id=='Basic'){
            parameters = {
                'subscribed_plan': route.params.plan.id,
                'subscribed_date': moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }else if(route.params.id=='Plus'){
            parameters = {
                'subscribed_plan': route.params.plan.id,
                'winkyblast_count': 5,
                'subscribed_date': moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }else if(route.params.id=='Premium'){
            parameters = {
                'subscribed_plan': route.params.plan.id,
                'winkyblast_count': 20,
                'subscribed_date': moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }

        try {
            var body = [];
            for (let property in parameters) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(parameters[property]);
                body.push(encodedKey + "=" + encodedValue);
            }
            console.log(body);
            setLoading(true)
            await axios.put('apis/update_user/', body.join("&"), {
                headers: {
                    'Auth-Token': global.token
                }
            })
            setLoading(false)
            setTimeout(() => {
                navigation.push("CreateProfile",{plan:route.params.plan.id})
            }, 100);
        } catch (error) {
            console.log('update_user', JSON.stringify(error))
            setLoading(false)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const onBackPress = () => navigation.pop()
    const BenefitItem = ({ benefit, index }) => {
        return (
            <View style={{ marginTop: index == 0 ? 40 : 20, width: Constants.LAYOUT.SCREEN_WIDTH - 60, flexDirection: 'row' }}>
                <Image style={{ width: 20, height: 15, resizeMode: 'contain' }} source={require('../../../assets/images/ic_plan_allow.png')} />
                <Text style={{ marginStart: 12, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                    {benefit}
                </Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {`${route.params.plan.id} Membership`}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    <Text style={{ marginTop: 6, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                        {`Will give you:`}
                    </Text>
                    {
                        route.params.plan.benefits.map((benefit, index) =>
                            <BenefitItem
                                key={index.toString()}
                                index={index}
                                benefit={benefit} />)
                    }
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {`Price:`}
                </Text>
                <Text style={{ marginTop: 6, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {`$${route.params.plan.price}/month`}
                </Text>
                <StyledButton
                    containerStyle={{ marginTop: 20 }}
                    textStyle={{}}
                    title={"CONTINUE"}
                    onPress={onContinuePress} />
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default PlanDetailScreen;