import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Button } from "react-native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screen/HomeScreen";
import Article from "../screen/Article";
import Feed from "../screen/Feed";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigation() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ drawerLabel: 'Home' }} />
            <Drawer.Screen name="Article" component={Article} options={{ drawerLabel: 'Article' }} />
        </Drawer.Navigator>
    );
}

const MainNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;