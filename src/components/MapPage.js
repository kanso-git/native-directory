/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import { biluneActions } from './actions';
import { Spinner } from './common';
import CustomCallout from './CustomCallout';
import * as mapHelper from './common/mapHelper';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 46.99179;
const LONGITUDE = 6.931;
const LATITUDE_DELTA = 0.000003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


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
    maplocals: [],
    localMarker: null,
    showSpinner: false,
  }
  componentDidMount() {
    if (this.props.biluneState === 'BDL_LOADED') {
      this.renderLocals();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.biluneState !== this.props.biluneState) {
      this.renderLocals();
    }
  }
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


    getCalloutInfo = (occupents, targetLocal) => {
      console.log(`getCalloutInfo localId:${occupents}`);

      let occupentsString = `Local: ${targetLocal.attributes.LOC_CODE}`;
      if (occupents.length > 0) {
        occupents.map((o) => {
          occupentsString +=`
${o.nom} ${o.prenom.slice(0, 1)}`;
        });
      } else { 
        occupentsString += `
Type: ${targetLocal.attributes.LOC_TYPE_DESIGNATION}`;
      }

      return occupentsString;
    }

    loadOccupent = async (targetLocal) => {
      const localId = targetLocal.attributes.LOC_ID;
      this.setState(() => ({ showSpinner: true }));
      const list = await this.props.loadOccupentsPerLocal(localId);
      this.setState(() => ({ showSpinner: false }));
      return list;
    }

    handleOnLocalPress= (clickedLocId) => {
      console.log(`handleOnLocalPress target :${clickedLocId}`);
      const targetLocal = this.props.locals
        .find(l => l.attributes.LOC_ID === clickedLocId);
      this.showLocalMarker(targetLocal);
    }
    showLocalMarker = async (targetLocal) => {
      this.setState(() => ({ localMarker: null }));
      const list = await this.loadOccupent(targetLocal);
      const targetCoordinates = mapHelper.polygonCenter(targetLocal.geometry.rings[0]);
      const localMarker = this.renderCustomMarker(targetCoordinates, list, targetLocal);
      this.setState(() => ({ localMarker }));
      setTimeout(() => this.marker1.showCallout(), 250);
    }

  renderMainLocals = (data) => {
    const maplocals = this.getMapLocals(data.mainLocals);
    const targetLocId = this.props.localId;
    if (targetLocId != null) {
      const targetLocal = data.mainLocals
        .find(l => l.attributes.LOC_ID === targetLocId);
      this.showLocalMarker(targetLocal);
    }
    this.setState(() => ({ maplocals }));
  }
  renderOtherLocals = (data) => {
    const maplocals = this.getMapLocals(data.otherLocals);
    const allLocals = [...this.state.maplocals, ...maplocals];
    this.setState(() => ({ maplocals: allLocals }));
  }
  renderLocals = () => {
    console.log(' *************** renderLocals  is called *************');
    const data = mapHelper.getVisibleLocals({ ...this.props });
    this.renderMainLocals(data);
    setTimeout(() => {
      const region = mapHelper.getCenteredRegionByFloor(data.mainLocals);
      this.map.animateToRegion(region);
      /*
      const buildingBorderMarkes = mapHelper.getMarkersForSelectedBat(data.mainLocals);
      this.map.fitToCoordinates(buildingBorderMarkes, {
        edgePadding: DEFAULT_PADDING,
        animated: true,
      }); */
      this.renderOtherLocals(data);
    }, 500);
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
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        provider={PROVIDER_GOOGLE}
        showsCompass
      >
        { this.state.maplocals}
        { this.state.localMarker }
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
