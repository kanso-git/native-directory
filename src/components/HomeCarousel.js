import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import * as _ from 'lodash';
import BuildingSlide from './BuildingSlide';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});
class HomeCarousel extends Component {
  state={
    entries: this.props.entries || [],
    activeSlide: 3,
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setState(() => ({
        entries: this.nextProps.entries,
      }));
    }
  }
  wp = (percentage) => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  }


     renderItem= ({ item, index }) => <BuildingSlide index={index} data={item} />
     render() {
       const slideHeight = viewportHeight;
       const slideWidth = this.wp(100);
       return (
         <View style={styles.container}>
           <Carousel
             data={this.state.entries}
             renderItem={this.renderItem}
             onSnapToItem={index => this.setState(() => ({ activeSlide: index }))}
             sliderWidth={slideWidth}
             itemWidth={slideWidth}
             sliderHeight={slideHeight}
             activeSlide={this.state.activeSlide}
             layout={'stack'} 
             layoutCardOffset={26}
           />
         </View>
       );
     }
}

export default HomeCarousel;
