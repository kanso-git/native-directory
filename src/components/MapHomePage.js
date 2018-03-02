/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { biluneActions } from './actions';
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
    right: 0,
    ...ifIphoneX({
      bottom: 60,
    }, {
      bottom: 40,
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
});


const initialRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: MAP_LATITUDE_DELTA,
  longitudeDelta: MAP_LONGITUDE_DELTA,
};
let region = initialRegion;

class MapHomePage extends Component {
  state={
    buildingMarkers: [],
  }

  // called every time you access this component
  componentWillMount() {
    region = mapHelper.getRegionForSelectedBatInHomePage({ ...this.props });
  }

  // called every time you access this component right after componentWillMount
  componentDidMount() {
    const id = mapHelper.getBuilidngId({ ...this.props });
    this.renderVisibleBuildings(id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      const myMap = this.map;
      if (myMap) {
        region = mapHelper.getRegionForSelectedBatInHomePage({ ...this.props, id: nextProps.id });
        myMap.animateToRegion(region, 0);
        this.renderVisibleBuildings(nextProps.id);
      }
    }
  }
  // called when about to leave the component
  componentWillUnmount() {
    region = initialRegion;
  }

  onLayoutMapReady = () => {
    const myMap = this.map;
    if (myMap) {
      myMap.animateToRegion(region, 0);
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

    renderVisibleBuildings = (selectedBuilding) => {
      const { buildings } = this.props;
      const visibleBuildings = buildings.filter(b => mapHelper.buildingInBoundingBox(region, b));
      if (visibleBuildings.length > 0) {
        const buildingMarkers = visibleBuildings
          .map(bat => this.generateMarker(bat, selectedBuilding));
        this.setState(() => ({ buildingMarkers }));
      }
    }

  renderBuildingFloor = async (id) => {
    this.props.loadAllBuildingData(id);
  }
  renderOpenMapButton = () => (
    <TouchableOpacity
      style={styles.openBtn}
      onPress={async () => {
        const buildingId = this.props.id || mapHelper.getBuilidngId({ ...this.props });

        const tragetBuilding = this.props.buildings.find(b => b.id === buildingId);
        if (tragetBuilding && tragetBuilding.floors) {
          Actions.push('mapPage', { buildingId, localId: null });
        } else {
          await this.renderBuildingFloor(buildingId);
          Actions.push('mapPage', { buildingId, localId: null });
        }
      }}
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
          onLayout={this.onLayoutMapReady}
          showsCompass
          showsScale
          loadingEnabled
          showsIndoorLevelPicker
        >
          { this.state.buildingMarkers }
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

export default connect(mapStateToProps, { ...biluneActions })(MapHomePage);
