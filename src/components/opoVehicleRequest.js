import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import ProfileCard from './profilecard';
import { appError, fetchVehicleRequest, getVehicles } from '../actions';
import '../styles/opoVehicleRequest-style.scss';

class OPOVehicleRequest extends Component {
  vehicleForm = [];

  defaultAssignment = {
    assignedVehicle: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    assignedKey: '',
  }

  constructor(props) {
    super(props);
    this.emailRef = React.createRef();
    this.state = {
      isEditing: true,
      showProfile: false,
      assignments: [this.defaultAssignment],
      showModal: false,
      modalTrigger: 'CONTACT',
    };
  }

  componentDidMount() {
    this.props.fetchVehicleRequest(this.props.match.params.vehicleReqId)
      .then(() => {
        const assignments = this.props.vehicleRequest.requestedVehicles.map((vehicle) => {
          return this.defaultAssignment;
        });
        const unreviewed = this.props.vehicleRequest.status === 'pending';
        this.setState({ isEditing: unreviewed, assignments });
      });
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
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
    if (splitTime[0] > 12) {
      splitTime[0] -= 12;
      splitTime[2] = ' PM';
    }
    return `${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
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
      // error highlight form if value is empty
      // if (Object.prototype.hasOwnProperty.call(oldVehicle.errorFields, updatedEntry)) {
      //   update.errorFields = Object.assign({}, oldVehicle.errorFields, { [updatedEntry]: this.isStringEmpty(event.target.value) });
      // }
      const updatedVehicle = Object.assign({}, oldVehicle, update);
      const updatedVehicles = Object.assign([], oldVehicles, { [index]: updatedVehicle });
      return { assignments: updatedVehicles };
    });
  }

  assignmentForm = (index) => {
    const assignment = this.state.assignments[index];
    return (
      <div className="ovr-req-assignment">
        <span className="vrf-label ovr-column-header">Assign</span>
        <div className="trip-detail ovr-white-background">
          <span className="ovr-req-row ovr-req-vehicle-detail">
            <Dropdown onSelect={eventKey => this.onVehicleTypeChange(eventKey, index)}>
              <Dropdown.Toggle id="ovr-vehicle-dropdown">
                <p className={`ovr-current-vehicle ${assignment.assignedVehicle === '' ? 'no-date' : ''}`}>{assignment.assignedVehicle === '' ? 'Assign a vehicle' : assignment.assignedVehicle}</p>
                <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="filter-options">
                {/* {this.vehicleForm} */}
                <Dropdown.Item eventKey="Vox 100">Vox 100</Dropdown.Item>
                <Dropdown.Item eventKey="Vox 3000">Vox 3000</Dropdown.Item>
                <Dropdown.Item eventKey="Vox 3005">Vox 3005</Dropdown.Item>
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
              className={`ovr-date-input ${assignment.pickupDate.length === 0 ? 'no-date' : ''}`}
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
              className={`ovr-date-input ${assignment.pickupTime.length === 0 ? 'no-date' : ''}`}
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
              className={`ovr-date-input ${assignment.returnDate.length === 0 ? 'no-date' : ''}`}
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
              className={`ovr-date-input ${assignment.returnTime.length === 0 ? 'no-date' : ''}`}
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
              className="ovr-date-input"
              maxLength="50"
              name="assignedKey"
              value={assignment.assignedKey}
              placeholder="33A"
              onChange={event => this.onAssignmentDetailChange(event, index)}
            />
          </span>
          <hr className="detail-line" />
        </div>
      </div>
    );
  }

  activateModal = (trigger) => {
    this.setState({ showModal: true, modalTrigger: trigger });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  getVehicles = () => {
    return this.props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
      return (
        <div key={`vehicle_#${index}`} id={`vehicle_req_${index}`} className="vrf-req-group">
          <div className="vrf-req-header">
            <h3 className="vrf-label vrf-req-no">Vehicle #{index + 1}</h3>
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

  copyEmail = (event) => {
    this.emailRef.current.select();
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Email copied to clipboard!');
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
    if (this.isObjectEmpty(this.props.vehicleRequest)) {
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
  };
};

export default withRouter(connect(mapStateToProps, { appError, fetchVehicleRequest, getVehicles })(OPOVehicleRequest));
