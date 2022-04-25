import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import COLORS from './src/consts/colors';
import VALUES from './src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import NetInfo from "@react-native-community/netinfo"
import { Context } from './App';



export const NetInfomation = () => {
    const [isOnline, setIsOnline] = useState(false)
    useEffect(() => {
        const unsubNet = NetInfo.addEventListener(state => {
            setIsOnline(state.isInternetReachable ? true : false)
        })
        return () => {
            unsubNet()
        }
    }, [])
    return (
        <View style={{
            position: 'absolute',
            top: 20,
            right: 20,
            borderRadius: 20,
            height: 40,
            width: 40,
            backgroundColor: isOnline ? 'blue' : 'red'
        }}></View>
    )
}

export const TextPlate = ({ title, styleEx, note, input, onChangeText }) => {

    return (
        <View style={[styleEx, { flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={{ fontSize: VALUES.textContent }}>{title}: </Text>
            <TextInput
                style={{
                    fontSize: VALUES.textContent, flex: 1,
                    borderWidth: 0.5,
                    borderColor: 'grey',
                    borderRadius: VALUES.commonRadius,
                    paddingLeft: 10,
                    paddingVertical: 5,
                }}
                value={input}
                onChangeText={onChangeText}
                autoCapitalize='none'
            />
            {note == null ? null :
                <TouchableOpacity onPress={() => alert(note)} >
                    <Icon name='help-outline' size={30} />
                </TouchableOpacity>
            }
        </View>
    )
}


export const SettingField = ({ content, onPress = () => { } }) => {
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

export function CalculateOrderValue(order) {
    let tempOrder = { ...order }
    tempOrder.value.items = order.orderItems.reduce((acc, obj) => acc + obj.pricePromo * obj.count, 0)
    tempOrder.value.total = tempOrder.value.items + tempOrder.value.ship - tempOrder.value.promo
    return tempOrder
}


export const NewOrderFlatlist = ({ order, onPress }) => {

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
                        <Text style={{ color: 'red', fontSize: VALUES.textH2 }}>{order.value.items}k + {order.value.ship}k ship</Text>
                        <Text style={{ color: 'blue', fontSize: VALUES.textContent }}>{statusMap.find(i => i.key == order.status).value}</Text>
                    </View>
                    {/* Shipper info */}
                    <Text style={{ fontSize: VALUES.textContent }}>{order.shipper.phone}</Text>
                    <Text style={{ fontSize: VALUES.textH2 }}>{
                        order.orderItems.map((item, index) => index == (order.orderItems.length - 1) ? item.name : item.name + "+")
                    }</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export const TextField = ({ text, styleEx }) => {
    return (
        <View style={[{
            height: VALUES.inputHeight,
            marginHorizontal: VALUES.commonMargin,
            borderWidth: VALUES.borderWidth,
            borderColor: 'grey',
            borderRadius: VALUES.inputRadius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }, styleEx]}>
            <Text style={{
                fontSize: VALUES.textContent, flex: 1,
                marginLeft: VALUES.iconMargin,
            }}>{text}</Text>
        </View>
    )
}

export const HorizonLine = ({ styleEx }) => {
    return (
        <View style={[styleEx, {
            borderColor: 'grey',
        }]}></View>
    )
}

export const ServiceItem = ({ service, onPress }) => {
    return (
        <View style={{
            flex: 0.5,
            borderColor: 'grey',
            borderRadius: VALUES.commonRadius,
            borderWidth: 0.5,
            marginHorizontal: 10,
            marginVertical: 10
        }}>
            {service.status == 'enable' ?
                <TouchableOpacity
                    style={{
                        alignItems: 'center'
                    }}
                    onPress={onPress}
                >
                    <Image source={{ uri: service.image }} style={{
                        width: VALUES.itemImageSize,
                        height: VALUES.itemImageSize,
                        resizeMode: 'contain',
                        marginTop: 10,
                        borderRadius: VALUES.commonRadius

                    }} />
                    <Text style={{ fontSize: VALUES.textH2, fontWeight: 'bold', }}>{service.name}</Text>
                    <PromoPricePlate normal={service.priceNormal} promo={service.pricePromo} />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={{
                        alignItems: 'center'
                    }}
                    onPress={() => alert('item disable')}
                >
                    <Grayscale>
                        <Image source={{ uri: service.image }} style={{
                            width: VALUES.itemImageSize,
                            height: VALUES.itemImageSize,
                            resizeMode: 'contain',
                            marginTop: 10,
                        }} />
                    </Grayscale>

                    <Text style={{ fontSize: VALUES.textH2, fontWeight: 'bold', color: 'grey' }}>{service.name}</Text>
                    <Text style={{ fontSize: VALUES.textContent, color: 'grey' }}>{service.priceNormal}.000d</Text>
                </TouchableOpacity>
            }


        </View>

    )
}



export const SearchField = ({ searchFunction, styleEx }) => {
    return (
        <View style={[styleEx, {
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: VALUES.borderWidth,
            borderColor: 'grey',
            borderRadius: VALUES.inputRadius,
        }]} >
            <Icon name='search' size={VALUES.iconSize} color={'gray'} style={{ marginHorizontal: VALUES.iconMargin }} />
            <TextInput
                autoCapitalize='none'
                style={{
                    fontSize: VALUES.textContent, flex: 1
                }}
                placeholder={"Tìm kiếm"}
                onChangeText={searchFunction} f
            />

        </View>
    )
}

export const PromoPricePlate = ({ promo, normal }) => {
    return (
        <View>
            {normal == promo ? <Text style={{ fontSize: VALUES.textContent, color: 'red' }}>{normal}.000d</Text> :
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: VALUES.textContent, color: 'red', textDecorationLine: 'line-through' }}>{normal}</Text>
                    <Text style={{ fontSize: VALUES.textContent, color: 'red' }}> {'->'}{promo}.000d</Text>
                </View>
            }
        </View>
    )
}

export const FoodItem = ({ item, onPress }) => {
    const { system } = useContext(Context)
    return (
        <View style={{
            flex: 0.5,
            borderColor: 'grey',
            borderRadius: VALUES.commonRadius,
            borderWidth: 0.5,
            marginHorizontal: 10,
            marginVertical: 10
        }}>

            <Image source={{
                uri: system.badge.find(i => i.name == item.badge).url
            }}
                style={{
                    position: 'absolute',
                    width: 50, height: 50, zIndex: 1
                }} />
            {item.status == 'enable' ?

                <TouchableOpacity
                    style={{
                        alignItems: 'center'
                    }}
                    onPress={onPress}
                >


                    <Image source={{ uri: item.image }} style={{
                        width: VALUES.itemImageSize,
                        height: VALUES.itemImageSize,
                        resizeMode: 'contain',
                        marginTop: 10,
                        borderRadius: VALUES.commonRadius

                    }} />
                    <Text style={{ fontSize: VALUES.textH2, fontWeight: 'bold',textAlign:'center' }}>{item.name}+ {item.id}</Text>
                    <PromoPricePlate normal={item.priceNormal} promo={item.pricePromo} />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={{
                        alignItems: 'center'
                    }}
                    onPress={() => alert('item disable')}
                >
                    <Grayscale>
                        <Image source={{ uri: item.image }} style={{
                            width: VALUES.itemImageSize,
                            height: VALUES.itemImageSize,
                            resizeMode: 'contain',
                            marginTop: 10,
                        }} />
                    </Grayscale>

                    <Text style={{ fontSize: VALUES.textH2, fontWeight: 'bold', color: 'grey' }}>{item.name}</Text>
                    <Text style={{ fontSize: VALUES.textContent, color: 'grey' }}>{item.priceNormal}.000d</Text>
                </TouchableOpacity>
            }


        </View>

    )
}

export const BigTitleField = ({ text, styleEx }) => {
    return (
        <View style={styleEx}>
            <Text style={{
                fontSize: VALUES.textH2,
                alignSelf: 'center',
            }}>{text}</Text>

        </View>

    )
}

export const BackField = ({ navigation, text }) => {
    return (
        <View>
            <TouchableOpacity onPress={navigation.goBack}>
                <Text style={{
                    fontSize: VALUES.textH2,
                    marginLeft: VALUES.commonMargin,
                }}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}
export function Confirm(title, funct) {
    Alert.alert(
        'Thông báo!',
        title,
        [
            { text: 'No', onPress: () => { }, style: 'cancel' },
            {
                text: 'Yes', onPress: funct
            },
        ],
        {
            cancelable: true
        }
    );
}
export const PrimaryButton = ({ styleEx, title, onPress = () => { } }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={[{
                backgroundColor: COLORS.primary,
                height: VALUES.buttonHeight,
                borderRadius: VALUES.commonRadius,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
            }, styleEx]}>
                <Text style={{
                    color: COLORS.white,
                    fontWeight: 'bold',
                    fontSize: VALUES.textH2
                }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const PrimaryInput = ({ editable, value, iconName, placeHolder, isPassword, styleEx, onChangeText = () => { } }) => {
    return (
        <View style={[{
            height: VALUES.inputHeight,
            marginHorizontal: VALUES.commonMargin,
            borderWidth: VALUES.borderWidth,
            borderColor: 'grey',
            borderRadius: VALUES.inputRadius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }, styleEx]}>
            {iconName == null ? null : <Icon name={iconName} size={VALUES.iconSize} color={'grey'} style={{ marginLeft: VALUES.iconMargin }} />}
            <TextInput
                secureTextEntry={isPassword ? true : false}
                style={{
                    fontSize: VALUES.textContent, flex: 1,
                    marginLeft: VALUES.iconMargin,
                }}
                placeholder={placeHolder}
                onChangeText={onChangeText}
                value={value}
                editable={editable}
                autoCapitalize='none'
            />
        </View>
    )
}

export const statusMap = [{ key: 'pendding', value: 'Mới' },
{ key: 'accept', value: 'Nhận' },
{ key: 'finish', value: 'Hoàn thành' },
{ key: 'cancel', value: 'Đã huỷ' }]