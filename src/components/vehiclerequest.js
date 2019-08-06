import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError } from '../actions';
import VehicleRequestForm from './vehicleRequestForm';

class VehicleRequest extends Component {
  defaultVehicleReq = {
    vehicleType: '',
    vehicleDetails: '',
    tripLength: 'single-day-trip',
    pickupDate: '',
    returnDate: '',
    pickupTime: '',
    returnTime: '',
    passNeeded: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      requestDetails: '',
      vehicles: [this.defaultVehicleReq],
    };
  }

  onReqDetailsChange = (event) => {
    event.persist();
    this.setState({
      requestDetails: event.target.value,
    });
  }

  onVehicleTypeChange = (eventkey, index) => {
    this.setState((prevState) => {
      const oldVehicles = prevState.vehicles;
      const oldVehicle = oldVehicles[index];
      const updatedVehicle = Object.assign({}, oldVehicle, { vehicleType: eventkey });
      const updatedVehicles = Object.assign([], oldVehicles, { [index]: updatedVehicle });
      return { vehicles: updatedVehicles };
    });
  }

  onVehicleDetailChange = (event, index) => {
    event.persist();
    this.setState((prevState) => {
      const oldVehicles = prevState.vehicles;
      const oldVehicle = oldVehicles[index];
      const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      const updatedEntry = event.target.type === 'radio' ? 'tripLength' : event.target.name;
      const update = {};
      update[updatedEntry] = newValue;
      if (oldVehicle.tripLength === 'single-day-trip' && event.target.name === 'pickupDate') {
        update.returnDate = newValue;
      }
      if (oldVehicle.tripLength === 'multi-day-trip' && event.target.value === 'single-day-trip') {
        update.returnDate = oldVehicle.pickupDate;
      }
      const updatedVehicle = Object.assign({}, oldVehicle, update);
      const updatedVehicles = Object.assign([], oldVehicles, { [index]: updatedVehicle });
      return { vehicles: updatedVehicles };
    });
  }

  addVehicle = () => {
    this.setState(prevState => (
      { vehicles: [...prevState.vehicles, this.defaultVehicleReq] }
    ));
  }

  removeVehicle = (event, index) => {
    this.setState((prevState) => {
      const oldVehicles = prevState.vehicles;
      const withoutDeletedVehicle = oldVehicles.slice(0, index).concat(oldVehicles.slice(index + 1));
      return { vehicles: withoutDeletedVehicle };
    });
  }

  render() {
    return (
      <VehicleRequestForm
        requestDetails={this.state.requestDetails}
        vehicles={this.state.vehicles}
        onReqDetailsChange={this.onReqDetailsChange}
        onVehicleTypeChange={this.onVehicleTypeChange}
        onVehicleDetailChange={this.onVehicleDetailChange}
        addVehicle={this.addVehicle}
        removeVehicle={this.removeVehicle}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, { appError })(VehicleRequest));
