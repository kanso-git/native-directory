/* eslint-disable react/prop-types,no-empty */
import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flex: 1,
  },
  bubble: {
    width: 140,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#034d7c',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    borderColor: '#007a87',
    borderWidth: 0.5,
  },
  amount: {
    // flex: 1,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#034d7c',
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});
class CustomCallout extends React.Component {
  componentDidMount() {

  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[styles.bubble]}>
          <View style={[styles.amount, { height: this.props.height - 20 }]} >
            {this.props.children}
          </View>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}


export default CustomCallout;
