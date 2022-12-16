import React from "react";
import { View, StyleSheet, Dimensions, Pressable, Text, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const width = Dimensions.get('window').width;
const SignUp = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [pw, setPw] = React.useState('');
    const [name, setName] = React.useState('');
    const [animating, setAnimating] = React.useState(false);

    return (
        <View style={styles.container}>
            <View style={{ flex: 2, justifyContent: 'center' }}>
                <Entypo name="creative-cloud" size={width / 100 * 30} color={'#fff'} />
            </View>
            <View style={{ width: '80%', flex: 3 }}>
                <Text style={styles.text}>이메일</Text>
                <TextInput style={styles.textInput} onChangeText={text => setEmail(text)} placeholder={'이메일'} />
                <Text style={styles.text}>비밀번호</Text>
                <TextInput style={styles.textInput} onChangeText={text => setPw(text)} secureTextEntry={true} placeholder={'비밀번호'} />
                <Text style={styles.text}>사용자 닉네임</Text>
                <TextInput style={styles.textInput} onChangeText={text => setName(text)} placeholder={'별명'} />
            </View>
            <View style={{ width: '80%', flex: 1.5 }}>
                <Pressable
                    style={styles.textInputBtn}
                    onPress={() => {
                        setAnimating(!animating);
                        if (!(email && pw)) {
                            setAnimating(!animating);
                            Alert.alert("info", "이메일 또는 비밀번호를 확인해주세요.", [{ text: 'OK' }]);
                        }
                        else {
                            auth().createUserWithEmailAndPassword(email, pw)
                                .then((userCredential) => {
                                    userCredential.user.sendEmailVerification().catch((error) => console.log("email send error: ", error));
                                    userCredential.user.updateProfile({ displayName: name }).catch((error) => console.log("auth update error", error));
                                    database().ref('/users/' + auth().currentUser.uid)
                                        .set({ email: email, profile: 'default.png', name: name })
                                        .then(() => {
                                            setAnimating(!animating);
                                            Alert.alert("info", "Check your Email", [{ text: "OK", onPress: () => navigation.goBack() }]);
                                        });
                                })
                                .catch(error => {
                                    if (error.code === 'auth/email-already-in-use') {
                                        console.log('That email address is already in use!');
                                    }
                                    if (error.code === 'auth/invalid-email') {
                                        console.log('That email address is invalid!');
                                    }
                                    console.error("user create error: ", error);
                                });
                        }
                    }}
                >
                    <Text style={styles.btnText}>회원가입하기</Text>
                </Pressable>
                <Pressable
                    style={styles.textInputBtn}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.btnText}>뒤로 가기</Text>
                </Pressable>
            </View>
            <View style={styles.activityIndicator}>
                <ActivityIndicator animating={animating} size="large" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#00aeff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
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
        marginVertical: 7
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
    text: {
        fontWeight: 'bold',
        color: '#fff',
        ontSize: 18
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
export default SignUp;