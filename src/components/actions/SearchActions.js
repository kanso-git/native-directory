import axios from 'axios';
import { API_ENDPOINT } from 'react-native-dotenv';
import * as types from './Types';

const searchAxios = async (query, secret) => {
  let res;
  try {
    res = await axios.post(`${API_ENDPOINT}/search?maxResults=100`, query, {
      headers: {
        'X-unine-directory-token': secret,
        'Content-Type': 'text/plain',
      },
    });
    console.log('------------');
    console.log(res);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
    // todo handle the other errors.
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
