import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import fetchOpoTrips from '../actions';

class OpoDashboard extends Component {
  componentDidMount() {
    this.props.fetchOpoTrips();
  }

  render() {
    
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    clubs: state.clubs,
  };
};

export default withRouter(connect(mapStateToProps, {fetchOpoTrips}))