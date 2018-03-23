/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint-disable consistent-return */
import axios from 'axios';
import { API_ENDPOINT } from 'react-native-dotenv';
import * as types from './Types';
import * as utile from '../common/utile';

const hash = require('sjcl-hash-sha256/hash');

const partial = (len, x, _end) => {
  if (len === 32) { return x; }
  return (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;
};
const getPartial = x => Math.round(x / 0x10000000000) || 32;

const bitLength = function (a) {
  let l = a.length,
    x;
  if (l === 0) { return 0; }
  x = a[l - 1];
  return (l - 1) * 32 + getPartial(x);
};

const clamp = (a, len) => {
  if (a.length * 32 < len) { return a; }
  a = a.slice(0, Math.ceil(len / 32));
  const l = a.length;
  len &= 31;
  if (l > 0 && len) {
    a[l - 1] = partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);
  }
  return a;
};


const fromBits = function (arr) {
  let out = '',
    i;
  for (i = 0; i < arr.length; i++) {
    out += ((arr[i] | 0) + 0xF00000000000).toString(16).substr(4);
  }
  return out.substr(0, bitLength(arr) / 4);// .replace(/(.{8})/g, "$1 ");
};

/** Convert from a UTF-8 string to a bitArray. */
const toBitsUTF8 = (str) => {
  str = unescape(encodeURIComponent(str));
  let out = [],
    i,
    tmp = 0;
  for (i = 0; i < str.length; i++) {
    tmp = tmp << 8 | str.charCodeAt(i);
    if ((i & 3) === 3) {
      out.push(tmp);
      tmp = 0;
    }
  }
  if (i & 3) {
    out.push(partial(8 * (i & 3), tmp));
  }
  return out;
};

const toBits = (str) => {
  let i,
    out = [],
    len;
  str = str.replace(/\s|0x/g, '');
  len = str.length;
  str += '00000000';
  for (i = 0; i < str.length; i += 8) {
    out.push(parseInt(str.substr(i, 8), 16) ^ 0);
  }
  return clamp(out, len * 4);
};

const computeSecretHash = (secret) => {
  const num = ((secret.a - secret.b) * secret.c) | 0; // the bitwise or 'converts' the value to 32 bits integer
  const result = secret.alpha + num;
  let bitArray = toBitsUTF8(result);

  for (let i = 0; i < secret.d; i++) {
    bitArray = hash(bitArray);
  }
  return fromBits(bitArray);
};

const resetRetry = () => ({
  type: types.RESET,
  payload: null,
});

const register = () =>
  // Return a function that  accepts `dispatch` so we can dispatch later.
  // Thunk middleware knows how to turn thunk async actions into actions.
  async (dispatch) => {
    try {
      const obs = await axios.post(`${API_ENDPOINT}/reg`, {});
      return dispatch({
        type: types.STORE_SECRET,
        payload: {
          secret: computeSecretHash(obs.data),
        },
      });
    } catch (e) {
      const isConnected = await utile.isConnected();
      const service = 'register';
      return dispatch({
        type: types.UPDATE_CONNECTION_STATE,
        payload: {
          isConnected,
          service,
          error: e,
        },
      });
    }
  };

export {
  register,
  resetRetry,
};
