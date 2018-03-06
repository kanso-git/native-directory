/* eslint-disable react/prop-types,no-empty */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { Dropdown } from 'react-native-material-dropdown';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
  },
  title: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 2,
    color: '#888888',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

const options = [
  { label: 'Plan', value: 'standard' },
  { label: 'Satellite', value: 'satellite' },
  { label: 'Hybrid', value: 'hybrid' },
];

class BuildingOverlay extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log('.................. componentWillReceiveProps ................');
  }

  componentWillUnmount() {

  }

  render() {
    const floorData = this.props.building.floors.map(f => ({
      value: f.id,
      label: f.designation,
      buildingId: this.props.building.id,
    }));
    const floorId = this.props.floorId ? this.props.floorId : this.props.building.etageIdParDefaut;
    const floorObject = this.props.building.floors.find(f => f.id === parseInt(floorId, 10));
    const { image } = this.props.building;
    const {
      abreviation, adresseLigne1, npa, localite,
    } = this.props.building;
    console.log(floorData);
    return (
      <View style={{ padding: 2 }}>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.props.onImageClick}>
            <Image
              style={{ width: 145, height: 100 }}
              source={{ uri: image }}
            />
          </TouchableOpacity>
          <View style={{ width: width - 160, marginLeft: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{abreviation} </Text>
              <Text style={styles.subtitle}>{`${adresseLigne1}
${npa} ${localite}`}
              </Text>
              <View style={{ marginTop: -12 }}>
                { floorData.length > 1 &&
                <Dropdown
                  label="étage :"
                  data={floorData}
                  value={floorObject.designation}
                  itemPadding={1}
                  itemCount={4}
                  fontSize={13}
                  dropdownOffset={{ top: 10, left: 10 }}
                  dropdownMargins={{ min: 8, max: 16 }}
                  onChangeText={this.props.onFloorChange}
                />
              }
                { floorData.length === 1 &&
                  <View>
                    <Text style={[styles.subtitle, { marginTop: 20 }]}>étage:</Text>
                    <Text style={[styles.subtitle]}>{floorData[0].label}</Text>
                  </View>
              }
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={{ fontSize: 14, paddingBottom: 10 }}>Réglages de Plans</Text>
          <View style={{ marginTop: -5 }}>
            <SwitchSelector
              options={options}
              borderColor="black"
              fontSize={13}
              initial={0}
              onPress={this.props.onMapTypeChange}
            />
          </View>
        </View>

      </View>
    );
  }
}


const mapStateToProps = state => (
  {
    buildings: state.bilune.buildings,
  });

export default connect(mapStateToProps)(BuildingOverlay);
