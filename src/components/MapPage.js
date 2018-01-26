/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarker from './MapMarker';

// const originShift = 2 * Math.PI * 6378137 / 2.0;

const originShift = (2 * Math.PI * 6378137) / 2.0;
const typeLocal = require('./common/localTypes.json');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

class MapPage extends Component {
  state={
    region: new MapView.AnimatedRegion({
      latitude: 46.99179,
      latitudeDelta: 0.1,
      longitude: 6.931,
      longitudeDelta: 0.1,
    }),
    mapMarkers: [],
    maplocals: [],
  }
  componentDidMount() {
    this.renderBuildings();
  }

  shouldComponentUpdate() {
    return true;
  }

  mapReady = () => {
    // this.renderLocals();
    this.renderBuildings();
  }
  toWebMercatorY = (latitude) => {
    let lat = (latitude / originShift) * 180.0;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);
    return lat;
  }

  // below formula to project a point to a coordinate
  toWebMercatorX= longitude => (longitude / originShift) * 180.0
  colorByLocType = (id) => {
    const locObj = typeLocal.filter(l => l.id === id);
    return locObj.length > 0 ? locObj[0].color : '#f7f7f7';
  }

  renderLocals = () => {
    const data = this.props.bilune.locals;
    const maplocals = data.map((f, index) => {
      const aLatLng = f.geometry.rings[0].map(p => ({
        latitude: this.toWebMercatorY(p[1]),
        longitude: this.toWebMercatorX(p[0]),
      }));
      const locals = <MapView.Polygon fillColor={this.colorByLocType(f.attributes.LOC_TYPE_ID)}key={`${f.attributes.BAT_ID}_${f.attributes.ETG_ID}_${index}`} coordinates={[...aLatLng]} />;
      return locals;
    });
    // this.setState(() => ({ maplocals }));
  }


  renderBuildings = () => {
    const data = this.props.bilune.buildings;
    const mapMarkers = data.map(f =>
      (<MapMarker
        key={f.id}
        coordinate={{
          latitude: this.toWebMercatorY(f.geometry[0] ? f.geometry[0].y : f.enteries[0].y),
          longitude: this.toWebMercatorX(f.geometry[0] ? f.geometry[0].x : f.enteries[0].x),
        }}
        title={` ${f.abreviation}`}
        description={`${f.adresseLigne1}`}
      />));
    
    this.setState(() => ({ mapMarkers }));
    const { code } = this.props.navigation.state.params;
    const f = this.props.bilune.buildings.filter(b => b.code === code);
    const regionLatitude = this
      .toWebMercatorY(f[0].geometry[0] ? f[0].geometry[0].y : f[0].enteries[0].y);
    const regionLongitude = this
      .toWebMercatorX(f[0].geometry[0] ? f[0].geometry[0].x : f[0].enteries[0].x);

    const region = {
      latitude: regionLatitude,
      latitudeDelta: 0.1,
      longitude: regionLongitude,
      longitudeDelta: 0.1,
    };

    setTimeout(() => {
      this.setState(() => ({ region }));
    }, 500);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView.Animated
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onMapReady={this.mapReady}
          showsCompass
          showsPointsOfInterest
          showsScale
          loadingEnabled
          minZoomLevel={17}
          region={this.state.region}
        >
          { this.state.maplocals }
          { this.state.mapMarkers }
        </MapView.Animated>

      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    person: state.directory.person,
    unit: state.directory.unit,
    bilune: state.bilune,
  });

export default connect(mapStateToProps)(MapPage);
