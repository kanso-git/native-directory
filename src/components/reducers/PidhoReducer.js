/* eslint-disable consistent-return */
import * as types from './../actions/Types';

const INITIAL_STATE = {
  courses: {},
  profCourses: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.STORE_COURSE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
