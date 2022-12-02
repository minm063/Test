import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Switch, Text, Pressable, TextInput, useWindowDimensions, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const category = () => (
    <View styles={{ flex: 1, }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={styles.category}>
                <Text>전체</Text>
            </Pressable>
            <Pressable style={styles.category}><Text>커스텀</Text></Pressable>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={styles.category}><Text>유산소</Text></Pressable>
            <Pressable style={styles.category}><Text>상체</Text></Pressable>
            <Pressable style={styles.category}><Text>하체</Text></Pressable>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={styles.category}><Text>전신</Text></Pressable>
            <Pressable style={styles.category}><Text>스트레칭</Text></Pressable>
        </View>
    </View>
);
const Temp0 = () => {
    return (
        <View><Text>Temp0</Text></View>
    )
};
const Temp1 = () => (
    <View>
        <Text>전체</Text>
    </View>
);
const Temp2 = () => (
    <View>
        <Text>유산소</Text>
    </View>
);
const Temp3 = () => (
    <View>
        <Text>상체</Text>
    </View>
);
const Temp4 = () => (
    <View>
        <Text>하체</Text>
    </View>
);
const Temp5 = () => (
    <View>
        <Text>전신</Text>
    </View>
);
const Temp6 = () => (
    <View>
        <Text>스트레칭</Text>
    </View>
);

const renderScene = SceneMap({
    category: category,
    '1': Temp1,
    '0': Temp0,
    '2': Temp2,
    '3': Temp3,
    '4': Temp4,
    '5': Temp5,
    '6': Temp6
});

const Feed = ({ route, navigation }) => {

    const [pressSearch, onSearch] = useState(false);
    const [search, setSearch] = useState('');

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
                    <Pressable onPress={() => onSearch(!pressSearch)}>
                        <AntDesign name='search1' color={'#fff'} size={20} style={styles.headerIcon} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('FeedCustom')}>
                        {
                            pressSearch ?
                                (
                                    <Pressable onPress={() => onSearch(!pressSearch)}>
                                        <Text style={{ color: '#fff', fontSize: 17 }}>종료</Text>
                                    </Pressable>
                                )
                                :
                                (<AntDesign name='plus' color={'#fff'} size={23} style={styles.headerIcon} />)
                        }
                    </Pressable>
                </View>
            )
        })
    }, [route, pressSearch]);
    useEffect(() => {
        //db
    }, []);

    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'category', title: '분류' },
        { key: '1', title: '전체' },
        { key: '0', title: '커스텀' },
        { key: '2', title: '유산소' },
        { key: '3', title: '상체' },
        { key: '4', title: '하체' },
        { key: '5', title: '전신' },
        { key: '6', title: '스트레칭' },
    ]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: '70%' }}>
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
            <View style={{ flex: 1, backgroundColor: '#aeff00' }}>
                <View style={{ flex: 2 }}></View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', backgroundColor: '#EFEFEF' }}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={[styles.footerBtn, { backgroundColor: '#fff' }]}>
                        <Text style={{ fontSize: 18, color: '#000' }}>취소</Text>
                    </Pressable>
                    <Pressable style={[styles.footerBtn, { backgroundColor: '#00aeff' }]}>
                        <Text style={{ fontSize: 18, color: '#fff' }}>완료</Text>
                    </Pressable>
                </View>
            </View>
        </View>
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
        width: '20%',
        height: 41,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    category: {
        borderWidth: 1,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80, height: 50,
        margin: 10
    }
})
export default Feed;