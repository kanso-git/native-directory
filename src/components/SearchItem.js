import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { PERSON } from 'react-native-dotenv';
import { CardSection } from './common';

const renderPersonItem = (item, listLen) => (
  <CardSection style={{ flexDirection: 'column' }}>
    <Text style={{ fontSize: 18 }}>{item.firstName} { item.lastName}</Text>
    <Text>
      {item.positions && item.positions[0].positionName ? `${item.positions[0].positionName}, ` : ''}
      {item.positions && item.positions[0].organizationalUnit ? item.positions[0].organizationalUnit.name : '' }
    </Text>
    <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
  </CardSection>
);

const renderUnitItem = (item, listLen) => (
  <CardSection style={{ flexDirection: 'column' }}>
    <Text style={{ fontSize: 18 }}>{item.name} </Text>
    <Text style={{ fontSize: 10, textAlign: 'right', paddingTop: -5 }}>{item.index + 1}/{listLen}</Text>
  </CardSection>
);

const SearchItem = ({ item, pressFn, listLen }) => (
  <TouchableOpacity onPress={() => pressFn(item)}>
    {item.type === PERSON ? renderPersonItem(item, listLen) : renderUnitItem(item, listLen)}
  </TouchableOpacity>
);


export default SearchItem;
