import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';

import { connect } from 'react-redux';
import Dashboard from '../containers/dashboard';
import AllTrips from './trips';
import CreateTrip from './createtrip';
import MyTrips from './myTrips';
import VehicleRequest from './vehiclerequest';
import ProfilePage from './profilepage';
import TripDetails from './tripdetails';
import OpoApprovals from './opoStuff';
import NavBar from './nav-bar/nav-bar';
import OpoTrips from './opotrips';
import OpoVehicleRequests from './opo-vehicle-requests';
import OpoVehicleRequest from './opoVehicleRequest';
import OPODashboard from './opo-dashboard';
import requireAuth from '../containers/requireAuth';
import VehicleCalendar from './vehiclecalendar';

import { getUser, getClubs, getVehicles } from '../actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentWillMount() {
    if (this.props.authenaticated) {
      this.loadData();
    } else { this.setState({ loaded: true }); }
  }

  loadData = () => {
    return new Promise((resolve, reject) => {
      this.props.getUser().then(() => {
        this.props.getClubs().then(() => {
          this.props.getVehicles().then(() => {
            this.setState({ loaded: true });
            resolve();
          });
        });
      }).catch(error => reject(error));
    });
  }

  render() {
    if (this.state.loaded) {
      return (
        <Router>
          <NavBar />
          <div id="theBody">
            <Switch>
              <Route exact path="/" component={requireAuth(Dashboard, this.loadData)} />
              <Route path="/user" component={requireAuth(ProfilePage, this.loadData)} />
              <Route path="/all-trips" component={requireAuth(AllTrips, this.loadData)} />
              <Route path="/vehicle-request/:vehicleReqId" component={requireAuth(VehicleRequest, this.loadData, 'viewMode')} />
              <Route path="/vehicle-request" component={requireAuth(VehicleRequest, this.loadData)} />
              <Route path="/trip/:tripID" component={requireAuth(TripDetails, this.loadData)} />
              <Route path="/createtrip" component={requireAuth(CreateTrip, this.loadData)} />
              <Route path="/my-trips" component={requireAuth(MyTrips, this.loadData)} />
              <Route path="/edittrip/:tripID" component={requireAuth(CreateTrip, this.loadData, 'editMode')} />
              <Route path="/opo-trips" component={requireAuth(OpoTrips, this.loadData)} />
              <Route path="/vehicle-requests" component={requireAuth(OpoVehicleRequests, this.loadData)} />
              <Route path="/opo-vehicle-request/:vehicleReqId" component={requireAuth(OpoVehicleRequest, this.loadData)} />
              <Route path="/opo-dashboard" component={requireAuth(OPODashboard, this.loadData)} />
              <Route path="/leader-approvals" component={requireAuth(OpoApprovals, this.loadData)} />
              <Route path="/vehicle-calendar" component={requireAuth(VehicleCalendar, this.loadData)} />
            </Switch>
          </div>
        </Router>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

const mapStateToProps = state => ({
  authenaticated: state.auth.authenaticated,
});

export default connect(mapStateToProps, { getUser, getClubs, getVehicles })(App);
