import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, Button, TouchableOpacity } from 'react-native';
import VALUES from '../src/consts/value';
import { PrimaryButton, NetInfomation, PrimaryInput } from '../Components';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { Context } from '../App';
import { auth, db } from '../firebase';
import { updateDoc, doc } from "firebase/firestore";
import NotificationProcess from '../notification';

const Login = ({ navigation }) => {
    const { expoToken, users } = useContext(Context);
    const { currentUser, setCurrentUser, system } = useContext(Context);
    const [phone, setPhone] = useState('0931837176')
    const [password, setPassword] = useState('Kien1234')
    const { isSignedIn, setIsSignedIn } = useContext(Context);




    useEffect(() => { ///Update token when signin , have token , have current user
        if (expoToken != 'none' && isSignedIn && currentUser.name != 'test') {
            updateDoc(doc(db, 'users', currentUser.id.toString()), {
                expoToken: expoToken
            }).then(re => console.log('log token : ' + expoToken)).catch(err => alert(err))
        }
    }, [expoToken, isSignedIn, currentUser])

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                let tempUser = users.find(u => u.uid == user.uid)
                setIsSignedIn(true)
                setCurrentUser(tempUser)
                navigation.navigate('Home')
            } else {
                setCurrentUser({ name: 'test' })
                navigation.navigate('Login')
                setIsSignedIn(false)
            }
        })
    }, [])

    const SignIn = () => {
        let email = phone + '@gmail.com'
        signInWithEmailAndPassword(auth, email, password).then(re => {
        }).catch(err => alert('sai thông tin đăng nhập'))
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Image
                style={{
                    width: '100%', height: 400,
                    resizeMode: 'contain'
                }}
                source={require('../src/assets/onboardImage.png')}
            />

            <PrimaryInput value={phone} iconName='phone' placeHolder='Phone' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setPhone(text)} />
            <PrimaryInput value={password} iconName='lock' placeHolder='Mật Khẩu' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setPassword(text)} />

            <View style={{
                marginRight: VALUES.commonMargin,
            }}>
                <TouchableOpacity onPress={() => alert('Gọi đến sdt ' + system.adminPhone + ' để reset mật khẩu')}>
                    <Text style={{
                        fontSize: VALUES.textContent,
                        textDecorationLine: 'underline',
                        textAlign: 'right'
                    }}>Quên mật khẩu?</Text>
                </TouchableOpacity>
            </View>
            <PrimaryButton styleEx={{ marginVertical: 15 }} title='ĐĂNG NHẬP' onPress={SignIn} />
            <View>
                <Text style={{
                    fontSize: VALUES.textContent,
                    textAlign: 'center'
                }}>---Hoặc---</Text>
            </View>
            <View>
                <TouchableOpacity onPress={isSignedIn == true ? () => alert('Đã đăng nhập') : () => navigation.navigate('Register')}>
                    <Text style={{
                        fontSize: VALUES.textContent,
                        textDecorationLine: 'underline',
                        textAlign: 'center',
                    }}>Đăng Kí</Text>
                </TouchableOpacity>
                <Button title='Skip Login' onPress={() => navigation.navigate('SkipLogin')} />
                <TouchableOpacity onPress={() => navigation.navigate('Policy')}>
                    <Text style={{
                        fontSize: VALUES.textContent,
                        textDecorationLine: 'underline',
                        textAlign: 'center',
                    }}>Policy</Text>
                </TouchableOpacity>
            </View>
            <NetInfomation />
            <NotificationProcess />
            <Text>{expoToken}+ {JSON.stringify(isSignedIn)}</Text>
            <Text>{JSON.stringify(currentUser)}</Text>
        </SafeAreaView>
    )
}
export default Login;

