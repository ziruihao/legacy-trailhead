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
    let createTripsLink, viewApprovalsLink;
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

    if (this.props.role === 'OPO') {
      viewApprovalsLink = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/opo">
            OPO Stuff
          </NavLink>
        </li>
      );
    } else {
      viewApprovalsLink = null;
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

            <li className="nav-item">
              <NavLink className="nav-link" to="/mytrips">
                My Trips
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/user">
                My Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tripscalendar">
                Trips Calendar
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/vehiclescheduler">
                Vehicle Scheduler
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
