/* eslint-disable consistent-return */
import axios from 'axios';
import { API_ENDPOINT,
  SECURITY_HEADER_NAME,
  HOME_SCREEN,
  PERSON_SCREEN,
  UNIT_SCREEN } from 'react-native-dotenv';
import * as types from './Types';


const searchAxios = async (query, secret) => {
  let res;
  const headers = {};
  headers[`${SECURITY_HEADER_NAME}`] = secret;
  headers['Content-Type'] = 'text/plain';
  try {
    res = await axios.post(`${API_ENDPOINT}/search`, query, {
      headers,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
const getPersonByIdAxios = async (id, secret) => {
  let res;
  const headers = {};
  headers[`${SECURITY_HEADER_NAME}`] = secret;
  headers['Content-Type'] = 'text/plain';
  try {
    res = await axios.get(`${API_ENDPOINT}/persons/${id}?cacheBuster=${(new Date()).getTime()}`, {
      headers,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

const getUnitByIdAxios = async (id, secret) => {
  let unit;
  let unitMembers;
  const headers = {};
  headers[`${SECURITY_HEADER_NAME}`] = secret;
  headers['Content-Type'] = 'text/plain';
  try {
    unit = await axios.get(`${API_ENDPOINT}/units/${id}?cacheBuster=${(new Date()).getTime()}`, {
      headers,
    });
    unitMembers = await axios.get(`${API_ENDPOINT}/units/${id}/members?includeSubUnits=false&cacheBuster=${(new Date()).getTime()}`, {
      headers,
    });
    return {
      unit: unit.data,
      unitMembers: unitMembers.data.map((item, index) => ({ ...item, key: item.id, index })),
    };
  } catch (e) {
    throw e;
  }
};


const search = (searchQuery, secret) =>
  async (dispatch) => {
    if (searchQuery && searchQuery.trim().length > 2) {
      try {
        dispatch({
          type: types.SHOW_SPINNER,
          payload: {
            searchQuery,
            spinner: true,
          },
        });
        const data = await searchAxios(searchQuery, secret);
        dispatch({
          type: types.SET_RESULT,
          payload: {
            searchQuery,
            data,
            spinner: false,
          },
        });
      } catch (e) {
        if (e.response) {
          if (e.response.status === 401) {
            dispatch({
              type: types.RETRY,
              payload: {
                screen: HOME_SCREEN,
              },
            });
          }
        }
      }
    } else {
      dispatch({
        type: types.SET_RESULT,
        payload: {
          searchQuery,
          data: [],
          spinner: false,
        },
      });
    }
  };
const getPersonDetail = (id, secret) =>
  async (dispatch) => {
    try {
      dispatch({
        type: types.SHOW_SPINNER,
        payload: {
          spinner: true,
        },
      });
      const person = await getPersonByIdAxios(id, secret);
      dispatch({
        type: types.SET_PERSON,
        payload: {
          person,
          spinner: false,
        },
      });
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          dispatch({
            type: types.RETRY,
            payload: {
              screen: PERSON_SCREEN,

            },
          });
        }
      }
    }
  };

const getUnitDetail = (id, secret) =>
  async (dispatch) => {
    dispatch({
      type: types.SHOW_SPINNER,
      payload: {
        spinner: true,
      },
    });
    try {
      const unit = await getUnitByIdAxios(id, secret);
      dispatch({
        type: types.SET_UNIT,
        payload: {
          unit,
          spinner: false,
        },
      });
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          dispatch({
            type: types.RETRY,
            payload: {
              screen: UNIT_SCREEN,
            },
          });
        }
      }
    }
  };


export {
  search,
  getPersonDetail,
  getUnitDetail,
};
