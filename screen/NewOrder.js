import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, Text,FlatList, TouchableOpacity } from 'react-native';
import COLORS from '../src/consts/colors';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField, SearchField } from '../Components';
import { Context } from '../App';

const NewOrder = ({ navigation }) => { 
    const { orders } = useContext(Context)
    const [select, setSelect] = useState('')
    const { currentUser } = useContext(Context);
    const [searchKey, setSearchKey] = useState('')

    useEffect(() => {
        //console.log(orders.filter(order => order.orderItems.map(i => i.shopId).includes(currentUser.id)))
    }, [])

    function GetOrderStatusPerShop(order, shopId) { /// Kiểm tra các item thuộc Shop trạng thái OrderStatus là gì, xuất ra
        return order.orderItems.find(i => i.shopId == shopId).orderStatus
    }


    function FilterOrder() {

        return orders.filter(order => order.orderItems.map(item => item.shopId).includes(currentUser.id)
            && GetOrderStatusPerShop(order, currentUser.id).includes(select)
        )
        // if (select == 'Tất cả') { /// tất cả order có shop là current user
        //     return orders.filter(order => order.orderItems.map(i => i.shopId).includes(currentUser.id))
        // }
        // if (select == 'Đơn mới') {
        //     return orders.filter(order => order.orderItems.map(i => i.shopId).includes(currentUser.id)
        //         && GetOrderStatusPerShop(order, currentUser.id) == 'pendding')
        // }
        // if (select == 'Đơn đã nhận') {
        //     return orders.filter(order => order.orderItems.map(i => i.shopId).includes(currentUser.id)
        //         && GetOrderStatusPerShop(order, currentUser.id) == 'accept')
        // }
    }



    const NewOrderItem = ({ order, onPress }) => {
        const [orderItems, setOrderItems] = useState(order.orderItems.filter(item => item.shopId == currentUser.id))
        function ShowStatus() {
            switch (GetOrderStatusPerShop(order, currentUser.id)) {
                case 'pendding':
                    return 'Mới';
                    break;
                case 'accept':
                    return 'Nhận';
                    break;
                case 'finish':
                    return 'Hoàn Thành';
                    break;
                case 'cancel':
                    return 'Đã Huỷ';
                    break;
            }
        }
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: VALUES.commonMargin,
                    marginVertical: 5,
                    borderWidth: VALUES.borderWidth,
                    borderColor: 'grey',
                    borderRadius: VALUES.commonRadius,
                }}>
                    <View style={{ margin: 10 }}>
                        <Icon name={order.type == 'food' ? 'fastfood' : 'shopping-cart'} size={80} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5, justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 5 }}>
                            <Text style={{ color: 'red', fontSize: VALUES.textH2 }}>{orderItems.reduce((acc, obj) => acc + obj.pricePromo, 0)}k</Text>
                            <Text style={{ color: 'blue', fontSize: VALUES.textContent }}>{ShowStatus()}</Text>
                        </View>

                        <Text style={{ fontSize: VALUES.textH2 }}>{
                            orderItems.map((item, index) => index == (orderItems.length - 1) ? item.name : item.name + "+")
                        }</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }



    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
            <BackField text='< Back' navigation={navigation} />
            <SearchField searchFunction={text => setSearchKey(text)} styleEx={{
                marginHorizontal: VALUES.commonMargin,
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: VALUES.borderWidth,
                borderColor: 'grey',
                borderRadius: VALUES.inputRadius,
            }} />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10
            }}>
                <TouchableOpacity onPress={() => { setSelect('') }}>
                    <Text style={{
                        fontSize: VALUES.textContent,
                        color: select == '' ? 'red' : 'black'
                    }}>Tất cả</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelect('pendding') }}>
                    <Text style={{
                        fontSize: VALUES.textContent,
                        color: select == 'pendding' ? 'red' : 'black'
                    }}>Đơn mới</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelect('accept') }}>
                    <Text style={{
                        fontSize: VALUES.textContent,
                        color: select == 'accept' ? 'red' : 'black'
                    }}>Đơn đã nhận</Text>
                </TouchableOpacity>

            </View>
            <FlatList
                data={FilterOrder()}
                renderItem={({ item }) => <NewOrderItem order={item} onPress={() => navigation.navigate('OrderDetail', item)} />}
            />
        </SafeAreaView>
    )
}
export default NewOrder;

