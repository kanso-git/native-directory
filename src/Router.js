import React from 'react';
import { Scene, Router, Stack, Actions } from 'react-native-router-flux';

import Home from './components/Home';
import MemberDetails from './components/MemberDetails';
import UnitDetails from './components/UnitDetails';


const RouterComponent = () => (
  <Router >
    <Stack key="root" hideNavBar>
      <Scene key="main" >
        <Scene
          key="home"
          component={Home}
          title="Annuaire"
        />
        <Scene
          key="memberDetails"
          component={MemberDetails}
          title="Détails de la personne"
        />
        <Scene
          key="unitDetails"
          component={UnitDetails}
          title="Détails unité"
        />
      </Scene>
    </Stack>
  </Router>
);

export default RouterComponent;
