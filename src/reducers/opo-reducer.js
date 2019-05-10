import { ActionTypes } from '../actions';

const initialState = ({
  approvals: [],
  gearRequests: [],
});

const OPOReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_APPROVALS:
      return Object.assign({}, state, { approvals: action.payload });
    case ActionTypes.FETCH_GEAR_REQUESTS:
      return Object.assign({}, state, { gearRequests: action.payload });
    default:
      return state;
  }
};

export default OPOReducer;
