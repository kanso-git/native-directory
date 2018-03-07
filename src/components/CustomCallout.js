/* eslint-disable react/prop-types,no-empty */
import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-fa-icons';


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
    width: 140,
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
      <View
        style={[styles.container, { height: this.props.height }]}
      >
        <View style={[styles.bubble]}>
          <View style={[styles.amount]} >

            <View style={{ height: 35 }}>
              <Text style={{ fontSize: 14, color: 'white' }}>{this.props.local}</Text>
              <Icon
                style={{
                      fontSize: 18,
                      color: 'white',
                      position: 'absolute',
                      top: 0,
                      right: 10,
                }}
                name="caret-right"
              />
            </View>


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
