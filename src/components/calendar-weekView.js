import React, { Component } from 'react';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import * as dates from '../utils/dates';
import '../styles/vehicle-calendar-style.scss';

class WeekView extends Component {
  constructor(props) {
    super(props);
    this.arrayofRefs = [];
  }

  componentDidMount() {
    this.arrayofRefs.forEach((ref, index) => {
      if (index !== 0) {
        ref.scrollRef.current.style.display = 'none';
      } else {
        ref.scrollRef.current.children[0].style.display = 'none';
      }
      const gutterRef = ref.gutter;
      while (gutterRef.firstChild) {
        gutterRef.removeChild(gutterRef.firstChild);
      }
    });
  }

  render() {
    const { date } = this.props;
    const range = WeekView.range(date);
    return this.props.vehicles.map((vehicle, index) => {
      const eventsWithDate = vehicle.bookings.map((booking) => {
        const calendarFields = {};
        calendarFields.start = new Date(booking.assigned_pickupDateAndTime);
        calendarFields.end = new Date(booking.assigned_returnDateAndTime);
        return Object.assign({}, booking, calendarFields);
      });
      return (
        <div key={vehicle.id} className="weekview-container">
          <span className={`vehicle-name ${index === 0 && 'weekView-top-padding'}`}>
            {vehicle.name}
          </span>
          <span className="timegrid-latch">
            <TimeGrid
              ref={(timeGridRef) => { this.arrayofRefs[index] = timeGridRef; }}
              {...this.props}
              range={range}
              step={60}
              timeslots={12}
              showMultiDayTimes
              events={eventsWithDate}
              titleAccessor="assigned_key"
              startAccessor="start"
              endAccessor="end"
            />
          </span>
        </div>
      );
    });
  }
}

WeekView.title = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateObject = new Date(date);
  return `${months[dateObject.getMonth()]}, ${dateObject.getFullYear()}`;
};

WeekView.range = (date) => {
  const start = dates.startOf(date, 'week');
  const end = dates.add(start, 6, 'day');

  let current = start;
  const range = [];

  while (dates.lte(current, end, 'day')) {
    range.push(current);
    current = dates.add(current, 1, 'day');
  }

  return range;
};


WeekView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -7, 'day');

    case navigate.NEXT:
      return dates.add(date, 7, 'day');

    default:
      return date;
  }
};

export default WeekView;
