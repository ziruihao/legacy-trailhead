import { ActionTypes } from '../actions';

const initialState = ({
  user: null,
  jstor: { role: 'jstor' },
});

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER:
      return Object.assign({}, state, { user: action.payload });
      // return Object.assign({}, Object.assign({}, action.payload.user, { hasCompleteProfile: action.payload.hasCompleteProfile }));
    case ActionTypes.UPDATE_USER_ID:
      return Object.assign({}, state, { user: { id: action.payload } });
    default:
      return state;
  }
};

export default UserReducer;
