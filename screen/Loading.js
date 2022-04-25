import React, { useContext, useEffect } from "react";
import { View, Text, Image, SafeAreaView } from "react-native";
import VALUES from '../src/consts/value';
import { Context } from '../App';
import LoadData from "../LoadData";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);
LogBox.ignoreLogs(['Bottom Tab']);
LogBox.ignoreLogs(['Require cycle']);
LogBox.ignoreLogs(['missing keys']);
LogBox.ignoreLogs(['Each child']);

const Loading = ({ navigation }) => {
    const { system, isSignedIn } = useContext(Context)

    useEffect(() => { //// prevent go back to loading page
        if (system && !isSignedIn) setTimeout(() => navigation.navigate('Welcome'), 2000)
        const unsubFocus = navigation.addListener('focus', () => {
            if (system) navigation.navigate('Welcome')
        });
        return () => {
            unsubFocus()
        }
    }, [system])
    return (
        <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'white'
        }}>
            <LoadData />
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: VALUES.textH2 }}>'Loading...'</Text>
                <Text style={{ fontSize: VALUES.textH2 }}>Kiểm tra lại Internet nếu Load quá lâu</Text>

            </View>
            <Image
                source={require('../src/assets/Loading_icon.gif')}
                style={{
                    height: 100,
                    width: 100
                }}
            />
        </SafeAreaView>
    )
}
export default Loading


