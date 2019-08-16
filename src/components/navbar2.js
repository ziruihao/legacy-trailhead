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

    let allTrips, dashboard, profile;
    if (this.props.role === 'OPO') {
      allTrips = (
        <li className="nav-item">
          <NavLink className="nav-link" to="/opo-trips">
            All Trips
          </NavLink>
        </li>
      );

      dashboard = (
        <li className="nav-item">
          <Dropdown onSelect={this.onDropdownChange}>
            <Dropdown.Toggle id="filter-dropdown" onChange={this.onDropdownChange}>
              <p className="current-filter">{this.getCurrentFilter()}</p>
              <img className="dropdown-icon right-margin" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="filter-options">
              <Dropdown.Item eventKey={this.ALL_KEY} active={this.ALL_KEY === this.state.selectedFilter}>{this.ALL_VALUE}</Dropdown.Item>
              <Dropdown.Item eventKey={this.GEAR_KEY} active={this.GEAR_KEY === this.state.selectedFilter}>{this.GEAR_VALUE}</Dropdown.Item>
              <Dropdown.Item eventKey={this.PCARD_KEY} active={this.PCARD_KEY === this.state.selectedFilter}>{this.PCARD_VALUE}</Dropdown.Item>
              <Dropdown.Item eventKey={this.VEHICLE_KEY} active={this.VEHICLE_KEY === this.state.selectedFilter}>{this.VEHICLE_VALUE}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      );
    }
}
