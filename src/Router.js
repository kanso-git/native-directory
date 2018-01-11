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
          title={I18n.t('global.title', { locale: props.language })}
        />
        <Scene
          key="memberDetails"
          component={MemberDetails}
          title="Détails de la personne"
          title={I18n.t('person.pageTitle', { locale: props.language })}
        />
        <Scene
          key="unitDetails"
          component={UnitDetails}
          title={I18n.t('unit.pageTitle', { locale: props.language })}
        />
      </Scene>
    </Stack>
  </Router>
);

export default RouterComponent;
