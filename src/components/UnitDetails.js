/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { UNIT_SCREEN, LOGGING } from 'react-native-dotenv';
import { authActions, searchActions } from './actions';
import { Spinner, Chromatic } from './common';
import Unit from './Unit';


class UnitDetails extends Component {
  componentWillMount() {
    if ((parseInt(LOGGING, 10))) console.log('------------ MemberDetail componentWillMount ------------------');
    const { id } = this.props.navigation.state.params.unitDetails;
    const { secret } = this.props.auth;
    this.props.getUnitDetail(id, secret);
  }

  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { id } = nextProps.navigation.state.params.unitDetails;
  
    if (secret == null && (retry > 0 && screen === UNIT_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === UNIT_SCREEN)) {
      this.props.getUnitDetail(id, secret);
      this.props.resetRetry();
    }
  }
   renderSpinner = () => (
     <View>
       <Chromatic />
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spinner /></View>
     </View>
   );
   renderUnit = () => (this.props.unit ?
     <View>
       <Chromatic />
       <ScrollView>
         <Unit unit={this.props.unit} unitMembers={this.props.unit.unitMembers} />
       </ScrollView>
     </View> : <View />);
   render() {
     return this.props.spinner ? this.renderSpinner() : this.renderUnit();
   }
}

const mapStateToProps = state => (
  {
    unit: state.directory.unit,
    spinner: state.directory.spinner,
    auth: state.auth,
    unitDetails: state.unitDetails,
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(UnitDetails);
