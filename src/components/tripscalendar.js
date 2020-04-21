import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './trips/trip-card.scss';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class TripsCal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      currEvent: '',
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount(props) {
    this.props.fetchTrips();
  }

  createEvents = () => {
    const allTrips = this.props.trips.map((trip) => {
      const sy = trip.startDate.substring(0, 4);
      const sm = trip.startDate.substring(5, 7);
      const sd = trip.startDate.substring(8, 10);
      let sh = 3;
      let smin = 5;
      let eh = 5;
      let emin = 5;
      if (trip.startTime && trip.endTime) {
        sh = trip.startTime.substring(0, 2);
        smin = trip.startTime.substring(3, 5);
        eh = trip.endTime.substring(0, 2);
        emin = trip.endTime.substring(3, 5);
      }
      const ey = trip.endDate.substring(0, 4);
      const em = trip.endDate.substring(5, 7);
      const ed = trip.endDate.substring(8, 10);
      const Event = {
        title: trip.title,
        id: trip._id,
        start: new Date(sy, sm - 1, sd, sh, smin, 0, 0),
        end: new Date(ey, em - 1, ed, eh, emin, 0, 0),
        allDay: false,
        resource: '',
      };
      return Event;
    });
    return allTrips;
  }

  handleSelect = (event) => {
    this.setState({ currEvent: event });
    this.handleShow();
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(event) {
    this.setState({ show: true });
  }


  render() {
    return (
      <div>
        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.currEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.currEvent._id} and {this.state.currEvent._id}</Modal.Body>
            <Modal.Footer>
              <button type="button" variant="secondary" onClick={this.handleClose}>
            Close
              </button>
              <NavLink type="button" to={`/trip/${this.state.currEvent._id}`} key={this.state.currEvent._id}>
                <div>
                  <h2>See Trip Details</h2>
                </div>
              </NavLink>
            </Modal.Footer>
          </Modal>;
        </div>
        <div className="calendar-container">
          <BigCalendar
            events={this.createEvents()}
            startAccessor="start"
            endAccessor="end"
            selectable
            views={allViews}
            step={30}
            showMultiDayTimes
            defaultDate={new Date()}
            defaultView={BigCalendar.Views.WEEK}
            localizer={localizer}
            scrollToTime={new Date(2019, 4, 12, 6, 0, 0)}
            onSelectEvent={event => this.handleSelect(event)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    trips: state.trips.all,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips })(TripsCal)); // connected component
