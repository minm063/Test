import { View, StyleSheet, TextInput, Pressable, Text, FlatList } from "react-native";
import { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

const youtubesearch = require("youtube-search-api");
const FeedCustom = ({ navigation }) => {

    const [pressSearch, onSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                if (pressSearch) {
                    return (
                        <TextInput style={{ color: '#fff', fontSize: 17 }}
                            placeholderTextColor='#fff'
                            placeholder="type here"
                            autoFocus={true}
                            onChangeText={text => setSearch(text)} />);
                }
                else {
                    return (
                        <Text style={{ color: '#fff', fontSize: 20, paddingRight: 7 }}>
                            커스텀 운동 만들기
                        </Text>
                    );
                }
            },
            headerStyle: { backgroundColor: '#0f5e4a' },
            headerTintColor: '#fff',
            headerRight: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable onPress={() => {
                        onSearch(!pressSearch);
                        if (search.length!==0){
                            youtubesearch.GetListByKeyword(search, false, 5, [{type: 'video'}]).then((res) => {
                                console.log(JSON.stringify(res.items[0]["thumbnail"]));
                                setData(res.items[0]);
                            });
                        }
                    }}>
                        <AntDesign name='search1' color={'#fff'} size={20} style={{ paddingRight: 10 }} />
                    </Pressable>
                </View>
            )
        })
    }, [pressSearch]);


    return (
        <View>
            <FlatList data={data}
            renderItem={(item) => (
                <View>
                    {/* thumbnails, url, title */}
                    <Text>{JSON.stringify(item)}</Text>
                </View>
            )}/>
        </View>
    )
}
export default FeedCustom;