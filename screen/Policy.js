import React, { useState, useContext } from 'react';
import { Text, Button, FlatList, SafeAreaView } from 'react-native'
import { BackField, BigTitleField, PrimaryInput } from '../Components';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications'
import { sendNotification } from '../notification';
import { Context } from '../App';
import VALUES from '../src/consts/value';

const Policy = ({ navigation }) => {



    return (
        <SafeAreaView style={{ flex: 1, }}>
            <BackField text='< Back' navigation={navigation} />
            <BigTitleField text='POLICY' />
            <Text style={{ fontSize: VALUES.textH2, marginHorizontal: 10 }}>Privacy Policy</Text>
            <Text style={{ fontSize: VALUES.textContent, marginHorizontal: 10 }}>
                Nguyen Trung Kien built the Viva Market app as a Commercial app. This SERVICE is provided by Nguyen Trung Kien and is intended for use as is.
                This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.
                If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.
                The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at Viva Market unless otherwise defined in this Privacy Policy.
            </Text>
        </SafeAreaView>
    )
}
export default Policy;
