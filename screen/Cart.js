import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import { BackField, PrimaryButton, PromoPricePlate, Confirm, HorizonLine } from '../Components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../App';
import { db } from '../firebase';
import { setDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { sendNotification } from '../notification';


const Cart = ({ navigation }) => {
    const [value, setValue] = useState({ ship: 0, promo: 0, items: 0, total: 0 })
    const { system, currentUser, lastScreenIs, users } = useContext(Context)
    const { activePromo, setActivePromo } = useContext(Context)
    const { foodCart, setFoodCart } = useContext(Context)
    const { goodCart, setGoodCart } = useContext(Context)
    const { ship, setShip } = useContext(Context)



    const OrderAction = () => { /// hit button order
        let order = {}
        order['orderItems'] = lastScreenIs == 'food' ? foodCart : goodCart
        order['user'] = currentUser
        order['promo'] = activePromo
        order['type'] = lastScreenIs
        order['shipper'] = { id: 0 }
        order['status'] = 'pendding'
        order['value'] = value
        order['shipType'] = ship
        order['timeCreate'] = new Date().toLocaleString()
        order['id'] = Date.now()
        order['adminNote'] = ''

        if (order.orderItems.length > 0) { /// if no item in cart
            setDoc(doc(db, "orders", order.id.toString()), order)
                .then(() => {
                    alert('Đơn hàng thành công')
                    ///send notif to admin, shop, shipper
                    users.filter(u => u.role == 'admin' ||
                        (u.role == 'shipper' && u.power.includes(lastScreenIs)) ||
                        JSON.stringify(order.orderItems).includes(u.phone))
                        .forEach(i => {
                            sendNotification('Thông báo!', 'Có đơn hàng mới!', i.expoToken)
                        })

                        
                    lastScreenIs == 'food' ? setFoodCart([]) : setGoodCart([])
                    if (activePromo) {
                        try {
                            updateDoc(doc(db, 'users', currentUser.id.toString()), { point: currentUser.point - activePromo.point })
                            updateDoc(doc(db, 'promos', activePromo.id.toString()), { countUse: increment(1) })
                        } catch (err) { alert(err) }
                    }
                    navigation.navigate('Home', { screen: 'Ăn Uống' })
                })
                .catch((err) => {
                    alert('Đơn hàng lỗi' + err)
                });

        }
    }

    function GetShipValue() {
        let cart = lastScreenIs == 'food' ? foodCart : goodCart
        let shopIdArr = [...new Set(cart.map(i => i.shopId))]
        if (lastScreenIs == 'food') {
            return (ship == 'normal' ? system.ship.food.normal : system.ship.food.atDoor) + system.ship.food.step * (shopIdArr.length - 1)
        } else {
            return (ship == 'normal' ? system.ship.good.normal : system.ship.good.atDoor) + system.ship.good.step * (shopIdArr.length - 1)
        }
    }

    function CheckPromo(valueItems) {
        if (!activePromo) {
            return false
        } else {
            if (currentUser.point < activePromo.point) {
                alert('bạn thiếu điểm')
                return false
            }
            if (valueItems < activePromo.minOrderValue) {
                alert('chưa đạt giá trị tối thiểu')
                return false
            }

            let cart = lastScreenIs == 'food' ? [...foodCart] : [...goodCart]
            let check = true
            if (activePromo.itemId != '') {
                cart.forEach(i => activePromo.itemId.includes(i.id) ? null : check = false)
                check ? null : alert('Khuyến mãi không áp dụng cho các sản phẩm này')
            }
            if (activePromo.shopId != '') {
                cart.forEach(i => activePromo.shopId.includes(i.shopId) ? null : check = false)
                check ? null : alert('Khuyến mãi không áp dụng cho các shop này')
            }
            console.log('check' + check)
            return check
        }
    }

    useEffect(() => {//// tính toán các giá trị trong giỏ hàng
        console.log('activePromo ' + activePromo)
        let tempValue = { ship: 0, promo: 0, items: 0, total: 0 }
        let cart = lastScreenIs == 'food' ? [...foodCart] : [...goodCart]

        if (cart.length > 0) {
            //tính toán tiền trong giỏ hàng
            tempValue.ship = GetShipValue()
            cart.map(i => {
                tempValue.items = tempValue.items + i.count * i.pricePromo
            })
            if (CheckPromo(tempValue.items)) {
                if (activePromo.type == 'ship') {
                    tempValue.promo = Math.min(tempValue.ship, activePromo.maxValue)
                }
                if (activePromo.type == '%') {
                    tempValue.promo = Math.min(Math.round(tempValue.items * activePromo.value / 100), activePromo.maxValue)
                }
                if (activePromo.type == 'value') {
                    tempValue.promo = activePromo.value
                }
            } else {
                setActivePromo(null)
            }
            tempValue.total = tempValue.ship + tempValue.items - tempValue.promo
        }
        setValue(tempValue)
    }, [lastScreenIs, foodCart, goodCart, ship, activePromo])


    useEffect(() => { /// clear promo when out of cart
        const unsubscribe = navigation.addListener('blur', () => {
            setActivePromo(null)
        });
        return () => unsubscribe()
    }, [])

    function RemoveItem(item) { //// hit delete button
        lastScreenIs == 'food' ? setFoodCart(pre => pre.filter(i => i.id != item.id))
            : setGoodCart(pre => pre.filter(i => i.id != item.id))
        setActivePromo(null)
    }
    function ChoseShipType() {
        Alert.alert(
            'Hey There!',
            'Chọn hình thức giao hàng',
            [
                {
                    text: 'Giao thường', onPress: () => {
                        setShip('normal')
                    }

                },
                {
                    text: 'Giao tận cửa', onPress: () => {
                        setShip('atDoor')
                    }
                },
            ],
            {
                cancelable: true
            }
        );
    }
    return (  ///Main
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <BackField text='<' navigation={navigation} />
            {/* Chọn hình thức giao hàng */}
            <TouchableOpacity onPress={() => { ChoseShipType() }}>
                <View style={{ backgroundColor: VALUES.liteBlue, paddingVertical: 5 }}>
                    <View>
                        <Text style={{
                            fontSize: VALUES.textContent,
                            marginHorizontal: 20,
                        }}>Hình thức giao hàng(nhấn để chọn)</Text>
                    </View>
                    <View style={{
                        borderBottomWidth: 0.5,
                        borderColor: 'grey',
                        marginLeft: 20,
                        marginRight: 40,
                        marginVertical: 5,
                    }}></View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: VALUES.textContent, marginHorizontal: 20, }}>{ship == 'normal' ? 'Giao thường' : 'Giao tận cửa'}</Text>
                        <Text style={{ fontSize: VALUES.textContent, marginHorizontal: 20, }}>{value.ship}.000d</Text>
                    </View>

                </View>
            </TouchableOpacity>
            <HorizonLine styleEx={{ borderBottomWidth: VALUES.HorizonLineThick }} />
            <TouchableOpacity onPress={() => navigation.navigate("Promo", lastScreenIs == 'food' ? 'food' : 'good')}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{ fontSize: VALUES.textContent, marginHorizontal: 20, }}>Mã Khuyến Mãi</Text>
                    <Text style={{ fontSize: VALUES.textContent, marginHorizontal: 20, }}>{'Nhập Mã >'} </Text>
                </View>
            </TouchableOpacity>

            <HorizonLine styleEx={{ borderBottomWidth: VALUES.HorizonLineThick }} />

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Thành tiền:</Text>
                {value.items == 0 ? null :
                    <Text style={{
                        fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                    }}>{value.items}.000d</Text>}

            </View>


            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Phí ship:</Text>

                {value.ship == 0 ? null :
                    <Text style={{
                        fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                    }}>{value.ship}.000d</Text>}

            </View>



            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Khuyến mãi:</Text>
                {value.promo == 0 ? null :
                    <Text style={{
                        fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                    }}>-{value.promo}.000d</Text>}

            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Tổng tiền:</Text>
                {value.total == 0 ? null :
                    <Text style={{
                        fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                    }}>{value.total}.000d</Text>}

            </View>

            <View style={{ flexDirection: 'row', height: 400 }}>
                <FlatList
                    numColumns={1}
                    data={lastScreenIs == 'food' ? foodCart.sort((a, b) => a.shopId - b.shopId) :
                        goodCart.sort((a, b) => a.shopId - b.shopId)}
                    renderItem={({ item }) => <CartItem item={item} onPress={() => navigation.navigate('ItemDetail', item)} onPressDelete={() => Confirm('Delete item?', () => RemoveItem(item))} />}
                />
            </View>

            {/* Empty space */}
            <View style={{ flex: 1 }}></View>
            <View style={{ marginBottom: 30 }}>
                <PrimaryButton title='ĐẶT HÀNG' onPress={() => Confirm('Update Order?', () => OrderAction())} />
            </View>

        </SafeAreaView>
    )
}
export default Cart


const CartItem = ({ item, onPress, onPressDelete }) => { //// cart Flatlist

    return (

        <View style={{
            flexDirection: 'row',
            borderColor: 'grey',
            borderWidth: VALUES.borderWidth,
            borderRadius: VALUES.commonRadius,
            marginVertical: 5,
            marginHorizontal: 10
        }}>


            <View style={{
                margin: 10,
            }}>
                <TouchableOpacity onPress={onPress}>
                    <Image style={{
                        width: VALUES.cartImageSize,
                        height: VALUES.cartImageSize,
                        borderRadius: VALUES.commonRadius
                    }}
                        source={{ uri: item.image }}
                    />
                </TouchableOpacity>

            </View>
            <View style={{
                flex: 1,
                justifyContent: 'space-between',
                marginRight: 10,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                }}>
                    <Text style={{ fontSize: VALUES.textContent }}>{item.name} {item.id} {item.shopId}</Text>
                    <Icon onPress={onPressDelete} name='delete' size={VALUES.iconSize} color={'gray'} />
                </View>
                <Text style={{ fontSize: VALUES.textContent }} >{item.shop.shopName}</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 15,
                }}>
                    <Text style={{ fontSize: VALUES.textContent }}>x {item.count}</Text>
                    <PromoPricePlate promo={item.pricePromo} normal={item.priceNormal} />
                </View>

            </View>
        </View>
    )
}

