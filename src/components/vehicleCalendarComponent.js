import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import '../styles/vehicle-calendar-style.scss';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment);
const VehicleCalendarComponent = (props) => {
  return (
    <BigCalendar
      localizer={localizer}
      defaultView="week"
      views={['day', 'week']}
      resources={props.vehicles}
      resourceIdAccessor="resourceId"
      events={props.vehicles}
    />
  );
};

export default VehicleCalendarComponent;
