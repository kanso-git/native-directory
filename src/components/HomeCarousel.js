import React, { Component } from 'react';
import { View, StyleSheet ,Dimensions} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import * as _ from 'lodash';
import BuildingSlide from './BuildingSlide';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
});
class HomeCarousel extends Component {
  state={
    entries: this.props.entries || [],
    activeSlide: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setState(() => ({
        entries: this.nextProps.entries,
      }));
    }
  }
  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
              }}
        inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
 wp =  (percentage) =>{
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}


     renderItem= ({ item, index }) => <BuildingSlide index={index} data={item} />
     render() {
      const slideHeight = viewportHeight * 0.36;
      const slideWidth = this.wp(75);
       console.log('render');
       console.log(`this.state.entries${this.state.entries}`);
       
       
       return (
         <View style={styles.container}>
           <Carousel
             data={this.state.entries}
             renderItem={this.renderItem}
             onSnapToItem={index => this.setState({ activeSlide: index })}
             sliderWidth={slideHeight}
             itemWidth={slideWidth}
           />
           { this.pagination }
         </View>
       );
     }
}

export default HomeCarousel;
