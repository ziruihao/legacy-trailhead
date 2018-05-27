import { ActionTypes } from '../actions';


const ClubsReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ALL_CLUBS:
      return Object.assign([], action.payload);
    default:
      return state;
  }
};

export default ClubsReducer;
