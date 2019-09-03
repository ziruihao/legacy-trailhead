import React from 'react';
import '../styles/vehicle-calendar-style.scss';

const hasReturnTimePassed = (eventEnd) => {
  const now = new Date();
  const returnTime = new Date(eventEnd);
  return returnTime < now;
};

const formatTime = (time) => {
  const splitTime = time.split(':');
  splitTime.push('am');
  const originalHour = splitTime[0];
  splitTime[0] = originalHour % 12;
  if (originalHour >= 12) {
    splitTime[2] = 'pm';
  }
  if (splitTime[0] === 0) {
    splitTime[0] = 12;
  }
  return `${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
};

const VehicleBooking = ({ event }) => {
  let pickedUpStatus = '';
  let statusMessage = '';
  const returnTimeHasPassed = hasReturnTimePassed(event.assigned_returnDateAndTime);
  if (event.pickedUp && event.returned) {
    pickedUpStatus = 'approved';
    statusMessage = 'Returned';
  } else if (event.pickedUp && !event.returned && returnTimeHasPassed) {
    pickedUpStatus = 'denied';
    statusMessage = 'Past due';
  } else if (event.pickedUp && !event.returned && !returnTimeHasPassed) {
    pickedUpStatus = 'pending';
    statusMessage = 'Picked up';
  }

  let bookingTitle = '';
  if (event.request.requestType === 'SOLO') {
    bookingTitle = event.request.requestDetails;
  } else if (event.request.requestType === 'TRIP') {
    bookingTitle = event.request.associatedTrip.title;
  }

  const bookingTime = `${formatTime(event.assigned_pickupTime)}-${formatTime(event.assigned_returnTime)}`;

  return (
    <span className={`booking-container ${event.pickedUp ? 'hoverable-booking' : ''}`}>
      <div className="booking-reason">
        {bookingTitle}
      </div>
      <div className="booking-mini-details">
        <span className="booking-time">{bookingTime}</span>
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
      </div>
      <div className="booking-tooltip">
        <span className={`booking-time ${pickedUpStatus}`}>{statusMessage}</span>
      </div>
    </span>
  );
};

export default VehicleBooking;
