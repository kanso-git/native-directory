/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Spinner, Chromatic, utile } from './common';
import PersonCoursList from './PersonCoursList';
import { pidhoActions } from './actions';
import * as logging from './common/logging';

class PersonCoursDetails extends Component {
  componentDidMount() {
    const { screens } = utile.gaParams;
    utile.trackScreenView(screens.cours);
    const {id} = this.props.navigation.state.params.person;
    this.loadCourseByBipeId(id);
  }
  loadCourseByBipeId = (bipeId)=>{
    const { courses } = this.props;
    if (courses && courses[bipeId]) {
      logging.log(` don't load the course list for bipeId${bipeId}`);
    } else {
      this.props.loadCoursesbyBipeId(bipeId);
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

export default connect(mapStateToProps, { ...pidhoActions })(PersonCoursDetails);
