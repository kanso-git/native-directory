/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
import React, { Component } from 'react';
import { View, Platform, BackHandler, NetInfo, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import { Actions } from 'react-native-router-flux';
import './I18n/I18n';
import { authActions, biluneActions } from './components/actions';
import reducers from './components/reducers';
import Router from './Router';

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
});
class App extends Component {
  componentDidMount() {
    if (SplashScreen && SplashScreen.hide) {
      SplashScreen.hide();
    }
    // todo add internet check at this level
    this.myStore.dispatch(authActions.register());
    // load bilune data, from BDL services
    setTimeout(() => this.myStore.dispatch(biluneActions.loadSpatialData()), 0);

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (Actions.currentScene === 'home' || Actions.currentScene === 'networkError') {
          console.info(`Exit APP  android backButtonListener currentScene:${Actions.currentScene}`);
          BackHandler.exitApp();
          return true;
        }
        console.info(`Should not Exit APP  currentScene:${Actions.currentScene}`);
        Actions.pop();
        return true;
      });
    }

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

  reConfirmOffline = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      console.info(`First, is ${isConnected ? 'online' : 'offline'}`);
      if (!isConnected) {
        Actions.reset('error');
        setTimeout(() => this.handleFirstConnectivityChange(), 300);
      }
    });
  }
  handleFirstConnectivityChange = (isConnected) => {
    const networkStatus = isConnected ? 'online' : 'offline';
    let reConfirmOfflineTimeOut = null;
    switch (networkStatus) {
      case 'online':
        if (Actions.currentScene === 'networkError') {
          if (reConfirmOfflineTimeOut) {
            console.info(' connection is back clear the timeout ');
            clearTimeout(reConfirmOfflineTimeOut);
          }
          Actions.reset('main');
        }
        break;
      case 'offline':
        reConfirmOfflineTimeOut = setTimeout(() => this.reConfirmOffline(), 3000);
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
        <View style={styles.full}>
          <Router />
        </View>
      </Provider>
    );
  }
}

export default App;
