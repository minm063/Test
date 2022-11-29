import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Button } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';

import HomeScreen from "../screen/HomeScreen";
import Article from "../screen/Article";
import MyPage from "../screen/MyPage";
import SignIn from "../screen/auth/SignIn";
import SignUp from "../screen/auth/SignUp";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigation() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="HomeScreen" component={HomeScreen}
                options={{ drawerLabel: 'Home', headerStyle: { backgroundColor: '#0f5e4a' }, headerTintColor: '#fff' }}
            />
            <Drawer.Screen name="Article" component={Article} options={{ drawerLabel: 'Article' }} />
            <Drawer.Screen name="MyPage" component={MyPage} options={{drawerLabel: 'My Page'}} />
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
    if (user) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
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