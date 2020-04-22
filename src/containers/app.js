import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios';
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
import VehicleCalendar from '../components/vehiclecalendar';

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
