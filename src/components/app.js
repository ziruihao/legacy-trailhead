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
import ProfilePage from './profile-page';
import TripDetails from './tripdetails';
import OpoApprovals from './opoStuff';
import NavBar from './nav-bar/nav-bar';
import OpoTrips from './opotrips';
import OpoVehicleRequests from './opo-vehicle-requests';
import OpoVehicleRequest from './opo-vehicle-request';
import OPODashboard from './opo-dashboard';
import VehicleCalendar from './vehiclecalendar';
import Gateway from './gateway';
import FleetManagement from './fleet-management';
import { getUser, getClubs, getVehicles } from '../actions';

const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-planner.herokuapp.com/api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  /**
   * Conditional data load if the browser's token is valid.
   */
  componentWillMount() {
    this.verifyToken().then(() => {
      this.loadData();
    }).catch(() => {
      this.setState({ loaded: true });
    });
  }

  /**
   * Upon mounting of App component, critical user and platform data is loaded from the backend.
   */
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

  /**
   * Checks the validity of the token stored in browser. Invalid tokens will cause a cache clear and put the user through the re-authentication process.
   */
  verifyToken = () => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get(`${ROOT_URL}/user`, { headers: { authorization: token } })
          .then(() => {
            resolve();
          })
          .catch(() => {
            localStorage.clear();
            reject();
          });
      } else { reject(); }
    });
  }

  requireAuth = (RequestedComponent, switchMode) => {
    if (this.props.authenticated) return <RequestedComponent switchMode={switchMode ? true : undefined} {...this.props} />;
    else return <Gateway dataLoader={this.loadData} />;
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <Router>
          <div id="theBody">
            <Switch>
              <Route path="/" component={Gateway} />
            </Switch>
          </div>
        </Router>
      );
    } else if (this.state.loaded) {
      return (
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/user" component={ProfilePage} />
            <Route path="/all-trips" component={AllTrips} />
            <Route path="/vehicle-request/:vehicleReqId" component={VehicleRequest} />
            <Route path="/vehicle-request" component={VehicleRequest} />
            <Route path="/trip/:tripID" component={TripDetails} />
            <Route path="/createtrip" component={CreateTrip} />
            <Route path="/my-trips" component={MyTrips} />
            <Route path="/edittrip/:tripID" component={CreateTrip} />
            <Route path="/opo-trips" component={OpoTrips} />
            <Route path="/vehicle-requests" component={OpoVehicleRequests} />
            <Route path="/opo-vehicle-request/:vehicleReqId" component={OpoVehicleRequest} />
            <Route path="/opo-dashboard" component={OPODashboard} />
            <Route path="/opo-fleet-management" component={FleetManagement} />
            <Route path="/leader-approvals" component={OpoApprovals} />
            <Route path="/vehicle-calendar" component={VehicleCalendar} />
          </Switch>
        </Router>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
});

export default connect(mapStateToProps, { getUser, getClubs, getVehicles })(App);
