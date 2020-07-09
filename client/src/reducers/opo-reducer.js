import { ActionTypes } from '../actions';

const initialState = ({
  leaderApprovals: [],
  gearRequests: [],
  trippeeGearRequests: [],
  certApprovals: [],
  opoTrips: [],
});

const OPOReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_LEADER_APPROVALS:
      return Object.assign({}, state, { leaderApprovals: action.payload });
    case ActionTypes.FETCH_GEAR_REQUESTS:
      return Object.assign({}, state, { gearRequests: action.payload });
    case ActionTypes.FETCH_TRIPPEE_GEAR_REQUESTS:
      return Object.assign({}, state, { trippeeGearRequests: action.payload });
    case ActionTypes.FETCH_CERT_APPROVALS:
      return Object.assign({}, state, { certApprovals: action.payload });
    case ActionTypes.FETCH_OPO_TRIPS:
      return Object.assign({}, state, { opoTrips: action.payload });
    default:
      return state;
  }
};

export default OPOReducer;
