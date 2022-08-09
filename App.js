import React, { Component } from 'react';
import { StyleSheet, ImageBackground } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Login from './src/main/containers/login'
import Listinv from './src/main/components/listainv'
import Filtros from './src/main/components/filtros'
import Stores from './src/main/components/store'
import Hamburger from './src/main/components/hamburger'

const loginNavigator = createStackNavigator({
  Inicio: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  },

  Store: {
    screen: Stores,
    navigationOptions: {
      headerShown: false
    }
  },

  HamburgerIcon: {
    screen: Hamburger,
    navigationOptions: {
      headerShown: false
    }
  },

  Filtro: {
    screen: Filtros,
    navigationOptions: {
      headerShown: false
    }
  },
  Inventario: {
    screen: Listinv,
    navigationOptions: {
      headerShown: false
    }
  },
});

const AppContainer = createAppContainer(loginNavigator);

class cricol extends Component {
  constructor() {
    super();
    console.disableYellowBox = true;
    this.state = {
      assetsLoaded: false,
    };
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./src/assets/images/005.png'),
        // require('@assets/images/applogo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./src/assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };
  render() {
    return (
      <AppContainer />
    )
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  }
})

export default cricol