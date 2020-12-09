import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import SummaryScreen from './screens/SummaryScreen';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer />
    )
  }
}

var AppNavigator = createSwitchNavigator({
  HomeScreen: HomeScreen,
  SummaryScreen: SummaryScreen
})

const AppContainer = createAppContainer(AppNavigator);