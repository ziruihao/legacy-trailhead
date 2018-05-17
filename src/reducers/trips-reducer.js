import { ActionTypes } from '../actions';

const initialState = ({
  all: [],
  trip: {},
  isOnTrip: false,
});

// Trips reducer
const TripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_TRIP:
      console.log('action.payload fetch trip');
      console.log(action.payload);
      return Object.assign({}, state, { trip: action.payload });
    case ActionTypes.JOIN_TRIP:
      return Object.assign({}, state, { isOnTrip: action.payload });
    case ActionTypes.CANCEL_TRIP:
      return state; // temporary
    case ActionTypes.IS_ON_TRIP:
      return Object.assign({}, state, { isOnTrip: action.payload });
    default:
      return state;
  }
};

export default TripsReducer;
