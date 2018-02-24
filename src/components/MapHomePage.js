/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import MapMarker from './MapMarker';
import * as mapHelper from './common/mapHelper';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 46.99179;
const LONGITUDE = 6.931;
const MAP_LATITUDE_DELTA = 0.003;
const MAP_LONGITUDE_DELTA = MAP_LATITUDE_DELTA * ASPECT_RATIO;


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
  openBtn: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 6,
    borderRadius: 10,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
class MapHomePage extends Component {
  state={
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: MAP_LATITUDE_DELTA,
      longitudeDelta: MAP_LONGITUDE_DELTA,
    },
    mapMarkers: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.zoomToBuilding(nextProps.id);
    }
  }

  generateMarker= (bat, zoomId) => {
    if (bat.id === zoomId) {
      return (<MapMarker
        key={bat.id}
        ref={(ref) => { this.marker = ref; }}
        pinColor="#034d7c"
        coordinate={{
       latitude: mapHelper.toWebMercatorY(bat.enteries[0].y),
       longitude: mapHelper.toWebMercatorX(bat.enteries[0].x),
     }}
        title={` ${bat.abreviation}`}
        description={`${bat.adresseLigne1}`}
      />);
    }
    return (<MapMarker
      key={bat.id}
      coordinate={{
          latitude: mapHelper.toWebMercatorY(bat.enteries[0].y),
          longitude: mapHelper.toWebMercatorX(bat.enteries[0].x),
        }}
      title={` ${bat.abreviation}`}
      description={`${bat.adresseLigne1}`}
    />);
  }

  mapReady = () => {
    console.log(' mapHomePage map is ready ....');
    this.renderBuildings();
  }


    zoomToBuilding = (id) => {
      const f = this.props.buildings.filter(b => b.id === id);
      const regionLatitude = mapHelper.toWebMercatorY(f[0].enteries[0].y);
      const regionLongitude = mapHelper.toWebMercatorX(f[0].enteries[0].x);
      const region = {
        latitude: regionLatitude,
        latitudeDelta: MAP_LATITUDE_DELTA,
        longitude: regionLongitude,
        longitudeDelta: MAP_LONGITUDE_DELTA,
      };
      const data = this.props.buildings;
      const mapMarkers = data.map(b => this.generateMarker(b, id));
      this.setState(() => ({ region, mapMarkers }));
    }

    renderBuildings = () => {
      const data = this.props.buildings;
      let zoomId = 0;
      if (this.props.id != null) {
        zoomId = this.props.id;
        this.zoomToBuilding(zoomId);
      } else {
        zoomId = this.props.buildings[0].id;
        this.zoomToBuilding(zoomId);
      }
      const mapMarkers = data.map(f => this.generateMarker(f, zoomId));
      this.setState(() => ({ mapMarkers }));
    }

  renderOpenMapButton = () => (
    <TouchableOpacity
      style={styles.openBtn}
      onPress={() => Actions.push('mapPage')}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>&#10063;</Text>
    </TouchableOpacity>
  )

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onMapReady={this.mapReady}
          showsCompass
          showsScale
          loadingEnabled
          cacheEnabled
          showsIndoorLevelPicker
          region={this.state.region}
        >
          { this.state.mapMarkers }
        </MapView>
        { this.renderOpenMapButton()}
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    buildings: state.bilune.buildings,
    id: state.bilune.id,
  });

export default connect(mapStateToProps)(MapHomePage);
