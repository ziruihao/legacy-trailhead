import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import ProfileCard from './profilecard';
import { appError, fetchVehicleRequest, getVehicles, assignVehicles } from '../actions';
import '../styles/opoVehicleRequest-style.scss';

class OPOVehicleRequest extends Component {
  vehicleForm = [];

  errorFields = {
    assignedVehicle: false,
    pickupDate: false,
    pickupTime: false,
    returnDate: false,
    returnTime: false,
    assignedKey: false,
  }

  defaultAssignment = {
    assignedVehicle: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    assignedKey: '',
    errorFields: { ...this.errorFields },
    conflictingEvents: [],
    responseIndex: 0,
  }

  constructor(props) {
    super(props);
    this.emailRef = React.createRef();
    this.state = {
      isEditing: true,
      showProfile: false,
      assignments: [],
      showModal: false,
      modalTrigger: 'CONTACT',
      ready: false,
    };
  }

  componentDidMount() {
    Promise.all([this.props.fetchVehicleRequest(this.props.match.params.vehicleReqId), this.props.getVehicles()])
      .then(() => {
        this.vehicleForm = this.props.vehicles.map((vehicle) => {
          return (
            <Dropdown.Item className="ovr-vehicle-option" key={vehicle.id} eventKey={vehicle.name}>
              <span>{vehicle.name}</span>
              <span className="ovr-vehicle-option-type">{vehicle.type}</span>
            </Dropdown.Item>
          );
        });
        const assignments = this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
          const { defaultAssignment } = this;
          return Object.assign({}, defaultAssignment, { responseIndex: index });
        });
        const unreviewed = this.props.vehicleRequest.status === 'pending';
        this.setState((prevState) => {
          return { isEditing: unreviewed, assignments, ready: true };
        });
      });
  }

  toggleProfile = () => {
    this.setState((prevState) => {
      return { showProfile: !prevState.showProfile };
    });
  }

  formatDate = (date) => {
    const rawDate = new Date(date);
    const dateString = rawDate.toUTCString();
    return dateString.substring(0, 11);
  };

  formatTime = (time) => {
    const splitTime = time.split(':');
    splitTime.push(' AM');
    const originalHour = splitTime[0];
    splitTime[0] = originalHour % 12;
    if (originalHour >= 12) {
      splitTime[2] = ' PM';
    }
    if (splitTime[0] === 0) {
      splitTime[0] = 12;
    }
    return `${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
  }

  copyEmail = (event) => {
    this.emailRef.current.select();
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Email copied to clipboard!');
  }

  onVehicleTypeChange = (eventkey, index) => {
    this.setState((prevState) => {
      const oldVehicles = prevState.assignments;
      const oldVehicle = oldVehicles[index];
      const updates = {};
      updates.assignedVehicle = eventkey;
      // updates.errorFields = Object.assign({}, oldVehicle.errorFields, { vehicleType: this.isStringEmpty(eventkey) });
      const updatedVehicle = Object.assign({}, oldVehicle, updates);
      const updatedVehicles = Object.assign([], oldVehicles, { [index]: updatedVehicle });
      return { assignments: updatedVehicles };
    });
  }

  onAssignmentDetailChange = (event, index) => {
    event.persist();
    this.setState((prevState) => {
      const oldVehicles = prevState.assignments;
      const oldVehicle = oldVehicles[index];
      const newValue = event.target.value;
      const updatedEntry = event.target.name;
      const update = {};
      // update entry with new value
      update[updatedEntry] = newValue;
      const updatedVehicle = Object.assign({}, oldVehicle, update);
      const updatedVehicles = Object.assign([], oldVehicles, { [index]: updatedVehicle });
      return { assignments: updatedVehicles };
    });
  }

  skipAssignment = (index) => {
    this.setState((prevState) => {
      const { assignments } = prevState;
      assignments[index] = this.defaultAssignment;
      return { assignments };
    });
    if (index < this.state.assignments.length - 1) {
      window.location.hash = `#vehicle_req_${index + 1}`;
    }
  }

  createDateObject = (date, time) => {
    const dateObject = new Date(date);
    const splitTime = time.split(':');
    dateObject.setHours(splitTime[0], splitTime[1]);
    return dateObject;
  }

  isStringEmpty = (string) => {
    return string.length === 0 || !string.toString().trim();
  }

  isValid = () => {
    const { assignments } = this.state;

    let hasIncompleteAssignment = false;
    const hasFilledOutField = {};
    const markedEmptyFields = assignments.map((assignment, index) => {
      const updatedErrorFields = { ...this.errorFields };
      const errorFields = Object.keys(updatedErrorFields);
      let hasEmptyField = false;
      hasFilledOutField[index] = false;
      errorFields.forEach((errorField) => {
        if (this.isStringEmpty(assignment[errorField])) {
          updatedErrorFields[errorField] = true;
          hasEmptyField = true;
        } else {
          hasFilledOutField[index] = true;
        }
      });
      if (hasEmptyField && hasFilledOutField[index]) {
        hasIncompleteAssignment = true;
        assignment.errorFields = Object.assign({}, assignment.errorFields, updatedErrorFields);
      }
      return assignment;
    });

    const hasFilledOutFieldValues = Object.values(hasFilledOutField);
    const hasFilledOutAssignment = hasFilledOutFieldValues.some((assignment) => {
      return assignment === true;
    });
    if (!hasFilledOutAssignment) {
      this.props.appError('Please assign at least one vehicle');
      window.scrollTo(0, 0);
      return false;
    }
    if (hasIncompleteAssignment) {
      this.setState({ assignments: markedEmptyFields });
      this.props.appError('Please complete or clear the highlighted assignments');
      window.scrollTo(0, 0);
      return false;
    }

    let returnBeforePickup = false;
    const markedReturnBeforePickup = assignments.map((assignment) => {
      if (!this.isStringEmpty(assignment.pickupDate) && !this.isStringEmpty(assignment.pickupTime) && !this.isStringEmpty(assignment.returnDate) && !this.isStringEmpty(assignment.returnTime)) {
        const updatedErrorFields = { ...this.errorFields };
        const pickupDate = new Date(assignment.pickupDate);
        const pickupTime = assignment.pickupTime.split(':');
        pickupDate.setHours(pickupTime[0], pickupTime[1]);
        const returnDate = new Date(assignment.returnDate);
        const returnTime = assignment.returnTime.split(':');
        returnDate.setHours(returnTime[0], returnTime[1]);
        if (returnDate < pickupDate) {
          updatedErrorFields.pickupDate = true;
          updatedErrorFields.pickupTime = true;
          updatedErrorFields.returnDate = true;
          updatedErrorFields.returnTime = true;
          returnBeforePickup = true;
        }
        assignment.errorFields = Object.assign({}, assignment.errorFields, updatedErrorFields);
        return assignment;
      } else {
        return assignment;
      }
    });

    // break if there's return date before pickup date
    if (returnBeforePickup) {
      this.setState({ assignments: markedReturnBeforePickup });
      this.props.appError('Return time must be before pickup time');
      window.scrollTo(0, 0);
      return false;
    }

    let hasConflictingEvent = false;
    const { vehicles } = this.props;
    const markedConflictingAssignments = assignments.map((assignment) => {
      if (!this.isStringEmpty(assignment.assignedVehicle) && !this.isStringEmpty(assignment.pickupDate)
        && !this.isStringEmpty(assignment.pickupTime) && !this.isStringEmpty(assignment.returnDate) && !this.isStringEmpty(assignment.returnTime)) {
        const selectedVehicle = vehicles.find((vehicle) => {
          return vehicle.name === assignment.assignedVehicle;
        });
        const conflictingEvents = selectedVehicle.bookings.filter((booking) => {
          const existingPickupDateAndTime = this.createDateObject(booking.assigned_pickupDate, booking.assigned_pickupTime);

          const existingReturnDateAndTime = this.createDateObject(booking.assigned_returnDate, booking.assigned_returnTime);

          const proposedPickupDateAndTime = this.createDateObject(assignment.pickupDate, assignment.pickupTime);

          const proposedReturnDateAndTime = this.createDateObject(assignment.returnDate, assignment.returnTime);

          return (proposedReturnDateAndTime >= existingPickupDateAndTime) || (proposedPickupDateAndTime <= existingReturnDateAndTime);
        });

        if (conflictingEvents.length > 0) {
          const updatedErrorFields = { ...this.errorFields };
          updatedErrorFields.pickupDate = true;
          updatedErrorFields.pickupTime = true;
          updatedErrorFields.returnDate = true;
          updatedErrorFields.returnTime = true;
          updatedErrorFields.conflictingEvents = conflictingEvents;
          assignment.errorFields = Object.assign({}, assignment.errorFields, updatedErrorFields);
          hasConflictingEvent = true;
        }

        return assignment;
      } else {
        return assignment;
      }
    });

    if (hasConflictingEvent) {
      this.setState({ assignments: markedConflictingAssignments });
      this.props.appError('The highlighted assignment conflicts with an already existing one');
      window.scrollTo(0, 0);
      return false;
    }

    return true;
  }

  activateModal = (trigger) => {
    this.setState({ showModal: true, modalTrigger: trigger });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  approve = () => {
    if (this.isValid()) {
      const nonEmptyAssignemnts = this.state.assignments.filter((assignment) => {
        const fields = Object.keys(this.errorFields);
        let hasFilledOutField = false;
        fields.forEach((field) => {
          if (!this.isStringEmpty(assignment[field])) {
            hasFilledOutField = true;
          }
        });
        return hasFilledOutField;
      });

      const deletedErrorFields = nonEmptyAssignemnts.map((assignment) => {
        delete assignment.errorFields;
        delete assignment.conflictingEvents;
        return assignment;
      });

      const response = {
        reqId: this.props.vehicleRequest.id,
        assignments: deletedErrorFields,
      };
      this.props.assignVehicles(response)
        .then(() => {
          console.log(this.props.vehicleRequest);
        });
    }
  }

  assignmentForm = (index) => {
    const assignment = this.state.assignments[index];
    return (
      <div className="ovr-req-assignment">
        <span className="vrf-label ovr-column-header">Assign</span>
        <div className="trip-detail ovr-white-background">
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <Dropdown onSelect={eventKey => this.onVehicleTypeChange(eventKey, index)}>
              <Dropdown.Toggle id="ovr-vehicle-dropdown" className={assignment.errorFields.assignedVehicle ? 'vrf-error' : ''}>
                <p className={`ovr-current-vehicle ${assignment.assignedVehicle === '' ? 'no-date' : ''}`}>{assignment.assignedVehicle === '' ? 'Assign a vehicle' : assignment.assignedVehicle}</p>
                <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="filter-options ovr-vehicle-options">
                {this.vehicleForm}
              </Dropdown.Menu>
            </Dropdown>
          </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail"> - </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail"> - </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <input
              type="date"
              id={`pickup_date_${index}`}
              className={`ovr-date-input ${assignment.pickupDate.length === 0 ? 'no-date' : ''} ${assignment.errorFields.pickupDate ? 'vrf-error' : ''}`}
              name="pickupDate"
              value={assignment.pickupDate}
              onChange={event => this.onAssignmentDetailChange(event, index)}
            />
          </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <input
              type="time"
              id={`pickup_time_${index}`}
              className={`ovr-date-input ${assignment.pickupTime.length === 0 ? 'no-date' : ''} ${assignment.errorFields.pickupTime ? 'vrf-error' : ''}`}
              name="pickupTime"
              value={assignment.pickupTime}
              onChange={event => this.onAssignmentDetailChange(event, index)}
            />
          </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <input
              type="date"
              id={`return_date_${index}`}
              className={`ovr-date-input ${assignment.returnDate.length === 0 ? 'no-date' : ''} ${assignment.errorFields.returnDate ? 'vrf-error' : ''}`}
              name="returnDate"
              value={assignment.returnDate}
              onChange={event => this.onAssignmentDetailChange(event, index)}
            />
          </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <input
              type="time"
              id={`return_time_${index}`}
              className={`ovr-date-input ${assignment.returnTime.length === 0 ? 'no-date' : ''} ${assignment.errorFields.returnTime ? 'vrf-error' : ''}`}
              name="returnTime"
              value={assignment.returnTime}
              onChange={event => this.onAssignmentDetailChange(event, index)}
            />
          </span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <input
              type="text"
              id={`assigned_key_${index}`}
              className={`ovr-date-input ${assignment.errorFields.assignedKey ? 'vrf-error' : ''}`}
              maxLength="50"
              name="assignedKey"
              value={assignment.assignedKey}
              placeholder="33A"
              onChange={event => this.onAssignmentDetailChange(event, index)}
            />
          </span>
          <hr className="detail-line" />
        </div>
        <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={() => this.skipAssignment(index)} role="button" tabIndex={0}>Skip assignment</span>
      </div>
    );
  }

  assignmentDisplay = (index) => {
    return (
      <div className="ovr-req-assignment">
        <span className="vrf-label ovr-column-header">Assigned</span>
        <div className="trip-detail ovr-white-background">
          <span className="ovr-req-row ovr-req-vehicle-detail">Van</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">4/15/19</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">9:00 AM</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">4/15/19</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">4:00 PM</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">Yes</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">No</span>
          <hr className="detail-line" />
          <span className="ovr-req-row ovr-req-vehicle-detail">63</span>
        </div>
      </div>
    );
  }

  getVehicles = () => {
    return this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
      return (
        <div key={`vehicle_#${index}`} id={`vehicle_req_${index}`} className="vrf-req-group">
          <div className="vrf-req-header">
            <h3 className="vrf-label vrf-req-no">Vehicle #{index + 1}</h3>
          </div>
          <div className="trip-detail pending-table ovr-white-background">
            <div className="vrf-label leader-detail-row">
              Vehicle Details
            </div>
            <hr className="detail-line" />
            <div className={`leader-detail-row ovr-req-detail ${this.isStringEmpty(vehicle.vehicleDetails) ? 'ovr-skipped-detail' : ''}`}>
              {this.isStringEmpty(vehicle.vehicleDetails) ? 'skipped' : vehicle.vehicleDetails}
            </div>
          </div>
          <div className="ovr-request-and-assignment">
            <div className="ovr-req-labels">
              <span className="ovr-req-row vrf-label ovr-req-label ovr-header-filler">#TheLodgeInfiltrated</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Vehicle</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Trailer Compatible?</span>
              <span className="ovr-req-row vrf-label ovr-req-label">WMNF Pass Needed?</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Pickup Date</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Pickup Time</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Return Date</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Return Time</span>
              <span className="ovr-req-row vrf-label ovr-req-label">Key Assignment </span>
            </div>

            <div className="ovr-req-vehicle-details">
              <span className="vrf-label ovr-column-header">Requested</span>
              <div className="trip-detail ovr-white-background">
                <span className="ovr-req-row ovr-req-vehicle-detail">{vehicle.vehicleType}</span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail">{vehicle.trailerNeeded ? 'Yes' : 'No'}</span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail">{vehicle.passNeeded ? 'Yes' : 'No'} </span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail">{this.formatDate(vehicle.pickupDate.substring(0, 10))}</span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail">{this.formatTime(vehicle.pickupTime)}</span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail">{this.formatDate(vehicle.returnDate.substring(0, 10))}</span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail">{this.formatTime(vehicle.returnTime)}</span>
                <hr className="detail-line" />
                <span className="ovr-req-row ovr-req-vehicle-detail"> - </span>
              </div>
            </div>

            {this.props.vehicleRequest.status === 'pending' ? this.assignmentForm(index) : this.assignmentDisplay(index)}

          </div>
        </div>
      );
    });
  }

  getAppropriateLink = () => {
    if (this.state.isEditing) {
      return <span className="cancel-link ovr-bottom-link ovr-contact-link" onClick={() => this.activateModal('CONTACT')} role="button" tabIndex={0}>Contact requester</span>;
    } else if (!this.state.isEditing && this.props.vehicleRequest.status === 'approved') {
      return <span className="cancel-link ovr-bottom-link" onClick={() => this.activateModal('CANCEL')} role="button" tabIndex={0}>Cancel assignment</span>;
    } else {
      return null;
    }
  }

  getAppropriateButton = () => {
    if (this.state.isEditing) {
      return <button type="submit" className="vrf-submit-button signup-button" onClick={this.approve}>{this.props.vehicleRequest.status === 'pending' ? 'Approve request' : 'Update'}</button>;
    } else {
      return <button type="submit" className="vrf-submit-button signup-button" onClick={this.startEditing}>Update assignment</button>;
    }
  }


  getModalContent = () => {
    if (this.state.modalTrigger === 'CONTACT') {
      return (
        <div className="cancel-content">
          <p className="cancel-question">{`Contact ${this.props.vehicleRequest.requester.name}`}</p>
          <p className="cancel-message">Please email the requester if you need them to update the request. They cannot update a request after it has been approved.</p>
          <div className="ovr-modal-button-container">
            <input
              ref={this.emailRef}
              type="text"
              className="ovr-requester-email"
              defaultValue={this.props.vehicleRequest.requester.email}
            />
          </div>
          <div className="ovr-modal-button-container">
            <button type="button" className="vrf-submit-button signup-button" onClick={this.copyEmail}>Copy email address</button>
          </div>
        </div>
      );
    } else if (this.state.modalTrigger === 'CANCEL') {
      return (
        <div className="cancel-content">
          <p className="cancel-question">Cancel assignment?</p>
          <p className="cancel-message">The assigned vehicle will become available for other requests</p>
          <div className="ovr-modal-button-container">
            <button type="submit" className="leader-cancel-button confirm-cancel" onClick={this.cancelAssignment}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (!this.state.ready) {
      return (
        <div>
          <h1>Loading</h1>
          <img src="/src/img/loading-gif.gif" alt="loading-gif" />
        </div>
      );
    } else {
      return (
        <div className="ovr-container">
          <div className="ovr-sidebar">
            <span className="ovr-sidebar-header">External Vehicle Request</span>
            <span className="vrf-label ovr-sidebar-subheader">Vehicle Request</span>
            <div className="ovr-sidebar-req-sections">
              <div className="ovr-sidebar-req-section">
                <a href="#req_details" className="ovr-req-section-link">Request Details</a>
              </div>

              {this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
                return (
                  <div key={`vehicle_link_${index}`} className="ovr-sidebar-req-section">
                    <a href={`#vehicle_req_${index}`} className="ovr-req-section-link">Vehicle #{index + 1}</a>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ovr-req-content">
            <div className="ovr-req-content-header">
              <h1 className="mytrips-header">Vehicle Request</h1>
            </div>
            <div id="req_details" className="trip-detail pending-table ovr-white-background">
              <div className="leader-detail-row">
                <span className="detail-cell vrf-label">Requester</span>
                <span className="detail-cell vrf-label"># of people</span>
                <span className="detail-cell vrf-label">Estimated Mileage</span>
                <span className="detail-cell vrf-label">Actions</span>
              </div>
              <hr className="detail-line" />
              <div className="leader-detail-row">
                <span className="detail-cell">{this.props.vehicleRequest.requester.name}</span>
                <span className="detail-cell">{this.props.vehicleRequest.noOfPeople}</span>
                <span className="detail-cell">{this.props.vehicleRequest.mileage}</span>
                <span className="detail-cell">
                  <button type="button" className="leader-signup-button toggle-profile" onClick={this.toggleProfile}>{this.state.showProfile ? 'Hide' : 'Show'} Profile</button>
                </span>
              </div>
              <Collapse
                in={this.state.showProfile}
              >
                <div className="leader-profile-card">
                  <ProfileCard
                    asProfilePage={false}
                    isEditing={false}
                    user={this.props.vehicleRequest.requester}
                  />
                </div>
              </Collapse>
            </div>
            {this.props.vehicleRequest.requestType === 'SOLO'
              ? (
                <div className="trip-detail pending-table ovr-white-background">
                  <div className="vrf-label leader-detail-row">
                    Request Details
                  </div>
                  <hr className="detail-line" />
                  <div className="leader-detail-row ovr-req-detail">
                    {this.props.vehicleRequest.requestDetails}
                  </div>
                </div>
              )
              : null}

            {this.getVehicles()}

            <div className="ovr-bottom-button-and-link">
              <Link to="/vehiclescheduler" className="calendar-link">View Vehicle Calendar</Link>

              {this.getAppropriateLink()}

              {this.getAppropriateButton()}
            </div>
          </div>
          <Modal
            centered
            show={this.state.showModal}
            onHide={this.closeModal}
          >
            <div className="trip-details-close-button">
              <i className="material-icons close-button" onClick={this.closeModal} role="button" tabIndex={0}>close</i>
            </div>
            <img className="status-badge ovr-status-badge" src="/src/img/warning_badge.svg" alt="approved_badge" />
            {this.getModalContent()}
          </Modal>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    vehicleRequest: state.vehicleRequests.vehicleReq,
    vehicles: state.vehicleRequests.vehicles,
    invalidAssignments: state.vehicleRequests.invalidAssignments,
  };
};

export default withRouter(connect(mapStateToProps, { appError, fetchVehicleRequest, getVehicles, assignVehicles })(OPOVehicleRequest));
