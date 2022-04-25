import React, { useContext } from 'react';
import { SafeAreaView, Text } from 'react-native';
import VALUES from '../src/consts/value';
import { BackField, BigTitleField, PrimaryButton } from '../Components';
import { Context } from '../App';



const PromoInfo = ({ navigation, route }) => {
    const promo = route.params
    const { items, users,shops, services } = useContext(Context)
    const { setActivePromo } = useContext(Context)


    return (
        <SafeAreaView style={{ flex: 1, marginHorizontal: VALUES.commonMargin,backgroundColor:'white' }}>
            <BackField text='<' navigation={navigation} />
            <BigTitleField text='THÔNG TIN KHUYẾN MÃI' styleEx={{ marginVertical: 10 }} />

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

            <PrimaryButton title={'SỬ DỤNG'} onPress={() => {
                setActivePromo(promo)
                navigation.pop(2)
            }} />
        </SafeAreaView>
    )
}
export default PromoInfo