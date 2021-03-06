import React from 'react';
import utils from '../../utils';

const hasReturnTimePassed = (eventEnd) => {
  const now = new Date();
  const returnTime = new Date(eventEnd);
  return returnTime < now;
};

const VehicleBooking = ({ event }) => {
  let pickedUpStatus = '';
  let statusMessage = '';
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
  }

  let bookingTitle = '';
  if (event.request.requestType === 'SOLO') {
    bookingTitle = event.request.requestDetails;
  } else if (event.request.requestType === 'TRIP') {
    bookingTitle = event.request.associatedTrip.title;
  }

  const bookingTime = `${utils.dates.formatTime(new Date(event.assigned_pickupDateAndTime))}-${utils.dates.formatTime(new Date(event.assigned_returnDateAndTime))}`;

  return (
    <span className={`booking-container ${event.pickedUp ? 'hoverable-booking' : ''} ${event.conflicts.length > 0 ? 'conflict' : null}`}>
      <div className='booking-reason'>
        {bookingTitle}
      </div>
      <div className='booking-mini-details'>
        <span className='booking-time'>{bookingTime}</span>
        {event.pickedUp
          ? (
            <span className='booking-status-container'>
              <span className='booking-dot'>.</span>
              <span className={`booking-pickedUp ${pickedUpStatus}`}>P</span>
            </span>
          )
          : null
        }
        {event.returned
          ? (
            <span className='booking-status-container'>
              <span className='booking-dot'>.</span>
              <span className='booking-returned approved'>R</span>
            </span>
          )
          : null
        }
      </div>
      <div className='booking-tooltip'>
        <span className={`booking-time ${pickedUpStatus}`}>{statusMessage}</span>
      </div>
    </span>
  );
};

export default VehicleBooking;
