import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';

const styles = StyleSheet.create({
  container: {
  },
});

class BuildingOverlay extends Component {
  state = {
    selected: 'A',
  }
  componentWillMount() {

  }

  componentWillUnmount() {

  }
  handleChange(value) {
    this.setState({
      selected: value,
    });
  }
  render() {
    const data = [{
      value: 'RS',
    }, {
      value: '1 étage',
    }, {
      value: 'Pear',
    }];

    return (
      <View>
        <Dropdown
          label=" Fruit"
          data={data}
        />
      </View>
    );
  }
}


export default BuildingOverlay;
