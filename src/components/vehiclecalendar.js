import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { appError, getVehicles, fetchVehicleAssignments } from '../actions';
import VehicleCalendarComponent from './vehicleCalendarComponent';
import loadingGif from '../img/loading-gif.gif';
import '../styles/vehicle-calendar-style.scss';

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
      <div className="vcm-container">
        <h1 className="p-trip-title vcm-title">
          {selectedEvent.request.requestType === 'TRIP' ? trip.title : selectedEvent.requestDetails}
        </h1>
        <div>
          <div className="vcm-trip-details">
            <div className="otd-details-labels">
              <div className="vcm-row">
                <span className="vcm-detail-left">{selectedEvent.request.requestType === 'TRIP' ? 'Leader' : 'Requester'}</span>
              </div>
              <div className="vcm-row">
                <span className="vcm-detail-left">Assigned Vehicle Date</span>
              </div>
              {selectedEvent.request.requestType === 'TRIP'
                ? (
                  <div>
                    <div className="vcm-row">
                      <span className="vcm-detail-left">Trip Date</span>
                    </div>
                    <div className="vcm-row">
                      <span className="vcm-detail-left">Co-Leader(s)</span>
                    </div>
                  </div>
                )
                : null}
            </div>
            <div className="otd-details-column">
              <div className="vcm-row">
                <span className="vcm-detail-right">{selectedEvent.requester.name}</span>
              </div>
              <div className="vcm-row">
                <span className="vcm-detail-right">
                  {this.formatDate(selectedEvent.assigned_pickupDate,
                    selectedEvent.assigned_returnDate,
                    selectedEvent.assigned_pickupTime,
                    selectedEvent.assigned_returnTime)}
                </span>
              </div>
              {selectedEvent.request.requestType === 'TRIP'
                ? (
                  <div>
                    <div className="vcm-row">
                      <span className="vcm-detail-right">
                        {this.formatDate(trip.startDate,
                          trip.endDate,
                          trip.startTime,
                          trip.endTime)}
                      </span>
                    </div>
                    <div className="vcm-row">
                      <span className="vcm-detail-right">
                        {this.getCoLeaders(trip.leaders)}
                      </span>
                    </div>
                  </div>
                )
                : null}
            </div>
          </div>
          <div className="vcm-trip-description">
            <span className="vcm-detail-left vcm-description-label">Description</span>
            <div className="vcm-row">
              <div className="vcm-description">
                {selectedEvent.request.requestType === 'TRIP' ? trip.description : selectedEvent.request.requestDetails}
              </div>
            </div>
          </div>
          <hr className="vcm-line" />
          <div className="vcm-assignment-info">
            <span className="vcm-assignment-detail">
              <span className="vcm-detail-left">Vehicle</span>
              <span>{selectedEvent.assignedVehicle}</span>
            </span>
            <span className="vcm-assignment-detail">
              <span className="vcm-detail-left">Key #</span>
              <span>{selectedEvent.assigned_key}</span>
            </span>
            <span className="vcm-assignment-detail">
              <span className="vcm-detail-left">Picked Up?</span>
              <span>{selectedEvent.pickedUp ? 'Yes' : 'No'}</span>
            </span>
            <span className="vcm-assignment-detail">
              <span className="vcm-detail-left">Returned?</span>
              <span>{selectedEvent.returned ? 'Yes' : 'No'}</span>
            </span>
            <Link
              className="cancel-link ovr-bottom-link ovr-contact-link"
              target="_blank"
              to={selectedEvent.request.requestType === 'TRIP'
                ? `/trip/${trip.id}`
                : `/opo-vehicle-request/${selectedEvent.request.id}#vehicle_req_${selectedEvent.responseIndex}`}
            >
              Edit Assignment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  eventStyleGetter = (event, start, end, isSelected) => {
    console.log(event);
    // const backgroundColor = `#${event.hexColor}`;
    if (event.conflicts.length > 0) {
      const style = {
        backgroundColor: '#ff0000',
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block',
      };
      return {
        style,
      };
    } else {
      const style = {
        backgroundColor: '#ffffff',
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block',
      };
      return style;
    }
  }

  render() {
    if (this.state.ready) {
      return (
        <div className="vehicle-calendar-container">
          <div className="mytrips-flex-start">
            <h1 className="mytrips-header">Vehicle Calendar</h1>
          </div>
          <div className="vcc-container trip-detail">
            <VehicleCalendarComponent
              vehicles={this.props.vehicles}
              showEventModal={this.showEventModal}
              userRole={this.props.user.role}
              eventPropGetter={this.eventStyleGetter}
            />
          </div>
          <Modal
            centered
            show={this.state.showModal}
            onHide={this.closeModal}
          >
            <div className="trip-details-close-button">
              <i className="material-icons close-button" onClick={this.closeModal} role="button" tabIndex={0}>close</i>
            </div>
            {this.state.showModal ? this.getModalContent() : null}
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
          <img src={loadingGif} alt="loading-gif" />
        </div>
      );
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
