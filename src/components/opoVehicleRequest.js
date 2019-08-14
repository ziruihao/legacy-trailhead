import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, fetchVehicleRequest } from '../actions';

class OPOVehicleRequest extends Component {
  componentDidMount() {
    this.props.fetchVehicleRequest(this.props.match.params.vehicleReqId);
  }

  render() {
    return (
      <div className="ovr-container">
        <h1>Wadup</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vehicleRequest: state.vehicleRequests.vehicleReq,
  };
};

export default withRouter(connect(mapStateToProps, { appError, fetchVehicleRequest })(OPOVehicleRequest));
