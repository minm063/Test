import React, { useState, useEffect } from "react";
import { View, Image, Text, Pressable, Alert, ActivityIndicator, } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import HomeScreen from "../screen/HomeScreen";
import Record from "../screen/Record";
import MyPage from "../screen/MyPage";
import SignIn from "../screen/auth/SignIn";
import SignUp from "../screen/auth/SignUp";
import Feed from "../screen/Feed";
import FeedCustom from "../screen/FeedCustom";
import FriendList from "../screen/FriendList";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const user = auth().currentUser;
    const [profileImg, setProfileImg] = useState(null);
    const downloadFile = async (fileName) => {
        const url = await storage().ref('profile/' + fileName).getDownloadURL();
        return url;
    }
    useEffect(() => {
        database().ref('/users/' + user.uid).on('value', snapshot => {
            downloadFile(snapshot.val()['profile']).then((url) => setProfileImg(url));
        });
    }, []);
    return (
        <View style={{ flex: 1, }}>
            <DrawerContentScrollView {...props}>
                {/* profile image, email, name */}
                <View style={{ padding: 30, justifyContent: 'center' }}>
                    <Image source={{ uri: profileImg }} style={{ width: 50, height: 50, borderRadius: 100 }} />
                    <Text style={{ paddingTop: 10, }}>{user.email}</Text>
                    <Text style={{ paddingVertical: 7, }}>{user.displayName}</Text>
                </View>
                <DrawerItemList {...props} />
                <View>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                        onPress={() => {
                            Alert.alert("info", "?????? ???????????? ???????????????????", [{ text: "??????", onPress: () => auth().signOut() }, { text: "??????", style: "cancel" }]);
                        }}>
                        <Text style={{ color: '#000', fontSize: 15, padding: 20, }}>????????????</Text>
                        <MaterialCommunityIcons name="logout-variant" color={'#be0000'} style={{ padding: 10, marginRight: 7, justifyContent: 'center' }} size={20} />
                    </Pressable>
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

function DrawerNavigation() {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="HomeScreen" component={HomeScreen}
                options={{ drawerLabel: '???', headerStyle: { backgroundColor: '#0f5e4a' }, headerTintColor: '#fff', drawerLabelStyle: { color: '#000' } }}
            />
            <Drawer.Screen name="Record" component={Record} options={{ drawerLabel: '??????', title: '??????', drawerLabelStyle: { color: '#000' }, headerStyle: { backgroundColor: '#0f5e4a' }, headerTintColor: '#fff' }} />
            <Drawer.Screen name="FriendList" component={FriendList} options={{ drawerLabel: '?????? ??????', title: '?????? ??????', drawerLabelStyle: { color: '#000' }, headerStyle: { backgroundColor: '#0f5e4a' }, headerTintColor: '#fff' }} />
            <Drawer.Screen name="MyPage" component={MyPage} options={{ drawerLabel: '?????? ?????????', title: '???????????????', drawerLabelStyle: { color: '#000' }, headerStyle: { backgroundColor: '#0f5e4a' }, headerTintColor: '#fff' }} />

        </Drawer.Navigator>
    );
}

const MainNavigation = () => {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    // auth
    if (user && auth().currentUser.emailVerified) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Feed" component={Feed} />
                    <Stack.Screen name="FeedCustom" component={FeedCustom} options={{
                        title: '????????? ?????? ?????????', headerStyle: { backgroundColor: '#0f5e4a' },
                        headerTintColor: '#fff',
                    }} />

                </Stack.Navigator>
            </NavigationContainer>
        )
    }
    else {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default MainNavigation;