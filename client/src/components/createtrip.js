/* eslint-disable */
/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrip, createTrip, editTrip, appError, clearError } from '../actions';
import {Modal} from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from './layout';
import PCardRequest from './pcard_request';
import { LeftColumn, BasicTripInfo, DatesLocation, AboutTheTrip, Equipment } from './create_trip_pages';
import Sidebar from './sidebar';
import Text from './text';
import VehicleRequest from './vehicle-request-page/vehicle-request';
import VehicleCalendar from './calendar/vehicleCalendar';
import * as constants from '../constants';
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
    name: '',
    quantity: 1,
    hasError: false,
  }

  defaultTrippeeGear = {
    gear: '',
    sizeType: 'N/A',
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
      leaders: [],
      club: null,
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
      vehicles: [],
      errorFields: this.errorFields,
      editMode: false,
      loaded: false,
      showCalendarModal: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onGearChangeName = this.onGearChangeName.bind(this);
    this.onGearChangeQuantity = this.onGearChangeQuantity.bind(this);
    this.onClubChange = this.onClubChange.bind(this);
    this.pageIsValid = this.pageIsValid.bind(this);
  }

  componentDidMount() {
    if (this.props.location.pathname.includes('/edittrip')) {
      this.setState({editMode: true})
      this.props.fetchTrip(this.props.match.params.tripID)
        .then(() => {
          if (this.props.isLeaderOnTrip) {
            const { trip } = this.props;
            let gearRequests = [];
            if (trip.OPOGearRequests) {
              gearRequests = trip.OPOGearRequests.map((groupGear) => {
                return { ...groupGear, hasError: false };
              });
            }
            let trippeeGear = [];
            if (trip.trippeeGear) {
              trippeeGear = trip.trippeeGear.map((individualGear) => {
                return Object.assign({}, individualGear, { hasError: false });
              });
            }
            let pcardRequest = [];
            if (trip.pcard) {
              pcardRequest = trip.pcard.map((pcard) => {
                const { otherCosts } = pcard;
                const withErrorFields = otherCosts.map((otherCost) => {
                  return Object.assign({}, otherCost, { errorFields: { ...this.otherCostErrorFields } });
                });
                const updates = {};
                updates.otherCosts = withErrorFields;
                updates.errorFields = { ...this.pcardErrorFields };
                return Object.assign({}, pcard, updates);
              });
            }
            let vehicles = [];
            if (trip.vehicleRequest) {
              vehicles = trip.vehicleRequest.requestedVehicles?.map((vehicle) => {
                const forEdititing = {};
                forEdititing.errorFields = { ...this.errorFields };
                forEdititing.pickupDate = vehicle.pickupDate.substring(0, 10);
                forEdititing.returnDate = vehicle.returnDate.substring(0, 10);
                const pickupAsDate = new Date(vehicle.pickupDate);
                const returnAsDate = new Date(vehicle.returnDate);
                forEdititing.tripLength = pickupAsDate.getTime() === returnAsDate.getTime() ? 'single-day-trip' : 'multi-day-trip';
                return Object.assign({}, vehicle, forEdititing);
              }) || [];
            }
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);
            const length = startDate.getTime() === endDate.getTime() ? 'single' : 'multi';
            
            this.setState({
              currentStep: 1,
              title: trip.title,
              leaders: trip.leaders.map(leader => leader.email),
              club: trip.club,
              experienceNeeded: trip.experienceNeeded,
              access: trip.coLeaderCanEditTrip,
              description: trip.description,
              startDate: trip.startDate.substring(0, 10),
              endDate: trip.endDate.substring(0, 10),
              startTime: trip.startTime,
              endTime: trip.endTime,
              pickup: trip.pickup,
              dropoff: trip.dropoff,
              location: trip.location,
              cost: trip.cost,
              length,
              mileage: trip.vehicleRequest?.mileage,
              trippeeGear,
              pcardRequest,
              gearRequests,
              vehicles,
              loaded: true,
            });

          } else {
            this.props.history.push(`/trip/${this.props.match.params.tripID}`);
          }
        });
    } else this.setState({loaded: true});
  }

  onFieldChange(event) {
    console.log(event.target.value);
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
    event.persist();
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

  onClubChange(eventKey) {
    let selectedClub = null;
    this.props.user.leader_for.some(club => {
      if (club._id === eventKey) selectedClub = club;
    });
    this.setState({
      club: selectedClub,
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

  // getClubOptions = () => {
  //   let options = null;
  //   if (this.props.user.role !== 'Trippee' && this.props.user.leader_for.length > 0) {
  //     options = this.props.user.leader_for.map((club) => {
  //       return <option key={club._id} data-id={club._id} value={club.name}>{club.name}</option>;
  //     });
  //   }
  //   return options;
  // }

  handleDateChange = (eventKey) => {
    if (eventKey === 'single') {
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

  onGearChangeName = (event, idx) => {
    event.persist();
    this.setState((prevState) => {
      const gearArray = prevState.gearRequests;
      const changedGearObject = gearArray[idx];
      const updates = {};
      updates.name = event.target.value;
      updates.hasError = this.isStringEmpty(event.target.value);
      const updatedGearObject = Object.assign({}, changedGearObject, updates);
      return {
        gearRequests: Object.assign([], gearArray, { [idx]: updatedGearObject })
      };
    });
  }

  onGearChangeQuantity = (event, idx) => {
    event.persist();
    this.setState((prevState) => {
      const gearArray = prevState.gearRequests;
      const changedGearObject = gearArray[idx];
      const updates = {};
      updates.quantity = event.target.value;
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
      updates.name = event.target.value;
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
      trippeeGear[index].sizeType = eventKey;
      return {
        trippeeGear,
      };
    });
  }

  passVehicles = (vehicles, mileage) => {
    this.setState((prevState) => {
      return { vehicles, mileage, currentStep: prevState.currentStep + 1 };
    });
  }

  // getCoLeaders = (leaders) => {
  //   let coleaders = '';
  //   leaders.forEach((leader, index) => {
  //     if (index !== 0) {
  //       coleaders += `${leader.email}, `;
  //     }
  //   });
  //   coleaders = coleaders.substring(0, coleaders.length - 2);
  //   coleaders = coleaders.length === 0 ? '' : coleaders;
  //   return coleaders;
  // };

  previousButton = (e) => {
    e.preventDefault();
    this._prev();
  }

  _next = () => {
    if (this.pageIsValid()) {
      this.props.clearError();
      this.setState({errorFields: this.errorFields});
      if (this.state.currentStep !== 6) {
        this.setState((prevState) => {
          return { currentStep: prevState.currentStep + 1 };
        });
      } else {
        this.createTrip();
      }
    }
  }

  getAppropriateButton = () => {
    // if (this.state.currentStep === 5 && (!this.state.editMode || this.props.trip.vehicleStatus === 'pending' || this.props.trip.vehicleStatus === 'N/A')) {
    //   return null;
    // }
    if (this.state.currentStep === 6) {
      return (
        <div className="doc-button" onClick={this._next} role="button" tabIndex={0}>
        {this.state.editMode ? 'Update Trip' : 'Create Trip!'}
      </div>
      );
    } else {
      return (
        <div className="doc-button" onClick={this._next} role="button" tabIndex={0}>
          {this.state.currentStep === 5 ? 'Skip' : 'Next'}
        </div>
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

  createDateObject = (date, time) => {
    // adapted from https://stackoverflow.com/questions/2488313/javascripts-getdate-returns-wrong-date
    const parts = date.toString().match(/(\d+)/g);
    const splitTime = time.split(':');
    return new Date(parts[0], parts[1] - 1, parts[2], splitTime[0], splitTime[1]);
  }

  pageIsValid = () => {
    if (this.state.currentStep === 1) {
      return !this.pageHasEmptyFields(['title', 'cost']);
    }
    if (this.state.currentStep === 2) {
      if (!this.pageHasEmptyFields(['startDate', 'startTime', 'endTime', 'endDate', 'location'])) {
        const { startDate, startTime, endDate, endTime } = this.state;
        const now = new Date();
        const startAsDate = this.createDateObject(startDate, startTime);
        if (startAsDate < now) {
          this.setState((prevState) => {
            return { errorFields: Object.assign({}, prevState.errorFields, { startDate: true, startTime: true }) };
          });
          this.props.appError('Trip cannot be in the past');
          window.scrollTo(0, 0);
          return false;
        }
        const endAsDate = this.createDateObject(endDate, endTime);
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
        const updatedErrorFields = {};
        const isFieldEmptyName = this.isStringEmpty(gear.name);
        const isFieldEmptyQuantity = (gear.quantity > 0 ? false : true);
        updatedErrorFields.name = this.isFieldEmptyName;
        updatedErrorFields.quantity = this.isFieldEmptyQuantity;
        if (isFieldEmptyName || isFieldEmptyQuantity) {
          hasEmptyField = true;
        };
        return Object.assign({}, gear, { hasError: updatedErrorFields });
      });
      const markedEmptyTrippeFields = trippeeGear.map((gear) => {
        const isFieldEmpty = this.isStringEmpty(gear.name);
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
      return true;
    }

    if (this.state.currentStep === 6) {
      if (this.props.trip.pcardStatus !== 'approved') {
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
    }
    return true;
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  createTrip() {
    const club = this.isObjectEmpty(this.state.club) ? this.props.user.leader_for[0] : this.state.club;
    const gearRequests = this.state.gearRequests.map((groupGear) => {
      delete groupGear.hasError;
      return groupGear;
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
    });
    const vehicles = this.state.vehicles.map((vehicle) => {
      delete vehicle.errorFields;
      return vehicle;
    });
    const vehicleReqId = (this.state.editMode && this.props.trip.vehicleStatus !== 'N/A') ? this.props.trip.vehicleRequest._id : null;
    const trip = {
      title: this.state.title,
      leaders: this.state.leaders,
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
      coLeaderCanEditTrip: this.state.access,
      gearRequests,
      trippeeGear,
      pcard,
      vehicles,
      vehicleReqId,
    };
    console.log('\tFinal trip before sending to server', trip);
    if (this.state.editMode) {
      this.props.editTrip(trip, this.props.history, this.props.match.params.tripID);
    } else {
      this.props.createTrip(trip, this.props.history);
    }
  }

  render() {
    let page;
    //this.state.currentStep = 4;
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
            updateLeaderValue={(update) => {
              const updateTrimmed = update.map(u => u.text);
              this.setState({leaders: updateTrimmed});
            }}
            experienceValue={this.state.experienceNeeded}
            accessValue={this.state.access}
            experienceOption={this.handleOptionChange}
            clubOptions={this.props.user.leader_for}
            selectedClub={this.state.club}
            errorFields={this.state.errorFields}
            loaded={this.state.loaded}
          />
        );
        break;
      case 2:
        page = (
          <DatesLocation
            onFieldChange={this.onFieldChange}
            onDateChange={this.onDateChange}
            dateLength={this.state.length}
            onDateLengthChange={this.handleDateChange}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            theStartTime={this.state.startTime}
            theEndTime={this.state.endTime}
            tripLocation={this.state.location}
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
            onGearChangeName={this.onGearChangeName}
            onGearChangeQuantity={this.onGearChangeQuantity}
            onSizeTypeChange={this.onSizeTypeChange}
            removeTrippeeGear={this.removeTrippeeGear}
            removeGear={this.removeGear}
            trippeeGearStatus={this.state.editMode ? this.props.trip.trippeeGearStatus : undefined}
            gearStatus={this.state.editMode ? this.props.trip.gearStatus : undefined}
          />
        );
        break;
      case 5:
        page = (!this.state.editMode || this.props.trip.vehicleStatus === 'pending' || this.props.trip.vehicleStatus === 'N/A')
          ? (
            <VehicleRequest
              requestType='TRIP'
              passVehicles={this.passVehicles}
              mileage={this.state.mileage}
              vehicles={this.state.vehicles}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              startTime={this.state.startTime}
              endTime={this.state.endTime}
            />
          )
          : (
            <>
              <Text type='h1'>Vehicle requests</Text>
              <Stack size={50}></Stack>
              <Box dir='row' justify='center' align='center' height={100} className='doc-bordered'>
                <Text type='p1' color='gray' weight='thin'>You can&apos;t edit requests after they&apos;ve been reviewed</Text>
              </Box>
            </>
          );
        break;
      case 6:
        page = (
          <PCardRequest
            pcardRequest={this.state.pcardRequest}
            togglePcard={this.togglePcard}
            onPcardFieldChange={this.onPcardFieldChange}
            onOtherCostsChange={this.onOtherCostsChange}
            deleteOtherCost={this.deleteOtherCost}
            addOtherCost={this.addOtherCost}
            errorFields={this.state.errorFields}
            pcardStatus={this.state.editMode ? this.props.trip.pcardStatus : undefined}
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
            clubOptions={this.props.user.leader_for}
            selectedClub={this.state.club}
            errorFields={this.state.errorFields}
          />
        );
        break;
    }
    return (
      <Box dir="row" expand style={{position: 'relative'}}>
        <div style={{ zIndex: 10, position: 'fixed', bottom: '50px', left: '50px' }} className="doc-button" onClick={() => this.setState({ showCalendarModal: true })} role="button" tabIndex={0}>See vehicle calendar</div>
        <Sidebar
          sections={
            [
              {title: 'Where & when?', steps: [{number: 1, text: 'Basic information'}, {number: 2, text:'Dates and location'}]},
              {title: 'More details', steps: [{number: 3, text:'About the trip'}, {number: 4, text: 'Required gear'}]},
              {title: 'Requests', steps: [{number: 5, text: 'Vehicles'}, {number: 6, text: 'P-Card'}]},
            ]
          }
          currentStep={this.state.currentStep}
        />
        <Box dir="col" align="stretch" pad={100} expand className="create-trip-form">
          {page}
          <Stack size={100} />
          <Divider size={1} />
          <Stack size={50} />
          <Box dir="row" justify="between" align="center" id="approval-navigation">
            <div className={`doc-button hollow ${this.state.step === 1 ? 'disabled' : ''}`} onClick={this.state.currentStep === 1 ? null : this.previousButton} role="button" tabIndex={0}>Previous</div>
            {this.getAppropriateButton()}
          </Box>
        </Box>
        <Modal
            centered
            show={this.state.showCalendarModal}
            onHide={() => this.setState({ showCalendarModal: false })}
            dialogClassName="vehicle-calendar-modal"
          >
            <VehicleCalendar />
          </Modal>
      </Box>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    trip: state.trips.trip,
    isLeaderOnTrip: state.trips.isLeaderOnTrip,
  };
};
export default withRouter(connect(mapStateToProps, { fetchTrip, createTrip, editTrip, appError, clearError })(CreateTrip));
