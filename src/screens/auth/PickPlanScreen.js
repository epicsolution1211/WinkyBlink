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
import PlanItem from '../../components/PlanItem';

function PickPlanScreen({ navigation }) {
    const insets = useSafeAreaInsets()
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [plans, setPlans] = useState([
        { id: 'Basic', title: 'Basic', subtitle: '$0.99', benefits: ["25 swipes per day", "Communicate with 10 unique members via in-app text messaging", "Receive up to 4 exchanges per member."], price: '0.99' },
        { id: 'Plus', title: 'PLUS', subtitle: '$12.99', benefits: ["150 swipes per day", "5 FREE WinkyBlasts", "Optional Winky Badge", "Unlimited text chat", "Audio chat can be purchased separately through our In-App store.", "Receive access to additional In-App features, which can be purchased throught our In-App Store."], price: '17.99' },
        { id: 'Premium', title: 'PREMIUM', subtitle: '$22.99', benefits: ["Unlimited swipes", "20 FREE WinkyBlasts", "Optional WinkyBadge", "Full audio and text chat capabilities", "1 FREE WinkBlinking Session (where available)", "Flex GPS, Travel Mode, Ghost Mode"], price: '24.99' },
    ])
    const onContinuePress = () => {
        selectedPlan != null && navigation.push("PlanDetail", { plan: selectedPlan })
    }
    const onBackPress = () => navigation.pop()
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderPrimary
                insets={insets}
                onBackPress={onBackPress} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <Text style={{ marginTop: 30, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                    {"Pick A Plan"}
                </Text>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20, alignItems: 'center' }}>
                    {
                        plans.map((plan, index) =>
                            <PlanItem
                                key={index.toString()}
                                index={index}
                                plan={plan}
                                selected={selectedPlan != null && selectedPlan.id == plan.id}
                                onPress={() => {
                                    setSelectedPlan(plan)
                                }} />)
                    }
                </ScrollView>
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={"CONTINUE"}
                    onPress={onContinuePress} />
            </View>

        </View>
    )
}

export default PickPlanScreen;