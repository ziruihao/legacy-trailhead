import { combineReducers } from 'redux';
import AuthReducer from './auth-reducer';
import TripsReducer from './trips-reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  trip: TripsReducer,
});

export default rootReducer;
