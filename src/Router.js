import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Scene, Router, Stack, Actions } from 'react-native-router-flux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-fa-icons';
import * as utile from './components/common/utile';
import Home from './components/Home';
import MemberDetails from './components/MemberDetails';
import UnitDetails from './components/UnitDetails';
import BuildingDetails from './components/BuildingDetails';
import LocalDetails from './components/LocalDetails';
import PersonCoursDetails from './components/PersonCoursDetails';
import MapPage from './components/MapPage';
import AppInfosPage from './components/AppInfosPage';
import LocalPersons from './components/LocalPersons';
import NetworkError from './components/NetworkError';

import SampleParallaxView from './components/SampleParallaxView';

const styles = StyleSheet.create({
  navStyle: {
    backgroundColor: '#034d7c',
  },
  leftImgStyle: {
    width: 75,
    height: 35,
    resizeMode: Image.resizeMode.contain,
    paddingBottom: 15,
  },
  leftInfoImgStyle: {
    color: 'white',
    marginRight: 10,
    fontSize: 30,
  },
  titleStyleAndroid: {
    alignSelf: 'center',
    marginRight: 75,
    color: 'white',
  },
  titleStyle: {
    alignSelf: 'center',
    color: 'white',
  },
});
const base64Icon = 'data:image/png;base64,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';

const backToHome = () => {
  const { categories, actions } = utile.gaParams;
  utile.trackEvent(categories.usr, actions.home);
  Actions.reset('main', { reset: true });
};
const openAppInfos = () => {
  const { screens } = utile.gaParams;
  utile.trackScreenView(screens.info);
  Actions.push('appInfosPage');
};
const RouterComponent = () => (
  <Router >
    <Stack key="root" hideNavBar>
      <Scene key="main" >
        <Scene
          renderLeftButton={<Image
            style={styles.leftImgStyle}
            source={{ uri: base64Icon }}
          />}
          key="home"
          component={Home}
          title={I18n.t('global.title')}
          titleStyle={styles.titleStyle}
          navigationBarStyle={styles.navStyle}
          renderRightButton={
            <TouchableOpacity onPress={() => openAppInfos()}>
              <Icon
                style={styles.leftInfoImgStyle}
                name="info-circle"
              />
            </TouchableOpacity>
          }
        />
        <Scene
          key="appInfosPage"
          backTitle=" "
          component={AppInfosPage}
          title={I18n.t('infos.pageTitle')}
          titleStyle={styles.titleStyle}
          navigationBarStyle={styles.navStyle}
          backButtonTintColor="white"
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
        }
        />
        <Scene
          key="memberDetails"
          backTitle=" "
          component={MemberDetails}
          title={I18n.t('person.pageTitle')}
          titleStyle={styles.titleStyle}
          navigationBarStyle={styles.navStyle}
          backButtonTintColor="white"
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
          }
        />
        <Scene
          key="unitDetails"
          backTitle=" "
          component={UnitDetails}
          title={I18n.t('unit.pageTitle')}
          titleStyle={styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
          }
        />

        <Scene
          key="buildingDetails"
          backTitle=" "
          component={BuildingDetails}
          title={I18n.t('building.pageTitle')}
          titleStyle={styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
          }
        />

        <Scene
          key="localDetails"
          backTitle=" "
          component={LocalDetails}
          title={I18n.t('local.pageTitle')}
          titleStyle={styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
          }
        />

        <Scene
          key="personCoursDetails"
          backTitle=" "
          component={PersonCoursDetails}
          title={I18n.t('person.coursPage')}
          titleStyle={styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
        }
        />


        <Scene
          key="mapPage"
          backTitle=" "
          component={MapPage}
          title={I18n.t('mapPage.pageTitle')}
          titleStyle={styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
          rightButtonImage={base64Icon}
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
          }
        />

        <Scene
          key="sampleParallaxView"
          backTitle=" "
          component={SampleParallaxView}
          title="SampleParallaxView"
          titleStyle={Platform.OS === 'android' ? styles.titleStyleAndroid : styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
        />

        <Scene
          key="localPersons"
          backTitle=" "
          component={LocalPersons}
          title={I18n.t('local.title')}
          titleStyle={styles.titleStyle}
          backButtonTintColor="white"
          navigationBarStyle={styles.navStyle}
          renderRightButton={
            <TouchableOpacity onPress={() => backToHome()}>
              <Image
                style={styles.leftImgStyle}
                source={{ uri: base64Icon }}
              />
            </TouchableOpacity>
          }
        />

      </Scene>
      <Scene key="error" >
        <Scene
          renderLeftButton={<Image
            style={styles.leftImgStyle}
            source={{ uri: base64Icon }}
          />}
          key="networkError"
          back={false}
          component={NetworkError}
          title={I18n.t('offline.pageTitle')}
          titleStyle={Platform.OS === 'android' ? styles.titleStyleAndroid : styles.titleStyle}
          navigationBarStyle={styles.navStyle}
        />
      </Scene>
    </Stack>
  </Router>
);

export default RouterComponent;
