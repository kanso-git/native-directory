/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.bilune.id !== this.props.bilune.id) {
      this.zoomToBuilding(nextProps.bilune.id);
    }
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


  zoomToBuilding = (id) => {
    const f = this.props.bilune.buildings.filter(b => b.id === id);
    const regionLatitude = this
      .toWebMercatorY(f[0].enteries[0].y);
    const regionLongitude = this
      .toWebMercatorX(f[0].enteries[0].x);

    const region = {
      latitude: regionLatitude,
      latitudeDelta: 0.003,
      longitude: regionLongitude,
      longitudeDelta: 0.003,
    };
    const data = this.props.bilune.buildings;
    const mapMarkers = data.map(f => this.generateMarker(f, id));
    this.setState(() => ({ region, mapMarkers }));
  }
  handleOnRegionChange = (newRegion) => {
    console.log(`handleOnRegionChange is called with ${JSON.stringify(newRegion, null, 5)}`);
  }
  generateMarker= (bat, zoomId) => {
    if (bat.id === zoomId) {
      return (<MapMarker
        key={bat.id}
        pinColor="#034d7c"
        coordinate={{
       latitude: this.toWebMercatorY(bat.enteries[0].y),
       longitude: this.toWebMercatorX(bat.enteries[0].x),
     }}
        title={` ${bat.abreviation}`}
        description={`${bat.adresseLigne1}`}
      />);
    }
    return (<MapMarker
      key={bat.id}
      coordinate={{
          latitude: this.toWebMercatorY(bat.enteries[0].y),
          longitude: this.toWebMercatorX(bat.enteries[0].x),
        }}
      title={` ${bat.abreviation}`}
      description={`${bat.adresseLigne1}`}
    />);
  }

  renderBuildings = () => {
    const data = this.props.bilune.buildings;
    let zoomId = 0;
    if (this.props.bilune.id != null) {
      zoomId = this.props.bilune.id;
      this.zoomToBuilding(zoomId);
    } else {
      zoomId = this.props.bilune.buildings[0].id;
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
          onRegionChange={this.handleOnRegionChange}
          region={this.state.region}
        >
          { this.state.maplocals }
          { this.state.mapMarkers }
        </MapView.Animated>
        {Actions.currentScene !== 'mapPage' && this.renderOpenMapButton()}
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
