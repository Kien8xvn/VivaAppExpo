import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView,FlatList } from 'react-native';
import { ServiceItem } from '../Components';
import { db } from '../firebase';
import { collection, query, onSnapshot } from "firebase/firestore";
import { Context } from '../App';

const Service = ({ navigation }) => {
    const { services } = useContext(Context)
    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
            <FlatList
                numColumns={2}
                data={services}
                renderItem={({ item }) => <ServiceItem service={item} onPress={() => navigation.navigate('ServiceDetail', item)} />}
            />
        </SafeAreaView>
    )
}
export default Service