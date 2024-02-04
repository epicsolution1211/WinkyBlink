import React, { useEffect, useState } from 'react';
import {
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Constants from '../../common/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StyledButton from '../../components/StyledButton';
import NavigationHeaderSecondary from '../../components/NavigationHeaderSecondary';
import SuccessModal from '../../components/SuccessModal';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { getS3StorageURL, presentToastMessage } from '../../common/Functions';
// //buy
// import {
//     isIosStorekit2,
//     PurchaseError,
//     requestPurchase,
//     Sku,
//     useIAP,
// } from 'react-native-iap';

// //subscription
// import {
//     isIosStorekit2,
//     PurchaseError,
//     requestSubscription,
//     Sku,
//     useIAP,
// } from'react-native-iap';
// import { isAmazon } from 'react-native-iap/lib/typescript/src/internal';


function CheckOutScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const [visibleSuccessModal, setVisibleSuccessModal] = useState(false)
    const [description, setDescription] = useState(route.params.description);
    const [price,setPrice] = useState(route.params.price);
    const [loading, setLoading] = useState(false);
    const onBackPress = () => navigation.goBack()
    const onHomePress = () => navigation.navigate('TabHome')
    const onMenuPress = () => navigation.openDrawer()
    const onConfirmPress = async () =>{
        if(description == 'WinkyBlasts'){
            try{
                setLoading(true);
                axios.post('apis/buy_blast_user/',{
                    'count':route.params.count
                },{
                    headers:{
                        'Auth-Token':token
                    }
                })
                setLoading(false);
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message:"You have perchased successfully." })
                }, 100);
            }catch(error){
                console.log('buy_blast err', JSON.stringify(error))
                setLoading(false)
                setTimeout(() => {
                    presentToastMessage({ type: 'success', position: 'top', message: (error && error.response && error.response.data) ? error.response.data : "Some problems occurred, please try again." })
                }, 100);
            }
        }
        if(description == 'In-App Audio Chat'){
            
        }
        if(description == 'Virtual Dates'){
            
        }
        if(description == 'WinkBlinking'){
            
        }
        if(description == 'Travel Mode'){
            
        }
        if(description == 'Ghost Mode'){
            
        }
        setVisibleSuccessModal(true)
    
    }

    //buy
    // const productsku = {sku:'kk'};
    // const [success, setSuccess] = useState(false);
    // const { 
    //     connected,
    //     products,
    //     currentPurchase,
    //     currentPurchaseError,
    //     initConnectionError,
    //     getProducts,
    // } = useIAP();
    
    // //get product
    // const handlegetProducts = async () => {
    //     try {
    //         const products = await getProducts({skus:Constants.productSkus});
    //         console.log(products);
    //         setSuccess(true);
    //     } catch (err) {
    //         console.log(err);
    //         setSuccess(false);
    //     }
    // };

    // //request buy product
    // const handleBuyProduct = async (productsku) => {
    //     try {
    //         const response = await requestPurchase(productsku);
    //         // if(response)
    //         setVisibleSuccessModal(true);
    //         setSuccess(true);
    //     } catch (err) {
    //         console.log(err);
    //         setSuccess(false);
    //     }
    // }
    // //confirm buy
    // useEffect(() => {
    //     const checkCurrentPurchase = async () => {
    //         try {
    //             if ((isIosStorekit2() && currentPurchase?.transactionId) || currentPurchase?.transactionReceipt) {
    //                 await finishTransaction({
    //                     purchase: currentPurchase,
    //                     isConsumable: true,
    //                 });
    //                 setSuccess(true);
    //             }
    //         } catch (error) {
    //             if (error instanceof PurchaseError) {
    //                 errorLog({message: `[${error.code}]: ${error.message}`, error});
    //             } else {
    //                 errorLog({message: 'handleBuyProduct', error});
    //             }
    //         }
    //     };
    
    //     checkCurrentPurchase();
    // }, [currentPurchase, finishTransaction]);

    // //subscription
    // const subscriptionsku = {sku:'kk'};
    // const {
    //     connected,
    //     subscriptions,
    //     getSubscriptions,
    //     currentPurchase,
    //     finishTransaction
    // } = useIAP()
    // const[ ownedSubscriptions, setOwnedSubscriptions ] = useState([]);

    // //get subscription
    //  const handleGetSubscriptions = async() => {
    //     try {
    //         await getSubscriptions({
    //             skus: Constants.subscriptionSkus
    //         });

    //         console.log(subscriptions);
    //         setSuccess(true);
    //     } catch (err) {
    //         console.log(err);
    //         setSuccess(false);
    //     }
    // };

    // //request subscription
    // const handleBuySubscription = async (subscriptionsku) => {
    //     try {
    //         // subscriptions.map((subscription, index) => {
    //         //     // const owned = ownedSubscriptions.find(pId =>Constants.subscriptionSkus);
    //         // }) 
    //         // subscriptions.findIndex(subscriptions.productId ===subscriptionsku)
    //         await requestSubscription(subscriptionsku);

    //         // if(response)
    //         setVisibleSuccessModal(true);
    //         setSuccess(true);
    //     } catch (err) {
    //         console.log(err);
    //         setSuccess(false);
    //     }
    // }

    // useEffect(() => {
    //     const checkCurrentPurchase = async () => {
    //         try{
    //             if(currentPurchase?.productId){
    //                 await finishTransaction({
    //                     purchase:currentPurchase,
    //                     isConsumable:true,
    //                 })

    //                 setOwnedSubscriptions(prev => [...prev,currentPurchase?.productId]);
    //             }
    //         }catch(error){
    //             if(error instanceof PurchaseError){
    //                 errorLog({message:`[${error.code}]: ${error.message}`, error});
    //             }else{
    //                 errorLog({message:'handleBuySubscription', error});
    //             }
    //         }
    //     }

    //     checkCurrentPurchase();
    // },[currentPurchase, finishTransaction]);

    

    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.SECONDARY }} >
            <StatusBar barStyle={Platform.OS == 'ios' ? 'light-content' : 'light-content'} backgroundColor={Constants.COLOR.BLACK} />
            {
                visibleSuccessModal &&
                <SuccessModal
                    insets={insets}
                    onClosePress={() => {
                        setVisibleSuccessModal(false)
                    }}
                    title={"Thank you for your purchase."}
                    content={""} />
            }
            <NavigationHeaderSecondary
                insets={insets}
                backgroundColor={Constants.COLOR.WHITE}
                onBackPress={onBackPress}
                onHomePress={onHomePress}
                onMenuPress={onMenuPress} />
            <Text style={{ marginStart: 20, marginTop: 20, marginBottom: 10, fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT28, color: Constants.COLOR.WHITE }}>
                {'Checkout'}
            </Text>
            <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image style={{ width: 93, height: 69, borderRadius: 10, resizeMode: 'cover' }} source={require('../../../assets/images/img_virtual_dates.jpg')} />
                <View style={{ flex: 1, paddingLeft: 15 }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {description}
                    </Text>
                    <Text style={{ marginTop: 4, fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                        {'$'+price}
                    </Text>
                </View>
                {/* <View style={{ height: 35, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, borderColor: Constants.COLOR.RED }}>
                    <TouchableOpacity style={{ width: 25, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.RED }}>
                            {'-'}
                        </Text>
                    </TouchableOpacity>
                    <View style={{ minWidth: 25, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.WHITE }}>
                            {'10'}
                        </Text>
                    </View>
                    <TouchableOpacity style={{ width: 25, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT18, color: Constants.COLOR.RED }}>
                            {'+'}
                        </Text>
                    </TouchableOpacity>
                </View> */}
            </View>
            <View style={{ width: '100%', marginTop: 35, height: 1, backgroundColor: Constants.COLOR.GRAY_SEPERATOR }} />
            <View style={{ width: '100%', marginTop: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {'Subtotal'}
                </Text>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {'$'+price}
                </Text>
            </View>
            <View style={{ width: '100%', marginTop: 10, marginBottom: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {'Discount'}
                </Text>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_REGULAR, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {'$0.99'}
                </Text>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY_SEPERATOR }} />
            <View style={{ width: '100%', marginVertical: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {'Total'}
                </Text>
                <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_BOLD, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.WHITE }}>
                    {'$'+(price-0.99)}
                </Text>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Constants.COLOR.GRAY_SEPERATOR }} />
            <View style={{ marginTop: 25, alignSelf: 'center', width: Constants.LAYOUT.SCREEN_WIDTH - 60, height: 60, backgroundColor: Constants.COLOR.WHITE, borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                <TextInput
                    value={''}
                    placeholder={'Coupon Code'}
                    onChangeText={(text) => { }}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    keyboardType={'default'}
                    returnKeyType={'default'}
                    style={{ flex: 1, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.BLACK }}
                    selectionColor={Constants.COLOR.BLACK}
                    placeholderTextColor={Constants.COLOR.BLACK} />
                <TouchableOpacity style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM, fontSize: Constants.FONT_SIZE.FT22, color: Constants.COLOR.PRIMARY }}>
                        {'Apply'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 24 }}>
                <StyledButton
                    containerStyle={{ marginTop: 20 }}
                    textStyle={{}}
                    title={"CONFIRM PURCHASE"}
                    onPress={onConfirmPress} />
            </View>
        </View>
    )
}

export default CheckOutScreen;