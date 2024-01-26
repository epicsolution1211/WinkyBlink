import React, { useEffect, useState } from 'react';
import {
    Platform,
    StatusBar,
    View,
    ScrollView,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import StyledButton from '../../components/StyledButton';
import StyledSlider from '../../components/StyledSlider';
import ConfirmationModal from '../../components/ConfirmationModal';
import InfoModal from '../../components/InfoModal';
import SuccessModal from '../../components/SuccessModal';
import { presentToastMessage } from '../../common/Functions';
import axios from 'axios';

function CompatibilityQuestionsScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [step, setStep] = useState(-1)
    const [visibleSkip, setVisibleSkip] = useState(false)
    const [visibleThankYou, setVisibleThankYou] = useState(false)
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([
        { type: 'single_check', question: 'Which quality do you find the sexiest?', items: ["Someone who is likes to listen to or play music", "Someone who is multilingual", "Someone who is logical/mathematical", "Someone who can make me laugh"] },
        { type: 'slider', question: 'Sex is an important part of a healthy relationship?', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'I consider myself a neat freak?', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'I strongly believe in fate and destiny', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'single_check', question: 'When on vacation, I generally prefer to?', items: ["Stay in a luxury hotel", "Stay in an Air BnB", "Stay in a budget hotel or hostel", "Use a tent and sleeping bag"] },
        { type: 'slider', question: 'Are you quick to forgive or do you hold grudges?', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'You can tell a lot about a person by their shoes', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'I need a relationship to feel happy', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'single_check', question: 'I find tattoos', items: ["Unattractive", "Doesn't faze me", "Tolerable", "Extremely Attractive"] },
        { type: 'slider', question: 'Separation between work and personal life important to me', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'Religion is an important part of my life', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'Being college educated is very important to me', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'single_check', question: 'What are the most important characteristics in a partner?', items: ["Good looks and style", "Loyal, kind, trustworthy", "Driven, successful", "Passionate and adventurous"] },
        { type: 'slider', question: 'Ambition/drive is an important trait in a person', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'I manage money well', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'It is important to me to live a healthy lifestyle', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'single_check', question: 'I find smoking', items: ["Acceptable", "Tolerable", "Doesn't faze me", "Gross"] },
        { type: 'slider', question: 'I believe in happiness over financial success', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'In a relationship, it\'s important not to go to sleep angry', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
        { type: 'slider', question: 'Spirituality is an important part of my life', values: ["Strongly Disagree", "I don't care", "Somewhat Agree", "Strongly Agree"] },
    ])
    
    const [answers, setAnswers] = useState([])
    useEffect(() => {
        setAnswers(new Array(questions.length).fill([]))
        return () => { };
    }, []);

    // const loadUserPreferences = async () => {
    //     try {
    //         setLoading(true)
    //         const response = await axios.get('apis/load_profile/', {
    //             headers: {
    //                 'Auth-Token': global.token
    //             }
    //         })
    //         setLookingFor(response.data.user.preferences.looking_for)
    //         setLoaded(true)
    //         setLoading(false)
    //     } catch (error) {
    //         console.log('load_profile', JSON.stringify(error))
    //         setLoading(false)
    //         setTimeout(() => {
    //             presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
    //         }, 100);
    //     }
    // }


    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()

    const onBackPress = () => {
        if (step == -1) {
            setVisibleSkip(true)
        } else {
            setStep(step - 1)
        }
    }
    const onSkipPress = () => {
        if (step == -1) {
            setVisibleSkip(true)
        } 
        else {
            if (questions.length > step + 1) {
                setStep(step + 1)
            } else {
                setVisibleThankYou(true)
            }
        }
    }
   
  const total_answer = [];

  const onNextPress = () => {
    if (questions.length > step + 1) {
      setStep(step + 1);
    //   console.log("question_id", step,"answer",answers[step]);
    } else {
        freewinkyblink();
        setVisibleThankYou(true);
    }

    // answers.map((item, index) => {
    //     total_answer.push({ "question_id": index, "answer": item });
    // });
    console.log(token);
    if(step>-1)
        savecompatibilityquestion();
  }
    

    const savecompatibilityquestion = async () => {
        try {
            setLoading(true)
            const response =  await axios.post('apis/set_user_answers_me/',
                {
                    "question_id":step,
                    "answer":answers[step]
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            console.log(response.data);
            presentToastMessage({ type: 'success', position: 'top', message: "You have successfully updated your preferences." })
            setLoading(false)
        } catch (error) {
            console.log('set_user_preferences', error)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }

    const freewinkyblink = async () => {
        console.log('this is freewinily api request part')
        try{
            setLoading(true);
            
            const response =  await axios.post('apis/freewinkyblast_receive/',
                {
                    'winkyblast': "free_winkyblast"
                },
                {
                    headers: {
                        'Auth-Token': token
                    }
                }
            )
            setLoading(false);
            console.log('freewinkyblast try',response.data)
        }catch(e){
            console.log('update_freewinlyblast', error)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }
    }
    const IntroView = ({ }) => {
        return (
            <View style={{ width: Constants.LAYOUT.SCREEN_WIDTH, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }} >
                <Image style={{ width: 90, height: 70, resizeMode: 'contain' }} source={require('../../../assets/images/ic_question_thumb.png')} />
                <Text style={{ marginTop: 35, lineHeight: 26, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}>
                    {"Help us find you the most suitable matches for you by answering the following compatibility questions.\n\nOnce you have completd all\n20 questions, you will receive\n5 FREE WinkyBlasts."}
                </Text>
            </View>
        )
    }
    const QuestionView = ({ step }) => {
        return (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 30, alignItems: 'center', justifyContent: 'center', width: Constants.LAYOUT.SCREEN_WIDTH }}>
                <Text style={{ marginTop: 60, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.BLACK }}>
                    {questions[step].question}
                </Text>
                {
                    questions[step].type == 'slider' ?
                        <StyledSlider
                            title={''}
                            theme={'light'}
                            disableRange={true}
                            lower={questions[step].values.findIndex((value) => value === answers[step])}
                            upper={1}
                            min={0}
                            max={3}
                            values={questions[step].values}
                            containerStyle={{ marginTop: 25 }} 
                            onValueChanged={({low}) => {
                                // console.log(answers)
                                answers[step]=questions[step].values[low];
                            }}
                        /> :
                        <View>
                            {
                                questions[step].items.map((item, index) =>
                                    <StyledButton
                                        key={index.toString()}
                                        containerStyle={{ marginTop: index == 0 ? 15 : 10, backgroundColor: answers[step].includes(item) ? Constants.COLOR.PRIMARY : Constants.COLOR.WHITE, borderWidth: 1, borderColor: answers[step].includes(item) ? Constants.COLOR.PRIMARY : Constants.COLOR.GRAY_LIGHT }}
                                        textStyle={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT20, color: answers[step].includes(item) ? Constants.COLOR.WHITE : Constants.COLOR.BLACK }}
                                        title={item}
                                        onPress={() => {
                                            if (questions[step].type == 'multi_check') {
                                                if (answers[step].includes(item)) {
                                                    setAnswers(answers.map((answer, i) => {
                                                        if (i == step) {
                                                            answer = answer.filter((value) => value !== item)
                                                        }
                                                        return answer
                                                    }))
                                                } else {
                                                    setAnswers(answers.map((answer, i) => {
                                                        if (i == step) {
                                                            answer = [...answer, item]
                                                        }
                                                        return answer
                                                    }))
                                                }
                                            } else {
                                                setAnswers(answers.map((answer, i) => {
                                                    if (i == step) {
                                                        answer = item
                                                    }
                                                    return answer
                                                }))
                                            }
                                        }} />
                                )
                            }
                        </View>
                }
            </ScrollView>
        )
    }
    const ProgressView = ({ step }) => {
        return (
            <View>
                <View style={{ marginTop: 35, width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <View style={{ width: `${100 * (step + 1) / questions.length}%`, height: '100%', backgroundColor: Constants.COLOR.PRIMARY, borderRadius: 10 }} />
                </View>
                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.BLACK }}>
                    {`${step + 1}/${questions.length}`}
                </Text>
            </View>
        )
    }
    return (
        <View style={{ position: 'absolute', width: Constants.LAYOUT.SCREEN_WIDTH, height: Constants.LAYOUT.SCREEN_HEIGHT, backgroundColor: Constants.COLOR.WHITE }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'dark-content' : 'dark-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visibleSkip &&
                <ConfirmationModal
                    insets={insets}
                    title={"Skip"}
                    content={"Are you sure you want to skip the compatibility questions?"}
                    onPositivePress={() => {
                        setVisibleSkip(false)
                        navigation.goBack()
                    }}
                    onNegativePress={() => {
                        setVisibleSkip(false)
                    }}
                    onClosePress={() => setVisibleSkip(false)}
                />
            }
            {
                visibleThankYou &&
                <InfoModal
                    insets={insets}
                    title={"Thank You"}
                    content={"Thank you for completing the compatibility questions. You've received 5 FREE WinkyBlasts."}
                    onClosePress={() => {
                        setVisibleThankYou(false)
                        navigation.goBack()
                    }}
                />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.BLUE_LIGHT}
                onHomePress={onHomePress}
                onBackPress={onBackPress}
                onMenuPress={onMenuPress}
                backType={step === -1 ? 'Close' : 'Back'} />
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                {step === -1 && <IntroView />}
                {step !== -1 && <ProgressView step={step} />}
                {step !== -1 && <QuestionView step={step} />}
                <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY_LIGHT, marginBottom: 20 }} />
                <StyledButton
                    containerStyle={{}}
                    textStyle={{}}
                    title={step === -1 ? "ANSWER QUESTIONS NOW" : "NEXT"}
                    onPress={onNextPress} />
                <TouchableOpacity onPress={onSkipPress} style={{ marginTop: 20 }}>
                    <Text style={{ textAlign: 'center', fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.GRAY }}>
                        {step === -1 ? `Not Now` : `Skip`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CompatibilityQuestionsScreen;