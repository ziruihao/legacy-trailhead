import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, submitVehicleRequest } from '../actions';
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
    trailerCompatible: false,
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
      requestType: 'SOLO',
      vehicles: [this.defaultVehicleReq],
    };
  }

  // componentDidMount() {
  //   this.props.fetchVehicleReq(this.props.match.params.vehicleReqId);
  // }

  onReqDetailsChange = (event) => {
    event.persist();
    this.setState({
      requestDetails: event.target.value,
      reqDetailsError: this.isStringEmpty(event.target.value),
    });
  }

  onVehicleTypeChange = (eventkey, index) => {
    this.setState((prevState) => {
      const oldVehicles = prevState.vehicles;
      const oldVehicle = oldVehicles[index];
      const updates = {};
      updates.vehicleType = eventkey;
      updates.errorFields = Object.assign({}, oldVehicle.errorFields, { vehicleType: this.isStringEmpty(eventkey) });
      const updatedVehicle = Object.assign({}, oldVehicle, updates);
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
      // update entry with new value
      update[updatedEntry] = newValue;
      // update return date to match pickup date if single day trip
      if (oldVehicle.tripLength === 'single-day-trip' && event.target.name === 'pickupDate') {
        update.returnDate = newValue;
      }
      // error highlight form if value is empty
      if (Object.prototype.hasOwnProperty.call(oldVehicle.errorFields, updatedEntry)) {
        update.errorFields = Object.assign({}, oldVehicle.errorFields, { [updatedEntry]: this.isStringEmpty(event.target.value) });
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

  isFormValid = () => {
    let hasEmptyField = false;
    let reqDetailsError = false;
    if (this.isStringEmpty(this.state.requestDetails)) {
      hasEmptyField = true;
      reqDetailsError = true;
    }
    const { vehicles } = this.state;

    // check for and mark empty fields
    const markedEmptyFields = vehicles.map((vehicle) => {
      const updatedErrorFields = {
        vehicleType: false,
        vehicleDetails: false,
        pickupDate: false,
        returnDate: false,
        pickupTime: false,
        returnTime: false,
      };
      const errorFields = Object.keys(updatedErrorFields);
      errorFields.forEach((errorField) => {
        if (this.isStringEmpty(vehicle[errorField])) {
          updatedErrorFields[errorField] = true;
          hasEmptyField = true;
        }
      });
      vehicle.errorFields = Object.assign({}, vehicle.errorFields, updatedErrorFields);
      return vehicle;
    });
    // break if there's an empty field
    if (hasEmptyField) {
      this.setState({ vehicles: markedEmptyFields, reqDetailsError });
      this.props.appError('Please complete all fields');
      window.scrollTo(0, 0);
      return false;
    }

    let dateHasPassed = false;
    const now = new Date();
    const markedPastDate = vehicles.map((vehicle) => {
      const updatedErrorFields = {
        vehicleType: false,
        vehicleDetails: false,
        pickupDate: false,
        returnDate: false,
        pickupTime: false,
        returnTime: false,
      };
      const pickupDate = new Date(vehicle.pickupDate);
      const pickupTime = vehicle.pickupTime.split(':');
      pickupDate.setHours(pickupTime[0], pickupTime[1]);
      if (pickupDate < now) {
        updatedErrorFields.pickupDate = true;
        updatedErrorFields.pickupTime = true;
        dateHasPassed = true;
      }
      vehicle.errorFields = Object.assign({}, vehicle.errorFields, updatedErrorFields);
      return vehicle;
    });
    // break if there's past date
    if (dateHasPassed) {
      this.setState({ vehicles: markedPastDate });
      this.props.appError('Pickup date and time must be in the future');
      window.scrollTo(0, 0);
      return false;
    }

    let returnBeforePickup = false;
    const markedReturnBeforePickup = vehicles.map((vehicle) => {
      const updatedErrorFields = {
        vehicleType: false,
        vehicleDetails: false,
        pickupDate: false,
        returnDate: false,
        pickupTime: false,
        returnTime: false,
      };
      const pickupDate = new Date(vehicle.pickupDate);
      const pickupTime = vehicle.pickupTime.split(':');
      pickupDate.setHours(pickupTime[0], pickupTime[1]);
      const returnDate = new Date(vehicle.returnDate);
      const returnTime = vehicle.returnTime.split(':');
      returnDate.setHours(returnTime[0], returnTime[1]);
      if (returnDate < pickupDate) {
        updatedErrorFields.pickupDate = true;
        updatedErrorFields.pickupTime = true;
        updatedErrorFields.returnDate = true;
        updatedErrorFields.returnTime = true;
        returnBeforePickup = true;
      }
      vehicle.errorFields = Object.assign({}, vehicle.errorFields, updatedErrorFields);
      return vehicle;
    });
    // break if there's return date before pickup date
    if (returnBeforePickup) {
      this.setState({ vehicles: markedReturnBeforePickup });
      this.props.appError('Return date must be before pickup date');
      window.scrollTo(0, 0);
      return false;
    }

    return true;
  }

  submit = () => {
    if (this.isFormValid()) {
      const vehicles = this.state.vehicles.map((vehicle) => {
        delete vehicle.errorFields;
        return vehicle;
      });
      const vehicleRequest = {
        requester: this.props.user,
        requestDetails: this.state.requestDetails,
        requestType: this.state.requestType,
        requestedVehicles: vehicles,
      };
      this.props.submitVehicleRequest(vehicleRequest, this.props.history);
    }
  }

  render() {
    const userCertifications = {
      driverCert: this.props.user.driver_cert,
      trailerCert: this.props.user.trailer_cert,
    };
    return (
      <VehicleRequestForm
        requestType={this.state.requestType}
        requestDetails={this.state.requestDetails}
        reqDetailsError={this.state.reqDetailsError}
        vehicles={this.state.vehicles}
        onReqDetailsChange={this.onReqDetailsChange}
        onVehicleTypeChange={this.onVehicleTypeChange}
        onVehicleDetailChange={this.onVehicleDetailChange}
        addVehicle={this.addVehicle}
        removeVehicle={this.removeVehicle}
        submit={this.submit}
        userCertifications={userCertifications}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, { appError, submitVehicleRequest })(VehicleRequest));
