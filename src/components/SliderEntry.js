/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { biluneActions } from './actions';
// import PropTypes from 'prop-types';
import styles from './SliderEntryStyle';

class SliderEntry extends Component {
  componentWillReceiveProps(nextProps) {
    // console.log(`componentWillReceiveProps :${ nextProps.data.image}`);
  }
  render() {
    const {
      data: {
        id, abreviation, adresseLigne1, localite, npa, locals,
      }, even,
    } = this.props;
    const uppercaseTitle = abreviation ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
        { abreviation.toUpperCase() }
      </Text>
    ) : false;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {
          this.props.setBuildingId({ id });
          Actions.push('buildingDetails');
         }}
      >
        <View style={styles.shadow} />
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
          <Image
            source={{ uri: this.props.data.image }}
            style={styles.image}
          />
          <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
        </View>
        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
          { uppercaseTitle }
          <Text
            style={[styles.subtitle, even ? styles.subtitleEven : {}]}
            numberOfLines={2}
          >
            { adresseLigne1 }
            { `\n${npa} ${localite}` }
          </Text>

        </View>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = state => state;
export default connect(mapStateToProps, { ...biluneActions })(SliderEntry);
