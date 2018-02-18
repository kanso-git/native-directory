/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Spinner, Chromatic } from './common';
import { biluneActions } from './actions';
import Local from './Local';

class LocalDetails extends Component {
  componentDidMount() {
    this.props.loadAllLocalData(this.props.bilune.locId);
  }
  renderSpinner = () => (
    <View style={{ flex: 1 }}>
      <Chromatic />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  );
  renderLocal = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Local />
    </View>
  )
  render() {
    return (this.props.bilune.state !== 'BDL_LOADED' || !this.props.reservations[this.props.bilune.locId]) ?
      this.renderSpinner() : this.renderLocal();
  }
}

const mapStateToProps = state => (
  {
    bilune: state.bilune,
    reservations: state.bilune.reservations,
  });

export default connect(mapStateToProps, { ...biluneActions })(LocalDetails);
