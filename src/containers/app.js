import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';

import { connect } from 'react-redux';
import Dashboard from './dashboard';
import AllTrips from '../components/allTrips';
import CreateTrip from '../components/createtrip';
import MyTrips from '../components/myTrips';
import VehicleRequest from '../components/vehiclerequest';
import ProfilePage from '../components/profilepage';
import TripDetails from '../components/tripdetails';
import OpoApprovals from '../components/opoStuff';
import NavBar from './navbar';
import OpoTrips from '../components/opotrips';
import OpoVehicleRequests from '../components/opoVehicleRequests';
import OpoVehicleRequest from '../components/opoVehicleRequest';
import OPODashboard from '../components/opoDashboard';
import requireAuth from './requireAuth';
import VehicleCalendar from './vehicleCalendar';

import { getUser, getClubs, getVehicles } from '../actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentWillMount() {
    this.props.getUser().then(() => {
      this.props.getClubs().then(() => {
        this.props.getVehicles().then(() => {
          console.log('done');
          this.setState({ loaded: true });
        });
      });
    });
  }

  render() {
    if (this.state.loaded) {
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
            </Switch>
          </div>
        </Router>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

export default connect(null, { getUser, getClubs, getVehicles })(App);
