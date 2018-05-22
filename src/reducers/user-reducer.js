import { ActionTypes } from '../actions';


const UserReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default UserReducer;
