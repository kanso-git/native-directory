/* eslint-disable react/prop-types,no-empty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Input, CardSection } from './common';
import { searchActions } from './actions';


class Home extends Component {
  componentWillMount() {
  }
  onSearch= () => {
  }
  render() {
    const { searchQuery } = this.props.directory;
    return (
      <Card>
        <CardSection>
          <Input
            autoFocus
            label="Search"
            placeholder="Eric"
            value={searchQuery}
            onChangeText={this.onSearch}
          />
        </CardSection>
      </Card>
    );
  }
}

const mapStateToProps = state => ({ directory: state.directory });

export default connect(mapStateToProps, searchActions)(Home);
