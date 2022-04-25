import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import { BackField, PrimaryButton, PrimaryInput, Confirm } from '../Components';
import { Context } from '../App';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { sendNotification } from '../notification';

const ServiceDetail = ({ navigation, route }) => {
    const [value, setValue] = useState({ service: 0, promo: 0, total: 0 })
    const { currentUser, users } = useContext(Context)
    const { activePromo, setActivePromo } = useContext(Context)
    const service = route.params;

    const OrderServiceAction = () => {
        let order = {}
        order['service'] = service
        order['user'] = currentUser
        order['promo'] = activePromo
        order['status'] = 'pendding'
        order['timeCreate'] = new Date().toLocaleString()
        order['value'] = value
        order['id'] = Date.now()
        order['adminNote'] = ''
        order['shipper'] = { id: 0 }

        setDoc(doc(db, "ordersService", order.id.toString()), order)
            .then(re => {
                alert('Đơn hàng thành công')
                ///send notif to admin, shop, shipper
                users.filter(u => u.role == 'admin' ||
                    (u.role == 'shipper' && u.power.includes(service.name)) ||
                    service.shopId == u.id)
                    .forEach(i => {
                        sendNotification('Thông báo!', 'Có đơn hàng mới!', i.expoToken)
                    })

                navigation.navigate('Home')
                if (activePromo) {
                    try {
                        updateDoc(doc(db, 'users', currentUser.id.toString()), { point: currentUser.point - activePromo.point })
                        updateDoc(doc(db, 'promos', activePromo.id.toString()), { countUse: increment(1) })
                    } catch (err) { alert(err) }
                }
            })
            .catch(err => {
                alert(err)
            });
    }

    //Clear active promo
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setActivePromo(null)
        });
        return () => unsubscribe()
    }, [])

    function CheckPromo(value) {
        if (!activePromo) {
            return false
        } else {
            if (currentUser.point < activePromo.point) {
                alert('bạn thiếu điểm')
                return false
            }
            if (value < activePromo.minOrderValue) {
                alert('chưa đạt giá trị tối thiểu')
                return false
            }
            let check = true
            if (activePromo.serviceId != '') {
                check = check && activePromo.serviceId.includes(service.id)
            }
            return check
        }
    }

    useEffect(() => {
        let tempValue = { service: 0, promo: 0, total: 0 }
        tempValue.service = service.pricePromo
        if (CheckPromo(tempValue.service)) {
            if (activePromo.type == 'value') {
                tempValue.promo = activePromo.value
            }
            if (activePromo.type == '%') {
                tempValue.promo = Math.min(Math.round(tempValue.service * activePromo.value / 100), activePromo.maxValue)
            }
        } else {
            setActivePromo(null)
        }
        tempValue.total = tempValue.service - tempValue.promo
        setValue(tempValue)
    }, [activePromo])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <BackField text='<' navigation={navigation} />
            <View style={{
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: VALUES.textH1,
                    fontWeight: 'bold',
                }}>{service.name}</Text>
            </View>
            <View style={{
                alignItems: 'center'
            }}>
                <Image source={{ uri: service.image }} style={{
                    width: 300, height: 300,
                }} />
            </View>
            <View style={{
                marginLeft: 30,
                alignItems: 'center'
            }}>
                <Text style={{
                    color: 'red',
                    fontSize: 30
                }}>{service.pricePromo}.000d</Text>
            </View>
            <PrimaryInput placeHolder='note' styleEx={{ marginVertical: 5 }} />

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Tiền dịch vụ:</Text>
                <Text style={{
                    fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                }}>{value.service}.000d</Text>

            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Tiền khuyến mãi:</Text>
                <Text style={{
                    fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                }}>{value.promo == 0 ? " " : '-' + value.promo + '.000d'}</Text>

            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 20, }}>Tổng tiền:</Text>
                <Text style={{
                    fontSize: VALUES.textH2, marginHorizontal: 20, color: 'red',
                }}>{value.total}.000d</Text>

            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Promo", 'service')}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{ fontSize: VALUES.textContent, marginHorizontal: 20 }}>{'Nhập Mã Khuyến Mãi >'} </Text>
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}></View>

            <View>
                <PrimaryButton title='ĐẶT DỊCH VỤ' onPress={() => Confirm('Order Service?', () => OrderServiceAction())} />
            </View>


        </SafeAreaView>
    )
}
export default ServiceDetail