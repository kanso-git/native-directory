import { combineReducers } from 'redux';
import auth from './AuthReducer';
import directory from './SearchReducer';
import bilune from './BiluneReducer';

export default combineReducers({
  auth,
  directory,
  bilune,
});
