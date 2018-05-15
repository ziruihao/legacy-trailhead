import { ActionTypes } from '../actions';

// Posts reducer
const TripsReducer = (state = { all: [], trip: {} }, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_TRIP:
      return Object.assign({}, state, { trip: action.payload });
    default:
      return state;
  }
};

export default TripsReducer;
