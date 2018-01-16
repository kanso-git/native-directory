import React, { Component } from 'react';
import { View, Platform, BackHandler, NetInfo } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import { Actions } from 'react-native-router-flux';
import './I18n/I18n';
import { authActions } from './components/actions';
import reducers from './components/reducers';
import Router from './Router';

class App extends Component {
  componentDidMount() {
    if (SplashScreen && SplashScreen.hide) {
      SplashScreen.hide();
    }
    this.myStore.dispatch(authActions.register());

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (Actions.currentScene === 'home' || Actions.currentScene === 'networkError') {
          console.log(`Exit APP  android backButtonListener currentScene:${Actions.currentScene}`);
          BackHandler.exitApp();
          return true;
        }
        console.log(`Should not Exit APP  currentScene:${Actions.currentScene}`);
        return false;
      });
    }

    NetInfo.isConnected.fetch().then((isConnected) => {
      console.log(`First, is ${isConnected ? 'online' : 'offline'}`);
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }
  handleFirstConnectivityChange = (isConnected) => {
    const networkStatus = isConnected ? 'online' : 'offline';
    const scene = Actions.currentScene;
    console.log(`handleFirstConnectivityChange Then, networkStatus is ${networkStatus}
    scene is ${scene}
    `);
    switch (networkStatus) {
      case 'online':
        Actions.reset('main');
        break;
      case 'offline':
        Actions.reset('error');
        break;
      default:
        break;
    }
  }
  myStore = null;
  render() {
    this.myStore = createStore(reducers, applyMiddleware(thunk));
    return (
      <Provider store={this.myStore} >
        <View style={{ flex: 1 }}>
          <Router />
        </View>
      </Provider>
    );
  }
}

export default App;
