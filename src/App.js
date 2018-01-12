import React, { Component } from 'react';
import { View, Platform, BackHandler } from 'react-native';
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
  constructor(props) {
    super(props);
    this.backButtonListener = null;
  }
  componentDidMount() {
    if (SplashScreen && SplashScreen.hide) {
      SplashScreen.hide();
    }
    this.myStore.dispatch(authActions.register());

    if (Platform.OS === 'android') {
      this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
        console.log(`android backButtonListener Actions.currentScene:${Actions.currentScene} `);
        if (Actions.currentScene !== 'home') {
          return false;
        }
        BackHandler.exitApp();
        return true;
      });
    } else {
      console.log(`IOS backButtonListener Actions.currentScene:${Actions.currentScene} `);
    }
  }
  componentWillUnmount() {
    this.backButtonListener.remove();
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
