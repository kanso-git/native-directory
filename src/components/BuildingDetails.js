/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Spinner, Chromatic } from './common';
import { biluneActions } from './actions';
import Building from './Building';


class BuidlingDetails extends Component {
  renderSpinner = () => (
    <View style={{ flex: 1 }}>
      <Chromatic />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  );
   renderBuilding = () => {
     const myBuilding = this.props.bilune.buildings.filter(b => b.id === this.props.bilune.id);
     if (myBuilding && myBuilding[0] && myBuilding[0].locals) {
       return (
         <View style={{ flex: 1 }}>
           <Building />
         </View>
       );
     }
     this.props.loadAllBuildingData(this.props.bilune.id);
     return this.renderSpinner();
   }
   render() {
     return this.props.bilune.state !== 'BDL_LOADED' ? this.renderSpinner() : this.renderBuilding();
   }
}

const mapStateToProps = state => (
  {
    bilune: state.bilune,
  });

export default connect(mapStateToProps, { ...biluneActions })(BuidlingDetails);
