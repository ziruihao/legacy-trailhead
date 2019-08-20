/* eslint-disable */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchTrip, createTrip, appError } from '../actions';
import PCardRequest from './pcard_request';
import { LeftColumn, BasicTripInfo, DatesLocation, AboutTheTrip, Equipment } from './create_trip_pages';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
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
      numPeople: null,
      snacks: null,
      breakfast: null,
      lunch: null,
      dinner: null,
      otherCostsTitle: [],
      otherCostsCost: [],
      totalCost: 0,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onFieldChangeOther = this.onFieldChangeOther.bind(this);
    this.createTrip = this.createTrip.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onGearChange = this.onGearChange.bind(this);
    this.onClubChange = this.onClubChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    if (this.props.trip.isEditMode !== false) {
      this.props.fetchTrip(this.props.match.params.tripID)
        .then(() => {
          const gear = this.props.trip.OPOGearRequests;
          const tripGear = this.props.trip.trippeeGear;
          const coLeaders = this.getCoLeaders(this.props.trip.leaders);
          // console.log(tripGear)
          // console.log(gear);
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
    let c;
    const cX = parseInt(this.state.totalCost, 10);
    if (event.target.name === 'snacks') {
      c = cX + 3 * parseInt(event.target.value, 10) * parseInt(this.state.numPeople, 10);
    } else if (event.target.name === 'breakfast') {
      c = cX + 10 * parseInt(event.target.value, 10) * parseInt(this.state.numPeople, 10);
    } else if (event.target.name === 'lunch') {
      c = cX + 14 * parseInt(event.target.value, 10) * parseInt(this.state.numPeople, 10);
    } else if (event.target.name === 'dinner') {
      c = cX + 16 * parseInt(event.target.value, 10) * parseInt(this.state.numPeople, 10);
    }
    this.setState({
      [event.target.name]: event.target.value,
      totalCost: c,
    });
  }

  onFieldChangeOther(event, idx) {
    if (event.target.name === 'otherCostsTitle') {
      const { otherCostsTitle: otherCTitle } = this.state;
      otherCTitle[idx] = event.target.value;
      this.setState({
        otherCostsTitle: otherCTitle,
      });
    } else {
      const { otherCostsCost: otherCCost } = this.state;
      otherCCost[idx] = parseInt(event.target.value, 10);
      let { totalCost: totalC } = this.state;
      totalC += parseInt(this.state.numPeople, 10) * parseInt(event.target.value, 10);
      this.setState({
        otherCostsCost: otherCCost,
        totalCost: totalC,
      });
    }
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
    }
    return options;
  }

  getDateOptions = () => {
    if (this.state.length === 'multi') {
      return (
        <div id="date-picker" className="row page-sub-headers trip-date-header">
          <div>
            <p>Start date</p>
            <input type="date" name="startDate" onChange={this.onDateChange} className="field top-create-trip leaders" value={this.state.startDate} />
          </div>
          <div>
            <p>End date</p>
            <input type="date" name="endDate" onChange={this.onDateChange} className="field top-create-trip leaders" value={this.state.endDate} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row page-sub-headers trip-date-header">
          <p>Trip date</p>
          <input type="date" name="startDate" onChange={this.onDateChange} className="field top-create-trip leaders" value={this.state.startDate} />
        </div>
      );
    }
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
    this.setState(prevState => ({ gearRequests: [...prevState.gearRequests, ''] }));
  }

  addTrippeeGear = () => {
    this.setState(prevState => ({ trippeeGear: [...prevState.trippeeGear, { gear: '', size_type: 'N/A', quantity: 0 }] }));
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
    console.log('gearRequest');
    return gearRequests.map((gearRequest, index) => {
      return (
        <div className="gear-container" key={index}>
          <input type="text" className="gear-input" name="opogearRequest" placeholder="Add Item" onChange={event => this.onGearChange(event, index)} value={gearRequest} autoFocus />
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
                  className="my-form-control gear-input"
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
                      <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
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
      const gearRequests = [...prevState.gearRequests];
      gearRequests[idx] = event.target.value;
      return {
        gearRequests,
      };
    });
  }

  onTrippeeGearChange = (event, idx) => {
    event.persist();
    this.setState((prevState) => {
      const trippeeGear = [...prevState.trippeeGear];
      trippeeGear[idx].gear = event.target.value;
      return {
        trippeeGear,
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
    console.log("next");
    e.preventDefault();
    this._next();
  }

  _next = () => {
    console.log(this.state.currentStep);
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  }

  _prev = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  }

  validate = () => {
    if (this.state.currentStep === 1) {
      const { title, club, cost } = this.state;
      if (title.length !== 0 && club !== {} && cost.length !==0) {
        return false;
      }
    }
    if (this.state.currentStep === 2) {
      const { startDate, startTime, endTime, location, mileage } = this.state;
      if (startDate.length !== 0 && startTime.length !== 0 && endTime.length !== 0 && location.length !== 0 && mileage.length !== 0) {
        return false;
      }
    }
    if (this.state.currentStep === 3) {
      const { description, pickup, dropoff } = this.state;
      if (description.length !== 0 && pickup.length !== 0 && dropoff.length !== 0) {
        return false;
      }
    }

    if (this.state.currentStep === 4) {
      const { gearRequest, trippeeGear } = this.state;
      if (gearRequest !== [] && trippeeGear !== []) {
        return false;
      }
    }
    return true;
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  createTrip() {
    console.log(this.state);
    const club = this.isObjectEmpty(this.state.club) ? this.props.user.leader_for[0] : this.state.club;
    const gearRequests = this.state.gearRequests.filter(gear => gear.length > 0);
    const trippeeGear = this.state.trippeeGear.filter(gear => gear.gear.length > 0);
    const otherPcardRequests = this.state.otherCostsCost.map((value, i) => (
      {
        expenseDetails: this.state.otherCostsTitle[i],
        unitCost: value,
        totalCost: (this.state.numPeople) * value,
      }
    ));
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
      pcard: [{ participants: this.state.numPeople },
        { totalCost: this.state.totalCost },
        { reason: [
          { info: [
            { expenseDetails: 'Snacks',
              unitCost: 3,
              totalCost: 3 * this.state.snacks * this.state.numPeople },
            { expenseDetails: 'Breakfast',
              unitCost: 10,
              totalCost: 10 * this.state.breakfast * this.state.numPeople },
            { expenseDetails: 'Lunch',
              unitCost: 14,
              totalCost: 14 * this.state.lunch * this.state.numPeople },
            { expenseDetails: 'Dinner',
              unitCost: 16,
              totalCost: 16 * this.state.dinner * this.state.numPeople },
          ] },
          { info: otherPcardRequests },

        ] },
      ],
    };

    if (!(trip.title && trip.description && trip.startDate && trip.endDate && trip.startTime && trip.endTime
     && trip.mileage && trip.location && trip.club)) {
      this.props.appError('All trip fields must be filled out');
      return;
    }

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (start.getTime() > end.getTime() || start.getTime() < Date.now() || end.getTime() < Date.now()) {
      this.props.appError('Please enter valid dates');
      return;
    }
    console.log(gearRequests);
    this.props.createTrip(trip, this.props.history);
  }


  render() {
    let page;
    switch (this.state.currentStep) {
      case 1:
        page = (
          <BasicTripInfo
            currentStep={this.state.currentStep}
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
            nextButton={this.nextButton}
            validate={this.validate}
          />
        );
        break;
      case 2:
        page = (
          <DatesLocation
            currentStep={this.state.currentStep}
            onFieldChange={this.onFieldChange}
            onDateChange={this.handleDateChange}
            dateLength={this.state.length}
            dateOptions={this.getDateOptions()}
            theStartTime={this.state.startTime}
            theEndTime={this.state.endTime}
            tripLocation={this.state.location}
            tripMileage={this.state.mileage}
            nextButton={this.nextButton}
            prevButton={this.previousButton}
            validate={this.validate}
          />
        );
        break;
      case 3:
        page = (
          <AboutTheTrip
            currentStep={this.state.currentStep}
            pickUp={this.state.pickup}
            dropOff={this.state.dropoff}
            onFieldChange={this.onFieldChange}
            DescripValue={this.state.description}
            nextButton={this.nextButton}
            prevButton={this.previousButton}
            validate={this.validate}
          />
        );
        break;
      case 4:
        page = (
          <Equipment
            currentStep={this.state.currentStep}
            addTrippeeGear={this.addTrippeeGear}
            addGear={this.addGear}
            getGearInputs={this.getGearInputs(this.props)}
            getTrippeeGear={this.getTrippeeGear(this.props)}
            nextButton={this.nextButton}
            prevButton={this.previousButton}
            validate={this.validate}
          />
        );
        break;
      case 5:
        page = (
          <PCardRequest
            currentStep={this.state.currentStep}
            onFieldChange={this.onFieldChange}
            onFieldChangeOther={this.onFieldChangeOther}
            prevButton={this.previousButton}
            validate={this.validate}
            createTrip={this.createTrip}
          />
        );
        break;
      default:
        page = (
          <BasicTripInfo
            currentStep={this.state.currentStep}
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
            nextButton={this.nextButton}
            validate={this.validate}
          />
        );
        break;
    }
    return (
      <div className="row my-row">
        <LeftColumn
          currentStep={this.state.currentStep}
        />
        { page }
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
