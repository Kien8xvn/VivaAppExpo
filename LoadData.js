import React, { useContext, useEffect } from "react";
import { View, Text } from 'react-native'
import { Context } from './App';
import { db } from './firebase';
import { doc, collection, query, onSnapshot } from "firebase/firestore";



function Arrange(arr) {
    let arr1 = [...arr]
    let hour = new Date().getHours()
    arr1.map((i) => {
        i.status = i.status == 'enable' && hour >= i.timeStart && hour < i.timeEnd ? 'enable' : 'disable'
    })
    arr1.sort(function (a, b) {
        if (a.status == 'enable' && b.status == 'disable') { return -1 }
        if (a.status == 'disable' && b.status == 'enable') { return 1 }
        return a.index - b.index
    })

    return arr1
}


export default LoadData = () => {
    const { setUsers, setServices, setItems, setPromos,
        setSystem, setItemType, setShops, setOrders, setOrdersService } = useContext(Context)
    useEffect(() => {
        const queryItems = query(collection(db, "items"));
        const queryPromos = query(collection(db, "promos"));
        const queryItemType = query(collection(db, "itemType"));
        const queryOrders = query(collection(db, "orders"));
        const queryOrdersService = query(collection(db, "ordersService"));
        const queryServices = query(collection(db, "services"));
        const queryUsers = query(collection(db, "users"));

        const unsubscribeSystem = onSnapshot(doc(db, "system", "system"), (doc) => {
            setSystem(doc.data())
        });

        const unsubscribeUsers = onSnapshot(queryUsers, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            temp.sort((a, b) => a.index - b.index)
            setUsers(temp);
            setShops(temp.filter(u => u.role == 'chủ shop'))
        });

        const unsubscribeServices = onSnapshot(queryServices, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            temp.sort(function (a, b) {
                if (a.status == 'enable' && b.status == 'disable') { return -1 }
                if (a.status == 'disable' && b.status == 'enable') { return 1 }
                return a.index - b.index
            })
            setServices(temp);
        });

        const unsubscribeOrders = onSnapshot(queryOrders, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            temp.sort((a, b) => a.id - b.id)
            setOrders(temp);
        });
        const unsubscribeOrdersService = onSnapshot(queryOrdersService, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            temp.sort((a, b) => a.id - b.id)
            setOrdersService(temp);
        });

        const unsubscribePromos = onSnapshot(queryPromos, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            temp.sort((a, b) => b.id - a.id)
            setPromos(temp);
        });
        //lấy danh sách items
        const unsubscribeItems = onSnapshot(queryItems, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            // setItemsBk(temp);//Backup
            setItems(Arrange(temp)); //  
        });
        // lấy danh sách ItemType
        const unsubscribeItemType = onSnapshot(queryItemType, (querySnapshot) => {
            let temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            temp.sort((a, b) => a.index - b.index)
            setItemType(temp);
        });

        return () => {
            unsubscribeSystem()
            unsubscribeItems()
            unsubscribeItemType()
            unsubscribeUsers()
            unsubscribePromos()
            unsubscribeOrders()
            unsubscribeOrdersService()
            unsubscribeServices()
        }
    }, [])

    return null
}


