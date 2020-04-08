import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { signOut, clearError } from '../actions';
import '../styles/navbar.scss';


class NavBar extends Component {
  componentDidMount() {
    this.props.history.listen((location, action) => {
      this.props.clearError();
    });
  }

  goToDashboard = () => {
    this.props.history.push('/opo-dashboard');
  };


  render() {
    if (!this.props.authenticated) {
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light" />
          {this.props.errorMessage === '' ? <div className="error" /> : <div className="alert alert-danger error">{this.props.errorMessage}</div>}
        </div>
      );
    } else {
      let dashboard;
      if (this.props.user && this.props.user.role === 'OPO') {
        dashboard = (
          <NavLink className="nav-link" to="/opo-dashboard">Dashboard</NavLink>
        );
      } else {
        dashboard = (
          <NavLink className="nav-link" to="/my-trips">Dashboard</NavLink>
        );
      }
      return (
        <div className="nav-bar">
          {dashboard}
          <NavLink className="nav-link" to="/all-trips">All Trips</NavLink>
          <NavLink className="nav-link" to="/user">Profile</NavLink>
          {/* <Navbar collapseOnSelect fixed="top" expand="md" className="navbar-style">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav>
                {dashboard}
                <NavLink to="/all-trips">All Trips</NavLink>
                <NavLink to="/user">Profile</NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar> */}
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
