import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Button } from "react-native";

import HomeScreen from "../screen/HomeScreen";
import Article from "../screen/Article";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Feed from "../screen/Feed";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigation() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Feed" component={Feed} options={{ drawerLabel: 'Feed' }} />
            <Drawer.Screen name="Article" component={Article} options={{ drawerLabel: 'Article' }} />
        </Drawer.Navigator>
    );
}

const MainNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{headerShown: 'false'}}/>
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;