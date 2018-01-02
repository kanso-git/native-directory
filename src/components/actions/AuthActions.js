import axios from 'axios';

import { API_ENDPOINT } from 'react-native-dotenv';

// const extractSecret = secret => ((secret.a - secret.b) * secret.c) || 0;


const register = () =>
  // Return a function that accepts `dispatch` so we can dispatch later.
  // Thunk middleware knows how to turn thunk async actions into actions.
  async (dispatch) => {
    try {
      //console.log(sjcl);
      //console.log(codec);
      const obs = await axios.post(`${API_ENDPOINT}/reg`, {});
      console.log(obs.data);
      // console.log(computeSecretHash(obs.data));
      return dispatch({
        type: '',
        payload: {
          secret: '',
        },
      });
    } catch (e) {
      console.log('error', e);
    }
  };

export {
  register,
};
