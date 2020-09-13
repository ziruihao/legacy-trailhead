import { ActionTypes } from '../actions';

const initialState = ({
  all: [],
  trip: {},
  myTrips: [],
  myVehicleReqs: [],
  isUserOnTrip: 'NONE', // other options: 'PENDING', 'YES'
  isLeaderOnTrip: false,
});

// Trips reducer
const TripsReducer = (state = initialState, action) => {
  const updatedState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, { all: action.payload });
    case ActionTypes.FETCH_TRIP:
      return Object.assign({}, state, { trip: action.payload.trip, isUserOnTrip: action.payload.userTripStatus, isLeaderOnTrip: action.payload.isLeaderOnTrip });
    case ActionTypes.ADD_PENDING:
      return Object.assign({}, state, { isUserOnTrip: action.payload.isUserOnTrip, trip: action.payload.trip });
    case ActionTypes.JOIN_TRIP:
      return Object.assign({}, state, { isUserOnTrip: action.payload.isUserOnTrip, trip: action.payload.trip });
    case ActionTypes.LEAVE_TRIP:
      return Object.assign({}, state, { isUserOnTrip: action.payload.isUserOnTrip, trip: action.payload.trip });
    case ActionTypes.SET_ATTENDENCE:
      console.log(updatedState.trip.members.find(member => member.user._id.toString() === action.payload.memberID.toString()).attended);
      console.log(action.payload.attending);
      updatedState.trip.members.find(member => member.user._id.toString() === action.payload.memberID.toString()).attended = action.payload.attending;
      return updatedState;
    case ActionTypes.MY_TRIPS:
      return Object.assign({}, state, { myTrips: action.payload.trips, myVehicleReqs: action.payload.vehicleRequests });
    case ActionTypes.EDIT_TRIP:
      return Object.assign({}, state, { trip: action.payload });
    default:
      return state;
  }
};

export default TripsReducer;
