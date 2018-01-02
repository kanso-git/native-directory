import axios from 'axios';
import { API_ENDPOINT, SECURITY_HEADER_NAME } from 'react-native-dotenv';
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
                error: 'retry',
              },
            });
          }
        }
      }
    }
  };


export {
  search,
};
