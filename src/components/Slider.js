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

class Slider extends Component {
    state={
      entries: this.props.entries || [],
    }
    componentWillMount() {
      /*
      console.log(`Slider componentWillMount id:${this.props.id}`);
      const buildingId = this.props.id;
      if (buildingId && buildingId !== null) {
        const bSelected = [];
        const aSelected = [];
        let found = false;
        const currentBuildingIndex = _.findIndex(this.props.entries, { id: buildingId });
        if (currentBuildingIndex !== 0) {
          this.props.entries.forEach((b, i) => {
            if (i === currentBuildingIndex) {
              found = true;
            }
            if (!found) {
              bSelected.push(b);
            } else {
              aSelected.push(b);
            }
          });
          const newEntries = [...aSelected, ...bSelected];
          console.log(`Slider componentWillMount newEntries:${newEntries.length}`);
          this.setState(() => ({
            entries: newEntries,
          }));
        }
        // const withoutSelected = this.props.entries.filter(b => b.id !== buildingId);
        // const withSelected = this.props.entries.filter(b => b.id === buildingId);
      } */
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
      console.log(`>>>>>>>> jumpToSlide to buidlingId:${buidlingId}`);
      const refCarousel = this.carousel;
      if (buidlingId && refCarousel && buidlingId > 0) {
        const currentSlideIndex = refCarousel.currentIndex;
        const currentBuildingIndex = _.findIndex(this.props.entries, { id: buidlingId });
        if (currentBuildingIndex !== currentSlideIndex) {
          console.info(`>>>>>>>> jumpToSlide  snapToItem index:${currentBuildingIndex}`);
          refCarousel.snapToItem(currentBuildingIndex, true);
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
            ref={(ref) => { this.carousel = ref; }}
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
