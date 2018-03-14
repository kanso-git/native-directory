/* eslint-disable react/prop-types,no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Communications from 'react-native-communications';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Icon from 'react-native-fa-icons';
import I18n from 'react-native-i18n';
import { Card, CardSection } from './common';
import { pidhoActions } from './actions';

const styles = StyleSheet.create({
  textStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23,
    flex: 11,
    height: 20,
    width: 100,
  },
  textStyleElem: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    flex: 11,
    height: 20,
    width: 100,
  },
  titleStyleElem: {
    color: '#A9A9A9',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    flex: 11,
    height: 20,
    width: 100,
  },
  textStyleElem2: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 37,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    flex: 11,
    height: 20,
    width: 100,
  },
  iconStyle: {
    fontSize: 18,
    paddingLeft: 5,
    flex: 1,
  },
  containerStyle: {
    flex: 1,
    height: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  touchable: {
    color: '#007aff',
  },
  touchableContainer: {
    marginBottom: 15,
  },
  iconWrapper: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressStyle: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
const {
  containerStyle,
  iconWrapper,
  iconStyle,
  textStyle,
  textStyleElem,
  titleStyleElem,
  touchable,
  touchableContainer,
  addressStyle,
} = styles;


class Person extends Component {
  componentDidMount() {
    const bipeId = this.props.person.id;
    const { courses } = this.props;
    if (courses && courses[bipeId]) {
      console.log(` don't load the course list for bipeId${bipeId}`);
    } else {
      this.props.loadCoursesbyBipeId(bipeId);
    }
  }
  formatPositions = (person) => {
    if (!person.positions) {
      person.currFunctions = [];
      person.positions = [];
    } else {
      const { positions } = person;
      const currTitles = positions.filter(p => p.positionType === 'title');
      const currFunctions = positions.filter(p => p.positionType === 'function');

      const finalPositions = currFunctions.map((p, key) => {
        const functionTitle = currTitles.filter((t) => {
          const isFoundAndNotDeleted =
           t.organizationalUnit.id === p.organizationalUnit.id && !t.deleted;
          if (isFoundAndNotDeleted) {
            t.deleted = true;
          }
          return isFoundAndNotDeleted;
        });

        if (functionTitle.length > 0) {
          p.titleName = functionTitle[0].positionName;
          functionTitle[0].deleted = true;
        }

        if (currFunctions.length === 1) {
          currFunctions[0].displayOrder = '';
        } else {
          const displayOrder = key + 1;
          p.displayOrder = displayOrder.toString();
        }
        return p;
      });

      // add unassigned titles to the end on the positions array
      currTitles.forEach((t) => {
        if (!t.deleted) {
          t.displayOrder = '';
          finalPositions.push(t);
        }
      });
      person.currFunctions = currFunctions;
      person.positions = finalPositions;
    }
    return person;
  };
renderPersonlUrl = (url) => {
  if (url) {
    return (
      <TouchableOpacity onPress={() => Communications.web(url)}>
        <View style={[containerStyle, touchableContainer]}>
          <Icon name="external-link" style={[iconStyle, touchable]} allowFontScaling />
          <Text style={[textStyleElem, touchable]}>{url} </Text>
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};
renderPhones = props => props.person.phones.map(phone => (
  <TouchableOpacity
    key={phone.external}
    onPress={
    () => Communications.phonecall(phone.external, true)}
  >
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="phone" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{phone.external} </Text>
    </View>
  </TouchableOpacity>
));

renderEmail = email => (
  <TouchableOpacity onPress={() => Communications.email([email], null, null, ' ', ' ')}>
    <View style={[containerStyle, touchableContainer]}>
      <Icon name="envelope" style={[iconStyle, touchable]} allowFontScaling />
      <Text style={[textStyleElem, touchable]}>{email} </Text>
    </View>
  </TouchableOpacity>
);

renderOfficeAddress = location => (
  <TouchableOpacity onPress={() => Actions.push('mapPage', { buildingCode: location.building.code, localCode: location.local.code })}>
    <View style={[containerStyle, { height: Platform.OS === 'android' ? 40 : 25 }, touchableContainer, { marginBottom: 15 }]}>
      <View style={iconWrapper}>
        <Icon name="building" style={[iconStyle, touchable]} allowFontScaling />
      </View>
      <View style={addressStyle}>
        <Text style={[touchable]}>{I18n.t('person.position.location.office')}: {location.local.code} </Text>
        <Text style={[touchable]}>{I18n.t('person.position.location.floor')}: {location.floor.name} </Text>
      </View>
    </View>
  </TouchableOpacity>
);
renderBuildingAddress = building => (
  <TouchableOpacity onPress={() => Actions.push('mapPage', { buildingCode: building.code })}>
    <View style={[containerStyle, touchableContainer,
      { marginBottom: 15, height: building.name ? 60 : 45 }]}
    >
      <View style={iconWrapper}>
        <Icon name="map-marker" style={[iconStyle, touchable]} allowFontScaling />
      </View>
      <View style={addressStyle}>
        { building.name && <Text style={[touchable]}> {building.name}</Text> }
        { building.addressLines.map(line => <Text style={[touchable]} key={line}> {line}</Text>)}
      </View>
    </View>
  </TouchableOpacity>
);

renderPositionElem = (position) => {
  const iconName = position.positionType === 'function' ? 'suitcase' : 'certificate';
  const title = position.positionType === 'function' ? `${I18n.t('person.position.position')} ${position.displayOrder}` : I18n.t('person.position.title');
  const value = position.positionName ? position.positionName : I18n.t('person.position.positionNA');
  return (
    <View>
      <View style={[containerStyle]}>
        <Icon name={iconName} style={iconStyle} allowFontScaling />
        <Text style={titleStyleElem}>{title}</Text>
      </View>
      <View style={[containerStyle, { marginBottom: 15 }]}>
        <Text style={iconStyle} />
        <Text style={textStyleElem}>{value} </Text>
      </View>
    </View>
  );
};
renderFunctions = props => props.person.positions.map((position, index) => (

  <CardSection key={index} style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
    {
      this.renderPositionElem(position)
    }
    {
        position.organizationalUnit && (
        <TouchableOpacity onPress={() => Actions.replace('unitDetails', { unitDetails: position.organizationalUnit })}>
          <View style={[containerStyle, touchableContainer]}>
            <Icon name="sitemap" style={[iconStyle, touchable]} allowFontScaling />
            <Text style={[textStyleElem, touchable]}>{position.organizationalUnit.name} </Text>
          </View>
        </TouchableOpacity>
        )

    }

    {
        position.location && (
          this.renderOfficeAddress(position.location)
        )
    }
    {
      (position.location && position.location.building) && (
        this.renderBuildingAddress(position.location.building)
      )
    }

  </CardSection>
));

render() {
  const {
    lastName,
    firstName,
    status,
    email,
    url,
    id,
  } = this.props.person;
  this.formatPositions(this.props.person);

  const { courses } = this.props;
  return (
    <Card>
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }} >
        <View style={[containerStyle, { height: 35 }]}>
          <Icon name="user-circle-o" style={[iconStyle, { fontSize: 22 }]} allowFontScaling />
          <Text style={textStyle}>{firstName} {lastName}</Text>
        </View>
        { (courses && courses[id] && courses[id].length > 0) &&
          <TouchableOpacity onPress={() => Actions.replace('personCoursDetails', { person: this.props.person })}>
            <View style={[containerStyle, { height: 35 }]}>
              <Icon name="graduation-cap" style={[iconStyle, { fontSize: 22 }, touchable]} allowFontScaling />
              <Text style={[textStyle, touchable]}>{I18n.t('person.myCours')}</Text>
            </View>
          </TouchableOpacity>
        }
      </CardSection>
      <CardSection style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={[containerStyle, { marginBottom: 15 }]}>
          <Icon name="info-circle" style={iconStyle} allowFontScaling />
          <Text style={textStyleElem}>{status}</Text>
        </View>
        { email && this.renderEmail(email)}
        { this.props.person.phones && this.renderPhones(this.props)}
        { url && this.renderPersonlUrl(url)}
      </CardSection>
      { this.props.person.positions && this.renderFunctions(this.props)}
    </Card>
  );
}
}

const mapStateToProps = state => (
  {
    courses: state.pidho.courses,
    profCourses: state.pidho.profCourses,
  }
);

export default connect(mapStateToProps, { ...pidhoActions })(Person);
