import React from "react";
import { View, StyleSheet, Dimensions, Pressable, Text, Alert } from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import { CommonActions } from "@react-navigation/native";
import SignIn from "./SignIn";

const width = Dimensions.get('window').width;
const SignUp = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [pw, setPw] = React.useState('');
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Entypo name="creative-cloud" size={width / 100 * 50} color={'#fff'} />
            </View>
            <View style={{ width: '80%', flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>이메일</Text>
                <TextInput style={styles.textInput} onChangeText={text => setEmail(text)} placeholder={'이메일'} />
                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>비밀번호</Text>
                <TextInput style={styles.textInput} onChangeText={text => setPw(text)} secureTextEntry={true} placeholder={'비밀번호'} />
                <View style={{marginTop: 8}}>
                    <Pressable
                        style={styles.textInputBtn}
                        onPress={() => {
                            if (!(email&&pw)) {
                                Alert.alert("info", "이메일 또는 비밀번호를 확인해주세요.", [{text: 'OK'}]);
                            }
                            else {
                                auth().createUserWithEmailAndPassword(email, pw)
                                    .then(() => {
                                        auth().signOut().then(() => {
                                            Alert.alert("info", "Check your Email", [{ text: "OK" }]);
                                        });
                                    })
                                    .catch(error => {
                                        if (error.code === 'auth/email-already-in-use') {
                                            console.log('That email address is already in use!');
                                        }
                                        if (error.code === 'auth/invalid-email') {
                                            console.log('That email address is invalid!');
                                        }
                                        console.error(error);
                                    });
                            }
                        }}
                    >
                        <Text style={styles.btnText}>회원가입하기</Text>
                    </Pressable>
                    <Pressable
                        style={styles.textInputBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.btnText}>뒤로 가기</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#00aeff',
        flex: 1,
        alignItems: 'center',
    },
    textInput: {
        borderWidth: 1,
        backgroundColor: '#fff',
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '100%',
        marginVertical: 13
    },
    textInputBtn: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
    },
    btnPressable: {
        width: '100%',
        height: 30,
        borderRadius: 10,
        marginVertical: 7,
        backgroundColor: '#fff',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        justifyContent: 'center',
        color: '#000',
        fontSize: 15,
        marginHorizontal: 10
    },
    textInputBtn: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 4
    }
})
export default SignUp;