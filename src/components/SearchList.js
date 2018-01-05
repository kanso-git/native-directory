import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { PERSON, UNIT } from 'react-native-dotenv';
import { searchActions } from './actions';
import SearchItem from './SearchItem';

class SearchList extends Component {
  componentWillMount() {
    console.log('>>>>>>>>>>>>>> componentWillMount');
  }
  onPressItem = (item) => {
    console.log('clicked item -------');
    console.log(JSON.stringify(item, null, 3));
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
    <SearchItem item={item} listLen={this.props.directory.searchResult.length} pressFn={this.onPressItem} />
  );
  render() {
    console.log(JSON.stringify(this.props.directory.searchResult, null, 5));
    return (
      <FlatList
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
