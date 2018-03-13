/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Spinner, Chromatic } from './common';
import PersonCoursList from './PersonCoursList';

class PersonCoursDetails extends Component {
  renderSpinner = () => (
    <View style={{ flex: 1 }}>
      <Chromatic />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  );
  renderCoursList = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <PersonCoursList {...this.props.navigation.state.params.person} />
    </View>
  )
  render() {
    const { person } = this.props.navigation.state.params;
    return (this.props.bilune.state !== 'BDL_LOADED' || !this.props.courses[person.id]) ?
      this.renderSpinner() : this.renderCoursList();
  }
}

const mapStateToProps = state => (
  {
    bilune: state.bilune,
    courses: state.pidho.courses,
  });

export default connect(mapStateToProps)(PersonCoursDetails);
