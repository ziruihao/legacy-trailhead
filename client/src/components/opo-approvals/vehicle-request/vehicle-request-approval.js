/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Collapse from 'react-bootstrap/Collapse';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Icon from '../../icon';
import Field from '../../field';
import Text from '../../text';
import { Stack, Queue, Divider, Box } from '../../layout';
import { ProfileCard } from '../../profile-card';
import ConflictModal from './conflict-modal';
import DOCLoading from '../../doc-loading';
import Badge from '../../badge';
import Sidebar from '../../sidebar';
import VehicleCalendar from '../../calendar/vehicleCalendar';
import * as constants from '../../../constants';
import utils from '../../../utils';
import { appError, fetchVehicleRequest, getVehicles, assignVehicles, cancelAssignments, denyVehicleRequest } from '../../../actions';
import './vehicle-request-approval.scss';

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
      showCalendarModal: false,
    };
  }

  componentDidMount() {
    const vehicleReqId = this.props.partOfTrip ? this.props.vehicleReqId : this.props.match.params.vehicleReqId;
    Promise.all([this.props.fetchVehicleRequest(vehicleReqId), this.props.getVehicles()])
      .then(() => {
        this.vehicleForm = this.props.vehicles.map((vehicle) => {
          return (
            <Dropdown.Item key={vehicle._id} className='ovr-vehicle-option' eventKey={vehicle.name}>
              <span>{vehicle.name}</span>
              <span className='ovr-vehicle-option-type'>{vehicle.type}</span>
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
      axios.post(`${constants.BACKEND_URL}/vehicle-requests/check-conflict`, proposedAssignment)
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
    proposedAssignment.timezone = utils.dates.timezone();
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
        assignment.timezone = utils.dates.timezone();
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
            <Dropdown.Item className='ovr-vehicle-option' key={vehicle._id} eventKey={vehicle.name}>
              <span>{vehicle.name}</span>
              <span className='ovr-vehicle-option-type'>{vehicle.type}</span>
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

  // getSideLinks = () => {
  //   return this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
  //     const assignment = this.props.vehicleRequest.assignments.find((element) => {
  //       return element.responseIndex === index;
  //     });
  //     return (
  //       <div key={vehicle._id} className="ovr-sidebar-req-section">
  //         <NavLink to={`#vehicle_req_${index}`} className="ovr-req-section-link">Vehicle #{index + 1}</NavLink>
  //         {assignment ? <Badge type="approved" /> : null}
  //       </div>
  //     );
  //   });
  // }

  openConflictsModal = (vehicleName, conflicts) => {
    this.setState({
      conflictWith: vehicleName,
      conflicts,
      showConflictsModal: true,
    });
  }

  findMatchingAssignment = (index) => {
    return this.props.vehicleRequest.assignments.find((element) => {
      return element.responseIndex === index;
    });
  }

  /**
   * Editing form component to assign a vehicle.
   */
  renderAssignmentForm = (index, vehicle) => {
    const assignment = this.state.assignments[index];
    return (
      <Box dir='col' align='center'>
        <Box dir='row' align='center' height={60}>
          <Text type='h2'>Assign</Text>
        </Box>
        <Box dir='col' pad={[0, 30]} className='doc-bordered doc-white'>
          <Box dir='row' align='center' height={60} className='p1'>
            <Dropdown id='assign-vehicle-dropdown' onSelect={eventKey => this.onVehicleTypeChange(eventKey, index)} style={{ flex: 1 }}>
              <Dropdown.Toggle className={`ovr-vehicle-dropdown-button ${assignment.errorFields.assignedVehicle ? 'field-error' : ''}`}>
                <div className={`ovr-current-vehicle ${assignment.assignedVehicle === '' ? 'inactive' : ''}`}>{assignment.assignedVehicle === '' ? 'Assign a vehicle' : assignment.assignedVehicle}</div>
                {assignment.conflicts.length > 0 ? <Icon id='ovr-vehicle-conflict-marker' type='warning' size={18} onClick={() => this.openConflictsModal(assignment.assignedVehicle, assignment.conflicts)} /> : null}
                <Queue size={5} />
                <Icon type='dropdown' size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu className='ovr-vehicle-options'>
                {this.vehicleForm}
              </Dropdown.Menu>
            </Dropdown>
          </Box>
          <Box dir='row' align='center' height={60} className='p1'>{vehicle.trailerNeeded ? 'Yes' : 'No'}</Box>
          <Box dir='row' align='center' height={60} className='p1'>{vehicle.passNeeded ? 'Yes' : 'No'} </Box>
          <Box dir='row' align='center' height={60} className='p1'>
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type='date'
                  id={`pickup_date_${index}`}
                  className={`ovr-date-input ${assignment.pickupDate.length === 0 ? 'no-date' : ''} ${assignment.errorFields.pickupDate ? 'field-error' : ''}`}
                  name='pickupDate'
                  value={assignment.pickupDate}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </Box>
          <Box dir='row' align='center' height={60} className='p1'>
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type='time'
                  id={`pickup_time_${index}`}
                  className={`ovr-date-input ${assignment.pickupTime.length === 0 ? 'no-date' : ''} ${assignment.errorFields.pickupTime ? 'field-error' : ''}`}
                  name='pickupTime'
                  value={assignment.pickupTime}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </Box>
          <Box dir='row' align='center' height={60} className='p1'>
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type='date'
                  id={`return_date_${index}`}
                  className={`ovr-date-input ${assignment.returnDate.length === 0 ? 'no-date' : ''} ${assignment.errorFields.returnDate ? 'field-error' : ''}`}
                  name='returnDate'
                  value={assignment.returnDate}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </Box>
          <Box dir='row' align='center' height={60} className='p1'>
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type='time'
                  id={`return_time_${index}`}
                  className={`ovr-date-input ${assignment.returnTime.length === 0 ? 'no-date' : ''} ${assignment.errorFields.returnTime ? 'field-error' : ''}`}
                  name='returnTime'
                  value={assignment.returnTime}
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </Box>
          <Box dir='row' align='center' height={60} className='p1'>
            {assignment.assignedVehicle === 'Enterprise'
              ? '-'
              : (
                <input
                  type='text'
                  id={`assigned_key_${index}`}
                  className={`ovr-date-input ${assignment.errorFields.assignedKey ? 'field-error' : ''}`}
                  maxLength='50'
                  name='assignedKey'
                  value={assignment.assignedKey}
                  placeholder='e.g. 33A'
                  onChange={event => this.onAssignmentDetailChange(event, index)}
                />
              )}
          </Box>
          {/* {assignment
            ? (
              <>
                <Box dir="row" align="center" height={60} className="p1">
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
                </Box>

                <Box dir="row" align="center" height={60} className="p1">
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
                </Box>
              </>
            )
            : null
          } */}
        </Box>
      </Box>
    );
  }

  /**
   * Viewing details about a vehicle assigned.
   */
  assignmentDisplay = (index, vehicle) => {
    const assignment = this.findMatchingAssignment(index);
    if (assignment) {
      return (
        <Box dir='col' align='center'>
          <Box dir='row' align='center' height={60}>
            <Text type='h2'>Assigned</Text>
          </Box>
          <Box dir='col' pad={[0, 30]} className='doc-bordered'>
            <Box dir='row' align='center' height={60} className='p1'>{assignment.assigned_vehicle.name}</Box>

            <Box dir='row' align='center' height={60} className='p1'>{vehicle.trailerNeeded ? 'Yes' : 'No'}</Box>

            <Box dir='row' align='center' height={60} className='p1'>{vehicle.passNeeded ? 'Yes' : 'No'} </Box>

            <Box dir='row' align='center' height={60} className='p1'>
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : utils.dates.formatDate(new Date(assignment.assigned_pickupDateAndTime), 'LONG')}
            </Box>

            <Box dir='row' align='center' height={60} className='p1'>
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : utils.dates.formatTime(new Date(assignment.assigned_pickupDateAndTime))}
            </Box>

            <Box dir='row' align='center' height={60} className='p1'>
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : utils.dates.formatDate(new Date(assignment.assigned_returnDateAndTime), 'LONG')}
            </Box>

            <Box dir='row' align='center' height={60} className='p1'>
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : utils.dates.formatTime(new Date(assignment.assigned_returnDateAndTime))}
            </Box>

            <Box dir='row' align='center' height={60} className='p1'>
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : assignment.assigned_key}
            </Box>
            {assignment
              ? (
                <div>

                  <Box dir='row' align='center' height={60} className='p1'>
                    {assignment.assigned_vehicle.name === 'Enterprise'
                      ? '-'
                      : assignment.pickedUp ? 'Yes' : 'No' }
                  </Box>

                  <Box dir='row' align='center' height={60} className='p1'>
                    {assignment.assigned_vehicle.name === 'Enterprise'
                      ? '-'
                      : assignment.returned ? 'Yes' : 'No'}
                  </Box>
                </div>
              )
              : null
            }
          </Box>
        </Box>
      );
    } else {
      return (
        <Box dir='col' style={{ textAlign: 'right' }}>
          <Box dir='row' align='center' height={60}>
            <Text type='h2'>Assigned</Text>
          </Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>Skipped</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>-</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>-</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>Skipped</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>Skipped</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>Skipped</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>Skipped</Box>
          <Box dir='row' align='center' height={60} className='p1 thin italic gray'>Skipped</Box>
        </Box>
      );
    }
  }

  getVehicles = () => {
    return this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
      const assignment = this.findMatchingAssignment(index);
      return (
        <Box dir='col' key={vehicle._id} id={`vehicle_req_${index}`}>
          <Divider size={1} />
          <Stack size={50} />
          <Box dir='row' justify='between' align='center'>
            <Text type='h2'>Vehicle {index + 1}</Text>
            {this.state.isEditing || typeof assignment === 'undefined'
              ? null
              : (
                <div className='doc-button alarm hollow' onClick={() => this.activateModal({ trigger: 'CANCEL', ids: [assignment._id] })} role='button' tabIndex={0}>
                  Cancel assignment
                </div>
              )
          }
          </Box>
          <Stack size={25} />
          <Text type='h3'>Vehicle notes</Text>
          <Stack size={25} />
          <div className='p1'>{this.isStringEmpty(vehicle.vehicleDetails) ? 'skipped' : vehicle.vehicleDetails}</div>
          <Stack size={25} />
          <Box dir='row' justify='between'>
            <Box dir='col' style={{ textAlign: 'right' }}>
              <Stack size={60} />
              <Box dir='row' align='center' height={60} className='p1 thick'>Vehicle</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>Trailer Hitch Required?</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>WMNF Pass Needed?</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>Pickup Date</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>Pickup Time</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>Return Date</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>Return Time</Box>
              <Box dir='row' align='center' height={60} className='p1 thick'>Key Assignment</Box>
              {assignment
                ? (
                  <div>
                    <Box dir='row' align='center' height={60} className='p1 thick'>Picked up?</Box>
                    <Box dir='row' align='center' height={60} className='p1 thick'>Returned?</Box>
                  </div>
                )
                : null
              }
            </Box>

            <Box dir='col' align='center'>
              <Box dir='row' align='center' height={60}>
                <Text type='h2'>Requested</Text>
              </Box>
              <Box dir='col' pad={[0, 30]} className='doc-bordered'>
                <Box dir='row' align='center' height={60} className='p1'>{vehicle.vehicleType}</Box>

                <Box dir='row' align='center' height={60} className='p1'>{vehicle.trailerNeeded ? 'Yes' : 'No'}</Box>

                <Box dir='row' align='center' height={60} className='p1'>{vehicle.passNeeded ? 'Yes' : 'No'} </Box>

                <Box dir='row' align='center' height={60} className='p1'>{utils.dates.formatDate(new Date(vehicle.pickupDateAndTime), 'LONG')}</Box>

                <Box dir='row' align='center' height={60} className='p1'>{utils.dates.formatTime(new Date(vehicle.pickupDateAndTime))}</Box>

                <Box dir='row' align='center' height={60} className='p1'>{utils.dates.formatDate(new Date(vehicle.returnDateAndTime), 'LONG')}</Box>

                <Box dir='row' align='center' height={60} className='p1'>{utils.dates.formatTime(new Date(vehicle.returnDateAndTime))}</Box>

                <Box dir='row' align='center' height={60} className='p1'> - </Box>
                {assignment
                  ? (
                    <div>

                      <Box dir='row' align='center' height={60} className='p1'> - </Box>

                      <Box dir='row' align='center' height={60} className='p1'> - </Box>
                    </div>
                  )
                  : null
                  }
              </Box>
            </Box>
            {this.state.isEditing ? this.renderAssignmentForm(index, vehicle) : this.assignmentDisplay(index, vehicle)}
          </Box>
          <Stack size={50} />
        </Box>
      );
    });
  }

  getAppropriateLink = () => {
    const allAssignmentIds = this.props.vehicleRequest.assignments.map((assignment) => {
      return assignment._id;
    });
    if (this.state.isEditing) {
      return null;
    } else if (!this.state.isEditing && this.props.vehicleRequest.status === 'approved') {
      return (
        <div className='doc-button alarm' onClick={() => this.activateModal({ trigger: 'CANCEL ALL', ids: allAssignmentIds })} role='button' tabIndex={0}>
          Cancel all assignments
        </div>
      );
    } else {
      return null;
    }
  }

  getAppropriateButton = () => {
    if (this.state.isEditing) {
      if (this.props.vehicleRequest.status === 'pending') {
        return (
          <>
            <div className='doc-button alarm' onClick={this.denyVehicleRequest} role='button' tabIndex={0}>Deny request</div>
            <Queue size={50} />
            <div className='doc-button' onClick={this.approve} role='button' tabIndex={0}>Assign vehicles</div>
          </>
        );
      } else {
        return (
          <>
            {/* <div className="doc-button alarm" onClick={this.denyVehicleRequest} role="button" tabIndex={0}>Deny request</div>
            <Queue size={50} /> */}
            <div className='doc-button alarm hollow' onClick={this.cancelUpdate} role='button' tabIndex={0}>Cancel changes</div>
            <Queue size={25} />
            <div className='doc-button' onClick={this.approve} role='button' tabIndex={0}>Save changes</div>
          </>
        );
      }
    } else {
      return (
        <>
          {/* <div className="doc-button alarm" onClick={this.denyVehicleRequest} role="button" tabIndex={0}>Deny request</div>
          <Queue size={50} /> */}
          <div className='doc-button hollow' onClick={this.startEditing} role='button' tabIndex={0}>Change assignments</div>
        </>
      );
    }
  }


  getModalContent = () => {
    if (this.state.modalInfo.trigger === 'CONTACT') {
      return (
        <div className='cancel-content'>
          <p className='cancel-question'>{`Contact ${this.props.vehicleRequest.requester.name}`}</p>
          <p className='cancel-message'>Please email the requester if you need them to update the request. They cannot update a request after it has been approved.</p>
          <div className='ovr-modal-button-container'>
            <input
              ref={this.emailRef}
              type='text'
              className='ovr-requester-email'
              defaultValue={this.props.vehicleRequest.requester.email}
            />
          </div>
          <div className='ovr-modal-button-container'>
            <button type='button' className='vrf-submit-button signup-button' onClick={this.copyEmail}>Copy email address</button>
          </div>
        </div>
      );
    } else if (this.state.modalInfo.trigger === 'CANCEL ALL') {
      return (
        <Box dir='col' align='center' pad={25}>
          <Icon type='warning' size={50} />
          <Stack size={24} />
          <Text type='h2'>Cancel all assignments for this request?</Text>
          <Stack size={24} />
          <div className='p1 center-text'>The assigned vehicles will become available for other requests. We will notify the requester that their assignments have been cancelled.</div>
          <Stack size={24} />
          <Box dir='row' justify='center' align='center'>
            <div className='doc-button' onClick={this.closeModal} role='button' tabIndex={0}>Nevermind</div>
            <Queue size={25} />
            <div className='doc-button alarm' onClick={() => this.cancelAssignments(this.state.modalInfo.ids)} role='button' tabIndex={0}>Cancel all</div>
          </Box>
        </Box>
      );
    } else if (this.state.modalInfo.trigger === 'CANCEL') {
      return (
        <Box dir='col' align='center' pad={25}>
          <Icon type='warning' size={50} />
          <Stack size={24} />
          <Text type='h2'>Cancel this assignment?</Text>
          <Stack size={24} />
          <div className='p1 center-text'>The assigned vehicle will become available for other requests. We will notify the requester that their assignments have been cancelled.</div>
          <Stack size={24} />
          <Box dir='row' justify='center' align='center'>
            <div className='doc-button' onClick={this.closeModal} role='button' tabIndex={0}>Nevermind</div>
            <Queue size={25} />
            <div className='doc-button alarm' onClick={() => this.cancelAssignments(this.state.modalInfo.ids)} role='button' tabIndex={0}>Cancel</div>
          </Box>
        </Box>
      );
    } else {
      return null;
    }
  }

  render() {
    if (!this.state.ready) {
      return (<DOCLoading type='doc' height='150' width='150' measure='px' />);
    } else {
      return (
        <Box dir='row' style={{ position: 'relative' }}>
          <div style={{ zIndex: 10, position: 'fixed', bottom: '50px', left: '50px' }} className='doc-button' onClick={() => this.setState({ showCalendarModal: true })} role='button' tabIndex={0}>See vehicle calendar</div>
          {this.props.partOfTrip
            ? null
            : (
              <Sidebar
                sections={
                [
                  { title: `V-Req #${this.props.vehicleRequest.number}`, steps: [{ number: 1, text: 'Request details' }].concat(this.props.vehicleRequest.requestedVehicles.map((vehicle, idx) => { return { number: idx + 2, text: `Vehicle ${idx + 1}` }; })) },
                ]
              }
                currentStep={1}
              />
            )
          }
          <Box dir='col' pad={this.props.partOfTrip ? 0 : 100} expand>
            <Box dir='row' justify='between' align='center'>
              <Text type='h1'>Vehicle request</Text>
              <Badge type={this.props.vehicleRequest.status} size={36} />
            </Box>
            <Stack size={50} />
            <Text type='h2'>Requester</Text>
            <Stack size={25} />
            <Box dir='row' align='center'>
              <div className='p1'>{this.props.vehicleRequest.requester.name}</div>
              <Queue expand />
              <div className='doc-button hollow' onClick={this.toggleProfile} role='button' tabIndex={0}>View profile</div>
              <Queue size={25} />
              <div className='doc-button' onClick={() => window.open(`mailto:${this.props.vehicleRequest.requester.email}`, '_blank')} role='button' tabIndex={0}>Email requester</div>
            </Box>
            <Stack size={25} />
            {this.props.vehicleRequest.requestType === 'SOLO'
              ? (
                <>
                  <Text type='h2'>Request Details</Text>
                  <Stack size={25} />
                  <div className='p1'>
                    {this.props.vehicleRequest.requestDetails}
                  </div>
                </>
              )
              : null}
            <Stack size={25} />
            <Box dir='row'>
              <Box dir='col' expand>
                <Text type='h2'>No. of people</Text>
                <Stack size={25} />
                <div className='p1'>{this.props.vehicleRequest.noOfPeople}</div>
              </Box>
              <Queue size={100} />
              <Box dir='col' expand>
                <Text type='h2'>Estimated mileage</Text>
                <Stack size={25} />
                <div className='p1'>{this.props.vehicleRequest.mileage}</div>
              </Box>
            </Box>
            <Stack size={50} />
            {this.getVehicles()}
            <Divider size={1} />
            <Stack size={25} />
            <Box dir='row' justify='end' align='center'>
              {this.getAppropriateLink()}
              <Queue size={50} />
              {this.getAppropriateButton()}
            </Box>
          </Box>
          <Modal
            centered
            size='lg'
            show={this.state.showProfile}
            onHide={this.toggleProfile}
          >
            <ProfileCard
              asProfilePage={false}
              isEditing={false}
              user={this.props.vehicleRequest.requester}
            />
          </Modal>
          <Modal
            centered
            show={this.state.showModal}
            onHide={this.closeModal}
          >
            {this.getModalContent()}
          </Modal>
          <Modal centered show={this.state.showConflictsModal} onHide={() => this.setState({ showConflictsModal: false })}>
            <ConflictModal closeModal={() => this.setState({ showConflictsModal: false })} vehicleName={this.state.conflictWith} conflicts={this.state.conflicts} />
          </Modal>
          <Modal
            centered
            show={this.state.showCalendarModal}
            onHide={() => this.setState({ showCalendarModal: false })}
            dialogClassName='vehicle-calendar-modal'
          >
            <VehicleCalendar />
          </Modal>
        </Box>
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
