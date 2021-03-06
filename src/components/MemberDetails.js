/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { PERSON_SCREEN } from 'react-native-dotenv';
import { Spinner, Chromatic, utile } from './common';
import { authActions, searchActions } from './actions';
import Person from './Person';


class MemberDetails extends Component {
  componentWillMount() {
    const { id } = this.props.navigation.state.params.memberDetails;
    const { secret } = this.props.auth;
    this.props.getPersonDetail(id, secret);
  }

  componentDidMount() {
    const { screens } = utile.gaParams;
    utile.trackScreenView(screens.person);
  }
  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { id } = nextProps.navigation.state.params.memberDetails;

    if (secret == null && (retry > 0 && screen === PERSON_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === PERSON_SCREEN)) {
      this.props.getPersonDetail(id, secret);
      this.props.resetRetry();
    }
  }
  renderSpinner = () => (
    <View style={{ flex: 1 }}>
      <Chromatic />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  );
  renderMember = () => (this.props.person ?
    <View>
      <Chromatic />
      <ScrollView><Person person={this.props.person} /></ScrollView>
    </View> : <View />);
  render() {
    return (this.props.spinner ? this.renderSpinner() : this.renderMember());
  }
}

const mapStateToProps = state => (
  {
    person: state.directory.person,
    spinner: state.directory.spinner,
    auth: state.auth,
    memberDetails: state.memberDetails,
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(MemberDetails);
