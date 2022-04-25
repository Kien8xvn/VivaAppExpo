import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native';
import { PrimaryButton, BackField, BigTitleField, PrimaryInput, Confirm } from '../Components';
import { Context } from '../App';
import { db, auth } from '../firebase';
import { doc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

const UserInfo = ({ navigation }) => {
    const { currentUser } = useContext(Context)
    const [name, setName] = useState(currentUser.name)
    const [address, setAddress] = useState(currentUser.address)
    const [password, setPassword] = useState('')

    const UpdateUserInfo = () => {
        if (name.length > 1 && address.length > 1) {
            updateDoc(doc(db, "users", currentUser.id.toString()), {
                address: address,
                name: name
            }).then().catch(err => console.log(err))

            if (password != '' && password.length >= 6) {
                updatePassword(auth.currentUser, password)
                    .then(() => {
                        alert('pass' + password)
                        updateDoc(doc(db, "users", currentUser.id.toString()), {
                            password: password
                        });
                    }).catch((error) => {
                        alert(error)
                    });

            }
            navigation.navigate('Login')
        } else {
            alert('empty')
        }
    }
    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
            <BackField text='<' navigation={navigation} />
            <BigTitleField text={'THÔNG TIN CÁ NHÂN (' + currentUser.id + ')'} styleEx={{ marginVertical: 10 }} />
            <PrimaryInput onChangeText={text => setName(text)} iconName='person' value={name} isPassword={false} styleEx={{ marginVertical: 5 }} />
            <PrimaryInput iconName='person' value={currentUser.shopName} isPassword={false} styleEx={{ marginVertical: 5 }} />
            <PrimaryInput editable={false} iconName='phone' value={currentUser.phone.toString()} isPassword={false} styleEx={{ marginVertical: 5 }} />
            <PrimaryInput editable={false} iconName='favorite' value={currentUser.point.toString() + ' điểm'} isPassword={false} styleEx={{ marginVertical: 5 }} />
            <PrimaryInput onChangeText={text => setAddress(text)} iconName='place' value={address} isPassword={false} styleEx={{ marginVertical: 5 }} />
            <PrimaryInput onChangeText={text => setPassword(text)} iconName='lock' placeHolder='Đổi mật khẩu' isPassword={false} styleEx={{ marginVertical: 5 }} />
            <PrimaryButton styleEx={{ marginVertical: 15 }} title='Save' onPress={() => Confirm('Update UserInfo?', () => UpdateUserInfo())} />
        </SafeAreaView>
    )
}
export default UserInfo;

