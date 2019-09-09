import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { signOut, clearError } from '../actions';
import '../styles/navbar-style.scss';


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

    let dashboard;
    if (this.props.role === 'OPO') {
      dashboard = (
        <NavDropdown onClick={this.goToDashboard} title="Dashboard" id="collapsible-nav-dropdown" className="dropdown-toggle drop-hover">
          <NavDropdown.Item className="dropdown-hover" href="/opo-trips">Trip Approvals</NavDropdown.Item>
          <NavDropdown.Item className="dropdown-hover" href="/vehicle-requests">Vehicle Requests</NavDropdown.Item>
          <NavDropdown.Item className="dropdown-hover" href="/leader_approvals">Profile Approvals</NavDropdown.Item>
          {/* <NavDropdown.Item className="dropdown-hover" href="#action/3.3">OPO Officer Assignments</NavDropdown.Item> */}
          <NavDropdown.Divider className="dropdown-hover" />
          <NavDropdown.Item className="dropdown-hover" href="/opo-dashboard">Back to Dashboard</NavDropdown.Item>
        </NavDropdown>
      );
    } else {
      dashboard = (
        <Nav.Link href="/mytrips">Dashboard</Nav.Link>
      );
    }


    return (
      <div>
        <Navbar collapseOnSelect fixed="top" expand="md" className="navbar-style">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              {dashboard}
              <Nav.Link href="/alltrips">All Trips</Nav.Link>
              <Nav.Link href="/user">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
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
