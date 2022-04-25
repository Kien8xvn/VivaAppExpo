import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import COLORS from '../src/consts/colors';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField, SearchField, statusMap } from '../Components';
import { Context } from '../App';

const OrderHistory = ({ navigation }) => {
    const { orders, ordersService } = useContext(Context)
    const [data, setData] = useState([])
    const { currentUser } = useContext(Context);
    useEffect(() => {

    }, [])






    const OrderHistoryFlatlist = ({ order }) => {
        return (
            <View style={{
                flexDirection: 'row',
                marginHorizontal: VALUES.commonMargin,
                marginVertical: 5,
                borderWidth: VALUES.borderWidth,
                borderColor: 'grey',
                borderRadius: VALUES.commonRadius,
            }}>
                <View style={{ margin: 10 }}>
                </View>
                <View style={{ flex: 1, marginLeft: 5, justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 5 }}>

                        {order.value.items ?
                            <Text style={{ color: 'red', fontSize: VALUES.textH2 }}>{order.value.items}k + {order.value.ship}k ship</Text>
                            : <Text style={{ color: 'red', fontSize: VALUES.textH2 }}>{order.value.service}k</Text>
                        }
                        <Text style={{ color: 'blue', fontSize: VALUES.textContent }}>{statusMap.find(i => i.key == order.status).value}</Text>
                    </View>
                    <Text style={{ fontSize: VALUES.textContent }}>{order.timeCreate}</Text>

                    {order.orderItems ? <Text style={{ fontSize: VALUES.textH2 }}>{
                        order.orderItems.map((item, index) => index == (order.orderItems.length - 1) ? item.name : item.name + "+")
                    }</Text>
                        : <Text style={{ fontSize: VALUES.textH2 }}>{order.service.name}</Text>
                    }
                </View>
            </View>
        )

    }



    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
            <BackField text='< Back' navigation={navigation} />

            <FlatList
                data={[...orders, ...ordersService].sort((a, b) => a.id - b.id)}
                renderItem={({ item }) => <OrderHistoryFlatlist order={item} />}
            />
        </SafeAreaView>
    )
}
export default OrderHistory;

