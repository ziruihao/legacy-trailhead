import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import reducers from './reducers';

import Dashboard from './containers/dashboard';
import AllTrips from './components/allTrips';
import CreateTrip from './components/createtrip';
import MyTrips from './components/myTrips';
import VehicleRequest from './components/vehiclerequest';
import ProfilePage from './components/profilepage';
import TripDetails from './components/tripdetails';
import OpoApprovals from './components/opoStuff';
import NavBar from './components/navbar';
import OpoTrips from './components/opotrips';
import OpoVehicleRequests from './components/opoVehicleRequests';
import OpoVehicleRequest from './components/opoVehicleRequest';
import OPODashboard from './components/opoDashboard';
import requireAuth from './containers/requireAuth';
import VehicleCalendar from './components/vehiclecalendar';
import { ActionTypes, getUser, getClubs, getVehicles } from './actions';
import './styles/base.scss';
import './styles/homepage-style.scss';

// this creates the store with the reducers, and does some other stuff to initialize devtools
// boilerplate to copy, don't have to know
const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
));

const token = localStorage.getItem('token');
const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-planner.herokuapp.com/api';
if (token) {
  axios.get(`${ROOT_URL}/user`, { headers: { authorization: token } })
    .then((response) => {
      store.dispatch({ type: ActionTypes.AUTH_USER });
      store.dispatch({ type: ActionTypes.UPDATE_USER, payload: response.data.user });
      store.dispatch(getClubs());
      store.dispatch(getVehicles());
    })
    .catch(() => {
      localStorage.clear();
      store.dispatch({ type: ActionTypes.DEAUTH_USER });
    });
}

const FallBack = (props) => {
  return <div>URL Not Found</div>;
};


const App = (props) => {
  return (
    <Router>
      <NavBar />
      <div id="theBody">
        <Switch>
          <Route exact path="/" component={requireAuth(Dashboard)} />
          <Route path="/user" component={requireAuth(ProfilePage)} />
          <Route path="/all-trips" component={requireAuth(AllTrips)} />
          <Route path="/vehicle-request/:vehicleReqId" component={requireAuth(VehicleRequest, 'viewMode')} />
          <Route path="/vehicle-request" component={requireAuth(VehicleRequest)} />
          <Route path="/trip/:tripID" component={requireAuth(TripDetails)} />
          <Route path="/createtrip" component={requireAuth(CreateTrip)} />
          <Route path="/my-trips" component={requireAuth(MyTrips)} />
          <Route path="/edittrip/:tripID" component={requireAuth(CreateTrip, 'editMode')} />
          <Route path="/opo-trips" component={requireAuth(OpoTrips)} />
          <Route path="/vehicle-requests" component={requireAuth(OpoVehicleRequests)} />
          <Route path="/opo-vehicle-request/:vehicleReqId" component={requireAuth(OpoVehicleRequest)} />
          <Route path="/opo-dashboard" component={requireAuth(OPODashboard)} />
          <Route path="/leader-approvals" component={requireAuth(OpoApprovals)} />
          <Route path="/vehicle-calendar" component={requireAuth(VehicleCalendar)} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};
// component={requireAuth() => <CreateTrip isEditMode={true} />}
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main'),
);
