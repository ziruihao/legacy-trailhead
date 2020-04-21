import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, fetchVehicleRequest, submitVehicleRequest, updateVehicleRequest } from '../actions';
import VehicleRequestForm from './vehicleRequestForm';
import VehicleRequestDisplay from './vehicleRequestDisplay';

class VehicleRequest extends Component {
  errorFields = {
    vehicleType: false,
    pickupDate: false,
    returnDate: false,
    pickupTime: false,
    returnTime: false,
  }

  soloErrorFields = {
    requestDetails: false,
    noOfPeople: false,
    mileage: false,
  }

  defaultVehicleReq = {
    vehicleType: '',
    vehicleDetails: '',
    tripLength: 'single-day-trip',
    pickupDate: '',
    returnDate: '',
    pickupTime: '',
    returnTime: '',
    passNeeded: false,
    trailerNeeded: false,
    errorFields: { ...this.errorFields },
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditing: true,
      requestDetails: '',
      noOfPeople: '',
      mileage: '',
      soloErrorFields: { ...this.soloErrorFields },
      requestType: 'SOLO',
      vehicles: [this.defaultVehicleReq],
    };
  }

  componentDidMount() {
    if (this.props.switchMode) {
      this.props.fetchVehicleRequest(this.props.match.params.vehicleReqId)
        .then(() => {
          const updates = {};
          updates.isEditing = false;
          if (this.props.requestType === 'TRIP') {
            updates.requestType = 'TRIP';
          }
          this.setState(updates);
        });
    } else if (this.props.requestType === 'TRIP') {
      this.setState({ requestType: 'TRIP', vehicles: this.props.vehicles });
    }
  }

  onSoloReqDetailsChange = (event) => {
    event.persist();
    this.setState((prevState) => {
      const update = {};
      update[event.target.name] = event.target.value;
      update.soloErrorFields = Object.assign({}, prevState.soloErrorFields, { [event.target.name]: this.isStringEmpty(event.target.value) });
      return update;
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
    return string.length === 0 || !string.toString().trim();
  }

  createDateObject = (date, time) => {
    // adapted from https://stackoverflow.com/questions/2488313/javascripts-getdate-returns-wrong-date
    const parts = date.toString().match(/(\d+)/g);
    const splitTime = time.split(':');
    return new Date(parts[0], parts[1] - 1, parts[2], splitTime[0], splitTime[1]);
  }

  isFormValid = () => {
    let hasEmptyField = false;
    const updatedSoloErrorFields = { ...this.soloErrorFields };
    if (this.state.requestType === 'SOLO') {
      const soloErrorFields = Object.keys(updatedSoloErrorFields);
      soloErrorFields.forEach((errorField) => {
        if (this.isStringEmpty(this.state[errorField])) {
          hasEmptyField = true;
          updatedSoloErrorFields[errorField] = true;
        }
      });
    }

    const { vehicles } = this.state;

    // check for and mark empty fields
    const markedEmptyFields = vehicles.map((vehicle) => {
      const updatedErrorFields = { ...this.errorFields };
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
      this.setState({ vehicles: markedEmptyFields, soloErrorFields: updatedSoloErrorFields });
      this.props.appError('Please complete the highlighted fields');
      window.scrollTo(0, 0);
      return false;
    }

    if (this.state.requestType === 'SOLO') {
      // check if entered invalid zero
      const enteredBadNoOfPeople = Number(this.state.noOfPeople) <= 0;
      const enteredBadMileage = Number(this.state.mileage) <= 0;
      if (enteredBadNoOfPeople || enteredBadMileage) {
        this.setState((prevState) => {
          return { soloErrorFields: Object.assign({}, prevState.soloErrorFields, { noOfPeople: enteredBadNoOfPeople, mileage: enteredBadMileage }) };
        });
        this.props.appError('Value must be greater than zero for the higlighted fields');
        window.scrollTo(0, 0);
        return false;
      }
    }

    let dateHasPassed = false;
    const now = new Date();
    const markedPastDate = vehicles.map((vehicle) => {
      const updatedErrorFields = { ...this.errorFields };
      const pickupDate = this.createDateObject(vehicle.pickupDate, vehicle.pickupTime);
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
      const updatedErrorFields = { ...this.errorFields };
      const pickupDate = this.createDateObject(vehicle.pickupDate, vehicle.pickupTime);
      const returnDate = this.createDateObject(vehicle.returnDate, vehicle.returnTime);
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
      this.props.appError('Return time must be before pickup time');
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
        noOfPeople: this.state.noOfPeople,
        mileage: this.state.mileage,
        requestType: this.state.requestType,
        requestedVehicles: vehicles,
      };
      this.props.submitVehicleRequest(vehicleRequest, this.props.history);
    }
  }

  startEditing = () => {
    const { vehicleRequest } = this.props;
    const withMoreFields = vehicleRequest.requestedVehicles.map((vehicle) => {
      const forEdititing = {};
      forEdititing.errorFields = { ...this.errorFields };
      forEdititing.pickupDate = vehicle.pickupDate.substring(0, 10);
      forEdititing.returnDate = vehicle.returnDate.substring(0, 10);
      const pickupAsDate = new Date(vehicle.pickupDate);
      const returnAsDate = new Date(vehicle.returnDate);
      forEdititing.tripLength = pickupAsDate.getTime() === returnAsDate.getTime() ? 'single-day-trip' : 'multi-day-trip';
      return Object.assign({}, vehicle, forEdititing);
    });
    this.setState({
      requestDetails: vehicleRequest.requestDetails,
      noOfPeople: vehicleRequest.noOfPeople,
      mileage: vehicleRequest.mileage,
      vehicles: withMoreFields,
      isEditing: true,
    });
  }

  cancelUpdate = () => {
    this.setState({ isEditing: false });
  }

  showError = () => {
    this.props.appError('You can\'t edit or cancel your vehicle request after it\'s been approved');
  }

  update = () => {
    if (this.isFormValid()) {
      const vehicles = this.state.vehicles.map((vehicle) => {
        delete vehicle.errorFields;
        return vehicle;
      });
      const updatedVehicleRequest = {
        id: this.props.vehicleRequest._id,
        requester: this.props.user,
        requestDetails: this.state.requestDetails,
        requestType: this.state.requestType,
        requestedVehicles: vehicles,
      };
      this.props.updateVehicleRequest(updatedVehicleRequest);
      this.setState({ isEditing: false });
    }
  }

  nextTripPage = () => {
    if (this.isFormValid()) {
      this.props.passVehicles(this.state.vehicles);
    }
  }

  render() {
    const userCertifications = {
      driverCert: this.props.user.driver_cert,
      trailerCert: this.props.user.trailer_cert,
    };
    if (this.state.isEditing) {
      return (
        <VehicleRequestForm
          requestType={this.state.requestType}
          requestDetails={this.state.requestDetails}
          soloErrorFields={this.state.soloErrorFields}
          noOfPeople={this.state.noOfPeople}
          mileage={this.state.mileage}
          vehicles={this.state.vehicles}
          onSoloReqDetailsChange={this.onSoloReqDetailsChange}
          onVehicleTypeChange={this.onVehicleTypeChange}
          onVehicleDetailChange={this.onVehicleDetailChange}
          addVehicle={this.addVehicle}
          removeVehicle={this.removeVehicle}
          submit={this.submit}
          userCertifications={userCertifications}
          asUpdate={this.props.viewMode}
          cancelUpdate={this.cancelUpdate}
          update={this.update}
          nextTripPage={this.nextTripPage}
        />
      );
    } else {
      return (
        <VehicleRequestDisplay
          userCertifications={userCertifications}
          requestType={this.state.requestType}
          vehicleRequest={this.props.vehicleRequest}
          startEditing={this.startEditing}
          showError={this.showError}
        />
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    vehicleRequest: state.vehicleRequests.vehicleReq,
  };
};

export default withRouter(connect(mapStateToProps, { appError, fetchVehicleRequest, submitVehicleRequest, updateVehicleRequest })(VehicleRequest));
