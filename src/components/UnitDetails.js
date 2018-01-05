/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { UNIT_SCREEN } from 'react-native-dotenv';
import { authActions, searchActions } from './actions';
import Unit from './Unit';


class UnitDetails extends Component {
  componentWillMount() {
    console.log('------------ MemberDetail componentWillMount ------------------');
    const { id } = this.props.navigation.state.params.unitDetails;
    const { secret } = this.props.auth;
    this.props.getUnitDetail(id, secret);
  }

  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { id } = nextProps.navigation.state.params.unitDetails;
    console.log(`------------ UnitDetails componentWillReceiveProps 
      secret:${secret}, retry:${retry}, screen:${screen}`);
    if (secret == null && (retry > 0 && screen === UNIT_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === UNIT_SCREEN)) {
      this.props.getUnitDetail(id, secret);
      this.props.resetRetry();
    }
  }
  render() {
    return this.props.unit ?
      <ScrollView><Unit unit={this.props.unit} unitMembers={this.props.unit.unitMembers}/></ScrollView> : <View />;
  }
}

const mapStateToProps = state => (
  {
    unit: state.directory.unit,
    auth: state.auth,
    unitDetails: state.unitDetails,
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(UnitDetails);
