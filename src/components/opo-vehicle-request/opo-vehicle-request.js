/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Collapse from 'react-bootstrap/Collapse';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import { ProfileCard } from '../profile-card';
import ConflictModal from './conflict-modal';
import Loading from '../loading';
import * as constants from '../../constants';
import { appError, fetchVehicleRequest, getVehicles, assignVehicles, cancelAssignments, denyVehicleRequest } from '../../actions';
import pendingBadge from '../../img/pending_badge.svg';
import approvedBadge from '../../img/approved_badge.svg';
import deniedBadge from '../../img/denied_badge.svg';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import conflictMarker from './conflict-marker.svg';
import './opo-vehicle-request.scss';

class OPOVehicleRequest extends Component {
  badges = {
    pending: pendingBadge,
    approved: approvedBadge,
    denied: deniedBadge,
  }

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
    conflicts: [],
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
      modalInfo: { trigger: 'CONTACT', ids: [] },
      ready: false,
      conflictWith: null,
      conflicts: null,
      showConflictsModal: false,
    };
  }

  componentDidMount() {
    const vehicleReqId = this.props.partOfTrip ? this.props.vehicleReqId : this.props.match.params.vehicleReqId;
    Promise.all([this.props.fetchVehicleRequest(vehicleReqId), this.props.getVehicles()])
      .then(() => {
        this.vehicleForm = this.props.vehicles.map((vehicle) => {
          return (
            <Dropdown.Item key={vehicle._id} className="ovr-vehicle-option" eventKey={vehicle.name}>
              <span>{vehicle.name}</span>
              <span className="ovr-vehicle-option-type">{vehicle.type}</span>
            </Dropdown.Item>
          );
        });
        const assignments = this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
          const { defaultAssignment } = this;
          const updates = {};
          updates.responseIndex = index;
          updates.conflicts = [];
          updates.pickupDate = vehicle.pickupDate.substring(0, 10);
          updates.pickupTime = vehicle.pickupTime;
          updates.returnDate = vehicle.returnDate.substring(0, 10);
          updates.returnTime = vehicle.returnTime;
          return Object.assign({}, defaultAssignment, updates);
        });
        const unreviewed = this.props.vehicleRequest.status === 'pending';
        this.setState(() => {
          return { isEditing: unreviewed, assignments, ready: true };
        });
      });
  }

  toggleProfile = () => {
    this.setState((prevState) => {
      return { showProfile: !prevState.showProfile };
    });
  }

  copyEmail = (event) => {
    this.emailRef.current.select();
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Email copied to clipboard!');
    this.setState({ showModal: false });
  }

  checkForAssignmentConflicts = (proposedAssignment) => {
    return new Promise((resolve, reject) => {
      axios.post(`${constants.BACKEND_URL}/vehicle-requests/check-conflict`, proposedAssignment, { headers: { authorization: localStorage.getItem('token') } })
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  onVehicleTypeChange = (eventkey, index) => {
    const proposedAssignment = this.state.assignments[index];
    proposedAssignment.assignedVehicle = eventkey;
    this.checkForAssignmentConflicts(proposedAssignment).then((conflicts) => {
      this.setState((prevState) => {
        const updates = prevState.assignments[index];
        updates.assignedVehicle = eventkey;
        updates.conflicts = conflicts;
        if (eventkey === 'Enterprise') {
          updates.assignedKey = 'Enterprise';
        }
        const updatedVehicle = Object.assign({}, prevState.assignments[index], updates);
        const updatedVehicles = Object.assign([], prevState.assignments, { [index]: updatedVehicle });
        return { assignments: updatedVehicles };
      });
    });
  }

  onAssignmentDetailChange = (event, index) => {
    event.persist();
    this.setState((prevState) => {
      const oldVehicles = prevState.assignments;
      const oldVehicle = oldVehicles[index];
      const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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
    // adapted from https://stackoverflow.com/questions/2488313/javascripts-getdate-returns-wrong-date
    const parts = date.match(/(\d+)/g);
    const splitTime = time.split(':');
    return new Date(parts[0], parts[1] - 1, parts[2], splitTime[0], splitTime[1]);
  }

  isStringEmpty = (string) => {
    return string.length === 0 || !string.toString().trim();
  }

  isValid = () => {
    const { assignments } = this.state;

    let hasIncompleteAssignment = false;
    const hasFilledOutField = {}; // keep track of which assignments have a filled out field
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
      if (!this.isStringEmpty(assignment.pickupDate)
        && !this.isStringEmpty(assignment.pickupTime)
        && !this.isStringEmpty(assignment.returnDate)
        && !this.isStringEmpty(assignment.returnTime)
        && assignment.assignedVehicle !== 'Enterprise') {
        const updatedErrorFields = { ...this.errorFields };
        const pickupDate = this.createDateObject(assignment.pickupDate, assignment.pickupTime);
        const returnDate = this.createDateObject(assignment.returnDate, assignment.returnTime);
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
    return true;
  }

  activateModal = (modalInfo) => {
    this.setState({ showModal: true, modalInfo });
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
        delete assignment.conflicts;
        return assignment;
      });

      const response = {
        reqId: this.props.vehicleRequest._id,
        assignments: deletedErrorFields,
      };
      this.props.assignVehicles(response, () => {
        this.setState((prevState) => {
          return { isEditing: false };
        });
        window.scrollTo(0, 0);
      });
    }
  }

  startEditing = () => {
    this.props.getVehicles()
      .then(() => {
        this.vehicleForm = this.props.vehicles.map((vehicle) => {
          return (
            <Dropdown.Item className="ovr-vehicle-option" key={vehicle._id} eventKey={vehicle.name}>
              <span>{vehicle.name}</span>
              <span className="ovr-vehicle-option-type">{vehicle.type}</span>
            </Dropdown.Item>
          );
        });
        const assignments = this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
          const assignment = this.props.vehicleRequest.assignments.find((element) => {
            return element.responseIndex === index;
          });
          const { defaultAssignment } = this;
          if (assignment) {
            const updates = {};
            updates.existingAssignment = true;
            updates.id = assignment._id;
            updates.responseIndex = index;
            updates.assignedVehicle = assignment.assigned_vehicle.name;
            if (assignment.assigned_vehicle.name !== 'Enterprise') {
              updates.pickupDate = assignment.assigned_pickupDate.substring(0, 10);
              updates.pickupTime = assignment.assigned_pickupTime;
              updates.returnDate = assignment.assigned_returnDate.substring(0, 10);
              updates.returnTime = assignment.assigned_returnTime;
              updates.pickedUp = assignment.pickedUp;
              updates.returned = assignment.returned;
              updates.assignedKey = assignment.assigned_key;
            } else if (assignment.assigned_vehicle.name === 'Enterprise') {
              updates.pickupDate = 'Enterprise';
              updates.pickupTime = 'Enterprise';
              updates.returnDate = 'Enterprise';
              updates.returnTime = 'Enterprise';
              updates.assignedKey = 'Enterprise';
            }
            return Object.assign({}, defaultAssignment, updates);
          } else {
            const updates = {};
            updates.responseIndex = index;
            return Object.assign({}, defaultAssignment, updates);
          }
        });
        this.setState((prevState) => {
          return { isEditing: true, assignments };
        });
      });
  }

  cancelUpdate = () => {
    this.setState({ isEditing: false });
  }

  cancelAssignments = () => {
    const deleteInfo = {
      reqId: this.props.vehicleRequest._id,
      toBeDeleted: this.state.modalInfo.ids,
    };
    this.props.cancelAssignments(deleteInfo)
      .then(() => {
        this.setState({ showModal: false });
        window.scrollTo(0, 0);
      });
  }

  denyVehicleRequest = () => {
    this.props.denyVehicleRequest(this.props.vehicleRequest._id)
      .then(() => {
        this.setState({ isEditing: false });
      });
  }

  getSideLinks = () => {
    return this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
      const assignment = this.props.vehicleRequest.assignments.find((element) => {
        return element.responseIndex === index;
      });
      return (
        <div key={vehicle._id} className="ovr-sidebar-req-section">
          <a href={`#vehicle_req_${index}`} className="ovr-req-section-link">Vehicle #{index + 1}</a>
          {assignment ? <img className="assigned-badge" src={this.badges.approved} alt="approved_badge" /> : null}
        </div>
      );
    });
  }

  openConflictsModal = (vehicleName, conflicts) => {
    this.setState({
      conflictWith: vehicleName,
      conflicts,
      showConflictsModal: true,
    });
    console.log(conflicts);
  }

  renderPotentialConflicts = (conflicts) => {
    return (
      <div className="ovr-req-assignment-conflicts">
        {conflicts.map((conflict) => {
          console.log(conflict);
          return (
            <div className="ovr-req-assignment-conflict" key={conflict.objectID}>
              {conflict.message}
            </div>
          );
        })}
      </div>
    );
  }

  /**
   * Editing form component to assign a vehicle.
   */
  renderAssignmentForm = (index) => {
    const assignment = this.state.assignments[index];
    return (
      <div className="ovr-req-assignment">
        <span className="vrf-label ovr-column-header">Assign</span>
        <div className="table">
          <div className="ovr-req-row">
            <Dropdown onSelect={eventKey => this.onVehicleTypeChange(eventKey, index)}>
              <Dropdown.Toggle id="ovr-vehicle-dropdown-button" className={assignment.errorFields.assignedVehicle ? 'vrf-error' : ''}>
                <div className={`ovr-current-vehicle ${assignment.assignedVehicle === '' ? 'inactive' : ''}`}>{assignment.assignedVehicle === '' ? 'Assign a vehicle' : assignment.assignedVehicle}</div>
                <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="ovr-vehicle-options">
                {this.vehicleForm}
              </Dropdown.Menu>
            </Dropdown>
            {assignment.conflicts.length > 0 ? <img id="ovr-vehicle-conflict-marker" src={conflictMarker} alt="conflict" onClick={() => this.openConflictsModal(assignment.assignedVehicle, assignment.conflicts)} /> : null}
          </div>
          <hr className="detail-line" />
          <div className="ovr-req-row"> - </div>
          <hr className="detail-line" />
          <div className="ovr-req-row"> - </div>
          <hr className="detail-line" />
          <div className="ovr-req-row">
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type="date"
                  id={`pickup_date_${index}`}
                  className={`ovr-date-input ${assignment.pickupDate.length === 0 ? 'no-date' : ''} ${assignment.errorFields.pickupDate ? 'vrf-error' : ''}`}
                  name="pickupDate"
                  value={assignment.pickupDate}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </div>
          <hr className="detail-line" />
          <div className="ovr-req-row">
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type="time"
                  id={`pickup_time_${index}`}
                  className={`ovr-date-input ${assignment.pickupTime.length === 0 ? 'no-date' : ''} ${assignment.errorFields.pickupTime ? 'vrf-error' : ''}`}
                  name="pickupTime"
                  value={assignment.pickupTime}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </div>
          <hr className="detail-line" />
          <div className="ovr-req-row">
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type="date"
                  id={`return_date_${index}`}
                  className={`ovr-date-input ${assignment.returnDate.length === 0 ? 'no-date' : ''} ${assignment.errorFields.returnDate ? 'vrf-error' : ''}`}
                  name="returnDate"
                  value={assignment.returnDate}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </div>
          <hr className="detail-line" />
          <div className="ovr-req-row">
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type="time"
                  id={`return_time_${index}`}
                  className={`ovr-date-input ${assignment.returnTime.length === 0 ? 'no-date' : ''} ${assignment.errorFields.returnTime ? 'vrf-error' : ''}`}
                  name="returnTime"
                  value={assignment.returnTime}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </div>
          <hr className="detail-line" />
          <div className="ovr-req-row">
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
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
              )}
          </div>
          <hr className="detail-line" />
          {assignment.existingAssignment
            ? (
              <div>
                <div className="ovr-req-row">
                  {assignment.assignedVehicle === 'Enterprise'
                    ? '-'
                    : (
                      <label className="checkbox-container club-checkbox" htmlFor={`pickedUp_${index}`}>
                        <input
                          type="checkbox"
                          name="pickedUp"
                          id={`pickedUp_${index}`}
                          checked={assignment.pickedUp}
                          onChange={event => this.onAssignmentDetailChange(event, index)}
                        />
                        <span className="checkmark" />
                      </label>
                    )}
                </div>
                <hr className="detail-line" />
                <div className="ovr-req-row">
                  {assignment.assignedVehicle === 'Enterprise'
                    ? '-'
                    : (
                      <label className="checkbox-container club-checkbox" htmlFor={`returned_${index}`}>
                        <input
                          type="checkbox"
                          name="returned"
                          id={`returned_${index}`}
                          checked={assignment.returned}
                          onChange={event => this.onAssignmentDetailChange(event, index)}
                        />
                        <span className="checkmark" />
                      </label>
                    )}
                </div>
              </div>
            )
            : null
          }
        </div>
        {assignment.existingAssignment
          ? null
          : <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={() => this.skipAssignment(index)} role="button" tabIndex={0}>Skip assignment</span>}
      </div>
    );
  }

  /**
   * Viewing details about a vehicle assigned.
   */
  assignmentDisplay = (index) => {
    const assignment = this.props.vehicleRequest.assignments.find((element) => {
      return element.responseIndex === index;
    });
    if (assignment) {
      return (
        <div className="ovr-req-assignment">
          <span className="vrf-label ovr-column-header">Assigned</span>
          <div className="table">
            <div className="ovr-req-row">{assignment.assigned_vehicle.name}</div>
            <hr className="detail-line" />
            <div className="ovr-req-row"> - </div>
            <hr className="detail-line" />
            <div className="ovr-req-row"> - </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : constants.formatDate(assignment.assigned_pickupDate.substring(0, 10))}
            </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : constants.formatTime(assignment.assigned_pickupTime)}
            </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : constants.formatDate(assignment.assigned_returnDate.substring(0, 10))}
            </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : constants.formatTime(assignment.assigned_returnTime)}
            </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : assignment.assigned_key}
            </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : assignment.pickedUp ? 'Yes' : 'No' }
            </div>
            <hr className="detail-line" />
            <div className="ovr-req-row">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : assignment.returned ? 'Yes' : 'No'}
            </div>
          </div>
          <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={() => this.activateModal({ trigger: 'CANCEL', ids: [assignment._id] })} role="button" tabIndex={0}>
            Cancel assignment
          </span>
        </div>
      );
    } else {
      return (
        <div className="ovr-req-assignment">
          <span className="vrf-label ovr-column-header">Skipped Assignment</span>
          <div className="table">
            <span className="ovr-req-row ovr-skipped-detail">skipped</span>
            <hr className="detail-line" />
            <div className="ovr-req-row"> - </div>
            <hr className="detail-line" />
            <div className="ovr-req-row"> - </div>
            <hr className="detail-line" />
            <span className="ovr-req-row ovr-skipped-detail">skipped</span>
            <hr className="detail-line" />
            <span className="ovr-req-row ovr-skipped-detail">skipped</span>
            <hr className="detail-line" />
            <span className="ovr-req-row ovr-skipped-detail">skipped</span>
            <hr className="detail-line" />
            <span className="ovr-req-row ovr-skipped-detail">skipped</span>
            <hr className="detail-line" />
            <span className="ovr-req-row ovr-skipped-detail">skipped</span>
          </div>
        </div>
      );
    }
  }

  getVehicles = () => {
    return this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
      const assignment = this.props.vehicleRequest.assignments.find((element) => {
        return element.responseIndex === index;
      });
      return (
        <div key={vehicle._id} id={`vehicle_req_${index}`} className="vrf-req-group">
          <div className="vrf-req-header">
            <h3 className="vrf-label vrf-req-no">Vehicle #{index + 1}</h3>
          </div>
          <div className="trip-detail pending-table white-background">
            <div className="vrf-label leader-detail-row">
              Vehicle Details
            </div>
            <hr className="detail-line" />
            <div className={`leader-detail-row ovr-req-detail ${this.isStringEmpty(vehicle.vehicleDetails) ? 'ovr-skipped-detail' : ''}`}>
              {this.isStringEmpty(vehicle.vehicleDetails) ? 'skipped' : vehicle.vehicleDetails}
            </div>
          </div>
          <div className="ovr-request-and-assignment">
            <div id="ovr-req-assignment-label" className="ovr-req-assignment">
              <span className="ovr-req-row ovr-header-filler">#TheLodgeInfiltrated</span>
              <span className="ovr-req-row">Vehicle</span>
              <span className="ovr-req-row">Trailer Hitch Required?</span>
              <span className="ovr-req-row">WMNF Pass Needed?</span>
              <span className="ovr-req-row">Pickup Date</span>
              <span className="ovr-req-row">Pickup Time</span>
              <span className="ovr-req-row">Return Date</span>
              <span className="ovr-req-row">Return Time</span>
              <span className="ovr-req-row">Key Assignment</span>
              {assignment
                ? (
                  <div>
                    <span className="ovr-req-row">Picked up?</span>
                    <span className="ovr-req-row">Returned?</span>
                  </div>
                )
                : null
              }
            </div>

            <div className="ovr-req-vehicle-details">
              <span className="vrf-label ovr-column-header">Requested</span>
              <div className="table">
                <div className="ovr-req-row">{vehicle.vehicleType}</div>
                <hr className="detail-line" />
                <div className="ovr-req-row">{vehicle.trailerNeeded ? 'Yes' : 'No'}</div>
                <hr className="detail-line" />
                <div className="ovr-req-row">{vehicle.passNeeded ? 'Yes' : 'No'} </div>
                <hr className="detail-line" />
                <div className="ovr-req-row">{constants.formatDate(vehicle.pickupDate.substring(0, 10))}</div>
                <hr className="detail-line" />
                <div className="ovr-req-row">{constants.formatTime(vehicle.pickupTime)}</div>
                <hr className="detail-line" />
                <div className="ovr-req-row">{constants.formatDate(vehicle.returnDate.substring(0, 10))}</div>
                <hr className="detail-line" />
                <div className="ovr-req-row">{constants.formatTime(vehicle.returnTime)}</div>
                <hr className="detail-line" />
                <div className="ovr-req-row"> - </div>
                {assignment
                  ? (
                    <div>
                      <hr className="detail-line" />
                      <div className="ovr-req-row"> - </div>
                      <hr className="detail-line" />
                      <div className="ovr-req-row"> - </div>
                    </div>
                  )
                  : null
                }
              </div>
            </div>

            {this.state.isEditing ? this.renderAssignmentForm(index) : this.assignmentDisplay(index)}

          </div>
        </div>
      );
    });
  }

  getAppropriateLink = () => {
    const allAssignmentIds = this.props.vehicleRequest.assignments.map((assignment) => {
      return assignment._id;
    });
    if (this.state.isEditing) {
      return this.props.partOfTrip ? null
        : (
          <span
            className="cancel-link ovr-bottom-link ovr-contact-link"
            onClick={() => this.activateModal({ trigger: 'CONTACT' })}
            role="button"
            tabIndex={0}
          >
            Contact requester
          </span>
        );
    } else if (!this.state.isEditing && this.props.vehicleRequest.status === 'approved') {
      return (
        <span className="cancel-link ovr-bottom-link" onClick={() => this.activateModal({ trigger: 'CANCEL ALL', ids: allAssignmentIds })} role="button" tabIndex={0}>
          Cancel all assignments
        </span>
      );
    } else {
      return null;
    }
  }

  getAppropriateButton = () => {
    if (this.state.isEditing) {
      if (this.props.vehicleRequest.status === 'pending') {
        return (
          <span className="ovr-display-flex">
            <button type="button" className="vrf-add-button vrf-cancel-button vrf-cancel-update-button" onClick={this.denyVehicleRequest}>Deny request</button>
            <button type="submit" className="vrf-submit-button signup-button" onClick={this.approve}>Assign vehicles</button>
          </span>
        );
      } else {
        return (
          <span className="ovr-display-flex">
            <button type="button" className="vrf-add-button vrf-cancel-button vrf-cancel-update-button" onClick={this.cancelUpdate}>Cancel update</button>
            <button type="submit" className="vrf-submit-button signup-button" onClick={this.approve}>Save</button>
          </span>
        );
      }
    } else {
      return <button type="submit" className="vrf-submit-button signup-button" onClick={this.startEditing}>Update assignments</button>;
    }
  }


  getModalContent = () => {
    if (this.state.modalInfo.trigger === 'CONTACT') {
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
    } else if (this.state.modalInfo.trigger === 'CANCEL ALL') {
      return (
        <div className="cancel-content">
          <p className="cancel-question">Cancel all assignments for this request?</p>
          <p className="cancel-message">The assigned vehicles will become available for other requests</p>
          <div className="ovr-modal-button-container">
            <button type="submit" className="leader-cancel-button confirm-cancel" onClick={() => this.cancelAssignments(this.state.modalInfo.ids)}>Cancel All</button>
          </div>
        </div>
      );
    } else if (this.state.modalInfo.trigger === 'CANCEL') {
      return (
        <div className="cancel-content">
          <p className="cancel-question">Cancel assignment?</p>
          <p className="cancel-message">The assigned vehicle will become available for other requests</p>
          <div className="ovr-modal-button-container">
            <button type="submit" className="leader-cancel-button confirm-cancel" onClick={() => this.cancelAssignments(this.state.modalInfo.ids)}>Cancel</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (!this.state.ready) {
      return (<Loading type="doc" height="150" width="150" measure="px" />);
    } else {
      return (
        <div className="ovr-container">
          {this.props.partOfTrip
            ? null
            : (
              <div className="ovr-sidebar">
                <span className="ovr-sidebar-header">External Vehicle Request</span>
                <span className="vrf-label ovr-sidebar-subheader">Vehicle Request</span>
                <div className="ovr-sidebar-req-sections">
                  <div className="ovr-sidebar-req-section">
                    <a href="#req_details" className="ovr-req-section-link">Request Details</a>
                  </div>

                  {this.getSideLinks()}
                </div>
              </div>
            )
          }
          <div className={`ovr-req-content ${this.props.partOfTrip ? 'otd-ovr-margin' : ''}`}>
            <div className="vrf-title-container">
              <h2 className="p-trip-title vrf-title-size">Vehicle Request</h2>
              <span className="vrf-status-display">
                <span className="vrf-label">
                  Status:
                </span>
                <span className="vrf-req-status-display">
                  {this.props.vehicleRequest.status}
                </span>
                <span className="vrf-req-status-badge">
                  <img className="status-badge" src={this.badges[this.props.vehicleRequest.status]} alt={`${this.props.vehicleRequest.status}_badge`} />
                </span>
              </span>
            </div>
            <div id="req_details" className="trip-detail pending-table white-background">
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
                <div className="trip-detail pending-table white-background">
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
              <Link to="/vehicle-calendar" className="calendar-link" target="_blank">View Vehicle Calendar</Link>

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
            <img className="status-badge ovr-status-badge" src={this.badges.denied} alt="denied_badge" />
            {this.getModalContent()}
          </Modal>
          <Modal centered show={this.state.showConflictsModal} onHide={() => this.setState({ showConflictsModal: false })}>
            <ConflictModal closeModal={() => this.setState({ showConflictsModal: false })} vehicleName={this.state.conflictWith} conflicts={this.state.conflicts} />
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

export default withRouter(connect(mapStateToProps, { appError, fetchVehicleRequest, getVehicles, assignVehicles, cancelAssignments, denyVehicleRequest })(OPOVehicleRequest));
