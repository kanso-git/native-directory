/* eslint-disable react/prop-types,no-empty */
/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint-disable consistent-return */

import React, { Component } from 'react';
import {
  View,
  Animated,
  Dimensions,
  PanResponder,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const SHOW_SLIDE_UP = 'show';
const HIDE_SLIDE_UP = 'hide';

export default class SlideUp extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.screenSize = Dimensions.get('window');
    const heightOverlay = this.screenSize.height;

    this.maxTop = 0;

    if (isIphoneX()) {
      this.maxBottom = heightOverlay * 0.25;
    } else if (Platform.OS === 'ios') {
      this.maxBottom = heightOverlay * 0.27;
    } else {
      this.maxBottom = heightOverlay * 0.29;
    }
    console.log(`this.maxBottom:${this.maxBottom}`);
    this.state = { scrollY: new Animated.Value(this.maxBottom) };
  }
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this.handlePanResponderEnd.bind(this),
    });
  }

  componentDidMount() {
    this.handleStausChange(this.props.slideUpStatus);
  }

  componentWillReceiveProps(nextProps) {
    console.log('.... SlideUp componentWillReceiveProps ....');
    this.handleStausChange(nextProps.slideUpStatus);
  }
 handleStausChange = (status) => {
   console.info(`SlideUp handleStausChange  request to ${status}`);
   switch (status) {
     case SHOW_SLIDE_UP:
       this.slideUp();
       break;
     case HIDE_SLIDE_UP:
       this.slideDown();
       break;
     default:
       break;
   }
 }


  defaultDraggableSection = () => {
    const { dragArrowColor } = this.props;
    const animatedSkewLeft = this.state.scrollY.interpolate({
      inputRange: [this.maxTop, this.maxBottom],
      outputRange: ['20deg', '-20deg'],
    });
    const animatedSkewRight = this.state.scrollY.interpolate({
      inputRange: [this.maxTop, this.maxBottom],
      outputRange: ['-20deg', '20deg'],
    });
    const animatedTranslateY = this.state.scrollY.interpolate({
      inputRange: [this.maxTop, this.maxBottom],
      outputRange: [6, -6],
    });
    return (
      <View style={{ paddingRight: 20, marginTop: -15 }}>
        <Animated.View style={{
              position: 'absolute',
              borderRadius: 4,
              backgroundColor: dragArrowColor,
              borderWidth: 0,
              borderColor: dragArrowColor,
              width: 20,
              height: 4,
              transform: [{ skewY: animatedSkewLeft },
                 { translateX: -9 }, { translateY: animatedTranslateY }],
          }}
        />

        <Animated.View style={{
              position: 'absolute',
              borderRadius: 4,
              backgroundColor: dragArrowColor,
              borderWidth: 0,
              borderColor: dragArrowColor,
              width: 20,
              height: 4,
              transform: [{ skewY: animatedSkewRight },
                { translateX: 9 }, { translateY: animatedTranslateY }],
          }}
        />
      </View>);
  }

    slideUpDownAnimation = (up) => {
      let val0 = this.state.scrollY._value;
      if (up) {
        val0 += 3;
      } else {
        val0 -= 3;
      }
      Animated.spring(this.state.scrollY, {
        toValue: val0,
        easing: Easing.back(),
        duration: 200,
      }).start();
    }

    slideUp = () => {
      this.currentModalPosition = 'top';

      Animated.spring(this.state.scrollY, {
        toValue: this.maxTop,
        easing: Easing.back(),
        duration: 0,
      }).start();
    }

    slideDown = () => {
      this.currentModalPosition = 'bottom';

      Animated.spring(this.state.scrollY, {
        toValue: this.maxBottom,
        easing: Easing.back(),
        duration: 0,
      }).start();
    }


  handleStartShouldSetPanResponder = () => true

  handleMoveShouldSetPanResponder = (evt, gestureState) => Math.abs(gestureState.dy) > 5

  handlePanResponderMove = (e, gestureState) => {
    let delta = this.maxBottom - gestureState.y0;
    if (delta > 0 && this.currentModalPosition === 'top') {
      delta = this.maxTop - gestureState.y0;
    }

    const position = gestureState.moveY + delta;

    Animated.timing(this.state.scrollY, {
      toValue: position,
      // speed: 30,
      duration: 0,
      easing: Easing.back(),
    }).start();
  }
  handlePanResponderGrant = () => true

  handlePanResponderEnd(e, gestureState) {
    let percent = (e.nativeEvent.pageY - this.maxTop) / (this.maxBottom - this.maxTop);
    if (percent < 0) {
      percent = 0;
    }

    if (percent > 1) {
      percent = 1;
    }

    percent *= 100;

    const way = gestureState.dy < 0 ? 'up' : 'down';
    let animateTo = 0;

    if (way === 'up') {
      if (percent < 85) {
        animateTo = 'up';
      } else {
        animateTo = 'down';
      }
    } else {
      animateTo = 'down';
    }

    if (percent >= 99 && gestureState.dy === 0) {
      animateTo = 'up';
    }

    if (animateTo === 'up') {
      this.slideUp();

      return true;
    }
    this.slideDown();
  }

  renderContentSection = () => {
    const { contentSection } = this.props;
    if (!contentSection) {
      return null;
    }
    return contentSection;
  }

  renderDraggableSection = () => {
    const { dragSection } = this.props;
    if (!dragSection) {
      return this.defaultDraggableSection();
    }
    return dragSection;
  }

  render() {
    const {
      visibleHeight, draggableHeight, contentSectionBgColor, dragBgColor,
    } = this.props;
    return (
      <Animated.View
        style={{
                    backgroundColor: contentSectionBgColor,
                    position: 'absolute',
                    width: '100%',
                    zIndex: 1,
                    height: '100%',
                    minHeight: visibleHeight,
                    // borderTopLeftRadius: animatedBorderRaduis,
                    // borderTopRightRadius: animatedBorderRaduis,
                    // margin: animatedMargin,
                    // borderWidth: animatedBorder,
                    borderColor: '#ccc',
                    transform: [
                        { translateY: this.state.scrollY },
                        // {translateX: animatedTranslateX}
                    ],
                }}
      >

        <View >
          <TouchableOpacity
            onPress={() => {
                    if (this.currentModalPosition === 'top') {
                        this.slideDown();
                        return null;
                    }
                    this.slideUp();
                }}
            style={{
                    height: draggableHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: dragBgColor,
                    // borderTopWidth: 1,
                    // borderTopColor: '#ddd'
                }}
          >
            {this.renderDraggableSection()}
          </TouchableOpacity>
          {this.renderContentSection()}
        </View>
      </Animated.View>
    );
  }
}
SlideUp.defaultProps = {
  visibleHeight: 0,
  draggableHeight: 40,
  contentSection: null,
  dragSection: null,
  dragBgColor: '#ddd',
  contentSectionBgColor: '#ddd',
  dragArrowColor: '#888',
  slideUpStatus: null,
};
