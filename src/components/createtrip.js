/* eslint-disable */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchTrip, createTrip, appError } from '../actions';
import PCardRequest from './pcard_request';
import { LeftColumn, BasicTripInfo, DatesLocation, AboutTheTrip, Equipment } from './create_trip_pages';
import dropdownIcon from '../img/dropdown-toggle.svg';
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

  defaultPcardReq = {
    numPeople: '',
    snacks: '0',
    breakfast: '0',
    lunch: '0',
    dinner: '0',
    otherCosts: [],
    numPeopleError: false,
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
    if (this.props.match.params.tripID !== undefined) {
      this.props.fetchTrip(this.props.match.params.tripID)
        .then(() => {
          const gear = this.props.trip.OPOGearRequests;
          const tripGear = this.props.trip.trippeeGear;
          const coLeaders = this.getCoLeaders(this.props.trip.leaders);
          this.setState({
            currentStep: 1,
            title: this.props.trip.title,
            leaders: coLeaders,
            club: this.props.trip.club,
            experienceNeeded: this.props.trip.experienceNeeded,
            description: this.props.trip.description,
            startDate: this.props.trip.startDate,
            endDate: this.props.trip.endDate,
            startTime: this.props.trip.startTime,
            endTime: this.props.trip.endTime,
            mileage: this.props.trip.mileage,
            pickup: this.props.trip.pickup,
            dropoff: this.props.trip.dropoff,
            location: this.props.trip.location,
            cost: this.props.trip.cost,
            gearRequests: gear,
            trippeeGear: tripGear,
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
      if (event.target.name === 'numPeople') {
        updates.numPeopleError = this.isStringEmpty(event.target.value)
      }
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
    if (this.props.user.leader_for) {
      options = this.props.user.leader_for.map((club) => {
        return <option key={club.id} data-id={club.id} value={club.name}>{club.name}</option>;
      });
      if (options.length === 0) {
        options = <option key={club.id} data-id={club.id} value={club.name}>Request leader access in profile page</option>;
      }
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

  getGearInputs = (props) => {
    const gearRequests = props.isEditMode ? props.trip.gearRequests : this.state.gearRequests;
    return gearRequests.map((gearRequest, index) => {
      return (
        <div className="gear-container" key={index}>
          <input type="text" className={`gear-input ${gearRequest.hasError ? 'create-trip-error' : ''}`} name="opogearRequest" placeholder="Add Item" onChange={event => this.onGearChange(event, index)} value={gearRequest.groupGear} autoFocus />
          <button type="button" className="delete-gear-button" onClick={() => this.removeGear(index)}>X</button>
        </div>
      );
    });
  }

  getTrippeeGear = (props) => {
    const trippeeGearRequests = props.isEditMode ? props.trippeeGear : this.state.trippeeGear;
    return trippeeGearRequests.map((gearRequest, index) => {
      return (
        <div key={index}>
          <div className="gear-container">
            <div className="gear-and-size">
              <div className="gear-field-and-form">
                <span className="gear-field">Gear:</span>
                <input
                  type="text"
                  className={`my-form-control gear-input ${gearRequest.hasError ? 'create-trip-error' : ''}`}
                  name="trippeeGear"
                  placeholder="Add Item"
                  onChange={event => this.onTrippeeGearChange(event, index)}
                  value={gearRequest.gear}
                  autoFocus
                />
              </div>
              <div className="gear-field-and-form">
                <span className="gear-field">Size Type:</span>
                <Dropdown onSelect={eventKey => this.onSizeTypeChange(eventKey, index)}>
                  <Dropdown.Toggle id="size-type-dropdown">
                    <span>
                      <span className="selected-size">{gearRequest.size_type}</span>
                      <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="filter-options clothe-options">
                    <Dropdown.Item eventKey="N/A">N/A</Dropdown.Item>
                    <Dropdown.Item eventKey="Clothe">Clothes</Dropdown.Item>
                    <Dropdown.Item eventKey="Shoe">Shoe</Dropdown.Item>
                    <Dropdown.Item eventKey="Height">Height</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <button type="button" className="delete-gear-button" onClick={() => this.removeTrippeeGear(index)}>X</button>
          </div>
          <hr className="line" />
        </div>
      );
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
    coleaders = coleaders.length === 0 ? 'None' : coleaders;
    return coleaders;
  };

  previousButton = (e) => {
    e.preventDefault();
    this._prev();
  }

  nextButton = (e) => {
    if (this.pageIsValid()) {
      e.preventDefault();
      if (this.state.currentStep !== 5) {
        this._next();
      } else {
        this.createTrip();
      }
    }
  }

  _next = () => {
    this.setState((prevState) => {
      return { currentStep: prevState.currentStep + 1 };
    });
  }

  _prev = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
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
        // const pcard = this.state.pcardRequest[0];
        const { otherCosts } = pcard;
        // let hasEmptyOtherCost = false;
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
        const numPeopleError = this.isStringEmpty(pcard.numPeople);
        updates.numPeopleError = numPeopleError;
        if (numPeopleError) {
          hasEmptyField = true;
        }
        return Object.assign({}, pcard, updates);
      });
      if (hasEmptyField) {
        this.setState({ pcardRequest: markedEmptyFields });
        this.props.appError('Please complete or clear the highlighted fields');
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
    this.props.createTrip(trip, this.props.history);
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
            getGearInputs={this.getGearInputs(this.props)}
            getTrippeeGear={this.getTrippeeGear(this.props)}
            errorFields={this.state.errorFields}
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
      <div className="row my-row">
        <LeftColumn
          currentStep={this.state.currentStep}
        />
        <div className="right-column">
          <div className="create-trip-form-page">
            {page}
          </div>
          <div className="create-trip-bottom-buttons create-trips-top-margin">
            <button disabled={this.state.currentStep === 1} type="button" className="btn next-button" onClick={this.previousButton}>Previous</button>
            <button type="button" className="btn next-button" onClick={this.nextButton}>
              {this.state.currentStep === 5 ? 'Create Trip!' : 'Next'}
            </button>
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
export default withRouter(connect(mapStateToProps, { fetchTrip, createTrip, appError })(CreateTrip));
