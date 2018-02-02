/* eslint-disable react/prop-types */
import React from 'react';
import { Image, View, Text, Dimensions } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const wp = (percentage) => {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
};
const slideWidth = wp(100);
const BuildingSlide = props => (
  <View>
    <Image
      style={{
      backgroundColor: '#F8F8F8',
      alignSelf: 'strech',
      height: slideWidth - 80,
      width: slideWidth - 120,
      borderWidth: 0,
      borderRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    }}
      source={{ uri: props.data.image }}
    />
    <View style={{
 backgroundColor: 'rgba(0,0,0,.6)', height: 60, marginTop: -60, width: slideWidth -40,
}}
    >
      <Text style={{
 fontSize: 16, fontWeight: '700', color: '#fff', paddingLeft: 5,
}}
      >{props.data.abreviation}
      </Text>
      <Text style={{
 fontSize: 13, color: '#fff', paddingTop: 5, paddingLeft: 5,
}}
      >{`${props.data.adresseLigne1}`}
      </Text>
      <Text style={{
 fontSize: 13, color: '#fff', paddingTop: 2, paddingLeft: 5,
}}
      >{`${props.data.localite}, ${props.data.npa}`}
      </Text>
    </View>
  </View>
);


export default BuildingSlide;