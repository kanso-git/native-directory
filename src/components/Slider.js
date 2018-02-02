/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './SliderEntryStyle';
import SliderEntry from './SliderEntry';
import styles from './indexStyle';


export default class Slider extends Component {
    state={
      entries: this.props.entries || [],
    }

    componentWillReceiveProps(nextProps) {
      this.setState(() => ({
        entries: nextProps.entries,
      }));
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
          />
        </View>
      );
    }

   renderItem = ({ item, index }) => <SliderEntry data={item} even={(index + 1) % 2 === 0} />
   render() {
     const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');

     return (
       <View style={styles.container}>

         <ScrollView
           style={styles.scrollview}
           scrollEventThrottle={200}
           directionalLockEnabled
         >

           { example3 }

         </ScrollView>
       </View>
     );
   }
}
