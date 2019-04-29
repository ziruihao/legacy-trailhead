import { combineReducers } from 'redux';
import AuthReducer from './auth-reducer';
import TripsReducer from './trips-reducer';
import UserReducer from './user-reducer';
import ClubsReducer from './clubs-reducer';
import ErrorReducer from './error-reducer';
import OPOReducer from './opo-reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  trips: TripsReducer,
  user: UserReducer,
  clubs: ClubsReducer,
  error: ErrorReducer,
  opo: OPOReducer,
});

export default rootReducer;
