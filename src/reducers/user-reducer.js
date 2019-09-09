import { ActionTypes } from '../actions';


const UserReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER:
      return Object.assign({}, Object.assign({}, action.payload.user, { hasCompleteProfile: action.payload.hasCompleteProfile }));
    case ActionTypes.UPDATE_USER_ID:
      return Object.assign({}, state, { user: { id: action.payload } });
    default:
      return state;
  }
};

export default UserReducer;
