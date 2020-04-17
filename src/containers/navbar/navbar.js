import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { signOut, clearError } from '../../actions';
import './navbar.scss';


class NavBar extends Component {
  componentDidMount() {
    this.props.history.listen((location, action) => {
      this.props.clearError();
    });
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light" />
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </div>
      );
    } else {
      return (
        <div className="nav-bar">
          {this.props.user && this.props.user.role === 'OPO'
            ? (
              <NavLink
                className={`nav-link ${this.props.history.location.pathname === '/opo-dashboard' ? 'current' : ''}`}
                to="/opo-dashboard"
              >
              Dashboard
              </NavLink>
            )
            : null
          }
          <NavLink className={`nav-link ${this.props.history.location.pathname === '/my-trips' ? 'current' : ''}`} to="/my-trips">My Trips</NavLink>
          <NavLink className={`nav-link ${this.props.history.location.pathname === '/all-trips' ? 'current' : ''}`} to="/all-trips">All Trips</NavLink>
          <NavLink className={`nav-link ${this.props.history.location.pathname === '/user' ? 'current' : ''}`} to="/user">Profile</NavLink>
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    errorMessage: state.error.errorMessage,
    user: state.user.user,
  };
};

export default withRouter(connect(mapStateToProps, { signOut, clearError })(NavBar));
