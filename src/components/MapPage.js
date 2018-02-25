/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
/* eslint global-require: "off" */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import * as ldash from 'lodash';
import { biluneActions } from './actions';
import { Spinner } from './common';
import CustomCallout from './CustomCallout';
import * as mapHelper from './common/mapHelper';
import MapPolygon from './MapPolygon';
import MapMarker from './MapMarker';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 46.988;
const LONGITUDE = 6.931;
const LATITUDE_DELTA = 0.07482692805103852;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const initialRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
let data = [];
let zoomLevel0 = 18;
let region = initialRegion;
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
    width,
    height,
    flex: 1,
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
    maplocals: [],
    localMarker: null,
    showSpinner: false,
    mapMarkers: null,
  }

  // called every time you access this component
  componentWillMount() {
    /*
     the region for the selected Building is calculated
    */
    region = mapHelper.getRegionForSelectedBat({ ...this.props });
  }

  // called every time you access this component right after componentWillMount
  componentDidMount() {
    /*
    when the user navigates to map after the locals get full loded
    the bilueState will be BDL_LOADED
    */
    if (this.props.biluneState === 'BDL_LOADED') {
      this.renderMapData();
    }
  }
  // called each time component revives new states or props values
  componentWillReceiveProps(nextProps) {
    /*
    when the user navigates to map before the locals are full loded
    the bilueState will be different to BDL_LOADED, but once locals
    are get loaded the componentWillReceiveProps will be called with
    BDL_LOADED as new state value
    */
    if (nextProps.biluneState !== this.props.biluneState) {
      this.renderMapData();
    }
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {
    const update = ldash.isEqual(nextState.maplocals, this.state.maplocals);
    debugger
    return !update;
  }
  */

  // called when about to leave the component
  componentWillUnmount() {
    region = initialRegion;
  }

  /*
 called on onLayout mapView method, to avoid carshing th app mainly on android
  */
onLayoutMapReady = () => {
  const myMap = this.map;
  if (myMap) {
    myMap.animateToRegion(region, 0);
  }
}

onLongPress = (c) => {
  const { coordinate } = c.nativeEvent;
  const inside = require('point-in-polygon');
  const allLocals = [...data.mainLocals, ...data.otherLocals];
  const targetPolygon = allLocals.find((f) => {
    const polygon = f.geometry
      .rings[0].map(p => [mapHelper.toWebMercatorX(p[0]), mapHelper.toWebMercatorY(p[1])]);
    const insidePoly = inside([coordinate.longitude, coordinate.latitude], polygon);
    if (insidePoly) {
      return true;
    }
    return false;
  });
  if (targetPolygon) {
    this.handleOnLocalPress(targetPolygon.attributes.LOC_ID, coordinate);
  }
}
// helper method to return an array of local polygon
getMapLocals = dataLocals =>
  dataLocals.map((f) => {
    const aLatLng = f.geometry.rings[0].map(p => ({
      latitude: mapHelper.toWebMercatorY(p[1]),
      longitude: mapHelper.toWebMercatorX(p[0]),
    }));
    const locals = (
      <MapPolygon
        fillColor={mapHelper.colorByLocType(f.attributes.LOC_TYPE_ID)}
        key={f.attributes.OBJECTID}
        coordinates={[...aLatLng]}
      />
    );
    return locals;
  });


getCalloutInfo = (occupents, targetLocal) => {
  console.log(`getCalloutInfo localId:${occupents}`);

  let occupentsString = `Local: ${targetLocal.attributes.LOC_CODE}`;
  if (occupents.length > 0) {
    occupents.forEach((o) => {
      occupentsString += `
${o.nom} ${o.prenom.slice(0, 1)}`;
    });
  } else {
    occupentsString += `
Type: ${targetLocal.attributes.LOC_TYPE_DESIGNATION}`;
  }

  return occupentsString;
}

    handleRegionChange = (trackRegion) => {
      region = trackRegion;
      const zoomLevel = mapHelper.getZoomLevel(region);
      if (zoomLevel0 !== zoomLevel) {
        data = mapHelper.getVisibleLocals({ ...this.props }, region);
        this.renderMapData();
      }
    }

    handleRegionChangeComplete = (trackRegion) => {
      region = trackRegion;
      data = mapHelper.getVisibleLocals({ ...this.props }, region);
      this.renderMapData();
    }

    loadOccupent = async (targetLocal) => {
      const localId = targetLocal.attributes.LOC_ID;
      this.setState(() => ({ showSpinner: true }));
      const list = await this.props.loadOccupentsPerLocal(localId);
      this.setState(() => ({ showSpinner: false }));
      return list;
    }

    handleOnLocalPress= (clickedLocId, coordinates) => {
      console.log(`handleOnLocalPress target :${clickedLocId}`);
      const targetLocal = this.props.locals
        .find(l => l.attributes.LOC_ID === clickedLocId);
      this.showLocalMarker(targetLocal, coordinates);
    }

    showLocalMarker = async (targetLocal, coordinates) => {
      this.setState(() => ({ localMarker: null }));
      const list = await this.loadOccupent(targetLocal);
      const targetCoordinates = coordinates || mapHelper
        .polygonCenter(targetLocal.geometry.rings[0]);
      const localMarker = this.renderCustomMarker(targetCoordinates, list, targetLocal);
      this.setState(() => ({ localMarker }));
      setTimeout(() => this.marker1.showCallout(), 250);
    }

 renderVisibleBuildings = () => {
   const { buildings } = this.props;
   const visibleBuildings = buildings.filter(b => mapHelper.buildingInBoundingBox(region, b));
   if (visibleBuildings.length > 0) {
     const mapMarkers = visibleBuildings.map(bat => (<MapMarker
       key={bat.id}
       coordinate={{
           latitude: mapHelper.toWebMercatorY(bat.enteries[0].y),
           longitude: mapHelper.toWebMercatorX(bat.enteries[0].x),
         }}
       title={` ${bat.abreviation}`}
       description={`${bat.adresseLigne1}`}
     />));
     this.setState(() => ({ mapMarkers, localMarker: null, maplocals: null }));
   }
 }

  renderVisibleLocals = () => {
    data = mapHelper.getVisibleLocals({ ...this.props }, region);
    const allLocals = [...data.mainLocals, ...data.otherLocals];
    console.log(`renderVisibleLocals allLocals length:${allLocals.length}`);
    const filteredMaplocals = ldash.uniqWith(allLocals, ldash.isEqual);
    const maplocals = this.getMapLocals(filteredMaplocals);
    console.log(`renderVisibleLocals maplocals length:${maplocals.length}`);
    const targetLocId = this.props.localId;
    if (targetLocId != null) {
      const targetLocal = filteredMaplocals
        .find(l => l.attributes.LOC_ID === targetLocId);
      this.showLocalMarker(targetLocal);
    }
    this.setState(() => ({ maplocals, mapMarkers: null }));
  }
  renderMapData = () => {
    const zoomLevel = mapHelper.getZoomLevel(region);
    zoomLevel0 = zoomLevel;
    console.log(`renderMapData called with zoomLevel:${zoomLevel}`);
    if (zoomLevel > 17) {
      this.renderVisibleLocals();
    } else {
      this.renderVisibleBuildings();
    }
  }

  renderCustomMarker = (localCoordinate, occupents, targetLocal) => (
    <Marker
      ref={(ref) => { this.marker1 = ref; }}
      coordinate={localCoordinate}
      calloutOffset={{ x: -8, y: 28 }}
      calloutAnchor={{ x: 0.5, y: 0.4 }}
    >
      <Callout tooltip style={styles.customView}>
        <CustomCallout>
          <Text style={{ color: 'white', fontSize: 11 }}>{ this.getCalloutInfo(occupents, targetLocal) }</Text>
        </CustomCallout>
      </Callout>
    </Marker>
  )
  renderSpinner = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  );
  renderMap = () => (
    <View style={styles.container}>
      <MapView
        ref={(ref) => { this.map = ref; }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onLayout={this.onLayoutMapReady}
        showsCompass
        initialRegion={region}
        onRegionChange={this.handleRegionChange}
        onRegionChangeComplete={this.handleRegionChangeComplete}
        onLongPress={this.onLongPress}
      >
        {this.state.maplocals}
        {this.state.mapMarkers}
        {this.state.localMarker}
      </MapView>
      { this.props.biluneState !== 'BDL_LOADED' || this.state.showSpinner && this.renderSpinner()}
    </View>
  );
  render() {
    return this.renderMap();
  }
}

const mapStateToProps = state => (
  {
    locals: state.bilune.locals,
    buildings: state.bilune.buildings,
    id: state.bilune.id,
    localId: state.bilune.locId,
    biluneState: state.bilune.state,
  });

export default connect(mapStateToProps, { ...biluneActions })(MapPage);
