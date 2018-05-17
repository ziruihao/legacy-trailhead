import { ActionTypes } from '../actions';

// Trips reducer
const TripsReducer = (state = { all: [], trip: {} }, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_TRIP:
      return Object.assign({}, state, { trip: action.payload });
    case ActionTypes.CREATE_TRIP:
      return Object.assign({}, state, {
        all: [...state.all, action.payload],
      });
    case ActionTypes.SIGN_UP_TRIP:
      return state; // temporary
    case ActionTypes.CANCEL_TRIP:
      return state; // temporary
    default:
      return state;
  }
};

export default TripsReducer;
