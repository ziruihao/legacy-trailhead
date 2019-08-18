import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { signOut, clearError } from '../actions';
import '../styles/navbar-style.scss';

class NavBar extends Component {
  componentDidMount() {
    this.props.history.listen((location, action) => {
      this.props.clearError();
    });
  }

  render() {
    if (this.props.errorMessage !== '') {
      setTimeout(() => { this.props.clearError(); }, 5000);
    }

    if (!this.props.authenticated) {
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-dark" />
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </div>
      );
    }
    let createTripsLink, viewApprovalsLink, opoTrips, vehicleRequest, vehicleRequests, myTrips;
    if (this.props.role === 'Leader') {
      createTripsLink = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/createtrip">
            Create Trip
          </NavLink>
        </li>
      );
    } else {
      createTripsLink = null;
    }

    if (this.props.role !== 'OPO') {
      vehicleRequest = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/vehiclerequest">
            Vehicle Request
          </NavLink>
        </li>
      );
      myTrips = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/mytrips">
            My Trips
          </NavLink>
        </li>
      );
    } else {
      vehicleRequest = null;
      myTrips = null;
    }

    if (this.props.role === 'OPO') {
      viewApprovalsLink = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/opo">
            OPO Stuff
          </NavLink>
        </li>
      );
      opoTrips = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/opo-trips">
            OPO Trips
          </NavLink>
        </li>
      );
      vehicleRequests = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/vehicle-requests">
            Vehicle Requests
          </NavLink>
        </li>
      );
    } else {
      viewApprovalsLink = null;
      opoTrips = null;
      vehicleRequests = null;
    }

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/">
                <i className="fas fa-home" />
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/alltrips">
                All Trips
              </NavLink>
            </li>

            {createTripsLink}
            {viewApprovalsLink}
            {opoTrips}
            {myTrips}
            <li className="nav-item">
              <NavLink className="nav-link" to="/user">
                My Profile
              </NavLink>
            </li>
            {vehicleRequest}
            {vehicleRequests}
            <li className="nav-item">
              <NavLink className="nav-link" to="/tripscalendar">
                Trips Calendar
              </NavLink>
            </li>
          </ul>
          <button type="button" className="btn btn-danger signout-btn" onClick={() => this.props.signOut(this.props.history)}>Sign Out</button>
        </nav>
        {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    errorMessage: state.error.errorMessage,
    role: state.user.role,
  };
};

export default withRouter(connect(mapStateToProps, { signOut, clearError })(NavBar));
