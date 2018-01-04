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
    unit = await axios.get(`${API_ENDPOINT}/units/${id}?cacheBuster=${(new Date()).getTime()}`, null, {
      headers,
    });
    unitMembers = await axios.get(`${API_ENDPOINT}/units/${id}/members?includeSubUnits=false&cacheBuster=${(new Date()).getTime()}`, null, {
      headers,
    });
    return { unit: unit.data, unitMembers: unitMembers.data };
  } catch (e) {
    throw e;
  }
};


const search = (searchQuery, secret) =>
  async (dispatch) => {
    dispatch({
      type: types.SET_RESULT,
      payload: {
        searchQuery,
        data: [],
      },
    });
    if (searchQuery && searchQuery.trim().length > 2) {
      console.log(`perform search for ${searchQuery}`);
      try {
        const data = await searchAxios(searchQuery, secret);
        dispatch({
          type: types.SET_RESULT,
          payload: {
            searchQuery,
            data,
          },
        });
      } catch (e) {
        if (e.response) {
          console.log(`e.response.status :${e.response.status}`);
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
    }
  };
const getPersonDetail = (id, secret) =>
  async (dispatch) => {
    try {
      const person = await getPersonByIdAxios(id, secret);
      console.log(` ---------------- getPersonDetail : ${JSON.stringify(person, null, 3)}`);
      dispatch({
        type: types.SET_PERSON,
        payload: {
          person,
        },
      });
    } catch (e) {
      console.log('---------------- Error getPersonDetail ------------------');
      if (e.response) {
        console.log(`e.response.status :${e.response.status}`);
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
    try {
      const unit = await getUnitByIdAxios(id, secret);
      dispatch({
        type: types.SET_UNIT,
        payload: {
          unit,
        },
      });
    } catch (e) {
      if (e.response) {
        console.log(`e.response.status :${e.response.status}`);
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
