import { combineReducers } from 'redux';

import TripsReducer from './trips-reducer';

const rootReducer = combineReducers({
  trip: TripsReducer,
});

export default rootReducer;
