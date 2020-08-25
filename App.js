import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer} from 'react-navigation'
import * as permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';

import TransactionScreen from './screens/Transaction';
import SearchScreen from './screens/Search';
import { createBottomTabNavigator } from 'react-navigation-tabs';

export default class App extends React.Component {
  constructor() {
    super()
  }


  render() {
    return (
      <AppContainer />
    );
  }
  }
  
  const TabNavigator = createBottomTabNavigator({
    Transaction: {screen: TransactionScreen},
    Search: {screen: SearchScreen},
  },
  {
    defaultNavigationOptions: ({navigation})=>({
      tabBarIcon: ()=>{
        
      }
    })
  }
  );

  const AppContainer = createAppContainer(TabNavigator);

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});