import { FlatList, Text, View, StyleSheet, Pressable } from "react-native"
import React from "react";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Record = ({ navigation }) => {
    const user = auth().currentUser;
    const [data, setData] = React.useState({});
    const [pressed, setPressed] = React.useState(false);
    const [readAll, setReadAll] = React.useState(false);
    React.useEffect(() => {
        database().ref('/alarms/' + user.uid).on('value', snapshot => {
            setData(snapshot.val());
        });
        const removeData = async () => {
            await database().ref('/alarms/' + user.uid).set(null);
        }
        navigation.setOptions({
            headerRight: () => (
                <Text style={{ color: '#fff', fontSize: 15, padding: 7, fontWeight: 'bold' }}
                    onPress={() => {
                        setReadAll(true);
                        removeData();
                        console.log('remove all');
                    }}>
                    모두 읽기
                </Text>
            )
        })
    }, []);
    const onRefuse = React.useCallback(() => {

    });


    return (
        <View>
            {data?(
                <FlatList
                    data={Object.keys(data)}
                    renderItem={(item) => (
                        <View style={styles.box}>
                            {data[item.item]['presssed'] === 'friend' ? (
                                // <View style={({pressed})=>[{backgroundColor: pressed? 'lightgray':null}]}>
                                <View style={{ padding: 10 }}>
                                    <Text style={styles.boxText}>
                                        {data[item.item].name}님으로부터 친구 신청이 왔습니다.
                                    </Text>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Pressable style={styles.boxPressable}
                                            onPress={() => { setPressed(true); console.log(pressed); }}>
                                            <Text style={{ color: '#000' }}>수락</Text>
                                        </Pressable>
                                        <Pressable style={styles.boxPressable}
                                            onPress={() => { setPressed(true); }}>
                                            <Text style={{ color: '#000' }}>거절</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ) : (
                                <View style={{ padding: 10 }}>
                                    <Text style={styles.boxText}>{data[item.item].name}님이 {user.displayName}님을 깨웠습니다.</Text>
                                </View>
                            )}
                        </View>
                    )}
                />
            ):(
                <View>
                    <Text>알림이 없습니다.</Text>
                </View>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    box: {
        margin: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderBottomColor: 'gray',
        // padding: 10
    },
    boxText: {
        fontSize: 17,
        color: '#000'
    },
    boxPressable: {
        borderWidth: 0.6,
        width: 45,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 7,
        marginTop: 7,
        borderColor: 'gray'
    }
})
export default Record;