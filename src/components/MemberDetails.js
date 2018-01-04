/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { PERSON_SCREEN } from 'react-native-dotenv';
import { authActions, searchActions } from './actions';
import Person from './Person';


class MemberDetails extends Component {
  componentWillMount() {
    console.log('------------ MemberDetail componentWillMount ------------------');
    const { id } = this.props.navigation.state.params.memberDetails;
    const { secret } = this.props.auth;
    this.props.getPersonDetail(id, secret);
  }

  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { id } = nextProps.navigation.state.params.memberDetails;
    console.log(`------------ MemberDetail componentWillReceiveProps 
      secret:${secret}, retry:${retry}, screen:${screen}`);
    if (secret == null && (retry > 0 && screen === PERSON_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === PERSON_SCREEN)) {
      this.props.getPersonDetail(id, secret);
      this.props.resetRetry();
    }
  }
  render() {
    return this.props.person ?
      <ScrollView><Person person={this.props.person} /></ScrollView> : <View />;
  }
}

const mapStateToProps = state => (
  {
    person: state.directory.person,
    auth: state.auth,
    memberDetails: state.memberDetails,
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(MemberDetails);