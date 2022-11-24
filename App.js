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

export default function App(){
  return(
    <MainNavigation />
  )
}
