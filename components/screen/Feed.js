import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Switch, Text, Pressable, TextInput, useWindowDimensions, ScrollView, Dimensions, TouchableHighlight, Image, Modal, VirtualizedList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { RefreshControl } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const user = auth().currentUser;
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Feed = ({ route, navigation }) => {

    const scrollRef = React.useRef();
    const [pressSearch, onSearch] = useState(false);
    const [search, setSearch] = useState('');
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0); //tab
    const [searchIndex, setSearchIndex] = useState(0); // search -> scroll index
    const [data, setData] = useState({});
    const [exercise, setExercise] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [custom, setCustom] = useState();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const CategoryRoute = () => (
        <View style={{ flex: 1, }}>
            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ flexDirection: 'row', }}>
                    <Pressable style={styles.category} onPress={() => setIndex(1)}><Text>전체</Text></Pressable>
                    <Pressable style={styles.category} onPress={() => setIndex(2)}><Text>커스텀</Text></Pressable>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Pressable style={styles.category} onPress={() => setIndex(3)}><Text>유산소</Text></Pressable>
                    <Pressable style={styles.category} onPress={() => setIndex(4)}><Text>상체</Text></Pressable>
                    <Pressable style={styles.category} onPress={() => setIndex(5)}><Text>하체</Text></Pressable>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Pressable style={styles.category} onPress={() => setIndex(6)}><Text>전신</Text></Pressable>
                    <Pressable style={styles.category} onPress={() => setIndex(7)}><Text>스트레칭</Text></Pressable>
                </View>
            </View>
        </View>
    );
    // 커스텀
    const CustomRoute = () => {

        const [modal, setModal] = useState(false);

        return (
            <View>
                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={modal}
                    onRequestClose={() => setModal(!modal)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                        <View style={styles.modalView}>
                            <View style={{ flex: 1 }}>
                                <AntDesign name='infocirlceo' size={20} color={'#000'} />
                            </View>
                            <View style={{ borderWidth: 0.6 }} />
                            <View style={{ justifyContent: 'space-evenly', flex: 3 }}>
                                <Pressable style={({ pressed }) => [{
                                    backgroundColor: pressed ? 'rgb(210, 230, 225)' : 'white'
                                }, styles.modalPressable]}>
                                    <Text>상세 정보 보기</Text>
                                </Pressable>
                                <Pressable style={({ pressed }) => [{
                                    backgroundColor: pressed ? 'rgb(210, 230, 225)' : 'white'
                                }, styles.modalPressable]}>
                                    <Text>수정하기</Text>
                                </Pressable>
                                <Pressable style={({ pressed }) => [{
                                    backgroundColor: pressed ? 'rgb(210, 230, 225)' : 'white'
                                }, styles.modalPressable]}>
                                    <Text>삭제하기</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                {custom && (
                    <View style={{ margin: 10 }}>
                        {Object.values(custom).map((item, index) => (
                            <Pressable key={index}
                                onLongPress={() => {
                                    // modal(상세보기, 수정, 삭제)
                                    setModal(!modal);
                                }}
                                onPress={() => {
                                    console.log(item.thumbnails[0]);
                                    setExercise(prev => [...prev, item.thumbnails[0] + ',' + item.timestamp]);
                                }}>
                                <View style={{ flexDirection: 'row', marginVertical: 10, }}>
                                    <Image source={{ uri: item.thumbnails[0] }} style={{ width: width / 3, height: 80 }} />
                                    <View style={{ marginHorizontal: 10, }}>
                                        <Text style={{ fontSize: 18, color: '#000', paddingVertical: 4 }}>{item.title}</Text>
                                        <Text>{new Date(item.timestamp).getHours() + ' : ' + new Date(item.timestamp).getMinutes() + ', '
                                            + (new Date(item.timestamp).toDateString())}</Text>
                                        <Text>{item.memo}</Text>
                                    </View>
                                </View>
                                <View style={{ borderWidth: 0.6, borderColor: 'lightgray' }} />
                            </Pressable>
                        ))}
                        {/* <Text>{JSON.stringify(custom)}</Text> */}
                    </View>
                )}
            </View>
        )
    };
    // 전체
    const TotalRoute = () => (
        <View>
            <Text>전체</Text>
        </View>
    );

    // virtualized
    const Item = ({ title }) => (
        <Pressable style={({ pressed }) => [{
            backgroundColor: pressed ? 'rgb(210, 230, 225)' : 'white'
        }, styles.list]}
            onPress={() => setExercise(prev => [...prev, title])}>
            <Text style={styles.listText}>{title}</Text>
        </Pressable>
    )
    const getItem = (data, index) => {
        return {
            id: index,
            title: data[index]
        }
    }
    const getItemCount = (data) => (Object.values(data).length);
    // 유산소
    const AerobicRoute = () => {
        return (
            <View>
                {data.aerobic && (
                    <VirtualizedList
                        data={data.aerobic}
                        getItemCount={getItemCount}
                        renderItem={({ item }) => <Item title={item.title} />}
                        getItem={getItem}
                        keyExtractor={item => item.id}
                        initialScrollIndex={searchIndex ? searchIndex : 0}
                    />
                )}
                {/* {data.aerobic && data.aerobic.map((item, index) => (
                    <TouchableHighlight key={index}
                        underlayColor='#DDDDDD'
                        onPress={() => setExercise(prev => [...prev, item])} >

                    </TouchableHighlight>
                ))} */}
            </View>
        );
    }
    const UpRoute = () => (
        <View>
            {data.up && (
                <VirtualizedList
                    data={data.up}
                    getItemCount={getItemCount}
                    renderItem={({ item }) => <Item title={item.title} />}
                    getItem={getItem}
                    keyExtractor={item => item.id}
                    initialScrollIndex={searchIndex ? searchIndex : 0}
                />
            )}
        </View>
    );
    const DownRoute = () => (
        <View>
            {data.down && (
                <VirtualizedList
                    data={data.down}
                    getItemCount={getItemCount}
                    renderItem={({ item }) => <Item title={item.title} />}
                    getItem={getItem}
                    keyExtractor={item => item.id}
                    initialScrollIndex={searchIndex ? searchIndex : 0}
                />
            )}
        </View>
    );
    const AllRoute = () => (
        <View>
            {data.all && (
                <VirtualizedList
                    data={data.all}
                    getItemCount={getItemCount}
                    renderItem={({ item }) => <Item title={item.title} />}
                    getItem={getItem}
                    keyExtractor={item => item.id}
                    initialScrollIndex={searchIndex ? searchIndex : 0}
                />
            )}
        </View>
    );
    const StretchRoute = () => (
        <View>
            {data.stretch && (
                <VirtualizedList
                    data={data.stretch}
                    getItemCount={getItemCount}
                    renderItem={({ item }) => <Item title={item.title} />}
                    getItem={getItem}
                    keyExtractor={item => item.id}
                    initialScrollIndex={searchIndex ? searchIndex : 0}
                />
            )}
        </View>
    );

    const isFocsed = useIsFocused();
    useEffect(() => {
        if (isFocsed) {
            database().ref('/custom/' + user.uid).once('value')
                .then((snapshot) => {
                    setCustom(snapshot.val());
                });
        }
    }, [isFocsed]);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => {
                if (pressSearch) {
                    return <TextInput style={{ color: '#fff', fontSize: 17 }}
                        placeholderTextColor='#fff'
                        placeholder="type here"
                        autoFocus={true}
                        onChangeText={text => setSearch(text)} />;
                }
                else {
                    return (
                        <Text style={{ color: '#fff', fontSize: 20, paddingRight: 7 }}>
                            {route.params.selected}
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
                        if (search.length) {
                            const key = Object.keys(data);
                            key.map((item, i) => {
                                // data[item]
                                const idx = data[item].indexOf(search);
                                if (idx > 0) {
                                    setIndex(i + 3);
                                    setSearchIndex(idx);
                                }
                            });
                        }
                    }}>
                        <AntDesign name='search1' color={'#fff'} size={20} style={styles.headerIcon} />
                    </Pressable>
                    {pressSearch ?
                        (
                            <Pressable onPress={() => {
                                onSearch(!pressSearch);
                            }}>
                                <Text style={{ color: '#fff', fontSize: 17 }}>종료</Text>
                            </Pressable>
                        ) : (
                            <Pressable onPress={() => navigation.navigate('FeedCustom')}>
                                <AntDesign name='plus' color={'#fff'} size={23} style={styles.headerIcon} />
                            </Pressable>
                        )
                    }
                </View>
            )
        })
    }, [route, pressSearch, search]);
    const getData = async () => {
        await firestore().collection('collection').doc('category').get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setData(documentSnapshot.data());
                }
            });
    }
    useEffect(() => {
        // store
        getData();
    }, []);

    // route, jumpTo, position
    const renderScene = SceneMap({
        category: CategoryRoute,
        total: TotalRoute,
        custom: CustomRoute,
        aerobic: AerobicRoute,
        up: UpRoute,
        down: DownRoute,
        all: AllRoute,
        stretch: StretchRoute
    });
    const [routes] = useState([
        { key: 'category', title: '분류' },
        { key: 'total', title: '전체' },
        { key: 'custom', title: '커스텀' },
        { key: 'aerobic', title: '유산소' },
        { key: 'up', title: '상체' },
        { key: 'down', title: '하체' },
        { key: 'all', title: '전신' },
        { key: 'stretch', title: '스트레칭' },
    ]);

    return (
        <View style={{ flex: 1, }}>
            <View style={{ height: '80%', }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={props => (
                        <TabBar {...props}
                            indicatorStyle={{ borderEndColor: '#fff' }}
                            tabStyle={{ width: 100 }}
                            scrollEnabled={true}
                        />
                    )}
                />
            </View>
            <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
                <View style={{ flex: 3 }}>
                    <ScrollView horizontal refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                        {exercise.map((item, index) => (
                            <Pressable key={index} style={styles.box}
                                onPress={() => {
                                    // del
                                    exercise.splice(index, 1);
                                    onRefresh();
                                }}>
                                {item.includes("https") ? (
                                    <Image source={{ uri: item.split(',')[0] }} resizeMode={'contain'} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <Text style={{ color: '#000' }}>{item}</Text>
                                )}
                                <AntDesign name='closecircleo' size={20} color='#000' style={{ position: 'absolute', right: 0, top: 0, margin: 5 }} />
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
                    <Pressable style={[styles.footerBtn, { backgroundColor: '#00aeff' }]}
                        onPress={() => {
                            const timestamp = Date.now();
                            database().ref('/exercise/' + user.uid + '/' + route.params.selected)
                                .update({
                                    [timestamp]: exercise,
                                })
                                .then(() => navigation.goBack())
                                .catch((error) => console.log(error));
                            console.log(exercise);
                        }}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>완료</Text>
                    </Pressable>
                </View>
            </View>
        </View >
    );
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
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    category: {
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80, height: 50,
        margin: 20
    },
    list: {
        padding: 15,
        borderWidth: 0.7,
        borderColor: 'lightgray',
        paddingHorizontal: 20
    },
    listText: {
        fontSize: 18
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width / 100 * 30,
        backgroundColor: '#fff',
        margin: 10
    },
    modalView: {
        width: '50%', height: '30%',
        borderRadius: 20,
        borderWidth: 0.5,
        padding: 20,
        backgroundColor: '#fff'
    },
    modalPressable: {
        paddingVertical: 8,
        borderRadius: 5
    }
})
export default Feed;