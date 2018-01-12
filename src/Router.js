import React from 'react';
import { Scene, Router, Stack, Actions } from 'react-native-router-flux';
import I18n from 'react-native-i18n';
import Home from './components/Home';
import MemberDetails from './components/MemberDetails';
import UnitDetails from './components/UnitDetails';


const RouterComponent = (props) => (
  <Router >
    <Stack key="root" hideNavBar>
      <Scene key="main" >
        <Scene
          key="home"
          component={Home}
          title={I18n.t('global.title')}
          titleStyle={{alignSelf: 'center'}} 
        />
        <Scene
          key="memberDetails"
          backTitle=" "
          component={MemberDetails}
          title={I18n.t('person.pageTitle')}
        />
        <Scene
          key="unitDetails"
          backTitle=" "
          component={UnitDetails}
          title={I18n.t('unit.pageTitle')}
        />
      </Scene>
    </Stack>
  </Router>
);

export default RouterComponent;
