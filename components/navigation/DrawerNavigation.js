import React from "react";
import { Pressable, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Calendar, CalendarList, Agenda, CalendarUtils } from "react-native-calendars";

import HomeScreen from "../screen/HomeScreen";
import Article from "../screen/Article";
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
    const [today, setToday] = React.useState('babo');
    React.useEffect(() => {
        let today = new Date();
        setToday(today.getFullYear().toString() + '.' + (today.getMonth() + 1).toString());
    }, []);

    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="MainNavigation" component={MainNavigation} options={{
                    drawerLabel: 'HomePage', headerTitle: () => (
                        <Pressable
                            onPress={() => console.log('Pressed')}
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Text style={{ color: '#fff', fontSize: 20, paddingRight: 7 }}>
                                {today}
                            </Text> */}
                            <AntDesign name="caretdown" size={18} color={'#fff'} />
                        </Pressable>
                    ),
                    headerStyle: {
                        backgroundColor: '#0f5e4a',
                    },
                    headerTintColor: '#ffffff'
                }}
                />
                <Drawer.Screen name="Feed" component={Feed} options={{ drawerLabel: 'Feed' }} />
                <Drawer.Screen name="Article" component={Article} options={{ drawerLabel: 'Article' }} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
export default DrawerNavigation;