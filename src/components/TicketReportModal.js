import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Modal, Text, Keyboard, LayoutAnimation, Platform } from 'react-native';
// import Spinner from '../../components/Spinner';
import Constants from '../common/Constants';
import StyledTextInput from './StyledTextInput';
import StyledDropdown from './StyledDropdown';
import StyledButton from './StyledButton';
import { presentToastMessage } from '../common/Functions';
import axios from 'axios';

const TicketReportModal = ({ insets, onClosePress, onSubmitPress }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [issuesubject, setIssuesubject] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    // const [loading,setLoading] = useState(false);
    const titleTextField = useRef()
    const descriptionTextField = useRef()
    const subjecSelectField = useRef()

    useEffect(() => {
        titleTextField.current.focus()

        const showSubscription = Keyboard.addListener(Platform.OS == 'ios' ? "keyboardWillShow" : "keyboardDidShow", (e) => keyboardDidShow(e));
        const hideSubscription = Keyboard.addListener(Platform.OS == 'ios' ? "keyboardWillHide" : "keyboardDidHide", (e) => keyboardDidHide(e));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const keyboardDidShow = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(event.endCoordinates.height)
    };
    const keyboardDidHide = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardHeight(0)
    };

    const supportrequest = () =>{
        
        if(title == '')
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter support title." })
        if(issuesubject == '')
            return presentToastMessage({ type: 'success', position: 'top', message: "Please select support subject." })
        if(description.trim().length == 0)
            return presentToastMessage({ type: 'success', position: 'top', message: "Please enter support description." })
        // console.log("this is supportrequest",description)
        submitsupport();
    }

    const submitsupport = async () =>{
        try{
            await axios.post('apis/send_help_user/',{
                'title':title,
                'subject':issuesubject[0],
                'description':description
            },{
                headers:{
                    'Auth-Token':token
                }
            })
            presentToastMessage({ type: 'success', position: 'top', message: 'Submitted successfully.' })
        }catch(error){
            console.log('submit report', error)
            setTimeout(() => {
                presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
            }, 100);
        }    
    }

    return (
        <Modal transparent style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'flex-end' }} >
                <View style={{ paddingHorizontal: 30, backgroundColor: Constants.COLOR.BLACK, paddingTop: 25, borderTopLeftRadius: 6, borderTopRightRadius: 6, paddingBottom:24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ flex: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                            {"Report an Issue"}
                        </Text>
                        <TouchableOpacity onPress={onClosePress}>
                            <Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../../assets/images/ic_close_white.png')} />
                        </TouchableOpacity>
                    </View>
                    <StyledTextInput
                        ref={titleTextField}
                        containerStyle={{ marginTop: 30 }}
                        placeholder={"Issue Title"}
                        value={title}
                        onChangeText={(text) => setTitle(text)} />
                    <StyledDropdown
                        ref={subjecSelectField}
                        title={"Subject"}
                        containerStyle={{ marginTop: 20 }} 
                        value={issuesubject == '' ? [] : issuesubject}
                        type={"Single"}
                        options={Constants.REPORT_ISSUE_SUBJECT}
                        onValueChanged={(value) => setIssuesubject(value)}
                        />
                    <StyledTextInput
                        ref={descriptionTextField}
                        containerStyle={{ marginTop: 20, height: 150, paddingTop: 20, paddingBottom: 20 }}
                        placeholder={"Description"}
                        value={description}
                        multiline={true}
                        supportrequest={(evalue)=>supportrequest(evalue)}
                        onChangeText={(text) => setDescription(text)} />
                    {/* <StyledButton
                        containerStyle={{ marginTop: 30, alignSelf: 'center' }}
                        textStyle={{}}
                        title={"SUBMIT"}
                        onPress={onSubmitPress} /> */}
                </View>
            
            </View >
        </Modal>
    )
}

// const styles = StyleSheet.create({
//     container: {
//         width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.PRIMARY, justifyContent: 'center', alignItems: 'center', borderRadius: 7
//     },
//     text: {
//         fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT20, color: Constants.COLOR.WHITE
//     }
// })

export default TicketReportModal;