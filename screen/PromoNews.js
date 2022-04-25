import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField, BigTitleField } from '../Components';
import { Context } from '../App';
import COLORS from '../src/consts/colors';

function CheckDate(start, expire) {
    let todayValue, startValue, expireValue
    let today = new Date()
    startValue = start.substr(6, 4) * 365 + start.substr(3, 2) * 30 + start.substr(0, 2) * 1
    expireValue = expire.substr(6, 4) * 365 + expire.substr(3, 2) * 30 + expire.substr(0, 2) * 1
    todayValue = today.getFullYear() * 365 + (today.getMonth() + 1) * 30 + today.getDate() * 1
    return todayValue >= startValue && todayValue < expireValue ? true : false
}

const PromoNews = ({ navigation }) => {
    const { promos } = useContext(Context)
    const { currentUser } = useContext(Context)

    return (
        <SafeAreaView style={{
            flex: 1,
            marginHorizontal: VALUES.commonMargin, backgroundColor: 'white'
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <BackField text='<' navigation={navigation} />
                <Text style={{ fontSize: 25, flex: 1, textAlign: 'center' }}>TỔNG HỢP KHUYẾN MÃI</Text>
            </View>
            <FlatList
                data={promos.filter(i => CheckDate(i.start, i.expire) && i.status == 'enable' && i.countUse < i.maxUse
                    && (i.userId == '' || i.userId.includes(currentUser.id)))}
                renderItem={({ item }) => <PromoItem promo={item} />}
            />
        </SafeAreaView>
    )
}
export default PromoNews


const PromoItem = ({ promo }) => {
    const { items, users, shops, services } = useContext(Context)
    return (
        <View style={{ borderBottomWidth: 3, borderColor: 'grey' }}>

            <Text style={{ fontSize: VALUES.textContent }}>-HSD: từ {promo.start} đến {promo.expire}</Text>

            {promo.type == '%' ?
                <Text style={{ fontSize: VALUES.textContent }}>-Giảm {promo.value}%</Text>
                : null
            }
            {promo.type == 'ship' ?
                <Text style={{ fontSize: VALUES.textContent }}>-Giảm {promo.value}k ship</Text>
                : null
            }
            {promo.type == 'value' ?
                <Text style={{ fontSize: VALUES.textContent }}>-Giảm {promo.value}k</Text>
                : null
            }
            <Text style={{ fontSize: VALUES.textContent }}>-Giảm tối đa {promo.maxValue}k</Text>


            <Text style={{ fontSize: VALUES.textContent }}>-Còn {promo.maxUse - promo.countUse} lượt sử dụng</Text>

            {promo.shopId == '' ? null :
                <Text style={{ fontSize: VALUES.textContent }}>Shop áp dụng:</Text>
            }


            {promo.shopId.split(',').map(i => {
                let shop
                shops.map(j => {
                    j.id.toString() == i ?
                        shop = j
                        : null
                })
                if (shop) {
                    return <Text style={{ fontSize: VALUES.textContent }}>◆{shop.shopName}</Text>
                }

            })}

            {promo.shopId == '' ? null :
                <Text style={{ fontSize: VALUES.textContent }}>Sản phẩm áp dụng:</Text>
            }

            {promo.itemId == '' ? null :
                promo.itemId.split(',').map(i => {
                    let item = null
                    items.map(j => {
                        j.id.toString() == i ?
                            item = j
                            : null
                    })

                    users.map(shop => {
                        shop.id == item.shopId ? item['shopName'] = shop.shopName : null
                    })
                    return <Text style={{ fontSize: VALUES.textContent }}>◆{item.name} của shop {item.shopName}</Text>
                })
            }
            {promo.serviceId == '' ? null :
                <Text style={{ fontSize: VALUES.textContent }}>Dịch vụ áp dụng:</Text>
            }
            {promo.serviceId == '' ? null :
                promo.serviceId.split(',').map(id => {
                    let service = services.find(s => s.id == id)
                    return <Text style={{ fontSize: VALUES.textContent }}>◆{service.name}</Text>
                })
            }
        </View>
    )
}