import { ActionTypes } from '../actions';

const initialState = {
  authenticated: false,
  profileCompleted: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_USER:
      return Object.assign({}, state, { authenticated: true });
    case ActionTypes.DEAUTH_USER:
      return Object.assign({}, state, { authenticated: false });
    case ActionTypes.COMPLETED_PROFILE:
      return Object.assign({}, state, { profileCompleted: true });
    default:
      return state;
  }
};

export default AuthReducer;
