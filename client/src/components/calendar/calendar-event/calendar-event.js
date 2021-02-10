import React from 'react';
import ReactToolTip from 'react-tooltip';
import utils from '../../../utils';
import { Stack, Queue, Divider, Box } from '../../layout';
import './calendar-event.scss';

const hasReturnTimePassed = (eventEnd) => {
  const now = new Date();
  const returnTime = new Date(eventEnd);
  return returnTime < now;
};

const VehicleBooking = ({ event }) => {
  let pickedUpStatus = '';
  let statusMessage = 'Unknown status';
  const returnTimeHasPassed = hasReturnTimePassed(event.assigned_returnDateAndTime);
  if (event.pickedUp && event.returned) {
    pickedUpStatus = 'approved';
    statusMessage = 'Vehicle returned';
  } else if (event.pickedUp && !event.returned && returnTimeHasPassed) {
    pickedUpStatus = 'denied';
    statusMessage = 'Return is past due';
  } else if (event.pickedUp && !event.returned && !returnTimeHasPassed) {
    pickedUpStatus = 'pending';
    statusMessage = 'Vehicle has been picked up';
  } else if (!event.pickedUp) {
    pickedUpStatus = 'unused';
    statusMessage = 'Vehicle was never picked up';
  }

  let bookingTitle = '';
  if (event.request.requestType === 'SOLO') {
    bookingTitle = `V-Req #${event.request.number}`;
  } else if (event.request.requestType === 'TRIP') {
    bookingTitle = `Trip #${event.request.associatedTrip.number}: ${event.request.associatedTrip.title}`;
  }
  // if (bookingTitle.length >= 25) bookingTitle = `${bookingTitle.substring(0, 22)}...`;

  const bookingTime = `${utils.dates.formatTime(new Date(event.assigned_pickupDateAndTime))} - ${utils.dates.formatTime(new Date(event.assigned_returnDateAndTime))}`;
  return (
    <>
      <Box dir='col' justify='between' pad={10} className={`booking-container ${event.pickedUp ? 'hoverable-booking' : ''} ${event.conflicts.length > 0 ? 'conflict' : null}`} data-tip data-for={`${event.request._id}-calendar-event`}>
        <div className='p2 thick booking-title'>
          {bookingTitle}
          {event.assigned_vehicle.name}
        </div>
        <div className='booking-time gray thin'>{bookingTime}</div>
        {/* <div className="booking-mini-details">
          {event.pickedUp
            ? (
              <span className="booking-status-container">
                <span className="booking-dot">.</span>
                <span className={`booking-pickedUp ${pickedUpStatus}`}>P</span>
              </span>
            )
            : null
          }
          {event.returned
            ? (
              <span className="booking-status-container">
                <span className="booking-dot">.</span>
                <span className="booking-returned approved">R</span>
              </span>
            )
            : null
          }
        </div> */}
        {/* <div className='booking-tooltip'>
          <span className={`booking-time ${pickedUpStatus}`}>{statusMessage}</span>
        </div> */}
      </Box>
      <ReactToolTip id={`${event.request._id}-calendar-event`} backgroundColor={pickedUpStatus === 'denied' ? '#A93A3A' : (pickedUpStatus === 'approved' ? '#0CA074' : (pickedUpStatus === 'pending' ? '#d7a884' : undefined))}>
        {statusMessage} — Key {event.assigned_key}
      </ReactToolTip>
    </>
  );
};

export default VehicleBooking;
