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
import * as utile from './components/common/utile';
import Router from './Router';
import * as types from './components/actions/Types';

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

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
    // add internet check at this level
    this.myStore.subscribe(() => {
      const state = this.myStore.getState();
      const { isConnected, error, service } = state.network;
      console.info(`Network isConnected:${isConnected}, error:${error}, service:${service} `);
      if (!isConnected) {
        Actions.reset('error');
        this.handleFirstConnectivityChange(false);
      }
    });
    try {
      this.initializeApp();
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
    } catch (e) {
      console.warn(`error occured in App.js, the error is:${e}`);
    }
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

  initializeApp = () => {
    this.myStore.dispatch(authActions.register());
    // load bilune data, from BDL services
    setTimeout(() => this.myStore.dispatch(biluneActions.loadSpatialData()), 0);
  }

  reConfirmOffline = async () => {
    const connectionAvailable = await utile.isConnected();
    if (connectionAvailable) {
      this.handleFirstConnectivityChange(true);
    } else {
      Actions.reset('error');
      this.handleFirstConnectivityChange(false);
    }
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
          this.myStore.dispatch({
            type: types.UPDATE_CONNECTION_STATE,
            payload: {
              isConnected,
            },
          });
          this.initializeApp();
          Actions.reset('main', { reset: true });
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
