import { combineReducers } from 'redux';
import auth from './AuthReducer';
import directory from './SearchReducer';
import bilune from './BiluneReducer';
import network from './NetworkReducer';

export default combineReducers({
  auth,
  directory,
  bilune,
  network,
});
