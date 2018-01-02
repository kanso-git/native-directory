import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { searchActions } from './actions';
import SearchItem from './SearchItem';

class SearchList extends Component {
  componentWillMount() {
    console.log('>>>>>>>>>>>>>> componentWillMount');
  }
  onPressItem = (item) => {
    // onPressItem={this.onPressItem}
    Actions.push('employeeEdit', { employeeForm: item });
  };
  renderItem = ({ item }) => (
    <SearchItem item={item} pressFn={this.onPressItem} />
  );
  render() {
    console.log(this.props.directory);
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
