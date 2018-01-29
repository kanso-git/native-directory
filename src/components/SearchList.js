/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { FlatList, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { PERSON, UNIT } from 'react-native-dotenv';
import { searchActions } from './actions';
import SearchItem from './SearchItem';

class SearchList extends Component {
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
      default:
        break;
    }
  };
  renderItem = ({ item }) => (
    <SearchItem
      item={item}
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
    totalSearchResult: [...state.directory.searchResult,
      ...state.bilune.search.local,
      ...state.bilune.search.building],
  }
);

export default connect(mapStateToProps, searchActions)(SearchList);
