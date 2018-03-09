/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { Actions } from 'react-native-router-flux';
import * as _ from 'lodash';
import { biluneActions } from './actions';
import { sliderWidth, itemWidth } from './SliderEntryStyle';
import SliderEntry from './SliderEntry';
import styles from './indexStyle';

let refCarousel;
class Slider extends Component {
    state={
      entries: this.props.entries || [],
    }
    componentWillMount() {
      console.log(`Slider componentWillMount BuildingId:${this.props.id}`);
    }
    componentWillReceiveProps(nextProps) {
      this.setState(() => ({
        entries: nextProps.entries,
      }));
    }
    shouldComponentUpdate() {
      if (Actions.currentScene === 'home') {
        console.log('Slider shouldComponentUpdate is true');
        return true;
      }
      console.log('Slider shouldComponentUpdate is fasle');
      return false;
    }
    // methods can then be called this way
    jumpToSlide= (buidlingId) => {
      const refCarousel = this.refs.carousel;
      if (buidlingId && refCarousel && buidlingId > 0) {
        const currentSlideIndex = refCarousel.currentIndex;
        const currentBuildingIndex = _.findIndex(this.state.entries, { id: buidlingId });
        if (currentBuildingIndex !== currentSlideIndex) {
          refCarousel.snapToItem(currentBuildingIndex, false);
        }
      }
    }
    handleSnapToItem = (index) => {
      const bat = this.state.entries[index];
      this.props.setBuildingId(bat);
    }

    layoutExample(number, title, type) {
      return (
        <View style={[styles.exampleContainer, styles.exampleContainerLight]}>

          <Carousel
            ref="carousel"
            data={this.state.entries}
            renderItem={this.renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            layout={type}
            loop
            onSnapToItem={this.handleSnapToItem}
          />
        </View>
      );
    }

   renderItem = ({ item, index }) => <SliderEntry data={item} even={(index + 1) % 2 === 0} />
   render() {
     const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');
     setTimeout(() => this.jumpToSlide(this.props.id), 500);
     return (
       <View style={styles.container}>
         { example3 }
       </View>
     );
   }
}
const mapStateToProps = state => (
  {
    id: state.bilune.id,
  });

export default connect(mapStateToProps, { ...biluneActions })(Slider);
