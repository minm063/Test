import { FlatList, Text, View, StyleSheet } from "react-native"
import React from "react";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Record = ({ navigation }) => {
    const user = auth().currentUser;
    const [data, setData] = React.useState({});
    const [userData, setUserData] = React.useState();
    React.useEffect(() => {
        database().ref('/alarms/' + user.uid).on('value', snapshot => {
            setData(snapshot.val());
        });
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: '#fff', fontSize: 18 }}>모두 읽기</Text>
            )
        })
    }, []);


    return (
        <View>
            <FlatList
                data={Object.keys(data)}
                renderItem={(item) => (
                    <View style={styles.box}>
                        {data[item.item]['presssed'] === 'friend' ? (
                            <Text style={styles.boxText}
                                onLongPress={() => {

                                }}>
                                {data[item.item].name}님으로부터 친구 신청이 왔습니다.
                            </Text>
                        ) : (
                            <Text style={styles.boxText}>{data[item.item].name}님이 {user.displayName}님을 깨웠습니다.</Text>
                        )}
                    </View>
                )}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    box: {
        margin: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderBottomColor: 'gray',
        padding: 10
    },
    boxText: {
        fontSize: 17,
        color: '#000'
    }
})
export default Record;