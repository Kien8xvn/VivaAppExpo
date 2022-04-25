import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image ,FlatList, TouchableOpacity} from 'react-native';
import VALUES from '../src/consts/value';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackField, FoodItem, SearchField } from '../Components';
import { Context } from '../App';

const SkipLogin = ({ navigation }) => {

    const { items, itemType } = useContext(Context)
    const [searchKey, setSearchKey] = useState('')

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






    return (   //Main
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
            <BackField text={'<Back'} navigation={navigation} />
            <View style={{
                flexDirection: 'row',
                marginHorizontal: VALUES.commonMargin,
            }}>
                <SearchField searchFunction={text => setSearchKey(text.toLowerCase())} styleEx={{ flex: 13 }} />
            </View>



            {/* //FIlter Item Type */}
            <View>
                <FlatList
                    horizontal={true}
                    data={itemType}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <FilterType type={item} onPress={() => setSearchKey(item.name)} />}
                />
            </View>


            <View style={{ flexDirection: 'row' }}>
                <FlatList
                    numColumns={2}
                    data={items.filter(i => JSON.stringify(i).toLowerCase().includes(searchKey))}
                    renderItem={({ item }) => <FoodItem item={item} onPress={() => alert('you have to login to order')} />}
                />
            </View>


        </SafeAreaView>

    )
}
export default SkipLogin;

