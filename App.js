import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import * as permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';

import TransactionScreen from './screens/Transaction';
import SearchScreen from './screens/Search';
import LoginScreen from "./screens/Login";
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
        const routeName = navigation.state.routeName;
        console.log(routeName)
        if(routeName === "Transaction"){
          return(
            <Image
            source={require("./images/book.png")}
            style={{width:40, height:40}}
          />
          )
          
        }
        else if(routeName === "Search"){
          return(
            <Image
            source={require("./images/searchingbook.png")}
            style={{width:40, height:40}}
          />)
          
        }
      }
    })
  }
  );

  const SwitchNavigator = createSwitchNavigator({
    LoginScreen:{screen: LoginScreen},
    TabNavigator: {screen: TabNavigator}
  })

    const AppContainer = createAppContainer(SwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
