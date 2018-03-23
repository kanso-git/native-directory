/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { biluneActions } from './actions';
import styles from './SliderEntryStyle';
import * as utile from './common/utile';

class SliderEntry extends Component {
  componentDidMount() {
  }
  render() {
    const {
      data: {
        id, abreviation, adresseLigne1, localite, npa,
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
          const { categories, actions } = utile.gaParams;
          utile.trackEvent(categories.usr, actions.sltp);
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
