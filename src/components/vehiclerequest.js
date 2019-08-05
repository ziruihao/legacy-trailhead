import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError } from '../actions';
import VehicleRequestForm from './vehicleRequestForm';

class VehicleRequest extends Component {
  render() {
    return (
      <VehicleRequestForm />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, { appError })(VehicleRequest));
