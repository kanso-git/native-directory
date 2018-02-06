/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { biluneActions } from './actions';
import { sliderWidth, itemWidth } from './SliderEntryStyle';
import SliderEntry from './SliderEntry';
import styles from './indexStyle';


class Slider extends Component {
    state={
      entries: this.props.entries || [],
    }

    componentWillReceiveProps(nextProps) {
      this.setState(() => ({
        entries: nextProps.entries,
      }));
    }
    handleSnapToItem = (index) => {
      console.log(`slide to silde index:${index}`);
      const bat = this.state.entries[index];
      this.props.zoomToBat(bat);
    }

    layoutExample(number, title, type) {
      return (
        <View style={[styles.exampleContainer, styles.exampleContainerLight]}>

          <Carousel
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

     return (
       <View style={styles.container}>
         { example3 }
       </View>
     );
   }
}

export default connect(null, { ...biluneActions })(Slider);
