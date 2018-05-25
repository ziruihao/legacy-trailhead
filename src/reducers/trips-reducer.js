import { ActionTypes } from '../actions';

const initialState = ({
  all: [],
  trip: {},
  isUserOnTrip: false,
  myTrips: [],
});

// Trips reducer
const TripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_TRIP:
      console.log('FETCH_TRIP reducer');
      console.log(action.payload);
      return Object.assign({}, state, { trip: action.payload.trip });
    case ActionTypes.JOIN_TRIP:
      return Object.assign({}, state, { isUserOnTrip: action.payload.added }); // isontrip?
    case ActionTypes.LEAVE_TRIP:
      return Object.assign({}, state, { isUserOnTrip: action.payload.isUserOnTrip }); // isontrip?
    case ActionTypes.IS_ON_TRIP:
      return Object.assign({}, state, { isUserOnTrip: action.payload });
    case ActionTypes.MY_TRIPS:
      return Object.assign({}, state, { myTrips: action.payload });
    default:
      return state;
  }
};

export default TripsReducer;
