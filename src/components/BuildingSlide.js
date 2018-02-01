/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';

const BuildingSlide = (props) => {
  console.log('BuildingSlide');
  console.log(props);
  return (<Image
    style={{ width: 300, height: 300 }}
    source={{ uri: props.data.image }}
  />);
};


export default BuildingSlide;
