import { ActionTypes } from '../actions';

const initialState = ({
  vehicleReq: {},
});

const OPOReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_VEHICLE_REQUEST:
      return Object.assign({}, state, { vehicleReq: action.payload });
    default:
      return state;
  }
};

export default OPOReducer;
