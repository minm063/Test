import React from "react";
import { TextInput, View, StyleSheet, Pressable, Text, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const FriendList = () => {
    const user = auth().currentUser;

    const [search, setSearch] = React.useState('');
    const [userData, setUserData] = React.useState({});
    const [filteredUserData, setFilteredUserData] = React.useState({});
    const [friends, setFriends] = React.useState({});
    const [pressed, setPressed] = React.useState(false);
    const [url, setUrl] = React.useState();
    const [animating, setAnimating] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const inputRef = React.useRef(null);
    const clearInput = () => {
        inputRef.current.clear();
        setSearch('');
    }

    React.useEffect(() => {
        setAnimating(!animating);
        const downloadUrl = async (uri) => {
            const temp = await storage().ref('profile/' + uri).getDownloadURL();
            return { [uri]: temp };
        }
        database().ref('friends/' + user.uid).on('value', snapshot => {
            setFriends(snapshot.val());
            database().ref('/users/').on('value', snapshot2 => {
                // const temp = Object.keys(snapshot.val()).filter(users => users!==user.uid).map(users=>);
                setUserData(snapshot2.val());
                // if (snapshot.val()) {
                    const val = Object.entries(snapshot2.val()).filter(users => users[0] !== user.uid);
                    setFilteredUserData(Object.fromEntries(val));
                // } 
                // else {
                //     const val = Object.entries(snapshot2.val()).filter(users => users[0] !== user.uid && users[0] !== Object.keys(snapshot.val())[0]);
                //     setFilteredUserData(Object.fromEntries(val));
                // }

                Object.values(snapshot2.val()).map((item) => {
                    const profile = item.profile;
                    downloadUrl(profile).then(setUrl);
                    // setUrl(prev=>({...prev, [profile]: {uri}}));
                });
            });
        });
    }, [refreshing]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
    }, []);
    const onDiff = React.useCallback((item) => {
        const pressedBulb = friends[item.item].alarms;
        if (Math.abs(new Date().getHours() - new Date(Object.keys(pressedBulb)[Object.keys(pressedBulb).length - 1]).getHours()) < 5) {
            setPressed(!pressed);
        }
    }, [pressed]);


    return (
        <View style={styles.container}>
            <View style={{ margin: 10, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput style={styles.textInput} placeholder="친구 이름을 검색하세요" onChangeText={text => setSearch(text)} autoFocus ref={inputRef} />
                    <AntDesign name="closecircleo" color={'#000'} size={20} style={{ position: 'absolute', right: '15%' }}
                        onPress={clearInput} />
                    <AntDesign name="search1" color={'#000'} size={24} />
                </View>
                <View>
                    {/* if search */}
                    {userData && url ? (
                        <View>
                            {search && filteredUserData ? (
                                <FlatList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                    data={Object.keys(filteredUserData)}
                                    renderItem={(item, index) => {
                                        const temp = filteredUserData[item.item] || [];
                                        if (temp.name?.includes(search) && temp.latestAccess && !Object.keys(friends).includes(item.item)) {
                                            return (
                                                <View>
                                                    <Pressable
                                                        style={({ pressed }) => [{
                                                            backgroundColor: pressed ? 'gray' : null
                                                        }, styles.box]}
                                                        onPress={() => {
                                                            // add, verified
                                                            database().ref('friends/' + user.uid + '/' + item.item).update({
                                                                'friend': false
                                                            }).then(() => {
                                                                // 친구 신청을 완료했습니다.
                                                                // setData(Object.entries(data).filter(users => users[0]!==item.item));
                                                                database().ref('/alarms/' + item.item + '/' + Date.now()).update({
                                                                    'pressed': 'friend',
                                                                    name: user.displayName,
                                                                    uid: user.uid
                                                                });

                                                                showMessage({ message: "친구 신청을 완료했습니다.", type: "info" });
                                                                setFilteredUserData(Object.entries(filteredUserData).filter(users => users[0] !== item.item));
                                                            }).catch(error => console.log(error));
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Image source={{ uri: url[temp.profile] }} style={styles.profile} />
                                                            <Text style={{ color: '#000', paddingHorizontal: 20, fontSize: 20 }}>{temp.name}</Text>
                                                        </View>
                                                        <Text>+ 친구</Text>
                                                    </Pressable>
                                                </View>
                                            )
                                        }
                                    }}
                                />
                            ) : (
                                <View>
                                    {friends ? (
                                        <FlatList
                                            refreshControl={
                                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                            }
                                            data={Object.keys(friends)}
                                            renderItem={item => {
                                                if (friends[item.item].friend) {
                                                    return (
                                                        <Pressable
                                                            onLongPress={() => {
                                                                // 친구 삭제
                                                            }}>
                                                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Image source={{ uri: url[userData[item.item].profile] }} style={styles.profile} />
                                                                    <Text style={{ color: '#000', paddingHorizontal: 20, fontSize: 20 }}>{userData[item.item].name}</Text>
                                                                </View>
                                                                <View style={styles.icons}>
                                                                    <Entypo name="light-bulb" size={19} onPress={() => {
                                                                        if (!pressed) {
                                                                            setPressed(true);
                                                                            database().ref('/alarms/' + item.item + '/' + Date.now()).update({
                                                                                'presssed': 'alert',
                                                                                name: user.displayName
                                                                            });
                                                                        }
                                                                    }}
                                                                        color={pressed ? 'lightgray' : '#00aeff'} />
                                                                </View>
                                                            </View>
                                                            <Text style={{ fontSize: 15 }}>최근 접속일
                                                                {new Date(userData[item.item].latestAccess).toLocaleDateString()}
                                                            </Text>
                                                        </Pressable>
                                                    )
                                                }
                                            }} />
                                    ) : (
                                        <View>
                                            <Text>친구를 검색해 추가해보세요.</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ) : (
                        <ActivityIndicator animating={animating} size={"large"} />
                    )}
                </View>
            </View>
            <FlashMessage position={"bottom"} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        width: '80%',
        borderWidth: 0.6,
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 15,
        margin: 10
    },
    profile: {
        width: 40,
        height: 40,
        borderRadius: 30,

    },
    box: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderBottomColor: 'gray',
        paddingVertical: 10
    },
    icons: {
        alignItems: 'center',
        borderWidth: 0.6,
        borderRadius: 20,
        width: 38, height: 38,
        justifyContent: 'center'
    }
})
export default FriendList;