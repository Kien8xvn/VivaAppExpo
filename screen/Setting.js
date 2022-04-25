import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, Image, Switch, FlatList, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import { BigTitleField } from '../Components';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Context } from '../App';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';



const Setting = ({ navigation }) => {
    const { currentUser, items, newOrderCount } = useContext(Context);


    const SignOut = () => {
        signOut(auth).then(re => {
            updateDoc(doc(db, 'users', currentUser.id.toString()), {
                expoToken: 'none'
            }).then().catch()
        }).catch(err => console.log(err))
    }

    const SettingItem = ({ item }) => {
        const [switchValue, setswitchValue] = useState(item.status == 'enable' ? true : false)
        const toggleSwitch = (value) => {
            setswitchValue(value)
            updateDoc(doc(db, "items", item.id.toString()), {
                status: value == true ? 'enable' : 'disable'
            }).then().catch(err => console.log(err))
        }


        return (
            <View style={{
                flexDirection: 'row',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderBottomWidth: 2,
                borderColor: 'grey'
            }}>
                <Image source={{ uri: item.image }} style={{
                    width: 80, height: 80,
                    borderRadius: VALUES.commonRadius
                }} />

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{
                        flex: 3,
                        justifyContent: 'space-around',
                        paddingLeft: 10
                    }}>
                        <Text style={{ fontSize: VALUES.textContent }}>{item.name}</Text>
                        <Text style={{ fontSize: VALUES.textContent, color: switchValue ? "red" : "grey" }}>{item.priceNormal}-{'>'}{item.pricePromo}.000d</Text>

                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'space-around'
                    }}>
                        <Switch
                            trackColor={{ false: "grey", true: "red" }}
                            onValueChange={toggleSwitch}
                            value={switchValue}
                        />

                    </View>
                </View>

            </View>
        )
    }
    const SettingField = ({ content, onPress = () => { } }) => {
        return (
            <View>
                <TouchableOpacity onPress={onPress} style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 0.5,
                    borderBottomWidth: 3,
                    borderColor: 'grey'
                }}>
                    <Text style={{ fontSize: VALUES.textContent }}>{content}</Text>
                    <Text style={{ fontSize: VALUES.textContent }}>{'>'}</Text>
                </TouchableOpacity>

            </View>
        )

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <BigTitleField text='CÀI ĐẶT' styleEx={{ marginVertical: 10 }} />
            {currentUser.role != 'chủ shop' ? null :
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('NewOrder')} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderTopWidth: 0.5,
                        borderBottomWidth: 3,
                        borderColor: 'grey',
                        alignItems: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: VALUES.textH1 }}>Đơn hàng mới : </Text>
                            <Text style={{ fontSize: VALUES.textH1, color: 'red' }}>{newOrderCount}</Text>
                        </View>
                        <Text style={{ fontSize: VALUES.textH1 }}>{'>'}</Text>
                    </TouchableOpacity>

                </View>}
            <SettingField content='Thông tin cá nhân' onPress={() => navigation.navigate('UserInfo')} />
            <SettingField content='Đơn đã đặt' onPress={() => navigation.navigate('OrderHistory')} />

            <SettingField content='Chương trình Khuyến Mãi' onPress={() => navigation.navigate('PromoNews')} />
            <SettingField content='Đăng xuất' onPress={() => SignOut()} />
            {currentUser.role != 'chủ shop' ? null :
                <FlatList
                    data={items.filter(item => item.shopId == currentUser.id)}
                    renderItem={({ item }) => <SettingItem item={item} />}
                />}
        </SafeAreaView>
    )
}
export default Setting