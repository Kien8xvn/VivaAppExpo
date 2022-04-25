import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TextInput } from 'react-native';
import COLORS from '../src/consts/colors';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField, BigTitleField, TextField, HorizonLine, PrimaryButton, Confirm, CalculateOrderValue } from '../Components';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Context } from '../App';
import { sendNotification } from '../notification';

const ValueLine = ({ text1, text2 }) => {
    return (
        <View style={{
            flexDirection: 'row',
            marginVertical: 2,
            justifyContent: 'flex-end'
        }}>
            <Text style={{ color: 'black', fontSize: VALUES.textH2 }}>{text1}</Text>
            <Text style={{ color: 'red', fontSize: VALUES.textH2 }}>{text2}</Text>

        </View>
    )
}

const OrderDetail = ({ navigation, route }) => { ///main
    const [order, setOrder] = useState(route.params)
    const { currentUser, users } = useContext(Context);
    const [shopIdArr, setShopIdArr] = useState([])
    const [adminNote, setAdminNote] = useState(route.params.adminNote)
    const [status, setStatus] = useState('pendding')


    useEffect(() => { /// listen order

        const unsub = onSnapshot(doc(db, "orders", order.id.toString()), (doc) => {
            let temp = [... new Set(doc.data().orderItems.map(item => item.shopId))]
            setShopIdArr(temp)
            setOrder(doc.data())
            setStatus(doc.data().orderItems.find(item => item.shopId == currentUser.id).orderStatus)
        });
        return () => {
            unsub()
        }
    }, [])





    const OrderShopFlatlist = ({ shopId }) => {  /// Render Flatlist Shop order
        const [itemsOfShop, setItemsOfShop] = useState(order.orderItems.filter(i => i.shopId == shopId))
        const [value, setValue] = useState(order.orderItems.filter(i => i.shopId == shopId)
            .reduce((acc, obj) => acc + obj.pricePromo * obj.count, 0))


        useEffect(() => {
            let temp = order.orderItems.filter(i => i.shopId == shopId)
            setItemsOfShop(temp)
            setValue(temp.reduce((acc, obj) => acc + obj.pricePromo * obj.count, 0))
        }, [])

        const ItemFlatlist = ({ item }) => { /// item flatlist inside orderflatlist

            function RemoveItem(item) {
                try {
                    let tempOrder = { ...order, orderItems: order.orderItems.filter(i => i.id != item.id) }
                    updateDoc(doc(db, 'orders', order.id.toString()), CalculateOrderValue(tempOrder))
                } catch (err) {
                    alert(JSON.stringify(err))
                }
            }
            return (  ///item
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: item.image }}
                        style={{
                            height: 70, width: 70,
                            margin: 5,
                            borderRadius: VALUES.commonRadius
                        }}
                    />

                    <View style={{ justifyContent: 'space-around', flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: VALUES.textContent, color: 'red' }}>{item.pricePromo}k x {item.count}</Text>
                            {currentUser.role != 'admin' ? null :
                                <Icon onPress={() => Confirm('Xoá item?', () => RemoveItem(item))} name='remove-circle-outline' size={20} color={COLORS.primary} />
                            }
                        </View>
                        <Text style={{ fontSize: VALUES.textContent }}>{item.userNote}</Text>
                        <Text style={{ fontSize: VALUES.textContent }}>{item.name}</Text>
                    </View>
                </View>
            )
        }

        return ( ///order
            <View>
                <HorizonLine styleEx={{ borderBottomWidth: VALUES.HorizonLineThick / 2 }} />
                {/* Shop info */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: VALUES.textContent }}>{itemsOfShop[0].shop.shopName} address: {itemsOfShop[0].shop.address} sdt:{itemsOfShop[0].shop.phone} </Text>
                    {currentUser.role != 'admin' ? null :
                        <Icon onPress={() => AddItem(shopId)} name='add-circle-outline' size={20} color={COLORS.primary} />
                    }
                </View>
                <HorizonLine styleEx={{ borderBottomWidth: VALUES.HorizonLineThick }} />
                <FlatList  ///item list of shop
                    data={itemsOfShop}
                    renderItem={({ item }) => <ItemFlatlist item={item} />}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: VALUES.textContent, color: 'blue' }}>{itemsOfShop[0].orderStatus}</Text>
                    <ValueLine text1={'Tổng:'} text2={value + 'k'} />
                </View>
                <HorizonLine styleEx={{ borderBottomWidth: VALUES.HorizonLineThick / 2 }} />
            </View>

        )
    }



    return (  ///Main
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <BackField text='<' navigation={navigation} />
                <BigTitleField text={'ID:' + order.id} styleEx={{ flex: 1, marginright: 10 }} />
                {currentUser.role != 'admin' ? null :

                    <View style={{ flexDirection: 'row' }}>
                        <Icon onPress={() => Confirm('Reset đơn hàng?', () => SetOrderStatus('pendding'))} name='sync' size={30} color={COLORS.primary} />
                        <Icon onPress={() => Confirm('Huỷ đơn hàng?', () => SetOrderStatus('cancel'))} name='delete' size={30} color={COLORS.primary} />
                    </View>
                }

            </View>
            {/* Order list */}

            <View style={{
                marginHorizontal: VALUES.commonMargin,
                marginVertical: VALUES.commonMargin
            }}>
                <FlatList
                    style={{ height: '50%' }}
                    data={shopIdArr.filter(id => id == currentUser.id)}
                    renderItem={({ item }) => <OrderShopFlatlist shopId={item} />}
                />
            </View>
            {/* User info */}
            {status == 'pendding' && currentUser.role != 'admin' ?
                <TextField text='Hiển thị khi nhận đơn' />
                :
                <TextField text={'Tên khách hàng: ' + order.user.name + '\n' +
                    'SDT: ' + order.user.phone + '\n' +
                    'Địa chỉ: ' + order.user.address
                } />
            }

            {/* Empty space */}
            <View style={{ flex: 1 }}></View>
            {/* value info */}
            <View style={{ alignItems: 'flex-end', marginRight: VALUES.commonMargin }}>
                <ValueLine text1={''} text2={order.value.items + 'k'} />
                <ValueLine text1={'Ship:'} text2={order.value.ship + 'k'} />
                <ValueLine text1={'-KM:'} text2={order.value.promo + 'k'} />
                <ValueLine text1={'Tổng:'} text2={order.value.total + 'k'} />
            </View>


            {/* Note from Admin */}
            {currentUser.role != 'admin' ? null :
                < TextInput
                    style={{
                        fontSize: VALUES.textContent, flex: 1,
                        marginLeft: VALUES.commonMargin,
                    }}
                    placeholder='AdminNote'
                    value={adminNote}
                    onChangeText={text => setAdminNote(text)}
                />
            }


            {/* Shipper info show only for admin  - function add shipper */}
            {currentUser.role != 'admin' ? null :
                <View style={{ marginHorizontal: VALUES.commonMargin, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Icon name='delivery-dining' size={80} color={COLORS.primary} />
                    <Text style={{ fontSize: VALUES.textH2 }}>{order.shipper.phone}</Text>
                    <View style={{ flex: 1 }}></View>
                    {order.status != 'pendding' ? <Icon onPress={() => Confirm('sure?', () => SetOrderStatus('pendding'))} name='remove-circle-outline' size={30} color={COLORS.primary} />
                        : <Icon onPress={() => navigation.navigate('UserListForAdd', { order: order, orderType: 'item' })} name='add-circle-outline' size={30} color={COLORS.primary} />
                    }
                </View>
            }



            {/* accept button  */}
            {status == 'pendding' ?
                <PrimaryButton title={'XÁC NHẬN ĐƠN HÀNG'} onPress={() => Confirm('Nhận đơn hàng?', () => SetOrderStatus('accept'))} />
                : status == 'accept' ?
                    <PrimaryButton title={'HOÀN THÀNH ĐƠN HÀNG'} onPress={() => Confirm('Hoàn thành đơn hàng?', () => SetOrderStatus('finish'))} />
                    : null
            }
        </SafeAreaView>
    )

    function SetOrderStatus(status) { /// shop xác nhận đơn hàng
        try {
            updateDoc(doc(db, 'orders', order.id.toString()), {
                orderItems: order.orderItems.map(item => {
                    return item.shopId == currentUser.id ? { ...item, orderStatus: status } : item
                })
            })
            sendNotification('Đơn hàng ' + order.id.toString(), currentUser.shopName + ' đã ' + status, users.find(u => u.role == 'admin').expoToken)
        } catch (err) {
            alert(err)
        }
    }

    function AddItem(shopId) {
        navigation.navigate('ItemListForAdd', { shopId: shopId, order: order })
    }
}


export default OrderDetail

