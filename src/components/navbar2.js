import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
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
          <nav className="navbar navbar-expand-lg navbar-light" />
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </div>
      );
    }

    let navbar;
    if (this.props.role === 'OPO') {
      navbar = (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="../img/DOC-log.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link to="/alltrips">All Trips</Nav.Link>
              <NavDropdown title="Dashboard" id="basic-nav-dropdown">
                <NavDropdown.Item to="/opo-trips">Trip Approvals</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Vehicle Requests</NavDropdown.Item>
                <NavDropdown.Item to="/leader_approvals">Profile Approvals</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">OPO Officer Assignments</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item to="/opo-dashboard">Back to Dashboard</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link to="/user">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
    else if (this.props.role === 'Leader') {
      navbar = (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="../img/DOC-log.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link to="/alltrips">All Trips</Nav.Link>
              <Nav.Link to="/mytrips">Dashboard</Nav.Link>
              <Nav.Link to="/user">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
    else{
      navbar = (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="../img/DOC-log.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link to="/alltrips">All Trips</Nav.Link>
              <Nav.Link to="/mytrips">Dashboard</Nav.Link>
              <Nav.Link to="/user">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </Navbar>
      )
    }


    return (
      <div>
        {navbar}
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
          <nav className="navbar navbar-expand-lg navbar-light" />
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </div>
      );
    }
    let createTripsLink, viewApprovalsLink, opoTrips, opoDashboard;
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
      opoTrips = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/opo-trips">
            OPO Trips
          </NavLink>
        </li>
      );
      opoDashboard = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/opo-dashboard">
            OPO Dashboard
          </NavLink>
        </li>
      );
    } else {
      viewApprovalsLink = null;
      opoTrips = null;
    }

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
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
            {opoDashboard}

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
