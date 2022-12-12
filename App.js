/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import DrawerNavigation from './components/navigation/DrawerNavigation';
import MainNavigation from './components/navigation/MainNavigation';
import SplashScreen from 'react-native-splash-screen';

export default function App(){
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  return(
    <MainNavigation />
  )
}
