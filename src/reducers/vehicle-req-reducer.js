import { ActionTypes } from '../actions';

const initialState = ({
  vehicleReq: {},
  vehicleRequests: [],
  vehicles: [],
  invalidAssignments: [],
});

const OPOReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_VEHICLE_REQUEST:
      return Object.assign({}, state, { vehicleReq: action.payload });
    case ActionTypes.FETCH_VEHICLE_REQUESTS:
      return Object.assign({}, state, { vehicleRequests: action.payload });
    case ActionTypes.FETCH_VEHICLES:
      return Object.assign({}, state, { vehicles: action.payload });
    case ActionTypes.OPO_RESPOND_TO_VEHICLE_REQUEST:
      return Object.assign({}, state, { vehicleReq: action.payload.updatedVehicleRequest, invalidAssignments: action.payload.invalidAssignments });
    default:
      return state;
  }
};

export default OPOReducer;
