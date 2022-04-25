import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FoodItem, SearchField } from '../Components';
import { Context } from '../App';


const FoodList = ({ navigation }) => {
    const [isShowFilterShop, setIsShowFilterShop] = useState(false)
    const [shop, setShop] = useState({ shopId: 0, shopName: 'All', index: 0 }) /// Shop hiện tại
    const [type, setType] = useState('All')
    const { foodCart, items, system, itemType, shops } = useContext(Context)
    const { setLastScreenIs } = useContext(Context)
    const [searchKey, setSearchKey] = useState({ type: 'string', key: '' })


    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('blur', () => {
            setLastScreenIs('food')
            setIsShowFilterShop(false)
        });
        return () => unsubscribeFocus()
    }, [])

    const FilterType = ({ type, onPress }) => {
        return (
            <View>
                <TouchableOpacity onPress={onPress}>
                    <Image source={{ uri: type.image }} style={{
                        width: VALUES.imageFilterSize,
                        height: VALUES.imageFilterSize,
                        resizeMode: 'stretch',
                        marginHorizontal: 6,
                        marginVertical: 2
                    }} />
                </TouchableOpacity>
            </View>
        )
    }
    const FilterShop = ({ shop, onPress }) => {
        return (
            <View style={{
                alignItems: 'center',
                marginVertical: 10,
                borderBottomWidth: 0.5,
                borderColor: 'grey',
                marginHorizontal: 30
            }}>
                <TouchableOpacity onPress={onPress}>
                    <Text style={{ fontSize: VALUES.textH2 }}>{shop.shopName}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    function Search(item) {
        if (searchKey.type == 'string') return item.name.includes(searchKey.key)
        if (searchKey.type == 'type') {
            return searchKey.key == 'All' ? true : item.type.includes(searchKey.key)
        }
        if (searchKey.type == 'shop') {
            return searchKey.key ? item.shopId == searchKey.key : true
        }
    }
    function GetFoodShop() {
        let temp = shops.filter(shop =>
            items.filter(item => system.foodType.includes(item.type))
                .map(i => i.shopId)
                .includes(shop.id))
        temp.unshift({ shopId: 0, shopName: 'All', index: 0 })
        return temp
    }



    return (   //Main
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

            <View style={{
                flexDirection: 'row',
                marginHorizontal: VALUES.commonMargin,
            }}>
                <SearchField searchFunction={text => {
                    setIsShowFilterShop(false)
                    setSearchKey({ type: 'string', key: text })
                }} styleEx={{ flex: 13 }} />
                <View style={{
                    flex: 4,
                    flexDirection: 'row',
                    borderWidth: VALUES.borderWidth,
                    borderColor: 'grey',
                    borderRadius: VALUES.inputRadius,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 5
                }}>
                    <TouchableOpacity onPress={() => {
                        { isShowFilterShop ? setIsShowFilterShop(false) : setIsShowFilterShop(true) }
                    }}>
                        <Text style={{
                            fontSize: VALUES.textContent
                        }}>Shop</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 2,
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Giỏ Hàng' })}>
                        <Icon name='shopping-cart' size={VALUES.iconCartSize} color={'gray'} />
                        <View style={{
                            position: 'absolute',
                            right: 0,
                            fontSize: 15,
                            borderRadius: 10,
                            backgroundColor: 'red'
                        }}>
                            {/* calculate cart count */}
                            <Text style={{ padding: 2, color: 'white' }}>{foodCart.reduce((acc, obj) => acc + obj.count, 0)}</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>


            {isShowFilterShop ?
                // Filter shop
                <View>
                    <FlatList
                        data={GetFoodShop()}
                        renderItem={({ item }) => <FilterShop shop={item} onPress={() => {
                            setType('All')
                            setShop(item)
                            setIsShowFilterShop(false)
                            setSearchKey({ type: 'shop', key: item.id })
                        }} />}
                    />
                </View> : null
            }


            {!isShowFilterShop ?
                //FIlter Item Type
                <View>
                    <FlatList
                        horizontal={true}
                        data={itemType.filter(type => system.foodType.includes(type.name))}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <FilterType type={item} onPress={() => {
                            setShop({ shopId: 0, shopName: 'All', index: 0 })
                            setType(item.name)
                            setSearchKey({ type: 'type', key: item.name })
                        }} />}
                    />
                </View>
                : null}

            {shop.shopName == 'All' || isShowFilterShop ? null :
                <Text style={{ fontSize: VALUES.textH2, alignSelf: 'center' }}>{shop.shopName}</Text>
            }
            {type == 'All' || isShowFilterShop ? null :
                <Text style={{ fontSize: VALUES.textH2, alignSelf: 'center' }}>{type}</Text>
            }

            {isShowFilterShop ? null :
                <View style={{ flexDirection: 'row' }}>
                    <FlatList
                        numColumns={2}
                        data={items.filter(item => system.foodType.includes(item.type) && Search(item))}
                        renderItem={({ item }) => <FoodItem item={item} onPress={() => navigation.navigate('ItemDetail', item)} />}
                    />
                </View>
            }

        </SafeAreaView>

    )
}
export default FoodList;

