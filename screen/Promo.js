import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField } from '../Components';
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

const Promo = ({ navigation, route }) => {
    const { promos } = useContext(Context)
    const { currentUser } = useContext(Context)
    const kind = route.params

    return (
        <SafeAreaView style={{
            flex: 1,
            marginHorizontal: VALUES.commonMargin,backgroundColor:'white'
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <BackField text='<' navigation={navigation} />
                <Text style={{ fontSize: VALUES.textContent }}>Bạn có {currentUser.point} điểm</Text>
            </View>
            <FlatList
                data={promos.filter(i => CheckDate(i.start, i.expire) && i.status == 'enable' && i.kind == kind && i.countUse < i.maxUse
                    && (i.userId == '' || i.userId.includes(currentUser.id)))}
                renderItem={({ item }) => <PromoItem item={item} onPress={() => navigation.navigate('PromoInfo', item)} />}
            />
        </SafeAreaView>
    )
}
export default Promo


const PromoItem = ({ item, onPress }) => {
    const { currentUser } = useContext(Context)
    const [type, setType] = useState(initType())

    function initType() {
        let temp = ''
        if (item.type == '%') { temp = 'Giảm ' + item.value + '%' }
        if (item.type == 'ship') { temp = 'Free Ship' }
        if (item.type == 'value') { temp = 'Giảm ' + item.value + 'k' }
        return temp
    }
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 5 }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        backgroundColor: 'yellow',
                        borderWidth:0.5,borderColor:'grey',
                        height: VALUES.promoImageSize,
                        width: VALUES.promoImageSize
                    }}>
                        <Text style={{ fontSize: VALUES.textH1,textAlign:'center' }}>{type}</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        borderColor: 'grey',
                        borderTopWidth: 0.5, borderBottomWidth: 0.5,
                        justifyContent: 'space-around',
                        paddingLeft: 10
                    }}>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: VALUES.textContent }}>Đơn tối thiểu {item.minOrderValue}k </Text>
                            {
                                item.userId.includes(currentUser.id) ? <Text style={{ fontSize: VALUES.textContent, color: COLORS.primary, fontWeight: 'bold' }}>Only YOU!</Text> : null
                            }
                        </View>



                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: VALUES.textTab,
                                color: 'red',
                                borderColor: 'red',
                                borderWidth: 0.5
                            }}>Tối đa {item.maxValue}k  {item.id}</Text>
                            <Icon name='check-circle' size={20} color='red' />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'grey', fontSize: VALUES.textTab }}>HSD:{item.expire}</Text>
                            <Text style={{ color: 'blue', fontSize: VALUES.contentSize }}>{item.point} điểm</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}