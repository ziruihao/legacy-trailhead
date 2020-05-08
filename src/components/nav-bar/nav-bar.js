import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { signOut, clearError } from '../../actions';
import './nav-bar.scss';


class NavBar extends Component {
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
              <NavDropdown title="Dashboard" className={`${['/opo-dashboard', '/opo-trips', '/vehicle-requests', '/leader-approvals, /opo-fleet-management'].includes(this.props.history.location.pathname) ? 'current-bootstrap-wrapper' : ''}`}>
                <NavDropdown.Item onClick={() => this.props.history.push('/opo-trips')}>Trip Approvals</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.props.history.push('/vehicle-requests')}>Vehicle Requests</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.props.history.push('/leader-approvals')}>Profile Approvals</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.props.history.push('/opo-fleet-management')}>Manage Fleet</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => this.props.history.push('/opo-dashboard')}>Dashboard</NavDropdown.Item>
              </NavDropdown>
            )
            : null
          }
          <NavLink className={`nav-link ${this.props.history.location.pathname === '/my-trips' ? 'current' : ''}`} to="/my-trips">My Trips</NavLink>
          <NavLink className={`nav-link ${this.props.history.location.pathname === '/all-trips' ? 'current' : ''}`} to="/all-trips">All Trips</NavLink>
          <NavDropdown title="Profile" className={`${this.props.history.location.pathname === '/user' ? 'current-bootstrap-wrapper' : ''}`}>
            <NavDropdown.Item onClick={() => this.props.history.push('/user')}>View Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={() => this.props.signOut(this.props.history)}>Logout</NavDropdown.Item>
          </NavDropdown>
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
