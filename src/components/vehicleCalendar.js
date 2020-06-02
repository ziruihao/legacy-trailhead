import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { Stack, Queue, Divider, Box } from './layout';
import VehicleCalendarComponent from './vehicleCalendarComponent';
import DOCLoading from './doc-loading';
import { appError, getVehicles, fetchVehicleAssignments } from '../actions';
import '../styles/vehicle-calendar-style.scss';
import './vehicle-calendar/event-modal.scss';

class VehicleCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      showModal: false,
      selectedEvent: {},
    };
  }

  componentDidMount() {
    Promise.all([this.props.getVehicles(), this.props.fetchVehicleAssignments()])
      .then(() => {
        this.setState({ ready: true });
      });
  }

  showEventModal = (selectedEvent, e) => {
    this.setState({ showModal: true, selectedEvent });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  formatDate = (startDate, endDate, startTime, endTime) => {
    const startAsDate = new Date(startDate);
    const startDateString = startAsDate.toUTCString();
    const displayStartDate = startDateString.substring(0, 11);

    const splitStartTime = startTime.split(':');
    splitStartTime.push(' AM');
    const originalStartHour = splitStartTime[0];
    splitStartTime[0] = originalStartHour % 12;
    if (originalStartHour >= 12) {
      splitStartTime[2] = ' PM';
    }
    if (splitStartTime[0] === 0) {
      splitStartTime[0] = 12;
    }
    const displayStartTime = `${splitStartTime[0]}:${splitStartTime[1]}${splitStartTime[2]}`;

    const endAsDate = new Date(endDate);
    const endDateString = endAsDate.toUTCString();
    const displayEndDate = endDateString.substring(0, 11);

    const splitEndTime = endTime.split(':');
    splitEndTime.push(' AM');
    const originalEndHour = splitEndTime[0];
    splitEndTime[0] = originalEndHour % 12;
    if (originalEndHour >= 12) {
      splitEndTime[2] = ' PM';
    }
    if (splitEndTime[0] === 0) {
      splitEndTime[0] = 12;
    }
    const displayEndTime = `${splitEndTime[0]}:${splitEndTime[1]}${splitEndTime[2]}`;

    return `${displayStartDate}, ${displayStartTime} - ${displayEndDate}, ${displayEndTime}`;
  };

  getCoLeaders = (leaders) => {
    let coleaders = '';
    leaders.forEach((leader, index) => {
      if (index !== 0) {
        coleaders += `${leader.name}, `;
      }
    });
    coleaders = coleaders.substring(0, coleaders.length - 2);
    coleaders = coleaders.length === 0 ? 'None' : coleaders;
    return coleaders;
  };

  getModalContent = () => {
    const { selectedEvent } = this.state;
    const trip = selectedEvent.request.associatedTrip;
    return (
      <div id="event-modal">
        <h1 id="event-modal-title">
          {selectedEvent.request.associatedTrip ? `Trip #${selectedEvent.request.associatedTrip.number}: ${trip.title}` : `Vehicle Request #${selectedEvent.request.number}`}
          {/* {selectedEvent.request.requestType === 'TRIP' ? trip.title : selectedEvent.requestDetails} */}
        </h1>
        <div id="event-key-details">
          <div id="event-key-details-labels">
            <div id="event-key-detail-row">
              {selectedEvent.request.requestType === 'TRIP' ? 'Leader' : 'Requester'}
            </div>
            <div id="event-key-detail-row">
              {selectedEvent.request.requestType === 'TRIP' ? 'Leader Contact' : 'Requester Contact'}
            </div>
            <div id="event-key-detail-row">
              Assigned Vehicle Date
            </div>
            {selectedEvent.request.requestType === 'TRIP'
              ? (
                <div>
                  <div id="event-key-detail-row">
                    Trip Name
                  </div>
                  <div id="event-key-detail-row">
                    Trip Date
                  </div>
                  <div id="event-key-detail-row">
                    Co-Leader(s)
                  </div>
                </div>
              )
              : null}
          </div>
          <div id="event-key-details-values">
            <div id="event-key-detail-row">
              {selectedEvent.requester.name}
            </div>
            <div id="event-key-detail-row">
              {`Email: ${selectedEvent.requester.email} | Phone: ${selectedEvent.requester.phone ? selectedEvent.requester.phone : 'N/A'}`}
            </div>
            <div id="event-key-detail-row">

              {this.formatDate(selectedEvent.assigned_pickupDate,
                selectedEvent.assigned_returnDate,
                selectedEvent.assigned_pickupTime,
                selectedEvent.assigned_returnTime)}
            </div>
            {selectedEvent.request.requestType === 'TRIP'
              ? (
                <div>
                  <div id="event-key-detail-row">
                    {trip.title}
                  </div>
                  <div id="event-key-detail-row">

                    {this.formatDate(trip.startDate,
                      trip.endDate,
                      trip.startTime,
                      trip.endTime)}

                  </div>
                  <div id="event-key-detail-row">

                    {this.getCoLeaders(trip.leaders)}
                  </div>
                </div>
              )
              : null}
          </div>
        </div>
        <hr />
        <div id="event-description">
          <span id="event-description-label">Description</span>
          <div id="event-key-detail-row">
            {selectedEvent.request.requestType === 'TRIP' ? trip.description : selectedEvent.request.requestDetails}
          </div>
        </div>
        <hr />
        <div className="vcm-assignment-info">
          <span className="vcm-assignment-detail">
            Vehicle
            <span>{selectedEvent.assignedVehicle}</span>
          </span>
          <span className="vcm-assignment-detail">
            Key #
            <span>{selectedEvent.assigned_key}</span>
          </span>
          <span className="vcm-assignment-detail">
            Picked Up?
            <span>{selectedEvent.pickedUp ? 'Yes' : 'No'}</span>
          </span>
          <span className="vcm-assignment-detail">
            Returned?
            <span>{selectedEvent.returned ? 'Yes' : 'No'}</span>
          </span>
          {/* <Link
            className="doc-button"
            target="_blank"
            to={selectedEvent.request.requestType === 'TRIP'
              ? `/trip/${trip._id}`
              : `/opo-vehicle-request/${selectedEvent.request._id}#vehicle_req_${selectedEvent.responseIndex}`}
          > */}
          <Link
            className="doc-button"
            target="_blank"
            to={`/opo-vehicle-request/${selectedEvent.request._id}#vehicle_req_${selectedEvent.responseIndex}`}
          >
            Edit Assignment
          </Link>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.ready) {
      return (
        <div className="vehicle-calendar-container center-view spacy">
          <Box className="doc-card" dir="col" align="stretch" pad={25}>
            <VehicleCalendarComponent
              assignments={this.props.assignments}
              vehicles={this.props.vehicles}
              showEventModal={this.showEventModal}
              userRole={this.props.user.role}
            />
          </Box>
          <Modal
            centered
            size="lg"
            show={this.state.showModal}
            onHide={this.closeModal}
          >
            <div id="event-modal-close">
              <i className="material-icons close-button" onClick={this.closeModal} role="button" tabIndex={0}>close</i>
            </div>
            {this.state.showModal ? this.getModalContent() : null}
          </Modal>
        </div>
      );
    } else {
      return (<DOCLoading type="doc" height="150" width="150" measure="px" />);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    vehicles: state.vehicleRequests.vehicles,
    assignments: state.vehicleRequests.allAssignments,
  };
};

export default withRouter(connect(mapStateToProps, { appError, getVehicles, fetchVehicleAssignments })(VehicleCalendar));
