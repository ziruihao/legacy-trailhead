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
    errorFields: {
      vehicleType: false,
      vehicleDetails: false,
      pickupDate: false,
      returnDate: false,
      pickupTime: false,
      returnTime: false,
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      requestDetails: '',
      reqDetailsError: false,
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

  isStringEmpty = (string) => {
    return string.length === 0 || !string.trim();
  }

  validate = () => {
    let hasEmptyField = false;
    let reqDetailsError = false;
    if (this.isStringEmpty(this.state.requestDetails)) {
      hasEmptyField = true;
      reqDetailsError = true;
    }
    const { vehicles } = this.state;
    vehicles.some((vehicle) => {
      const errorFields = Object.keys(vehicle.errorFields);
      const updatedErrorFields = {};
      errorFields.map((errorField) => {
        if (this.isStringEmpty(vehicle[errorField])) {
          updatedErrorFields[errorField] = true;
          hasEmptyField = true;
        }
      });
      if (hasEmptyField) {
      }
      // vehicle.errorFields = Object.assign({}, vehicle.errorFields, updatedErrorFields);

      let dateHasPassed = false;
      const now = new Date();
      const pickupDate = new Date(vehicle.pickupDate);
      const pickupTime = vehicle.pickupTime.split(':');
      pickupDate.setHours(pickupTime[0], pickupTime[1]);
      if (pickupDate < now) {
        updatedErrorFields[pickupDate] = true;
        updatedErrorFields[pickupTime] = true;
        dateHasPassed = true;
      }

      let returnBeforePickup = false;
      const returnDate = new Date(vehicle.returnDate);
      const returnTime = vehicle.returnTime.split(':');
      returnDate.setHours(returnTime[0], returnTime[1]);
      if (returnDate < pickupDate) {
        updatedErrorFields[pickupDate] = true;
        updatedErrorFields[pickupTime] = true;
        updatedErrorFields[returnDate] = true;
        updatedErrorFields[returnTime] = true;
        returnBeforePickup = true;
      }
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
