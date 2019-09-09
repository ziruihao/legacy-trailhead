import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import '../styles/vehicle-calendar-style.scss';
import WeekView from './calendar-weekView';
import VehicleBooking from './calendarVehicleBooking';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment);

const VehicleCalendarComponent = (props) => {
  return (
    <BigCalendar
      localizer={localizer}
      defaultView="week"
      views={{
        week: WeekView,
      }}
      events={props.vehicles}
      showMultiDayTimes
      popup
      step={60}
      timeslots={12}
      vehicles={props.vehicles}
      components={{ event: VehicleBooking }}
      onSelectEvent={props.userRole === 'OPO' ? (selectedEvent, e) => props.showEventModal(selectedEvent, e) : undefined}
    />
  );
};

export default VehicleCalendarComponent;
