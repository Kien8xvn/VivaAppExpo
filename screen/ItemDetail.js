import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField, PrimaryInput, PrimaryButton } from '../Components';
import { Context } from '../App';


const ItemDetail = ({ navigation, route }) => {
    const { foodCart, setFoodCart } = useContext(Context)
    const { goodCart, setGoodCart } = useContext(Context)
    const { lastScreenIs, users, currentUser, system } = useContext(Context)
    const [count, setCount] = useState(1)
    const [note, setNote] = useState('note from ...')
    const [shop, setShop] = useState()
    const item = route.params;


    useEffect(() => {
        let temp = lastScreenIs == 'food' ? [...foodCart] : [...goodCart]
        try {
            setNote(temp.find(i => i.id == item.id).userNote)
            setCount(temp.find(i => i.id == item.id).count)
        } catch { }

        setShop(users.find(s => s.id == item.shopId))
    }, [])
    const UpdateCart = () => {
        if (item.shopId == currentUser.id) {
            alert('Bạn không thể đặt hàng của mình')
        } else {
            let temp = lastScreenIs == 'food' ? [...foodCart] : [...goodCart]
            let arr = temp.filter(i => i.id != item.id)
            count > 0 ? arr.push({ ...item, shop: shop, count: count, userNote: note, orderStatus: 'pendding' }) : null
            lastScreenIs == 'food' ? setFoodCart(arr) : setGoodCart(arr)
            navigation.goBack()
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <BackField text='<' navigation={navigation} />
            <View style={{
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: VALUES.textH1,
                    fontWeight: 'bold',
                }}>{item.name}</Text>
                <Text style={{ fontSize: VALUES.textContent }}>({system.badge.find(i => i.name == item.badge).note})</Text>
            </View>
            <View style={{
                alignItems: 'center'
            }}>
                <Image source={{ uri: item.image }} style={{
                    width: 300, height: 300, borderRadius: VALUES.commonRadius
                }} />
            </View>
            <View style={{
                marginLeft: 30,
                alignItems: 'center'
            }}>
                <Text style={{
                    color: 'red',
                    fontSize: 30
                }}>{item.pricePromo}.000d</Text>

                {!shop ? null : <Text style={{ fontSize: VALUES.textContent }}>Shop: {shop.shopName}</Text>}

            </View>
            <PrimaryInput value={note} placeHolder='note' styleEx={{ marginVertical: 5 }} onChangeText={text => setNote(text)} />
            <View style={{
                marginHorizontal: 120,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

                <Icon onPress={() => { setCount(count => Math.max(count - 1, 0)) }}
                    name='remove-circle-outline' size={35} color={'red'} />
                <Text style={{
                    fontSize: 30
                }}>{count}</Text>
                <Icon onPress={() => { setCount(count => count + 1) }} name='add-circle-outline' size={35} color={'red'} />

            </View>

            <View>
                <PrimaryButton title='THÊM VÀO GIỎ HÀNG' onPress={UpdateCart} />
            </View>
        </SafeAreaView>
    )
}
export default ItemDetail