import React, { Component } from 'react';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import * as dates from '../../../utils/dates';
import './calendar-views.scss';

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

  hasReturnTimePassed = (eventEnd) => {
    const now = new Date();
    const returnTime = new Date(eventEnd);
    return returnTime < now;
  };

  render() {
    const { date } = this.props;
    const range = WeekView.range(date);
    const vehiclesWithoutEnterprise = this.props.vehicles.filter((vehicle) => {
      return vehicle.name !== 'Enterprise';
    });
    return vehiclesWithoutEnterprise.sort((a, b) => {
      if (a.name > b.name) return -1;
      else if (b.name > a.name) return 1;
      else return 0;
    }).map((vehicle, index) => {
      const eventsWithDate = vehicle.bookings.map((booking) => {
        const calendarFields = {};
        calendarFields.start = new Date(booking.assigned_pickupDateAndTime);
        calendarFields.end = new Date(booking.assigned_returnDateAndTime);
        const returnTimeHasPassed = this.hasReturnTimePassed(booking.assigned_returnDateAndTime);
        if (booking.pickedUp && booking.returned) {
          calendarFields.tooltip = 'Vehicle has been returned';
        } else if (booking.pickedUp && !booking.returned && returnTimeHasPassed) {
          calendarFields.tooltip = 'Return time has passed';
        } else if (booking.pickedUp && !booking.returned && !returnTimeHasPassed) {
          calendarFields.tooltip = 'Vehicle has been picked up';
        }
        calendarFields.assignedVehicle = vehicle.name;
        return Object.assign({}, booking, calendarFields);
      });
      return (
        <div key={vehicle._id} className='weekview-container'>
          <span className={`vehicle-name ${index === 0 && 'weekView-top-padding'}`}>
            {vehicle.name}
          </span>
          <span className='timegrid-latch'>
            <TimeGrid
              ref={(timeGridRef) => { this.arrayofRefs[index] = timeGridRef; }}
              {...this.props}
              range={range}
              min={new Date(0, 0, 0, 5)}
              step={30}
              timeslots={9}
              showMultiDayTimes
              events={eventsWithDate}
              startAccessor='start'
              endAccessor='end'
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
  return `${months[dateObject.getMonth()]}, ${dateObject.getFullYear()} (${dates.timezone()})`;
};

WeekView.range = (date) => {
  let start = dates.startOf(date, 'week');
  start = dates.add(start, 1, 'day');
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
