import React, { useState, useContext } from 'react';
import { SafeAreaView, Text } from 'react-native';
import VALUES from '../src/consts/value';
import { BackField, BigTitleField, PrimaryInput, Confirm, PrimaryButton } from '../Components';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Context } from '../App';
import { doc, setDoc, updateDoc, increment } from "firebase/firestore";


const Register = ({ navigation }) => {
    const { setIsSignedIn, system, expoToken } = useContext(Context);
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [address, setAddress] = useState('')

    function CheckValidInfo() {
        return name.length > 0 && phone.length > 9 && password == rePassword && password.length > 5 && address.length > 0
    }

    const RegisterUser = () => {
        let email = phone + '@gmail.com'
        !CheckValidInfo() ? alert('Thông tin không chính xác!') : createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                let newId = system.userCount + 1
                setDoc(doc(db, "users", newId.toString()), {
                    uid: userCredential.user.uid,
                    id: newId,
                    index: 0,
                    name: name,
                    address: address,
                    phone: phone,
                    password: password,
                    role: "users",
                    shopName: '',
                    status: 'enable',
                    point: 0,
                    expoToken: expoToken
                }).then(() => {
                    updateDoc(doc(db, "system", "system"), {
                        userCount: increment(1)
                    }).then().catch(err => console.log(err))
                }).catch(err => console.log(err))
                setIsSignedIn(true)
                navigation.navigate('Home')
            })
            .catch((err) => {
                alert(err)
                console.log(err)
            })

    }
    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
            <BackField text='<' navigation={navigation} />
            <BigTitleField text='ĐĂNG KÍ TÀI KHOẢN' styleEx={{ marginVertical: 10 }} />
            <PrimaryInput placeHolder='HỌ VÀ TÊN' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setName(text)} />
            <PrimaryInput placeHolder='PHONE' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setPhone(text)} />
            <PrimaryInput placeHolder='MẬT KHẨU (ít nhất 6 kí tự)' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setPassword(text)} />
            <PrimaryInput placeHolder='NHẬP LẠI MẬT KHẨU' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setRePassword(text)} />
            <PrimaryInput placeHolder='MÃ CĂN HỘ ( ĐỊA CHỈ )' isPassword={false} styleEx={{ marginVertical: 5 }} onChangeText={text => setAddress(text)} />
            <PrimaryButton title={"ĐĂNG KÍ"} onPress={() => Confirm('Register?', () => RegisterUser())} />
        </SafeAreaView>
    )
}
export default Register
