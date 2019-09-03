import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import '../styles/vehicle-calendar-style.scss';
import WeekView from './calendar-weekView';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment);

const VehicleCalendarComponent = (props) => {
  return (
    <BigCalendar
      localizer={localizer}
      defaultView="week"
      views={{
        day: true,
        week: WeekView,
      }}
      events={props.vehicles}
      showMultiDayTimes
      step={60}
      timeslots={12}
      vehicles={props.vehicles}
    />
  );
};

export default VehicleCalendarComponent;
