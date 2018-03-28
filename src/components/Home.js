/* eslint-disable react/prop-types,no-empty */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { HOME_SCREEN } from 'react-native-dotenv';
import I18n from 'react-native-i18n';
import { Actions } from 'react-native-router-flux';
import * as ldsh from 'lodash';
import { Card, InputFlex, CardSection, Footer, Spinner, Chromatic, utile } from './common';
import * as logging from './common/logging';
import { authActions, searchActions, biluneActions } from './actions';
import SearchList from './SearchList';
import Slider from './Slider';
import MapHomePage from './MapHomePage';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchResultBox: {
    flex: 1,
    marginBottom: 40,
  },
  wrapperMapSlider: {
    flex: 1,
  },
  sliderBox: {
    flex: 5,
    justifyContent: 'center',
  },
  mapBox: {
    flex: 4,
  },
  resultText: {
    fontSize: 14,
    padding: 5,
  },
  spinnerWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },
});
const {
  container,
  resultText,
  searchResultBox,
  spinnerWrapper,
  sliderBox,
  mapBox,
  wrapperMapSlider,
} = styles;

class Home extends Component {
  state={
    focused: false,
  }
  componentWillMount() {
    // const { reset } = this.props.navigation.state.params;
    // logging.info(`>>>>>>>>>>>>>>>>>>>>>> Home resest is:${reset}`);
  }
  componentDidMount() {
    const { screens } = utile.gaParams;
    utile.trackScreenView(screens.home);
  }
  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { searchQuery } = nextProps.directory;

    if (secret == null && (retry > 0 && screen === HOME_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === HOME_SCREEN)) {
      this.props.search(searchQuery, secret);
      this.props.resetRetry();
    }
  }

  onFocus= () => {
    this.setState(() => ({ focused: true }));
    logging.log(`focus in :${this.state.focused}`);
  }
  onBlur= () => {
    this.setState(() => ({ focused: false }));
    logging.log(`focus out :${this.state.focused}`);
  }
  onCardTap = () => {
    const currentFocusStatus = this.state.focused;
    logging.log(`currentFocusStatus :${currentFocusStatus}`);
    if (Keyboard) {
      Keyboard.dismiss();
    }
    if (currentFocusStatus === true) {
      this.setState(() => ({ focused: false }));
    }
  }
  onSearch= (value) => {
    const { secret } = this.props.auth;
    if (this.props.bilune.buildings.length > 0 || this.props.bilune.state === 'BDL_LOADED') {
      this.props.search(value, secret);
      // new version 2.3.0 searchBilune
      this.props.searchBilune(value);
    }
  }
  onClearText = () => {
    this.onSearch('');
  }
  showBdlLoading = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    </View>
  )
  renderResultMessage= () => {
    const feedbackTranslated = I18n.t('search.feedback');
    const resultsTranslated = I18n.t('search.results');
    const resultTranslated = I18n.t('search.result');

    const { searchQuery } = this.props.directory;
    const { totalSearchResult } = this.props;

    if (searchQuery.length > 1) {
      let result = `${totalSearchResult.length} ${resultTranslated} `;
      if (totalSearchResult.length > 1) {
        result = `${totalSearchResult.length} ${resultsTranslated} `;
      }
      return (
        this.props.spinner ?
          <View style={spinnerWrapper}><Spinner size="small" /></View> :
          <Text style={resultText}>{feedbackTranslated + result} </Text>
      );
    }

    return null;
  }
  renderSectionJsx = text => (
    <View>
      <TouchableOpacity onPress={() => Actions.push('buildingList')}>
        <Text style={{
         fontSize: 18,
         padding: 5,
         backgroundColor: '#E5EFF5',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.5,
         elevation: 2,
         color: '#007aff',
       }}
        >
          {text}
        </Text>
      </TouchableOpacity>
      <Chromatic height={2} />
    </View>
  )
  renderFooter = () => (
    <View style={{
 position: 'absolute', left: 0, right: 0, bottom: 0,
}}
    >
      <Footer
        footerTitle1={`${I18n.t('global.footerLine1')}${I18n.t('global.month')} ${I18n.t('global.currentYear')}`}
        footerTitle2={`${I18n.t('global.footerLine2')}${I18n.t('global.currentYear')} ${I18n.t('global.owner')}`}
      />
    </View>
  )
  renderContent = () => {
    const { searchQuery } = this.props.directory;

    const entries = this.props.bilune.buildings ? this.props.bilune.buildings.map((b) => {
      b.image = this.props.bilune.images[b.id];
      return b;
    }) : null;
    const buildings = this.props.bilune.buildings ? this.props.bilune.buildings : null;

    if (searchQuery.length > 0 || !entries || this.state.focused) {
      return (
        <TouchableWithoutFeedback onPressIn={Keyboard.dismiss} accessible={false} onPress={e => this.onCardTap(e)}>
          <View style={searchResultBox}>
            <Card><SearchList /></Card>
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (entries && entries.length > 0 && buildings && buildings.length > 0) {
      const labelBuildingSection = `${I18n.t('section.building')} (${buildings.length})`;
      const bSelected = [];
      const aSelected = [];
      let newEntries = entries;
      let found = false;
      const currentBuildingIndex = this.props.bilune.id != null
        ? ldsh.findIndex(this.props.entries, { id: this.props.bilune.id }) : 0;
      if (currentBuildingIndex !== 0) {
        entries.forEach((b, i) => {
          if (i === currentBuildingIndex) {
            found = true;
          }
          if (!found) {
            bSelected.push(b);
          } else {
            aSelected.push(b);
          }
        });
        newEntries = [...aSelected, ...bSelected];
      }
      return (
        <View style={wrapperMapSlider} >
          {this.renderSectionJsx(labelBuildingSection)}
          <View style={sliderBox}><Slider entries={newEntries} /></View>
          <Chromatic height={2} />
          <View style={mapBox}><MapHomePage /></View>
        </View>
      );
    }
  }

  renderSpinner = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Spinner /></View> ;
  render() {
    const { searchQuery } = this.props.directory;
    return (
      <View style={container}>
        <Chromatic />
        <Card>
          <CardSection>
            <InputFlex
              icon="&#x1F50E;"
              placeholder={I18n.t('search.placeholder')}
              value={searchQuery}
              onChangeText={this.onSearch}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onClearText={this.onClearText}
              spinner={this.props.spinner}
            />
          </CardSection>
          {this.renderResultMessage()}
        </Card>
        {this.props.bilune.buildings.length === 0 ? this.showBdlLoading() : this.renderContent()}
        {this.renderFooter()}
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    directory: state.directory,
    auth: state.auth,
    spinner: state.directory.spinner,
    bilune: state.bilune,
    totalSearchResult: [...state.directory.searchResult,
      ...state.bilune.search.local,
      ...state.bilune.search.building],
    images: state.bilune.images,
  });

export default connect(mapStateToProps, { ...authActions, ...searchActions, ...biluneActions })(Home);
