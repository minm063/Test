import React from "react"
import {Pressable, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';

const MyPage = () => {
    return (
        <View>
            <Pressable onPress={() => auth().signOut()}>
                <Text>로그아웃</Text>
            </Pressable>
        </View>
    )
}
export default MyPage;