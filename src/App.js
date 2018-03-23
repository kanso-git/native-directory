/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
import React, { Component } from 'react';
import { View, Text, Platform, BackHandler, NetInfo, StyleSheet, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import { Actions } from 'react-native-router-flux';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-fa-icons';
import { GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import I18n from './I18n/I18n';
import { authActions, biluneActions } from './components/actions';
import reducers from './components/reducers';
import * as utile from './components/common/utile';
import Router from './Router';
import * as types from './components/actions/Types';
import * as logging from './components/common/logging';

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
});
const APP_INTRO_KEY = 'showAppIntro';
const APP_INTRO_SHOW = 'show';
const APP_INTRO_HIDE = 'hide';
const slides = [
  {
    key: 'search',
    title: `${I18n.t('intro.search.title')}`,
    text: `${I18n.t('intro.search.text')}`,
    icon: 'search',
    colors: ['#0083b0', '#056734'],
  },
  {
    key: 'event',
    title: `${I18n.t('intro.event.title')}`,
    text: `${I18n.t('intro.event.text')}`,
    icon: 'graduation-cap',
    colors: ['#056734', '#b70f1d'],
  },
  {
    key: 'map',
    title: `${I18n.t('intro.map.title')}`,
    text: `${I18n.t('intro.map.text')}`,
    icon: 'map-marker',
    colors: ['#b70f1d', '#eb9800', '#904c88'],
  },
];
class App extends Component {
  state={
    showAppIntro: null,
  }
  componentWillMount() {
    AsyncStorage.getItem(APP_INTRO_KEY).then((v) => {
      if (v == null) {
        this.setState(() => ({ showAppIntro: APP_INTRO_SHOW }));
      } else {
        this.setState(() => ({ showAppIntro: APP_INTRO_HIDE }));
      }
    });
  }
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
      logging.info(`Network isConnected:${isConnected}, error:${error}, service:${service} `);
      if (!isConnected) {
        const { screens } = utile.gaParams;
        utile.trackScreenView(screens.network);
        Actions.reset('error');
        this.handleFirstConnectivityChange(false);
      }
    });
    try {
      this.initializeApp();
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', () => {
          if (Actions.currentScene === 'home' || Actions.currentScene === 'networkError') {
            logging.info(`Exit APP  android backButtonListener currentScene:${Actions.currentScene}`);
            BackHandler.exitApp();
            return true;
          }
          logging.info(`Should not Exit APP  currentScene:${Actions.currentScene}`);
          Actions.pop();
          return true;
        });
      }
    } catch (e) {
      logging.warn(`error occured in App.js, the error is:${e}`);
    }
    const { categories, actions } = utile.gaParams;
    utile.trackEvent(categories.app, actions.lapp);
    // The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
    GoogleAnalyticsSettings.setDispatchInterval(30);
    // Setting `dryRun` to `true` lets you test tracking without sending data to GA
    // GoogleAnalyticsSettings.setDryRun(true);
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
      const { screens } = utile.gaParams;
      utile.trackScreenView(screens.network);
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
            logging.info(' connection is back clear the timeout ');
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
  handleDone = () => {
    logging.info('Intro handleDone pressed!');
    AsyncStorage.setItem(APP_INTRO_KEY, APP_INTRO_HIDE);
    this.setState(() => ({ showAppIntro: APP_INTRO_HIDE }));
  }
  handleSkip = () => {
    logging.info('Intro handleSkip pressed!');
    this.setState(() => ({ showAppIntro: APP_INTRO_HIDE }));
  }
  renderIntroItem = props => (
    <LinearGradient
      style={[styles.mainContent, {
        paddingTop: props.topSpacer,
        paddingBottom: props.bottomSpacer,
        width: props.width,
        height: props.height,
      }]}
      colors={props.colors}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 0.1, y: 1 }}
    >
      <Icon
        style={{
          backgroundColor: 'transparent', color: 'white', fontSize: 200,
        }}
        name={props.icon}
      />
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </LinearGradient>
  );

  renderIntro = () => (
    <AppIntroSlider
      slides={slides}
      renderItem={this.renderIntroItem}
      bottomButton
      showSkipButton
      onDone={this.handleDone}
      onSkip={this.handleSkip}
      skipLabel={I18n.t('intro.btn.skip')}
      doneLabel={I18n.t('intro.btn.done')}
      nextLabel={I18n.t('intro.btn.next')}
    />
  );
  renderMainApp = myStore => (
    <Provider store={myStore} >
      <View style={styles.full}>
        <Router />
      </View>
    </Provider>
  );
  render() {
    if (this.myStore === null) {
      this.myStore = createStore(reducers, applyMiddleware(thunk));
    }
    logging.info(`showAppIntro :${this.state.showAppIntro}`);
    // AsyncStorage.removeItem(APP_INTRO_KEY);
    return this.state.showAppIntro === 'show' ? this.renderIntro() : this.renderMainApp(this.myStore);
  }
}

export default App;
