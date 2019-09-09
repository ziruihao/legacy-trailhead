import { ActionTypes } from '../actions';


const UserReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER:
      return Object.assign({}, action.payload);
    case ActionTypes.UPDATE_USER_ID:
        return Object.assign({}, state, {user: {id: action.payload}});
    default:
      return state;
  }
};

export default UserReducer;
