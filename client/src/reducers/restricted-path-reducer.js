import { ActionTypes } from '../actions';

const initialState = {
  restrictedPath: '/',
};

const RestrictedPathReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_RESTRICTED_PATH:
      return Object.assign({}, state, { restrictedPath: action.payload });
    default:
      return state;
  }
};

export default RestrictedPathReducer;
