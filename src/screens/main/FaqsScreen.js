import React, { useState, useEffect } from 'react';
import {
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
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import { presentToastMessage } from '../../common/Functions';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

function FaqsScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [limit, setLimit] = useState(10);
    // const [questions, setQuestions] = useState([
    //     { id: '0', question: 'Lorem ipsum dolor sit amet, cons ectetur adipiscing elit?', answer: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', expanded: false },
    //     { id: '1', question: 'Lorem ipsum dolor sit amet, cons ectetur adipiscing elit?', answer: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', expanded: false },
    //     { id: '2', question: 'Lorem ipsum dolor sit amet, cons ectetur adipiscing elit?', answer: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', expanded: false },
    //     { id: '3', question: 'Lorem ipsum dolor sit amet, cons ectetur adipiscing elit?', answer: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ', expanded: false },
    // ])
    const [questions, setQuestions] = useState('');
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const [loading,setLoading] = useState(false);
    
    // useEffect(() => {
    //     faqs(10);
    //     return () => {};
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
          faqs(limit);
          return () => {
          };
        }, [])
    );

    const faqs = async (limit) => {
        try{
            setLoading(true);
            const result = await axios.get(`apis/load_faq/${limit}`,{
                headers:{
                    'Auth-Token':global.token
                }
            })
            console.log(result.data.faqs);
            setQuestions(result.data.faqs);
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log('load_faqs=====>',error)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const QuestionItem = ({ item, index, onPress }) => {
        return (
            <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', width: Constants.LAYOUT.SCREEN_WIDTH - 40, paddingVertical: 15 }}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={item.expanded ? require('../../../assets/images/ic_faq_collapse.png') : require('../../../assets/images/ic_faq_expand.png')} />
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                        {item.question}
                    </Text>
                    {
                        item.expanded &&
                        <Text style={{ marginTop: 8, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE }}>
                            {item.answer}
                        </Text>
                    }
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {'FAQs'}
            </Text>
            <View style={{ flex: 1, marginTop: 25, alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <ScrollView style={{ width: Constants.LAYOUT.SCREEN_WIDTH }} contentContainerStyle={{ alignItems: 'center' }}>
                    {
                        questions.map((item, index) =>
                            <QuestionItem
                                key={index.toString()}
                                item={item}
                                index={index}
                                onPress={() => setQuestions(questions.map((question, i) => {
                                    if (i == index) {
                                        question.expanded = !question.expanded
                                    }
                                    return question
                                }))} />
                        )
                    }
                </ScrollView>
            </View>
            {loading && <Spinner visible={true} />}
        </View>
    )
}

export default FaqsScreen;