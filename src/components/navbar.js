import React from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { signOut } from '../actions';
import '../styles/navbar-style.scss';

const NavBar = (props) => {
  if (!props.authenticated) {
    return <nav className="navbar navbar-expand-lg navbar-light bg-dark" />;
  }

  return (
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
        <li className="nav-item">
          <NavLink className="nav-link" to="/createtrip">
            Create Trip
          </NavLink>
        </li>
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
      </ul>
      <button className="btn btn-danger signout-btn" onClick={() => props.signOut(props.history)}>Sign Out</button>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { signOut })(NavBar));
