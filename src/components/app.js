/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';
import DOCLoading from './doc-loading';
import Dashboard from './dashboard';
import AllTrips from './trips';
import CreateTrip from './createtrip';
import MyTrips from './my-trips';
import VehicleRequestPage from './vehicle-request';
import VehicleRequest from './vehiclerequest';
import ProfilePage from './profile-page';
import TripDetails from './tripdetails';
import OPOLeaders from './opo-approvals/leaders';
import NavBar from './nav-bar/nav-bar';
import OPOTrips from './opo-approvals/trips';
import OPOVehicleRequests from './opo-approvals/vehicle-requests';
import OPOVehicleRequest from './opo-vehicle-request';
import OPODashboard from './opo-dashboard';
import VehicleCalendar from './vehicleCalendar';
import Gateway from './gateway';
import FleetManagement from './fleet-management';
import { ROOT_URL, green } from '../constants';
import { MobileCheckIn, MobileCheckOut } from './mobile-check';
import CompleteProfile from './gateway/complete-profile';
import { getUser, authUser, getClubs, getVehicles } from '../actions';


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
  componentDidMount() {
    this.verifyToken().then(() => {
      this.loadData();
    }).catch((error) => {
      this.setState({ loaded: true });
    });
  }

  /**
   * Upon mounting of App component, critical user and platform data is loaded from the backend.
   */
  loadData = () => {
    return new Promise((resolve, reject) => {
      this.props.getClubs().then(() => {
        this.props.getVehicles().then(() => {
          this.setState({ loaded: true });
          resolve();
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
        this.props.getUser().then((user) => {
          if (user.completedProfile) this.props.authUser();
          resolve();
        }).catch(() => {
          localStorage.clear();
          reject();
        });
      } else { reject(); }
    });
  }

  requireRole = (RequestedComponent, switchMode) => {
    switch (this.props.user.role) {
      case 'OPO':
        if (switchMode) return <RequestedComponent switchMode={switchMode ? true : undefined} {...this.props} />;
        else window.location.replace(`${ROOT_URL}/opo-dashboard`);
        break;
      case 'Leader':
        // if (switchMode) return <MyTrips switchMode={switchMode ? true : undefined} {...this.props} />;
        window.location.replace(`${ROOT_URL}/my-trips`);
        break;
      default:
        // if (switchMode) return <AllTrips switchMode={switchMode ? true : undefined} {...this.props} />;
        window.location.replace(`${ROOT_URL}/all-trips`);
    }
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <Router>
          <div id="theBody">
            <Switch>
              <Route path="/trip-check-in/:tripID" component={MobileCheckIn} />
              <Route path="/trip-check-out/:tripID" component={MobileCheckOut} />
              <Route path="/"><Gateway dataLoader={this.loadData} /></Route>
            </Switch>
          </div>
        </Router>
      );
    } else if (this.state.loaded) {
      return (
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/">{() => this.requireRole(null, false)}</Route>
            <Route path="/user" component={ProfilePage} />
            <Route path="/complete-profile" component={CompleteProfile} />
            <Route path="/all-trips" component={AllTrips} />
            <Route path="/vehicle-request/:vehicleReqId" component={VehicleRequest} />
            <Route path="/vehicle-request" component={VehicleRequestPage} />
            <Route path="/trip/:tripID" component={TripDetails} />
            <Route path="/createtrip" component={CreateTrip} />
            <Route path="/my-trips" component={MyTrips} />
            <Route path="/edittrip/:tripID" component={CreateTrip} />
            <Route path="/opo-trips" component={OPOTrips} />
            <Route path="/vehicle-requests" component={OPOVehicleRequests} />
            <Route path="/opo-vehicle-request/:vehicleReqId" component={OPOVehicleRequest} />
            <Route path="/opo-dashboard">{() => this.requireRole(OPODashboard, true)}</Route>
            <Route path="/opo-fleet-management" component={FleetManagement} />
            <Route path="/leader-approvals" component={OPOLeaders} />
            <Route path="/vehicle-calendar" component={VehicleCalendar} />
            <Route path="/trip-check-in/:tripID" component={MobileCheckIn} />
            <Route path="/trip-check-out/:tripID" component={MobileCheckOut} />
          </Switch>
        </Router>
      );
    } else {
      return <DOCLoading type="doc" height="150" width="150" measure="px" />;
    }
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  user: state.user.user,
});

export default connect(mapStateToProps, { getUser, authUser, getClubs, getVehicles })(App);
