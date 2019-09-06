/* eslint-disable */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrip, createTrip, editTrip, appError } from '../actions';
import PCardRequest from './pcard_request';
import { LeftColumn, BasicTripInfo, DatesLocation, AboutTheTrip, Equipment } from './create_trip_pages';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
  otherCostErrorFields = {
    title: false,
    cost: false,
  }

  defaultOtherCost = {
    title: '',
    cost: '',
    errorFields: { ...this.otherCostErrorFields },
  }

  defaultGroupGear = {
    groupGear: '',
    hasError: false,
  }

  defaultTrippeeGear = {
    gear: '',
    size_type: 'N/A',
    quantity: 0,
    hasError: false,
  }

  pcardErrorFields = {
    numPeople: false,
    snacks: false,
    breakfast: false,
    lunch: false,
    dinner: false,
  }

  defaultPcardReq = {
    numPeople: '',
    snacks: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    otherCosts: [],
    errorFields: { ...this.pcardErrorFields }
  }

  errorFields = {
    title: false,
    cost: false,
    startDate: false,
    endDate: false,
    startTime: false,
    endTime: false,
    mileage: false,
    location: false,
    pickup: false,
    dropoff: false,
    description: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      title: '',
      leaders: '',
      club: {},
      experienceNeeded: false,
      access: false,
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      mileage: '',
      pickup: '',
      dropoff: '',
      location: '',
      cost: '',
      length: 'single',
      gearRequests: [],
      trippeeGear: [],
      pcardRequest: [],
      errorFields: this.errorFields,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onGearChange = this.onGearChange.bind(this);
    this.onClubChange = this.onClubChange.bind(this);
    this.pageIsValid = this.pageIsValid.bind(this);
  }

  componentDidMount() {
    if (this.props.switchMode) {
      this.props.fetchTrip(this.props.match.params.tripID)
        .then(() => {
          const { trip } = this.props;
          const gearRequests = trip.OPOGearRequests.map((groupGear) => {
            return { groupGear, hasError: false };
          });
          const trippeeGear = trip.trippeeGear.map((individualGear) => {
            return Object.assign({}, individualGear, { hasError: false });
          });
          const pcardRequest = trip.pcard.map((pcard) => {
            const { otherCosts } = pcard;
            const withErrorFields = otherCosts.map((otherCost) => {
              return Object.assign({}, otherCost, { errorFields: { ...this.otherCostErrorFields } });
            });
            const updates = {};
            updates.otherCosts = withErrorFields;
            updates.errorFields = { ...this.pcardErrorFields };
            return Object.assign({}, pcard, updates);
          });
          const coLeaders = this.getCoLeaders(trip.leaders);
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);
          const length = startDate.getTime() === endDate.getTime() ? 'single' : 'multi';
          this.setState({
            currentStep: 1,
            title: trip.title,
            leaders: coLeaders,
            club: trip.club,
            experienceNeeded: trip.experienceNeeded,
            access: trip.co_leader_access,
            description: trip.description,
            startDate: trip.startDate.substring(0, 10),
            endDate: trip.endDate.substring(0, 10),
            startTime: trip.startTime,
            endTime: trip.endTime,
            mileage: trip.mileage,
            pickup: trip.pickup,
            dropoff: trip.dropoff,
            location: trip.location,
            cost: trip.cost,
            length,
            trippeeGear,
            pcardRequest,
            gearRequests,
          });
        });
    }
  }

  onFieldChange(event) {
    event.persist();
    this.setState((prevState) => {
      const updates = {};
      updates[event.target.name] = event.target.value;
      updates.errorFields = Object.assign({}, prevState.errorFields, { [event.target.name]: this.isStringEmpty(event.target.value) });
      return updates;
    });
  }

  togglePcard = () => {
    this.setState((prevState) => {
      if (prevState.pcardRequest.length === 0) {
        return { pcardRequest: [this.defaultPcardReq] };
      } else {
        return { pcardRequest: [] };
      }
    });
  }

  onPcardFieldChange = (event, index) => {
    event.persist();
    this.setState((prevState) => {
      const pcardRequest = prevState.pcardRequest[index];
      const updates = {};
      updates[event.target.name] = event.target.value;
      updates.errorFields = Object.assign({}, prevState.errorFields, { [event.target.name]: this.isStringEmpty(event.target.value) });
      const updatedReq = Object.assign({}, pcardRequest, updates);
      const updatedRequests = Object.assign([], prevState.pcardRequest, { [index]: updatedReq });
      return { pcardRequest: updatedRequests };
    });
  }

  onOtherCostsChange = (event, pCardIndex, otherCostIndex) => {
    this.setState((prevState) => {
      const pcardRequest = prevState.pcardRequest[pCardIndex];
      const otherCost = pcardRequest.otherCosts[otherCostIndex];
      const updates = {};
      updates[event.target.name] = event.target.value;
      updates.errorFields = Object.assign({}, otherCost.errorFields, { [event.target.name]: this.isStringEmpty(event.target.value) });
      const updatedOtherCost = Object.assign({}, otherCost, updates);
      const updatedOtherCosts = Object.assign([], pcardRequest.otherCosts, { [otherCostIndex]: updatedOtherCost });
      const update = Object.assign({}, pcardRequest, { otherCosts: updatedOtherCosts });
      const updatedRequests = Object.assign([], prevState.pcardRequest, { [pCardIndex]: update });
      return { pcardRequest: updatedRequests };
    });
  }

  deleteOtherCost = (event, pCardIndex, otherCostIndex) => {
    this.setState((prevState) => {
      const pcardRequest = prevState.pcardRequest[pCardIndex];
      const { otherCosts } = pcardRequest;
      const withoutDeletedCost = [...otherCosts.slice(0, otherCostIndex), ...otherCosts.slice(otherCostIndex + 1)];
      const update = Object.assign({}, pcardRequest, { otherCosts: withoutDeletedCost });
      const updatedRequests = Object.assign([], prevState.pcardRequest, { [pCardIndex]: update });
      return { pcardRequest: updatedRequests };
    })
  }

  addOtherCost = (event, pCardIndex) => {
    this.setState((prevState) => {
      const pcardRequest = prevState.pcardRequest[pCardIndex];
      const { otherCosts } = pcardRequest;
      const withAddedCost = [...otherCosts, this.defaultOtherCost];
      const update = Object.assign({}, pcardRequest, { otherCosts: withAddedCost });
      const updatedRequests = Object.assign([], prevState.pcardRequest, { [pCardIndex]: update });
      return { pcardRequest: updatedRequests };
    })
  }

  onClubChange(event) {
    event.persist();
    this.setState({
      club: { _id: event.target[event.target.selectedIndex].dataset.id, name: event.target.value },
    });
  }

  onDateChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (this.state.length === 'single') {
      this.setState({
        endDate: event.target.value,
      });
    }
  }

  getClubOptions = () => {
    let options = null;
    if (this.props.user.role === 'Leader' && this.props.user.leader_for.length > 0) {
      options = this.props.user.leader_for.map((club) => {
        return <option key={club.id} data-id={club.id} value={club.name}>{club.name}</option>;
      });
    }
    return options;
  }

  getDateOptions = () => {
    return (
      <div id="date-picker" className="row page-sub-headers trip-date-header">
        <div>
          <p>{this.state.length === 'multi' ? 'Start' : 'Trip'} date</p>
          <input type="date" name="startDate" onChange={this.onDateChange} className={`field top-create-trip leaders ${this.state.errorFields.startDate ? 'create-trip-error' : ''}`} value={this.state.startDate} />
        </div>
        {this.state.length === 'multi'
          ? (
            <div>
              <p>End date</p>
              <input type="date" name="endDate" onChange={this.onDateChange} className={`field top-create-trip leaders ${this.state.errorFields.endDate ? 'create-trip-error' : ''}`} value={this.state.endDate} />
            </div>
          )
          : null}
      </div>
    );
  }

  getVehicleRequest = () => {
    let certifications = '';
    if (this.props.user.driver_cert === null && !this.props.user.trailer_cert) {
      certifications = this.NONE_CONSTANT;
    } else {
      certifications = this.props.user.trailer_cert ? `${this.props.user.driver_cert}, ${this.TRAILER_CONSTANT}` : this.props.driver_cert;
    }
    return certifications;
  }

  handleDateChange = (changeEvent) => {
    if (changeEvent.target.value === 'single') {
      this.setState(prevState => ({
        length: 'single',
        endDate: prevState.startDate,
      }));
    } else {
      this.setState({
        length: 'multi',
      });
    }
  };

  addGear = () => {
    this.setState(prevState => ({ gearRequests: [...prevState.gearRequests, this.defaultGroupGear] }));
  }

  addTrippeeGear = () => {
    this.setState(prevState => ({ trippeeGear: [...prevState.trippeeGear, this.defaultTrippeeGear] }));
  }

  removeGear = (index) => {
    this.setState((prevState) => {
      const withoutDeleted = prevState.gearRequests.slice(0, index).concat(prevState.gearRequests.slice(index + 1));
      return {
        gearRequests: withoutDeleted,
      };
    });
  }

  handleOptionChange = (changeEvent) => {
    this.setState({ experienceNeeded: changeEvent.target.checked });
  };

  toggleAccess = (event) => {
    this.setState({ access: event.target.checked });
  }

  handleStateChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  removeTrippeeGear = (index) => {
    this.setState((prevState) => {
      const withoutDeleted = prevState.trippeeGear.slice(0, index).concat(prevState.trippeeGear.slice(index + 1));
      return {
        trippeeGear: withoutDeleted,
      };
    });
  }

  onGearChange = (event, idx) => {
    event.persist();
    this.setState((prevState) => {
      const gearArray = prevState.gearRequests;
      const changedGearObject = gearArray[idx];
      const updates = {};
      updates.groupGear = event.target.value;
      updates.hasError = this.isStringEmpty(event.target.value);
      const updatedGearObject = Object.assign({}, changedGearObject, updates);

      return {
        gearRequests: Object.assign([], gearArray, { [idx]: updatedGearObject })
      };
    });
  }

  onTrippeeGearChange = (event, idx) => {
    event.persist();
    this.setState((prevState) => {
      const trippeeGearArray = prevState.trippeeGear;
      const changedTrippeeGearObject = trippeeGearArray[idx];
      const updates = {};
      updates.gear = event.target.value;
      updates.hasError = this.isStringEmpty(event.target.value);
      const updatedTrippeeGearObject = Object.assign({}, changedTrippeeGearObject, updates);

      return {
        trippeeGear: Object.assign([], trippeeGearArray, { [idx]: updatedTrippeeGearObject })
      };
    });
  }

  onSizeTypeChange = (eventKey, index) => {
    this.setState((prevState) => {
      const trippeeGear = [...prevState.trippeeGear];
      trippeeGear[index].size_type = eventKey;
      return {
        trippeeGear,
      };
    });
  }

  getCoLeaders = (leaders) => {
    let coleaders = '';
    leaders.forEach((leader, index) => {
      if (index !== 0) {
        coleaders += `${leader.email}, `;
      }
    });
    coleaders = coleaders.substring(0, coleaders.length - 2);
    coleaders = coleaders.length === 0 ? '' : coleaders;
    return coleaders;
  };

  previousButton = (e) => {
    e.preventDefault();
    this._prev();
  }

  _next = () => {
    if (this.pageIsValid()) {
      this.setState((prevState) => {
        return { currentStep: prevState.currentStep + 1 };
      });
    }
  }

  getAppropriateButton = () => {
    if (this.state.currentStep !== 5) {
      return (
        <button type="button" className="btn next-button" onClick={this._next}>
          Next
        </button>
      );
    } else {
      return (
        <button type="button" className="btn next-button" onClick={this.createTrip}>
          {this.props.switchMode ? 'Update Trip' : 'Create Trip!'}
        </button>
      );
    }
  }

  _prev = () => {
    this.setState((prevState) => {
      return { currentStep: prevState.currentStep - 1 };
    });
  }

  isStringEmpty = (string) => {
    return string.length === 0 || !string.toString().trim();
  };

  pageHasEmptyFields = (fields) => {
    const updates = {};
    let hasEmptyField = false;
    fields.forEach((field) => {
      const isFieldEmpty = this.isStringEmpty(this.state[field]);
      updates[field] = isFieldEmpty;
      if (isFieldEmpty) {
        hasEmptyField = true;
      }
    });
    if (hasEmptyField) {
      this.setState((prevState) => {
        return { errorFields: Object.assign({}, prevState.errorFields, updates) };
      });
      this.props.appError('Please complete all highlighted fields');
      window.scrollTo(0, 0);
      return true;
    } else {
      return false;
    }
  }

  pageIsValid = () => {
    if (this.state.currentStep === 1) {
      return !this.pageHasEmptyFields(['title', 'cost']);
    }
    if (this.state.currentStep === 2) {
      if (!this.pageHasEmptyFields(['startDate', 'startTime', 'endTime', 'endDate', 'location', 'mileage'])) {
        const { startDate, startTime, endDate, endTime } = this.state;
        const now = new Date();
        const startAsDate = new Date(startDate);
        const startAsTime = startTime.split(':');
        startAsDate.setHours(startAsTime[0], startAsTime[1]);
        if (startAsDate < now) {
          this.setState((prevState) => {
            return { errorFields: Object.assign({}, prevState.errorFields, { startDate: true, startTime: true }) };
          });
          this.props.appError('Trip cannot be in the past');
          window.scrollTo(0, 0);
          return false;
        }
        const endAsDate = new Date(endAsDate);
        const endAsTime = endTime.split(':');
        endAsDate.setHours(endAsTime[0], endAsTime[1]);
        if (endAsDate < startAsDate) {
          this.setState((prevState) => {
            return { errorFields: Object.assign({}, prevState.errorFields, { startDate: true, startTime: true, endDate: true, endTime: true }) };
          });
          this.props.appError('Start time must be before end time');
          window.scrollTo(0, 0);
          return false;
        }
        return true;
      } else {
        return false;
      }
    }
    if (this.state.currentStep === 3) {
      return !this.pageHasEmptyFields(['description', 'pickup', 'dropoff']);
    }

    if (this.state.currentStep === 4) {
      const { gearRequests, trippeeGear } = this.state;
      let hasEmptyField = false;
      const markedEmptyGroupFields = gearRequests.map((gear) => {
        const isFieldEmpty = this.isStringEmpty(gear.groupGear);
        if (isFieldEmpty) {
          hasEmptyField = true;
        };
        return Object.assign({}, gear, { hasError: isFieldEmpty });
      });
      const markedEmptyTrippeFields = trippeeGear.map((gear) => {
        const isFieldEmpty = this.isStringEmpty(gear.gear);
        if (isFieldEmpty) {
          hasEmptyField = true;
        }
        return Object.assign({}, gear, { hasError: isFieldEmpty });
      });
      if (hasEmptyField) {
        this.setState({ gearRequests: markedEmptyGroupFields, trippeeGear: markedEmptyTrippeFields });
        this.props.appError('Please complete or clear the highlighted fields');
        window.scrollTo(0, 0);
        return false;
      }
    }

    if (this.state.currentStep === 5) {
      const pcards = this.state.pcardRequest;
      let hasEmptyField = false;
      const markedEmptyFields = pcards.map((pcard) => {
        const updatedPcardErrorFields = { ...this.pcardErrorFields };
        const soloErrorFields = Object.keys(updatedPcardErrorFields);
        soloErrorFields.forEach((errorField) => {
          if (this.isStringEmpty(pcard[errorField])) {
            hasEmptyField = true;
            updatedPcardErrorFields[errorField] = true;
          }
        });
        const { otherCosts } = pcard;
        const markedEmptyOtherCosts = otherCosts.map((otherCost) => {
          const updatedErrorFields = {};
          const isTitleEmpty = this.isStringEmpty(otherCost.title);
          const isCostEmpty = this.isStringEmpty(otherCost.cost);
          updatedErrorFields.title = isTitleEmpty;
          updatedErrorFields.cost = isCostEmpty;
          if (isTitleEmpty || isCostEmpty) {
            hasEmptyField = true;
          }
          return Object.assign({}, otherCost, { errorFields: updatedErrorFields });
        });
        const updates = {};
        updates.otherCosts = markedEmptyOtherCosts;
        updates.errorFields = updatedPcardErrorFields;
        return Object.assign({}, pcard, updates);
      });
      if (hasEmptyField) {
        this.setState({ pcardRequest: markedEmptyFields });
        this.props.appError('Please complete the highlighted fields. Enter 0 if not applicable');
        window.scrollTo(0, 0);
        return false;
      }

    }
    return true;
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  createTrip() {
    const club = this.isObjectEmpty(this.state.club) ? this.props.user.leader_for[0] : this.state.club;
    const gearRequests = this.state.gearRequests.map((groupGear) => {
      return groupGear.groupGear;
    });
    const trippeeGear = this.state.trippeeGear.map((trippeeGear) => {
      delete trippeeGear.hasError;
      return trippeeGear;
    });
    const pcard = this.state.pcardRequest.map((pcardRequest) => {
      const deletedErrorFields = pcardRequest.otherCosts.map((otherCost) => {
        delete otherCost.errorFields;
        return otherCost;
      });
      const updatedRequest = Object.assign({}, pcardRequest, { otherCosts: deletedErrorFields });
      delete updatedRequest.numPeopleError;
      return updatedRequest;
    })
    const trip = {
      title: this.state.title,
      leaders: this.state.leaders.trim().split(','),
      club,
      experienceNeeded: this.state.experienceNeeded,
      description: this.state.description,
      mileage: this.state.mileage,
      location: this.state.location,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      cost: this.state.cost,
      pickup: this.state.pickup,
      dropoff: this.state.dropoff,
      co_leader_access: this.state.access,
      gearRequests,
      trippeeGear,
      pcard,
    };
    if (this.props.switchMode) {
      this.props.editTrip(trip, this.props.history, this.props.match.params.tripID);
    } else {
      this.props.createTrip(trip, this.props.history);
    }
  }

  render() {
    let page;
    switch (this.state.currentStep) {
      case 1:
        page = (
          <BasicTripInfo
            onFieldChange={this.onFieldChange}
            onClubChange={this.onClubChange}
            toggleAccess={this.toggleAccess}
            titleValue={this.state.title}
            costValue={this.state.cost}
            leaderValue={this.state.leaders}
            experienceValue={this.state.experienceNeeded}
            accessValue={this.state.access}
            experienceOption={this.handleOptionChange}
            clubOptions={this.getClubOptions()}
            errorFields={this.state.errorFields}
          />
        );
        break;
      case 2:
        page = (
          <DatesLocation
            onFieldChange={this.onFieldChange}
            onDateChange={this.handleDateChange}
            dateLength={this.state.length}
            dateOptions={this.getDateOptions()}
            theStartTime={this.state.startTime}
            theEndTime={this.state.endTime}
            tripLocation={this.state.location}
            tripMileage={this.state.mileage}
            errorFields={this.state.errorFields}
          />
        );
        break;
      case 3:
        page = (
          <AboutTheTrip
            pickUp={this.state.pickup}
            dropOff={this.state.dropoff}
            onFieldChange={this.onFieldChange}
            DescripValue={this.state.description}
            errorFields={this.state.errorFields}
          />
        );
        break;
      case 4:
        page = (
          <Equipment
            addTrippeeGear={this.addTrippeeGear}
            addGear={this.addGear}
            trippeeGear={this.state.trippeeGear}
            gearRequests={this.state.gearRequests}
            onTrippeeGearChange={this.onTrippeeGearChange}
            onGearChange={this.onGearChange}
            onSizeTypeChange={this.onSizeTypeChange}
            removeTrippeeGear={this.removeTrippeeGear}
            removeGear={this.removeGear}
          />
        );
        break;
      case 5:
        page = (
          <PCardRequest
            pcardRequest={this.state.pcardRequest}
            togglePcard={this.togglePcard}
            onPcardFieldChange={this.onPcardFieldChange}
            onOtherCostsChange={this.onOtherCostsChange}
            deleteOtherCost={this.deleteOtherCost}
            addOtherCost={this.addOtherCost}
            errorFields={this.state.errorFields}
          />
        );
        break;
      default:
        page = (
          <BasicTripInfo
            onFieldChange={this.onFieldChange}
            onClubChange={this.onClubChange}
            toggleAccess={this.toggleAccess}
            titleValue={this.state.title}
            costValue={this.state.cost}
            leaderValue={this.state.leaders}
            experienceValue={this.state.experienceNeeded}
            accessValue={this.state.access}
            experienceOption={this.handleOptionChange}
            clubOptions={this.getClubOptions()}
            errorFields={this.state.errorFields}
          />
        );
        break;
    }
    return (
      <div className="ovr-container">
        <LeftColumn
          currentStep={this.state.currentStep}
        />
        <div className="ovr-req-content">
          <div className="create-trip-form-page">
            {page}
          </div>
          <div className="create-trip-bottom-buttons create-trips-top-margin">
            <button disabled={this.state.currentStep === 1} type="button" className="btn next-button" onClick={this.previousButton}>Previous</button>
            {this.getAppropriateButton()}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    trip: state.trips.trip,
  };
};
export default withRouter(connect(mapStateToProps, { fetchTrip, createTrip, editTrip, appError })(CreateTrip));
