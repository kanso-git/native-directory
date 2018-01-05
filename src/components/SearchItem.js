import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { CardSection } from './common';

const SearchItem = ({ item, pressFn, listLen }) => (
  <TouchableOpacity onPress={() => pressFn(item)}>
    <CardSection style={{ flexDirection: 'column' }}>
      <Text style={{ fontSize: 18 }}>{item.firstName} { item.lastName}</Text>
      <Text>
        {item.positions && item.positions[0] ? item.positions[0].positionName : '---'},
        {item.positions && item.positions[0].organizationalUnit ? item.positions[0].organizationalUnit.name : '--' }
      </Text>
      <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
    </CardSection>
  </TouchableOpacity>
);


export default SearchItem;
