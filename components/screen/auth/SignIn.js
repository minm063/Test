import React, { useEffect, useState } from "react";
import { View, Dimensions, Text, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { webClientId } from '../../constants/config.json';

import SignUp from "./SignUp";

const width = Dimensions.get('window').width;
const googleSigninConfigure = () => {
    GoogleSignin.configure({
        webClientId:
            webClientId,
    })
}
const SignIn = ({ navigation }) => {

    const [login, setLogin] = useState(false);
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const onGoogleButtonPress = async () => {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }
    useEffect(() => { googleSigninConfigure(); }, []);

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Entypo name="creative-cloud" size={width / 100 * 50} color={'#fff'} />
                <Text style={{ fontSize: 30, color: '#fff' }}>운동 캘린더</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                {login ? (
                    <View style={{ width: '70%' }}>
                        <View style={{ width: '100%', marginBottom: 13 }}>
                            <TextInput style={styles.textInput} placeholder={"email"} onChangeText={text => setId(text)} />
                            <TextInput style={styles.textInput} placeholder={"password"} onChangeText={text => setPw(text)} secureTextEntry={true} />
                        </View>
                        <Pressable
                            style={styles.textInputBtn}
                            onPress={() => {
                                // sign in
                                auth().signInWithEmailAndPassword(id, pw)
                                    .then(() => {
                                        // auth
                                        if (auth().currentUser.emailVerified) {
                                            auth().signOut().then(() => Alert.alert("info", "email not verified", [{ text: 'OK' }]));
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error.code);
                                        if (error.code === 'auth/email-already-in-use') {
                                            Alert.alert("info", 'That email address is already in use!', [{ text: 'OK' }]);
                                        }
                                        if (error.code === 'auth/invalid-email') {
                                            Alert.alert("info", 'That email address is invalid!', [{ text: 'OK' }]);
                                        }
                                        if (error.code === 'auth/user-not-found') {
                                            Alert.alert("info", "User not Found", [{ text: 'OK' }]);
                                        }
                                    });
                            }}>
                            <Text style={styles.btnText}>로그인</Text>
                        </Pressable>
                        <Pressable
                            style={styles.textInputBtn}
                            onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.btnText}>회원가입하기</Text>
                        </Pressable>
                        <Pressable
                            style={styles.textInputBtn}
                            onPress={() => setLogin(!login)}>
                            <Text style={styles.btnText}>돌아가기</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={{ width: '70%', alignItems: 'center', justifyContent: 'center' }}>
                        <Pressable
                            style={styles.btnPressable}
                            onPress={() => setLogin(!login)}>
                            <Entypo name="email" style={styles.btnIcon} />
                            <Text style={styles.btnText}>Email & Password로 로그인</Text>
                        </Pressable>
                        <Pressable
                            style={styles.btnPressable}
                            onPress={() => onGoogleButtonPress()}>
                            <AntDesign name="google" color='#000' style={styles.btnIcon} />
                            <Text style={styles.btnText}>Google로 로그인</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00aeff'
    },
    btnPressable: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        margin: 18,
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderWidth: 1
    },
    btnText: {
        justifyContent: 'center',
        color: '#000',
        fontSize: 15,
        marginHorizontal: 10
    },
    btnIcon: {
        justifyContent: 'flex-start',
        color: '#00aeff',
        fontSize: 21,
        marginHorizontal: 10
    },
    textInput: {
        borderWidth: 1,
        backgroundColor: '#fff',
        height: 50,
        margin: 7,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '100%'
    },
    textInputBtn: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        margin: 4
    }
})

export default SignIn;
