/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { HOME_SCREEN } from 'react-native-dotenv';
import { Card, InputFlex, CardSection } from './common';
import { authActions, searchActions } from './actions';
import SearchList from './SearchList';


class Home extends Component {
  componentWillReceiveProps(nextProps) {
    const { secret, retry, screen } = nextProps.auth;
    const { searchQuery } = nextProps.directory;
    console.log(`componentWillReceiveProps secret:${secret}, retry:${retry}, screen:${screen}`);
    if (secret == null && (retry > 0 && screen === HOME_SCREEN)) {
      this.props.register();
    } else if (secret != null && (retry > 0 && screen === HOME_SCREEN)) {
      this.props.search(searchQuery, secret);
      this.props.resetRetry();
    }
  }
  onSearch= (value) => {
    const { secret } = this.props.auth;
    this.props.search(value, secret);
  }
  render() {
    console.log('------------ render -----------');
    const { secret, retry } = this.props.auth;
    const { searchQuery } = this.props.directory;
    console.log(`render secret:${secret}
    retry:${retry}`);

    return (
      <View>
        <Card>
          <CardSection>
            <InputFlex
              autoFocus
              placeholder="&#x1F50E; personne, unité,.."
              value={searchQuery}
              onChangeText={this.onSearch}
            />
          </CardSection>
        </Card>
        <Card>
          <SearchList />
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => ({ directory: state.directory, auth: state.auth });

export default connect(mapStateToProps, { ...authActions, ...searchActions })(Home);
