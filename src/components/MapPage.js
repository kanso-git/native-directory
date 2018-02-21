/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import MapMarker from './MapMarker';
import CustomCallout from './CustomCallout';
import * as mapHelper from './common/mapHelper';

// const originShift = 2 * Math.PI * 6378137 / 2.0;
/*
latitude: 46.99179,
latitudeDelta: 0.1,
longitude: 6.931,
longitudeDelta: 0.1,
*/

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
  customView: {
    width: 140,
    height: 100,
  },
});

class MapPage extends Component {
  state={
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: MAP_LATITUDE_DELTA,
      longitudeDelta: MAP_LONGITUDE_DELTA,
    },
    mapMarkers: [],
    maplocals: [],
    localMarker: null,
  }

  componentDidMount() {
    this.renderBuildingsOrLacals();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bilune.id !== this.props.bilune.id) {
      this.zoomToBuilding(nextProps.bilune.id);
    }
  }
  /*
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  } */
  getMapLocals = data =>
    data.map((f) => {
      const aLatLng = f.geometry.rings[0].map(p => ({
        latitude: mapHelper.toWebMercatorY(p[1]),
        longitude: mapHelper.toWebMercatorX(p[0]),
      }));
      const locals = (
        <MapView.Polygon
          id={f.attributes.LOC_ID}
          fillColor={mapHelper.colorByLocType(f.attributes.LOC_TYPE_ID)}
          key={f.attributes.OBJECTID}
          coordinates={[...aLatLng]}
          tappable
          onPress={() => this.handleOnLocalPress(f.attributes.LOC_ID)}
        />
      );
      return locals;
    });

  generateMarker= (bat, zoomId) => {
    if (bat.id === zoomId) {
      return (<MapMarker
        key={bat.id}
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
  handleOnLocalPress= (locId) => {
    // console.log(`handleOnLocalPress target :${e.target}`);
    const targetLocal = this.props.bilune.locals
      .find(l => l.attributes.LOC_ID === locId);
    this.showLocalMarker(targetLocal);
  }
  mapReady = () => {
    // this.renderLocals();
    this.renderBuildingsOrLacals();
  }

    handleOnRegionChange = (newRegion) => {
      // console.log(`handleOnRegionChange is called with ${JSON.stringify(newRegion, null, 5)}`);
    }
    zoomToBuilding = (id) => {
      const f = this.props.bilune.buildings.filter(b => b.id === id);
      const regionLatitude = mapHelper.toWebMercatorY(f[0].enteries[0].y);
      const regionLongitude = mapHelper.toWebMercatorX(f[0].enteries[0].x);

      const region = {
        latitude: regionLatitude,
        latitudeDelta: MAP_LATITUDE_DELTA,
        longitude: regionLongitude,
        longitudeDelta: MAP_LONGITUDE_DELTA,
      };
      const data = this.props.bilune.buildings;
      const mapMarkers = data.map(b => this.generateMarker(b, id));
      this.setState(() => ({ region, mapMarkers }));
    }

    renderOpenMapButton = () => (
      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => Actions.push('mapPage')}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>&#10063;</Text>
      </TouchableOpacity>
    )
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
  showLocalMarker = (targetLocal) => {
    const targetCoordinates = mapHelper.polygonCenter(targetLocal.geometry.rings[0]);
    const localMarker = this.renderCustomMarker(targetCoordinates);
    this.setState(state => ({ ...state, localMarker }));
    setTimeout(() => this.marker1.showCallout(), 250);
  }
  renderMainLocals = (data) => {
    const region = mapHelper.getCenteredRegionByFloor(data.mainLocals);
    const maplocals = this.getMapLocals(data.mainLocals);
    const targetLocId = this.props.bilune.locId;
    if (targetLocId != null) {
      console.log(`renderCustomMarker for locId:${targetLocId}`);
      const targetLocal = data.mainLocals
        .find(l => l.attributes.LOC_ID === targetLocId);
      this.showLocalMarker(targetLocal);
    }
    this.setState(state => ({ ...state, maplocals, region }));
  }
  renderOtherLocals = (data) => {
    const maplocals = this.getMapLocals(data.otherLocals);
    const allLocals = [...this.state.maplocals, ...maplocals];

    this.setState(state => ({ ...state, maplocals: allLocals }));
  }
  renderLocals = () => {
    const data = mapHelper.getVisibleLocals(this.props.bilune);
    this.renderMainLocals(data);
    setTimeout(() => this.renderOtherLocals(data), 500);
  }

  renderCustomMarker = (localCoordinate) => {
    console.log(`renderCustomMarker for localCoordinate:${localCoordinate}`);
    return (
      <Marker
        ref={(ref) => { this.marker1 = ref; }}
        coordinate={localCoordinate}
        calloutOffset={{ x: -8, y: 28 }}
        calloutAnchor={{ x: 0.5, y: 0.4 }}
      >
        <Callout tooltip style={styles.customView}>
          <CustomCallout>
            <Text style={{ color: 'white' }}>This is a custom callout bubble view</Text>
          </CustomCallout>
        </Callout>
      </Marker>
    );
  }
  renderBuildingsOrLacals = () => {
    if (Actions.currentScene !== 'mapPage') {
      this.renderBuildings();
    } else {
      this.renderLocals();
      // setTimeout(() => this.fitToAllLocals(), 5000);
      // const zoomId = this.props.bilune.id;
      // this.zoomToBuilding(zoomId);
    }
  }
  render() {
    return (
      <View style={styles.container}>

        <MapView
          ref={(ref) => { this.map = ref; }}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onMapReady={this.mapReady}
          showsCompass
          showsPointsOfInterest
          showsScale
          loadingEnabled
          cacheEnabled
          showsIndoorLevelPicker
          onRegionChange={this.handleOnRegionChange}
          region={this.state.region}
        >
          { this.state.maplocals }
          { this.state.mapMarkers }
          { this.state.localMarker }
        </MapView>
        {Actions.currentScene !== 'mapPage' && this.renderOpenMapButton()}
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    bilune: state.bilune,
  });

export default connect(mapStateToProps)(MapPage);
