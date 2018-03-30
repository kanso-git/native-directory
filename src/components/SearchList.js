/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { FlatList, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { PERSON, UNIT, BUILDING, LOCAL } from 'react-native-dotenv';
import { searchActions, biluneActions } from './actions';
import SearchItem from './SearchItem';

class SearchList extends Component {
  onPressItemHelper = (item) => {
    this.props.setLocalId(item.attributes.LOC_ID, item.attributes.BAT_ID);
    const typeCode = item.attributes.LOC_TYPE_ID;
    if (typeCode === 10 || typeCode === 11 || typeCode === 12 || typeCode === 3) {
      Actions.push('localDetails');
    } else {
      Actions.push('mapPage', { buildingId: item.attributes.BAT_ID, localId: item.attributes.LOC_ID });
    }
  }

  onPressItem = (item) => {
    if (Platform.OS === 'android') {
      Keyboard.dismiss();
    }
    switch (item.type) {
      case PERSON:
        Actions.push('memberDetails', { memberDetails: item });
        break;
      case UNIT:
        Actions.push('unitDetails', { unitDetails: item });
        break;
      case BUILDING:
        this.props.setBuildingId(item);
        Actions.push('buildingDetails');
        break;
      case LOCAL:
        this.onPressItemHelper(item);
        break;
      default:
        break;
    }
  };
  renderItem = ({ item }) => (
    <SearchItem
      item={item}
      image={item.attributes ?
        this.props.images[item.attributes.OBJECTID] : this.props.images[item.id]}
      listLen={this.props.totalSearchResult.length}
      pressFn={this.onPressItem}
    />
  );
  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        data={this.props.totalSearchResult.map((r, index) => ({ ...r, index }))}
        extraData={this.props.totalSearchResult}
        renderItem={this.renderItem}
      />
    );
  }
}


const mapStateToProps = state => (
  {
    directory: state.directory,
    secret: state.auth.secret,
    images: state.bilune.images,
    totalSearchResult: [...state.directory.searchResult,
      ...state.bilune.search.local,
      ...state.bilune.search.building],
  }
);

export default connect(mapStateToProps, { ...searchActions, ...biluneActions })(SearchList);
