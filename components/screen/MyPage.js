import React from "react"
import { Pressable, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const user = auth().currentUser;
const MyPage = () => {

    const [profileImg, setProfileImg] = React.useState('');

    const downloadFile = async (fileName) => {
        const url = await storage().ref('profile/' + fileName).getDownloadURL();
        return url;
    }
    React.useEffect(() => {
        database().ref('/users/' + user.uid).on('value', snapshot => {
            downloadFile(snapshot.val()['profile']).then((url) => setProfileImg(url));
        });
    }, []);

    return (
        <View>
            <Text onPress={() => auth().signOut()}>로그아웃</Text>
        </View>
    )
}
export default MyPage;