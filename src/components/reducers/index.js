import { combineReducers } from 'redux';
import auth from './AuthReducer';
import directory from './SearchReducer';

export default combineReducers({
  auth,
  directory,
});
