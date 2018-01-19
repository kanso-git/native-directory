/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { PERSON, UNIT } from 'react-native-dotenv';
import { searchActions } from './actions';
import SearchItem from './SearchItem';

class SearchList extends Component {
  onPressItem = (item) => {
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
      listLen={this.props.directory.searchResult.length}
      pressFn={this.onPressItem}
    />
  );
  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        data={this.props.directory.searchResult}
        extraData={this.props.directory.searchResult}
        renderItem={this.renderItem}
      />
    );
  }
}


const mapStateToProps = state => (
  { directory: state.directory, secret: state.auth.secret }
);

export default connect(mapStateToProps, searchActions)(SearchList);
