import React, { useEffect, useState } from "react";
import { View, Dimensions, Text, Pressable, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { webClientId } from '../../constants/config.json';

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
    const [animating, setAnimating] = useState(false);

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
            <View style={{ flex: 1.3, alignItems: 'center', justifyContent: 'center', }}>
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
                                setAnimating(!animating);
                                auth().signInWithEmailAndPassword(id, pw)
                                    .then(() => {
                                        // auth
                                        if (!auth().currentUser.emailVerified) {
                                            Alert.alert("info", "email not verified", [{ text: 'OK', onPress: ()=> setAnimating(!animating) }]);
                                        }
                                        // else {
                                        //     database().ref('users/'+auth().currentUser.uid).update({
                                        //         emailVerified: true,
                                        //         latestAccess: Date.now(),
                                        //     });
                                        // }
                                    })
                                    .catch(error => {
                                        if (error.code === 'auth/email-already-in-use') {
                                            Alert.alert("info", 'That email address is already in use!', [{ text: 'OK', onPress: ()=> setAnimating(!animating)}]);
                                        }
                                        else if (error.code === 'auth/invalid-email') {
                                            Alert.alert("info", 'That email address is invalid!', [{ text: 'OK', onPress: ()=> setAnimating(!animating) }]);
                                        }
                                        else if (error.code === 'auth/user-not-found') {
                                            Alert.alert("info", "User not Found", [{ text: 'OK', onPress: ()=> setAnimating(!animating) }]);
                                        }
                                        else {
                                            Alert.alert("info", "Unknown Error : Try Again", [{ text: 'OK', onPress: ()=> setAnimating(!animating) }]);
                                        }
                                    });
                            }}>
                            <Text style={styles.btnText}>로그인</Text>
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
                            onPress={() => {
                                onGoogleButtonPress().then(() => {
                                    database().ref('/users/' + auth().currentUser.uid)
                                        .set({ email: id, profile: 'default.png', name: auth().currentUser.displayName })
                                });
                            }}>
                            <AntDesign name="google" color='#000' style={styles.btnIcon} />
                            <Text style={styles.btnText}>Google로 로그인</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.btnPressable, { justifyContent: 'center' }]}
                            onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.btnText}>회원가입하기</Text>
                        </Pressable>
                    </View>
                )}
            </View>
            <View style={styles.activityIndicator}>
                <ActivityIndicator animating={animating} size="large" />
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
    },
    activityIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SignIn;
