/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { Spinner, Chromatic } from './common';
import { biluneActions } from './actions';
import Building from './Building';


class BuidlingDetails extends Component {
  state={
    spinner: true,
  }
  stopSpinner= () => {
    this.setState(() => ({
      spinner: false,
    }));
  }
  renderSpinner = () => (
    <View style={{ flex: 1 }}>
      <Chromatic />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  );
   renderBuilding = buildingObject => (
     <View>
       <Chromatic />
       <ScrollView>
         <Building building={buildingObject} />
       </ScrollView>
     </View>);
   render() {
     const myBuilding = this.props.bilune.buildings.filter(b => b.id === this.props.bilune.id);
     const building = myBuilding[0];

     return this.renderBuilding(building);
   }
}

const mapStateToProps = state => (
  {
    bilune: state.bilune,
  });

export default connect(mapStateToProps, { ...biluneActions })(BuidlingDetails);
