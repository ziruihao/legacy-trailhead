import React, { Component } from 'react';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import * as dates from '../../utils/dates';
// import '../../styles/vehicle-calendar-style.scss';
import './calendar-views.scss';

class AllView extends Component {
  constructor(props) {
    super(props);
    this.arrayofRefs = [];
  }

  componentDidMount() {
    // this.arrayofRefs.forEach((ref, index) => {
    //   if (index !== 0) {
    //     ref.scrollRef.current.style.display = 'none';
    //   } else {
    //     ref.scrollRef.current.children[0].style.display = 'none';
    //   }
    //   const gutterRef = ref.gutter;
    //   while (gutterRef.firstChild) {
    //     gutterRef.removeChild(gutterRef.firstChild);
    //   }
    // });
  }

  hasReturnTimePassed = (eventEnd) => {
    const now = new Date();
    const returnTime = new Date(eventEnd);
    return returnTime < now;
  };

  render() {
    const { date } = this.props;
    const range = AllView.range(date);

    const eventsWithDate = this.props.assignments.map((booking) => {
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
      } else {
        calendarFields.tooltip = 'Vehicle has not been picked up yet';
      }
      calendarFields.assignedVehicle = booking.assigned_vehicle.name;
      return Object.assign({}, booking, calendarFields);
    });
    return (
      <div className="all-view-container">
        <span className="timegrid-latch">
          <TimeGrid
            // ref={(timeGridRef) => { this.arrayofRefs[index] = timeGridRef; }}
            {...this.props}
            range={range}
            min={new Date(0, 0, 0, 5)}
            step={30}
            timeslots={6}
            showMultiDayTimes
            events={eventsWithDate}
            startAccessor="start"
            endAccessor="end"
          />
        </span>
      </div>
    );
  }
}

AllView.title = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateObject = new Date(date);
  return `${months[dateObject.getMonth()]}, ${dateObject.getFullYear()}`;
};

AllView.range = (date) => {
  const start = date;
  const end = dates.add(start, 4, 'day');

  let current = start;
  const range = [];

  while (dates.lt(current, end, 'day')) {
    range.push(current);
    current = dates.add(current, 1, 'day');
  }

  return range;
};


AllView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -4, 'day');

    case navigate.NEXT:
      return dates.add(date, 4, 'day');

    default:
      return date;
  }
};

export default AllView;
