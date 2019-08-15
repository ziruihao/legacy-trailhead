import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, fetchVehicleRequest } from '../actions';
import '../styles/opoVehicleRequest-style.scss';

class OPOVehicleRequest extends Component {
  componentDidMount() {
    this.props.fetchVehicleRequest(this.props.match.params.vehicleReqId);
  }

  render() {
    return (
      <div className="ovr-container">
        <div className="ovr-sidebar">
          <h3>External Vehicle Request</h3>
        </div>
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
