import { ActionTypes } from '../actions';

const initialState = ({
  all: [],
  trip: {},
  isOnTrip: false,
  myTrips: [],
});

// Trips reducer
const TripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_TRIP:
      return Object.assign({}, state, { trip: action.payload.trip });
    case ActionTypes.JOIN_TRIP:
      console.log('action.payload join trip');
      console.log(action.payload);
      return Object.assign({}, state, { isOnTrip: action.payload }); // isontrip?
    case ActionTypes.LEAVE_TRIP:
      return Object.assign({}, state, { isOnTrip: action.payload }); // isontrip?
    case ActionTypes.IS_ON_TRIP:
      console.log('action.payload is_on_trip');
      console.log(action.payload);
      return Object.assign({}, state, { isOnTrip: action.payload });
    case ActionTypes.MY_TRIPS:
      return Object.assign({}, state, { myTrips: action.payload });
    default:
      return state;
  }
};

export default TripsReducer;
