import { combineReducers } from 'redux';
import auth from './AuthReducer';
import directory from './SearchReducer';
import bilune from './BiluneReducer';
import network from './NetworkReducer';
import pidho from './PidhoReducer';

export default combineReducers({
  auth,
  directory,
  bilune,
  pidho,
  network,
});
