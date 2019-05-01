import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';
import dates from '../utils/dates';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/alltrips-style.scss';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class TripsCal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(props) {
    this.props.fetchTrips();
  }

  createEvents = () => {
    const allTrips = this.props.trips.map((trip) => {
      let multiDay = true;
      if (trip.startDate === trip.endDate) {
        multiDay = false;
      }
      const startDayWrapper = moment(trip.startDate).hour(3).minute(14);
      const endDayWrapper = moment(trip.endDate).hour(5).minute(14);
      const Event = {
        title: trip.title,
        start: startDayWrapper,
        id: trip._id,
        end: endDayWrapper,
        allDay: multiDay,
        resource: '',
      };
      console.log(`Start is: ${Event.start}`);
      return Event;
    });
    return allTrips;
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name');
    console.log(title + start + end);
  }

  render() {
    return (
      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={this.createEvents()}
          startAccessor="start"
          endAccessor="end"
          step={60}
          views={allViews}
          max={dates.add(dates.endOf(new Date(2028, 17, 1), 'day'), -1, 'hours')}
          selectable
          onSelectEvent={event => alert(event.id)}
          onSelectSlot={this.handleSelect}
        />
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
