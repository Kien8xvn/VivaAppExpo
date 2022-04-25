import React, { useEffect, useState, useContext } from "react"
import { StyleSheet, View, Button, Text } from "react-native"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Context } from "./App"




export function sendNotification(title, body, token) {
    try {
        fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip,deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: token,
                title,
                body,
            }),
        })
    } catch (err) {
        alert('send notif fail')
    }

}


export default NotificationProcess = ({ onLoad = () => { } }) => {
    const { expoToken, setExpoToken } = useContext(Context)
    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])


    useEffect(() => {
        const receivedSubscription = Notifications.addNotificationReceivedListener(
            notification => {
                console.log("Notification Received!")
               // console.log(notification)
            }
        )

        const responseSubscription =
            Notifications.addNotificationResponseReceivedListener(response => {
                console.log("Notification Clicked!")
               // console.log(response)
            })
        return () => {
            receivedSubscription.remove()
            responseSubscription.remove()
        }
    }, [])




    const registerForPushNotificationsAsync = async () => {
        ////// Show notifications when the app is in the foreground
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });


        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                throw new Error("Permission not granted")
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoToken(token)
            return token
            this.setState({ expoPushToken: token });
        } else {
            throw new Error("Must use physical device for Push Notifications")

        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };
    return null
}



