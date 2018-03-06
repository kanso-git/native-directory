/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
/* eslint global-require: "off" */
/* eslint-disable react/prop-types,no-empty */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import * as ldash from 'lodash';
import Icon from 'react-native-fa-icons';
import I18n from 'react-native-i18n';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { biluneActions } from './actions';
import { Spinner, SlideUp, utile } from './common';
import CustomCallout from './CustomCallout';
import * as mapHelper from './common/mapHelper';
import MapPolygon from './MapPolygon';
import MapMarker from './MapMarker';
import BuildingOverlay from './BuildingOverlay';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 46.988;
const LONGITUDE = 6.931;
const LATITUDE_DELTA = 0.07482692805103852;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SHOW_SLIDE_UP = 'show';
const HIDE_SLIDE_UP = 'hide';

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
    right: 0,
    flex: 1,
    ...ifIphoneX({
      bottom: 33,
    }, {
      bottom: Platform.OS === 'ios' ? 25 : 35,
    }),
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
  },
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? height * 0.5 : height * 0.43,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: -5,
  },
  mapType: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 6,
    borderRadius: 10,
    width: 40,
    height: 120,
    paddingTop: 13,
    paddingBottom: 13,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  lineStyle: {
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    paddingLeft: 2,
    paddingRight: 2,
    width: 40,
    margin: 10,
  },
});
class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maplocals: [],
      localMarker: null,
      showSpinner: false,
      mapMarkers: null,
      localId: null,
      floorId: null,
      mapType: 'standard',
      floors: [],
      slideUpStatus: null,
    };
  }

  // called every time you access this component
  componentWillMount() {
    /*
     the region for the selected Building is calculated
    */
    console.log('.................. componentWillMount ................');
    const { params } = this.props.navigation.state;
    const initialState = mapHelper.extractParams(params, { ...this.props });
    this.setState(() => ({ ...initialState }));
    region = mapHelper.getRegionForSelectedBat({ ...this.props, id: initialState.id });
  }

  // called every time you access this component right after componentWillMount
  componentDidMount() {
    /*
    when the user navigates to map after the locals get full loded
    the bilueState will be BDL_LOADED
    */
    console.log('.................. componentDidMount ................');
    if (this.props.biluneState === 'BDL_LOADED') {
      // this.renderMapData();
      region = mapHelper.getRegionForSelectedBat({ ...this.props, ...this.state });
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
    console.log('.................. componentWillReceiveProps ................');
    if (nextProps.biluneState !== this.props.biluneState) {
      this.renderMapData('componentWillReceiveProps');
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
  console.log(`>>>>>>>> onLayoutMapReady  id:${this.state.id}, localId:${this.state.localId} >>>>>`);
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
    const slideUpStatus = SHOW_SLIDE_UP;
    const { BAT_ID, LOC_ID } = targetPolygon.attributes;
    this.setState(() => ({ localId: LOC_ID, id: BAT_ID, slideUpStatus }));
    this.handleOnLocalPress(targetPolygon.attributes.LOC_ID, coordinate);
  } else {
    // check if the widget is opened
    const slideUpStatus = HIDE_SLIDE_UP;
    this.setState(() => ({ slideUpStatus, localMarker: null, localId: null }));
  }
}
onMarkerPress = (floorId, BuildingId) => {
  this.setState(() => ({
    localId: null, floorId, id: BuildingId, slideUpStatus: SHOW_SLIDE_UP,
  }));
}
onPolygonPress = (locId, floorIdStr, BuildingId) => {
  console.log(`onPolygonPress locId:${locId}, floorId:${floorIdStr}, BuildingId:${BuildingId} `);
  this.setState(() => ({
    localId: locId, floorId: parseInt(floorIdStr, 10), id: BuildingId, slideUpStatus: SHOW_SLIDE_UP,
  }));
}

onPress = (c) => {
  if (this.state.maplocals !== null) {
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
      const slideUpStatus = SHOW_SLIDE_UP;
      const { BAT_ID } = targetPolygon.attributes;
      this.setState(() => ({
        id: BAT_ID,
        localId: null,
        localMarker: null,
        slideUpStatus,
      }));
    } else {
    // check if the widget is opened
      const slideUpStatus = HIDE_SLIDE_UP;
      this.setState(() => ({ slideUpStatus, localMarker: null, localId: null }));
    }
  } else {
    const slideUpStatus = HIDE_SLIDE_UP;
    this.setState(() => ({ slideUpStatus, localMarker: null, localId: null }));
  }
}

// helper method to return an array of local polygon
getMapLocals = dataLocals =>
  dataLocals.map((f) => {
    const aLatLng = f.geometry.rings[0].map(p => ({
      latitude: mapHelper.toWebMercatorY(p[1]),
      longitude: mapHelper.toWebMercatorX(p[0]),
    }));
    const { LOC_ID, ETG_ID, BAT_ID } = f.attributes;
    const locals = (
      <MapPolygon
        fillColor={mapHelper.colorByLocType(f.attributes.LOC_TYPE_ID)}
        key={f.attributes.OBJECTID}
        coordinates={[...aLatLng]}
        onPress={() => this.onPolygonPress(LOC_ID, ETG_ID, BAT_ID)}
      />
    );
    return locals;
  });


getCalloutInfo = (occupents, targetLocal) => {
  console.log(`getCalloutInfo localId:${occupents}`);

  let occupentsString = '';
  let extraLength = 0;
  if (occupents.length > 0) {
    occupents.forEach((o) => {
      const formatedNomEtPernom = mapHelper.formatNomEtPrenom(o.nom, o.prenom);
      if (formatedNomEtPernom.length > 37) {
        extraLength += 2;
      } else if (formatedNomEtPernom.length > 18 && formatedNomEtPernom.length < 38) {
        extraLength += 1;
      }
      occupentsString += `
${formatedNomEtPernom}`;
    });
  } else {
    let localType = targetLocal.attributes.LOC_TYPE_DESIGNATION;
    if (targetLocal.attributes.LOC_TYPE_ID === 11) {
      localType = 'Salle d\'ens.';
    }
    occupentsString += `
Type: ${localType}`;
  }

  return [extraLength, occupentsString];
}

getCurrentPosition = () => {
  try {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        const myMap = this.map;
        if (myMap) {
          myMap.animateToRegion(region, 0);
        }
      },
      (error) => {
        switch (error.code) {
          case 1:
            if (Platform.OS === 'ios') {
              Alert.alert('', I18n.t('mapPage.iosPositionError'));
            } else {
              Alert.alert('', I18n.t('mapPage.androidPositionError'));
            }
            break;
          default:
            Alert.alert('', I18n.t('mapPage.positionError'));
        }
      },
    );
  } catch (e) {
    console.warn(e.message || '');
  }
}
fitToRegion = () => {
  const myMap = this.map;
  if (myMap) {
    myMap.animateToRegion(initialRegion, 0);
  }
  this.setState(() => ({ slideUpStatus: HIDE_SLIDE_UP }));
}
handleFloorChange = (value, index, floor) => {
  console.log(`handleFloorChange value:${value} index:${index}, data:${floor}`);
}

handleMapTypeChange = (value) => {
  this.setState(() => ({ mapType: value }));
}

overlayJsx = tragetBuilding => (<BuildingOverlay
  selectedFloor={this.state.floorId}
  building={tragetBuilding}
  onFloorChange={this.handleFloorChange}
  onMapTypeChange={this.handleMapTypeChange}
/>)
overlayContent = () => {
  const tragetBuilding = this.props.buildings.find(b => b.id === this.state.id);
  let floors = [];
  if (!tragetBuilding.floors) {
    floors = this.props.loadBuildingFloors(this.state.id).then((d) => {
      tragetBuilding[floors] = d.data;
      return this.overlayJsx(tragetBuilding);
    });
  } else {
    return this.overlayJsx(tragetBuilding);
  }
}


    handleRegionChange = (trackRegion) => {
      region = trackRegion;
      const zoomLevel = mapHelper.getZoomLevel(region);
      if (zoomLevel0 !== zoomLevel) {
        data = mapHelper.getVisibleLocals({ ...this.props, ...this.state }, region);
        this.renderMapData('handleRegionChange');
      }
    }

    handleRegionChangeComplete = (trackRegion) => {
      region = trackRegion;
      data = mapHelper.getVisibleLocals({ ...this.props, ...this.state }, region);
      this.renderMapData('handleRegionChangeComplete');
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
      setTimeout(() => {
        if (this.marker1) {
          this.marker1.showCallout();
        }
      }, 250);
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
       onPress={() => setTimeout(() => this.onMarkerPress(bat.etageIdParDefaut, bat.id), 0)}
     />));
     this.setState(() => ({ mapMarkers, localMarker: null, maplocals: null }));
   }
 }

  renderVisibleLocals = () => {
    data = mapHelper.getVisibleLocals({ ...this.props, ...this.state }, region);
    const allLocals = [...data.mainLocals, ...data.otherLocals];
    console.log(`renderVisibleLocals allLocals length:${allLocals.length}`);
    if (allLocals.length > 0) {
      const filteredMaplocals = ldash.uniqWith(allLocals, ldash.isEqual);
      const maplocals = this.getMapLocals(filteredMaplocals);
      console.log(`renderVisibleLocals maplocals length:${maplocals.length}`);
      const targetLocId = this.state.localId;
      if (targetLocId != null) {
        const targetLocal = filteredMaplocals
          .find(l => l.attributes.LOC_ID === targetLocId);
        if (targetLocal) {
          this.showLocalMarker(targetLocal);
        }
      }
      this.setState(() => ({ maplocals, mapMarkers: null }));
    }
  }
  renderMapData = (callerName) => {
    const zoomLevel = mapHelper.getZoomLevel(region);
    zoomLevel0 = zoomLevel;
    console.log(`renderMapData  called  from  ${callerName} with zoomLevel:${zoomLevel}`);
    if (zoomLevel > 17) {
      this.renderVisibleLocals();
    } else {
      this.renderVisibleBuildings();
    }
  }
  renderCustomMarkerHeight = (length) => {
    let calloutH = 0;
    if (length === 0 || length === 1) {
      calloutH = 80;
    } else {
      calloutH = 65 + (length * 14);
    }
    if (Platform.OS === 'android') {
      calloutH += 18;
    }

    return calloutH;
  }

  renderCustomMarker = (localCoordinate, occupents, targetLocal) => (
    <Marker
      ref={(ref) => { this.marker1 = ref; }}
      coordinate={localCoordinate}
      calloutOffset={{ x: -8, y: 28 }}
      calloutAnchor={{ x: 0.5, y: 0.4 }}
    >
      <Callout
        tooltip
        style={[styles.customView,
          {
            height:
            this.renderCustomMarkerHeight(occupents.length +
               this.getCalloutInfo(occupents, targetLocal)[0]),
            }]}
      >
        <CustomCallout
          local={`Local: ${targetLocal.attributes.LOC_CODE}`}
          height={
          this.renderCustomMarkerHeight(occupents.length +
            this.getCalloutInfo(occupents, targetLocal)[0])}
        >
          <Text style={{ color: 'white', fontSize: 11, marginTop: -20 }}>{ this.getCalloutInfo(occupents, targetLocal)[1] }</Text>
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
  renderMapTypeSelectors = () => (
    <View style={styles.mapType} >
      <TouchableOpacity
        onPress={() => this.setState(() => ({ slideUpStatus: SHOW_SLIDE_UP }))}
      >
        <Text style={{ fontSize: 20, color: '#007aff' }} >&#9432;</Text>
      </TouchableOpacity>
      <View style={styles.lineStyle} />

      <TouchableOpacity onPress={() => { this.fitToRegion(); }}>
        <Image
          style={{ width: 30, height: 25 }}
          source={{ uri: utile.collapseIcon }}
        />
      </TouchableOpacity>
      <View style={styles.lineStyle} />

      <TouchableOpacity
        onPress={() => this.getCurrentPosition()}
      >
        <Icon name="location-arrow" style={{ fontSize: 20, color: '#007aff' }} />
      </TouchableOpacity>
    </View>

  )

  renderMap = () => (
    <View style={styles.container}>
      <MapView
        ref={(ref) => { this.map = ref; }}
        style={styles.map}
        mapType={this.state.mapType}
        provider={PROVIDER_GOOGLE}
        onLayout={this.onLayoutMapReady}
        showsUserLocation
        userLocationAnnotationTitle="my location"
        showsScale
        showsCompass
        showsMyLocationButton={false}
        initialRegion={region}
        onRegionChange={this.handleRegionChange}
        onRegionChangeComplete={this.handleRegionChangeComplete}
        onLongPress={this.onLongPress}
        onPress={this.onPress}
      >
        {this.state.maplocals}
        {this.state.mapMarkers}
        {this.state.localMarker}
      </MapView>
      { this.renderMapTypeSelectors() }
      { this.props.biluneState !== 'BDL_LOADED' || this.state.showSpinner && this.renderSpinner()}
      <View style={styles.overlay}>
        <SlideUp
          draggableHeight={36}
          dragArrowColor="white"
          dragBgColor="#034d7c"
          contentSectionBgColor="rgba(255, 255, 255, 1)"
          contentSection={this.overlayContent()}
          slideUpStatus={this.state.slideUpStatus}
        />
      </View>
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
    biluneState: state.bilune.state,
  });

export default connect(mapStateToProps, { ...biluneActions })(MapPage);
