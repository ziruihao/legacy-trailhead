import { ActionTypes } from '../actions';

const initialState = ({
  approvals: [],
});

const OPOReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_APPROVALS:
      return Object.assign({}, state, { approvals: action.payload });
    default:
      return state;
  }
};

export default OPOReducer;
