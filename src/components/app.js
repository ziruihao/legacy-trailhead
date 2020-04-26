import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';
import Dashboard from './dashboard';
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
import VehicleCalendar from './vehiclecalendar';
import Gateway from './gateway';

import { getUser, getClubs, getVehicles } from '../actions';

const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-planner.herokuapp.com/api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentWillMount() {
    this.verifyToken().then(() => {
      this.loadData();
    }).catch(() => {
      this.setState({ loaded: true });
    });
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

  verifyToken = () => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('there is a token');
        axios.get(`${ROOT_URL}/user`, { headers: { authorization: token } })
          .then(() => {
            console.log('token works');
            resolve();
          })
          .catch(() => {
            console.log('token doesnt work');
            localStorage.clear();
            reject();
            // store.dispatch({ type: ActionTypes.DEAUTH_USER });
          });
      } else { reject(); }
    });
  }

  requireAuth = (RequestedComponent, switchMode) => {
    if (this.props.authenaticated) return <RequestedComponent switchMode={switchMode ? true : undefined} {...this.props} />;
    else return <Gateway dataLoader={this.loadData} />;
  }

  render() {
    if (this.state.loaded) {
      return (
        <Router>
          <NavBar />
          <div id="theBody">
            <Switch>
              <Route exact path="/" component={this.requireAuth(Dashboard)} />
              <Route path="/user" component={this.requireAuth(ProfilePage)} />
              <Route path="/all-trips" component={this.requireAuth(AllTrips)} />
              <Route path="/vehicle-request/:vehicleReqId" component={this.requireAuth(VehicleRequest, 'viewMode')} />
              <Route path="/vehicle-request" component={this.requireAuth(VehicleRequest)} />
              <Route path="/trip/:tripID" component={this.requireAuth(TripDetails)} />
              <Route path="/createtrip" component={this.requireAuth(CreateTrip)} />
              <Route path="/my-trips" component={this.requireAuth(MyTrips)} />
              <Route path="/edittrip/:tripID" component={this.requireAuth(CreateTrip, 'editMode')} />
              <Route path="/opo-trips" component={this.requireAuth(OpoTrips)} />
              <Route path="/vehicle-requests" component={this.requireAuth(OpoVehicleRequests)} />
              <Route path="/opo-vehicle-request/:vehicleReqId" component={this.requireAuth(OpoVehicleRequest)} />
              <Route path="/opo-dashboard" component={this.requireAuth(OPODashboard)} />
              <Route path="/leader-approvals" component={this.requireAuth(OpoApprovals)} />
              <Route path="/vehicle-calendar" component={this.requireAuth(VehicleCalendar)} />
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
