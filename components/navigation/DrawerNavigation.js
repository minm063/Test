import React from "react";
import { Pressable, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Calendar, CalendarList, Agenda, CalendarUtils } from "react-native-calendars";

import HomeScreen from "../screen/HomeScreen";
import Record from "../screen/Record";
import Feed from "../screen/Feed";
import HomeFeed from "../screen/HomeFeed";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeFeed" component={HomeFeed} />
        </Stack.Navigator>
    );
}

const DrawerNavigation = () => {

    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="MainNavigation" component={MainNavigation} options={{drawerLabel: 'HomePage'}} />
                <Drawer.Screen name="Feed" component={Feed} options={{ drawerLabel: 'Feed' }} />
                <Drawer.Screen name="Article" component={Record} options={{ drawerLabel: 'Article' }} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
export default DrawerNavigation;