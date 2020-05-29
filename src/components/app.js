/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';
import DOCLoading from './doc-loading';
import AllTrips from './trips';
import CreateTrip from './createtrip';
import MyTrips from './my-trips';
import VehicleRequestPage from './vehicle-request';
import VehicleRequest from './vehiclerequest';
import ProfilePage from './profile-page';
import { TripDetails } from './trip-details';
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
import { getUser, authUser, getClubs, getVehicles, clearError } from '../actions';


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

  requireRole = (RequestedComponent, allowedRoles, switchMode) => {
    if (this.props.user) {
      switch (this.props.user.role) {
        case 'OPO':
          if (switchMode && allowedRoles.includes('OPO')) return <RequestedComponent switchMode={switchMode ? true : undefined} {...this.props} />;
          else window.location.replace(`${ROOT_URL}/opo-dashboard`);
          break;
        case 'Leader':
          if (switchMode && allowedRoles.includes('Leader')) return <RequestedComponent switchMode={switchMode ? true : undefined} {...this.props} />;
          window.location.replace(`${ROOT_URL}/my-trips`);
          break;
        default:
          if (switchMode && allowedRoles.includes('Trippee')) return <RequestedComponent switchMode={switchMode ? true : undefined} {...this.props} />;
          window.location.replace(`${ROOT_URL}/all-trips`);
      }
    } else {
      window.location.replace(`${ROOT_URL}`);
    }
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <Router>
          <div id="theBody">
            <Switch>
              <Route path="/trip-check-out/:tripID" component={MobileCheckOut} />
              <Route path="/trip-check-in/:tripID" component={MobileCheckIn} />
              <Route path="/"><Gateway dataLoader={this.loadData} /></Route>
            </Switch>
          </div>
        </Router>
      );
    } else if (this.state.loaded) {
      return (
        <Router>
          <NavBar />
          <Toast className="doc-toast" onClose={this.props.clearError} show={this.props.errorMessage !== ''} delay={3000} autohide>
            <Toast.Header className="doc-toast-header" closeButton={false}>
              <strong className="mr-auto">Error</strong>
            </Toast.Header>
            <Toast.Body className="doc-toast-body">{this.props.errorMessage}</Toast.Body>
          </Toast>
          <Switch>
            <Route exact path="/">{() => this.requireRole(null, false)}</Route>
            <Route path="/user" component={ProfilePage} />
            <Route path="/complete-profile" component={CompleteProfile} />
            <Route path="/all-trips" component={AllTrips} />
            <Route path="/vehicle-request/:vehicleReqId">{() => this.requireRole(VehicleRequest, ['OPO', 'Leader'], true)}</Route>
            <Route path="/vehicle-request">{() => this.requireRole(VehicleRequestPage, ['OPO', 'Leader'], true)}</Route>
            <Route path="/trip/:tripID" component={TripDetails} />
            <Route path="/createtrip">{() => this.requireRole(CreateTrip, ['OPO', 'Leader'], true)}</Route>
            <Route path="/my-trips" component={MyTrips} />
            <Route path="/edittrip/:tripID">{() => this.requireRole(CreateTrip, ['OPO', 'Leader'], true)}</Route>
            <Route path="/opo-trips">{() => this.requireRole(OPOTrips, ['OPO'], true)}</Route>
            <Route path="/vehicle-requests">{() => this.requireRole(OPOVehicleRequests, ['OPO'], true)}</Route>
            <Route path="/opo-vehicle-request/:vehicleReqId">{() => this.requireRole(OPOVehicleRequest, ['OPO'], true)}</Route>
            <Route path="/opo-dashboard">{() => this.requireRole(OPODashboard, ['OPO'], true)}</Route>
            <Route path="/opo-fleet-management">{() => this.requireRole(FleetManagement, ['OPO'], true)}</Route>
            <Route path="/leader-approvals">{() => this.requireRole(OPOLeaders, ['OPO'], true)}</Route>
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
  errorMessage: state.error.errorMessage,
});

export default connect(mapStateToProps, { getUser, authUser, getClubs, getVehicles, clearError })(App);
