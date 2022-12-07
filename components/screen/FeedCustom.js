import { View, StyleSheet, TextInput, Pressable, Text, FlatList, ActivityIndicator, Image, Dimensions, ScrollView, RefreshControl, Alert, Modal } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { API_KEY } from "../constants/api.json";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;
//timeout의 시간만큼 함수를 지연하고 처리하는 함수 생성
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
const FeedCustom = ({ navigation }) => {

    const [pressSearch, onSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState();
    const [nextPageToken, setToken] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [thumbnailUri, setThumnailUri] = useState([]);
    const [videoId, setVideoId] = useState([]);
    const [count, setCount] = useState(1);
    const [pressed, setPressed] = useState(false);
    // modal
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');

    const windowWidth = Dimensions.get('window').width;
    const url = "https://www.youtube.com/watch?v=";
    //refreshcontrol을 호출할 때 실행되는 callback함수
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);
    const videoSearch = async () => {
        await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=` + search + `&key=` + API_KEY)
            .then((res) => res.json())
            .then(data => {
                // nextPageToken
                console.log(data);
                setData(data.items);
                setToken(data.nextPageToken);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }
    const videoSearchNext = async () => {
        console.log(nextPageToken);
        await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=` + search + `&pageToken=` + nextPageToken + `&key=` + API_KEY)
            .then((res) => res.json())
            .then(data => {
                // nextPageToken
                setData(prev => [...prev, ...data.items]);
                setToken(data.nextPageToken);
                setLoading(false);
                setCount(prev => prev + 1);
            })
            .catch(error => console.log(error));
    }
    const getData = async () => {
        console.log(Object.keys(data).length);
        if (Object.keys(data).length >= 10 * count) {
            setLoading(true);
            await videoSearchNext();
            console.log(data);
        }
    }

    const onEndReached = () => {
        if (!isLoading) {
            getData();
        }
    }

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
                        onSearch(true);
                        console.log(search);
                        if (search.length !== 0) {
                            // youtubesearch.GetListByKeyword(search, false, 5, [{type: 'video'}]).then((res) => {
                            //     console.log(JSON.stringify(res.items[0]["thumbnail"]));
                            //     setData(res.items[0]);
                            // });
                            setLoading(true);
                            videoSearch();
                        }
                    }}>
                        <AntDesign name='search1' color={'#fff'} size={20} style={{ paddingRight: 10 }} />
                    </Pressable>
                </View>
            )
        })
    }, [pressSearch, search, nextPageToken]);

    return (
        <View style={{ flex: 1, }}>
            <Modal
                visible={modal}
                onRequestClose={() => setModal(!modal)}
                transparent={true}
                animationType={'slide'}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <View style={styles.modal}>
                        <View style={{ flex: 1, marginVertical: 4 }}>
                            <Text style={styles.modalText}>제목</Text>
                            <TextInput maxLength={20} placeholder="제목" style={styles.modalInput} onChangeText={text => setTitle(text)} />
                        </View>
                        <View style={{ flex: 1.8, marginVertical: 4 }}>
                            <Text style={styles.modalText}>메모</Text>
                            <TextInput
                                multiline={true}
                                // numberOfLines={3}
                                style={styles.modalInput}
                                maxLength={120}
                                onChangeText={text => setMemo(text)} />
                        </View>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Pressable style={[styles.modalBtn, { backgroundColor: '#00aeff' }]}
                                onPress={() => {
                                    database().ref('/custom/' + user.uid + '/' + Date.now()).set({
                                        title: title,
                                        memo: memo,
                                        thumbnails: thumbnailUri,
                                        videoId: videoId,
                                        timestamp: Date.now()
                                    }).then(() => {
                                        navigation.goBack();
                                    })
                                        .catch((error) => {
                                            Alert.alert("alert", "저장에 실패하였습니다.", [{ text: "OK" }]);
                                            console.log(error);
                                        })
                                }}>
                                <Text>등록하기</Text>
                            </Pressable>
                            <Pressable style={[styles.modalBtn, { backgroundColor: '#fff' }]} onPress={() => setModal(!modal)}><Text>취소</Text></Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ height: '80%' }}>
                {/* FlatList */}
                <FlatList
                    data={data}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.7}
                    ListFooterComponent={isLoading && <ActivityIndicator />}
                    keyExtractor={(item, index) => index}
                    renderItem={(item, index) => (
                        <View>
                            <Pressable
                                style={({ pressed }) => [{
                                    backgroundColor: pressed ? 'rgb(210, 230, 225)' : 'white'
                                }, { flexDirection: 'row' }]}
                                onPress={() => {
                                    // {...thumbnailUri, [index]: item.item.snippet.thumbnails.medium.url}
                                    // setThumnailUri((prevState, index) => {
                                    //     return { ...prevState, [index]: item.item.snippet.thumbnails.medium.url }
                                    // });
                                    if (thumbnailUri.length < 10) {
                                        setThumnailUri(prev => [...prev, item.item.snippet.thumbnails.medium.url]);
                                        setVideoId(prev => [...prev, item.item.id.videoId]);
                                    }
                                    else {
                                        Alert.alert("info", "10개까지 선택 가능합니다", [{ text: "OK" }]);
                                    }
                                }}
                            >
                                <Image source={{ uri: item.item.snippet.thumbnails.medium.url }}
                                    style={{ width: windowWidth / 3, height: windowWidth / 5, }}
                                    resizeMode={'contain'} />
                                <View style={{ margin: 7, flex: 1 }}>
                                    <Text style={{ color: '#000' }}>{item.item.snippet.title}</Text>
                                    <Text>{item.item.snippet.channelTitle}</Text>
                                </View>
                            </Pressable>
                            <View style={{ borderWidth: 0.6, borderColor: 'lightgray' }} />
                        </View>
                    )} />
            </View>
            <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
                <View style={{ flex: 3, }}>
                    <ScrollView horizontal
                        contentContainerStyle={styles.ScrollView}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {thumbnailUri.map((item, index) => (
                            <Pressable key={index}
                                onPress={() => {
                                    //삭제
                                    thumbnailUri.splice(index, 1);
                                    videoId.splice(index, 1)
                                    onRefresh();
                                }}>
                                <Image source={{ uri: item }} style={{ width: 120, height: 100, margin: 7 }} resizeMode={"contain"} />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', backgroundColor: '#EFEFEF', padding: 10 }}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={[styles.footerBtn, { backgroundColor: '#fff' }]}>
                        <Text style={{ fontSize: 15, color: '#000' }}>취소</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setModal(!modal)}
                        style={[styles.footerBtn, { backgroundColor: '#00aeff' }]}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>완료</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerIcon: {
        paddingHorizontal: 8
    },
    footerBtn: {
        borderRadius: 30,
        width: '19%',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    ScrollView: {
        alignItems: 'center',
        paddingHorizontal: 10
    },
    modalBtn: {
        borderRadius: 15,
        width: '30%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 7,
    },
    modal: {
        width: '80%', height: '50%',
        backgroundColor: 'lightgray',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 20
    },
    modalText: {
        color: '#000',
        marginVertical: 8
    },
    modalInput: {
        borderWidth: 0.6,
        borderRadius: 7,
    }
});
export default FeedCustom;