/* eslint-disable react/prop-types,no-empty */
/* eslint global-require:"off" */
/* eslint-disable consistent-return */
import React from 'react';
import { Actions } from 'react-native-router-flux';
import I18n from 'react-native-i18n';
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { CardSection } from './common';

const { height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({

  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,


  },
});

const countLocalsByType = (locals, des) => {
  const typeDes = des.toLowerCase();
  const locByDes = locals.filter(l => l.attributes.LOC_TYPE_DESIGNATION.toLowerCase() === typeDes);
  return locByDes.length;
};

const getBuildingTypes = (locals) => {
  const locTypes = require('./common/localTypes.json');
  const buildingTypes = [];
  locTypes.forEach((lt) => {
    const countLoc = countLocalsByType(locals, lt.designation);
    if (countLoc > 0) {
      buildingTypes.push(<CardSection key={lt.id}><Text>{`${lt.designation} : ${countLoc}`} </Text></CardSection>);
    }
  });
  return buildingTypes;
};

const BuildingSummary = props => (
  <ScrollView style={[styles.containerStyle, { height: (viewportHeight * 0.33) + 85 }]}>
    <CardSection style={{ flexDirection: 'row', paddingTop: 10 }}>
      <Image
        style={{ width: 60, height: 60, backgroundColor: '#034d7c' }}
        source={{ uri: props.currentBuilding.image }}
      />
      <TouchableOpacity onPress={() => Actions.push('mapPage')}>
        <View >
          <Text style={{
            marginLeft: 5,
            fontSize: 18,
            marginBottom: 5,
            color: '#007aff',
          }}
          >
            {props.currentBuilding.abreviation}
          </Text>
        </View>
        <View style={[{ marginLeft: 5, marginBottom: 5, height: 30 }]}>
          <View style={props.currentBuilding.addressStyle}>
            <Text style={{ color: '#007aff' }}>{`${props.currentBuilding.adresseLigne1}
${props.currentBuilding.npa} ${props.currentBuilding.localite}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </CardSection>
    <CardSection>
      <Text>{I18n.t('building.floorNumber')}: {props.currentBuilding.floors.length}</Text>
    </CardSection>
    <CardSection>
      <Text>{I18n.t('building.localTotalNumber')}: {props.currentBuilding.locals.length}</Text>
    </CardSection>
    { getBuildingTypes(props.currentBuilding.locals)}
  </ScrollView>
);

export default BuildingSummary;

