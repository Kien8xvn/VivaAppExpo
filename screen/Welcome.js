import React, { useContext } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { Context } from '../App';
import Swiper from 'react-native-swiper';
import { PrimaryButton } from '../Components';

const Welcome = ({ navigation }) => {
    const { system } = useContext(Context)

    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>

            <Swiper
                style={{
                    alignItems: 'center'
                }}
                pagingEnabled>
                {system.welcomeImage.map(i => {
                    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={{ uri: i }}
                            resizeMode='contain'
                            style={{
                                height: '85%',
                                width: '85%',
                                borderColor: 'grey',
                                borderRadius: 20,
                                borderWidth: 0.5 
                            }}
                        />
                    </View>
                })}
            </Swiper>
            <PrimaryButton title={'ĐĂNG NHẬP'} onPress={() => navigation.navigate('Login')} />
        </SafeAreaView>
    )
}
export default Welcome;

