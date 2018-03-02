import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const styles = {
  wrapper: {
    marginTop: 120
  },
  slide: {
   width,
   height:400,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width,
    height: 300,
    flex: 1,
    zIndex: 300,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  paginationText: {
    color: 'white',
    fontSize: 20,
  },
};

const images = [
  'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',

];


const renderPagination = (index, total, context) => (
  <View style={styles.paginationStyle}>
    <Text style={{ color: 'grey' }}>
      <Text style={styles.paginationText}>{index + 1}</Text>/{total}
    </Text>
  </View>
);

export default class BuidlingImageMapSlider extends Component {
  componentDidMount() {

  }
  render() {
    return (
      <Swiper
          style={styles.wrapper}
          renderPagination={renderPagination}
          loop={false}
        >
          <View
            style={styles.slide}
            title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}
          >
            <Image style={styles.image} source={{ uri: 'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png' }} />
          </View>
          <View
            style={styles.slide}
            title={<Text numberOfLines={1}>Big lie behind Nine’s new show</Text>}
          >
            <Image style={styles.image} source={{ uri: images[1] }} />
          </View>
          <View
            style={styles.slide}
            title={<Text numberOfLines={1}>Why Stone split from Garfield</Text>}
          >
            <Image style={styles.image} source={{ uri: images[2] }} />
          </View>
          <View
            style={styles.slide}
            title={<Text numberOfLines={1}>Learn from Kim K to land that job</Text>}
          >
            <Image style={styles.image} source={{ uri: images[3] }} />
          </View>
        </Swiper>
    );
  }
}
