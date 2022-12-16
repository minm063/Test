import { FlatList, Text, View } from "react-native"
import React from "react";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;
const Record = () => {
    const [data, setDate] = React.useState();
    React.useEffect(() => {
        database().ref('/exercise/' + user.uid).on('value', snapshot => {
            console.log(snapshot.val());
            setDate(snapshot.val());
        });
    }, []);

    return (
        <View>
            <FlatList
                data={data}
                renderItem={item => {
                    <View>
                        <Text>{JSON.stringify(item)}</Text>
                    </View>
                }} />
        </View>
    )
}
export default Record;