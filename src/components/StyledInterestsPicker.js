import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text, Modal } from 'react-native';
import Constants from '../common/Constants';
import TagSelect from '../components/react-native-tag-select/TagSelect';
import AddInterestModal from './AddInterestModal';

const StyledInterestsPicker = ({ insets, value, title, containerStyle, onValueChanged }) => {
    const [items, setItems] = useState(value)
    const [visibleAddInterestModal, setVisibleAddInterestModal] = useState(false)
    const onAddPress = () => setVisibleAddInterestModal(true)
    useEffect(() => {
        setItems(value)
        return () => { }
    }, [value]);
    return (
        <View style={[styles.container, containerStyle]}>
            {
                visibleAddInterestModal &&
                <AddInterestModal
                    insets={insets}
                    title={title}
                    onClosePress={() => {
                        setTimeout(() => {
                            setVisibleAddInterestModal(false)
                        }, 100);
                    }}
                    onAdd={(value) => {
                        const updated = [...items, value]
                        onValueChanged(updated)

                        setTimeout(() => {
                            setVisibleAddInterestModal(false)
                            setItems(updated)
                        }, 100);
                    }} />
            }
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <TouchableOpacity onPress={onAddPress}>
                    <Image style={{ width: 21, height: 21, resizeMode: 'contain' }} source={require('../../assets/images/ic_add_interest.png')} />
                </TouchableOpacity>
            </View>
            <TagSelect
                value={[]}
                labelAttr={'label'}
                data={items}
                max={0}
                removeable={true}
                onItemRemovePress={(i) => {
                    const updated = items.filter((item, index) => index !== i)
                    onValueChanged(updated)

                    setItems(updated)
                }}
                containerStyle={{ alignSelf: 'flex-start', marginTop: 16 }}
                itemStyle={styles.tab_item}
                itemStyleSelected={styles.tab_item}
                itemLabelStyle={styles.tag_item_label}
                itemLabelStyleSelected={styles.tag_item_label} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Constants.LAYOUT.SCREEN_WIDTH - 60
    },
    title: {
        fontFamily: Constants.FONT_FAMILY.PRIMARY_DEMI, fontSize: Constants.FONT_SIZE.FT24, color: Constants.COLOR.WHITE
    },
    tab_item: {
        height: 50, borderRadius: 7, justifyContent: 'center', paddingVertical: 0, paddingHorizontal: 10, backgroundColor: Constants.COLOR.WHITE, borderWidth: 0
    },
    tag_item_label: {
        color: Constants.COLOR.BLACK, fontSize: Constants.FONT_SIZE.FT20, fontFamily: Constants.FONT_FAMILY.PRIMARY_MEDIUM
    }
})

export default StyledInterestsPicker;