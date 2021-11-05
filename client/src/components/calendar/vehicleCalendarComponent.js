import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';
import { AllView, WeekView } from './calendar-views';
import VehicleBooking from './calendar-event';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment);

const VehicleCalendarComponent = (props) => {
  return (
    <BigCalendar
      localizer={localizer}
      defaultView='week'
      views={{
        week: WeekView,
      }}
      events={props.vehicles}
      // showMultiDayTimes
      popup
      vehicles={props.vehicles}
      // assignments={props.assignments}
      components={{ event: VehicleBooking }}
      // eventPropGetter={(props.eventPropGetter)}
      onSelectEvent={props.userRole === 'OPO' ? (selectedEvent, e) => props.showEventModal(selectedEvent, e) : undefined}
      onNavigate={props.onNavigate}
    />
  );
};

export default VehicleCalendarComponent;
