import React, { useCallback, useEffect,useState} from 'react';
import {
    Image,
    Platform,
    StatusBar,
    TouchableOpacity,
    View,
} from 'react-native';

import AudioRecorderPlayer, {
     AVEncoderAudioQualityIOSType,
     AVEncodingOption,
     AudioEncoderAndroidType,
     AudioSet,
     AudioSourceAndroidType,
    } from 'react-native-audio-recorder-player';

import Slider from 'react-native-slider';

const audioRecorderPlayer = new AudioRecorderPlayer;
var Sound = require('react-native-sound');

const AudioMessageComponent = ({audio}) => {
    const [isAlreadyPlay, setIsAlreadyPlay] = useState(false);
    const [duration, setDuration] = useState('00:00:00');
    const [timeElapsed, setTimeElapsed] = useState('00:00:00');
    const [percent,setPercet] = useState(0);
    const [current_track,setCurrent_track] = useState(0);
    const [inprogress,setInprogress] = useState(false);
    const path = audio;
    var whoosh = new Sound(path);
    var whoosh_duration = whoosh.getDuration();
    console.log('whoosh_duration=======>', whoosh);


    const onstartplay = async ()=>{
        setIsAlreadyPlay(true);
        setInprogress(true);
        
        const result = await audioRecorderPlayer.startPlayer(path);
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if(e.currentPosition == e.duration){
                audioRecorderPlayer.stopPlayer();
            }
            let percent = Math.round(Math.floor(e.currentPosition)/Math.floor(e.duration)*100)
            setTimeElapsed(e.currentPosition);
            setPercet(percent);
            setDuration(e.duration);
            console.log('playing=======>', e.currentPosition);
            return;
        })
    }

    const onpause = async ()=>{
        setIsAlreadyPlay(false);
        // setInprogress(false);
        const result = await audioRecorderPlayer.pausePlayer((e)=>{
            console.log(e.duration)
        });
        console.log('pause=======>', result);
    }
    
    // const changeTime = async(seconds) => {
    //     let seektime = (seconds / 100) * duration;
    //     setTimeElapsed(seektime);
    //     await audioRecorderPlayer.startPlayer(path);
    //     audioRecorderPlayer.setVolume(1.0);
    //     audioRecorderPlayer.addPlayBackListener((e) => {
    //         if(e.currentPosition == e.duration){
    //             audioRecorderPlayer.stopPlayer();
    //         }
    //         let percent = Math.round(Math.floor(e.currentPosition)/Math.floor(e.duration)*100)
    //         setTimeElapsed(e.currentPosition);
    //         setPercet(percent);
    //         setDuration(e.duration);
    //         console.log('playing=======>', e.currentPosition);
    //         return;
    //     })


    //     // await audioRecorderPlayer.pausePlayer((e)=>{
    //     //     console.log(e.duration)
    //     // });
    //     // console.log('seektime=======>', seektime);
    //     // audioRecorderPlayer.addPlayBackListener((e)=>{
    //     //     console.log(e.currentPosition)
    //     // })
    //     // try {await audioRecorderPlayer.seekToPlayer(seektime);}
    //     // catch(err){console.log("seek error=========>",err)}
    // }

    return (
        <View>
            <TouchableOpacity onPress={onstartplay}>
                {!isAlreadyPlay ? <Image 
                source={require('../../assets/images/ic_chat_camera.png')} 
                style={{width: 15, height: 15}} /> : 
                <Image source={require('../../assets/images/Icon-1024.png')} style={{width:15,height:15}}/>}
            </TouchableOpacity>
            <Slider
                  minimumValue={0}
                  maximumValue={100}
                //   trackStyle={styles.track}
                //   thumbStyle={styles.thumb}
                  value={percent}
                  minimumTrackTintColor="#93A8B3"
                //   onValueChange={(value) => changeTime(value)}
            />
        </View>
    )
};
export default AudioMessageComponent