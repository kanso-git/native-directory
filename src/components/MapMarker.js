/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import MapView from 'react-native-maps';
import * as _ from 'lodash';

export default class MapMarker extends PureComponent {
  state = {
    tracksViewChanges: true,
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setState(() => ({
        tracksViewChanges: true,
      }));
    }
  }
  componentDidUpdate() {
    if (this.state.tracksViewChanges) {
      this.setState(() => ({
        tracksViewChanges: false,
      }));
    }
  }
  render() {
    return (
      <MapView.Marker
        tracksViewChanges={this.state.tracksViewChanges}
        {...this.props}
      >{this.props.children}
      </MapView.Marker>
    );
  }
}
