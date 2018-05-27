import { combineReducers } from 'redux';
import AuthReducer from './auth-reducer';
import TripsReducer from './trips-reducer';
import UserReducer from './user-reducer';
import ClubsReducer from './clubs-reducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  trips: TripsReducer,
  user: UserReducer,
  clubs: ClubsReducer,
});

export default rootReducer;
