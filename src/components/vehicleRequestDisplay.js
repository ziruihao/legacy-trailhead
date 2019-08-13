import React from 'react';
import '../styles/vehicleRequestForm-style.scss';

const formatDate = (date, time) => {
  let timeString = '';
  const rawDate = new Date(date);
  const dateString = rawDate.toString();
  timeString = `${dateString.slice(0, 3)},${dateString.slice(3, 10)}`;
  const splitTime = time.split(':');
  splitTime.push('am');
  if (splitTime[0] > 12) {
    splitTime[0] -= 12;
    splitTime[2] = 'pm';
  }
  timeString = `${timeString}, ${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
  return timeString;
};

const getVehicles = (props) => {
  return props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
    return (
      <div key={index} className="vrf-req-group">
        <div className="vrf-req-header">
          <h3 className="vrf-label vrf-req-no">Vehicle #{index + 1}</h3>
        </div>

        <div className="vrf-form-row">
          <span className="vrf-label">Vehicle Type</span>
          <span className="vrf-req-details-display">{vehicle.vehicleType}</span>
        </div>

        <div className="vrf-form-row">
          <span className="vrf-label">Vehicle Details</span>
          <span className="vrf-req-details-display">{vehicle.vehicleDetails}</span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <span className="vrf-label">Pickup Date & Time</span>
            <span className="vrf-req-details-display vrf-single-day-date">{formatDate(vehicle.pickupDate, vehicle.pickupTime)}</span>
          </span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <span className="vrf-label">Return Date & Time</span>
            <span className="vrf-req-details-display vrf-single-day-date">{formatDate(vehicle.returnDate, vehicle.returnTime)}</span>
          </span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <div className="club-option">
            <label className="checkbox-container club-checkbox" htmlFor={`passNeeded_${index}`}>
              <input
                type="checkbox"
                name="passNeeded"
                id={`passNeeded_${index}`}
                checked={vehicle.passNeeded}
                disabled
              />
              <span className="checkmark" />
            </label>
            <span className="vrf-label">WMNF Pass Needed?</span>
          </div>
        </div>

        {props.userCertifications.trailerCert
          ? (
            <div className="vrf-form-row vrf-req-dates">
              <div className="club-option">
                <label className="checkbox-container club-checkbox" htmlFor={`trailerNeeded_${index}`}>
                  <input
                    type="checkbox"
                    name="trailerNeeded"
                    id={`trailerNeeded_${index}`}
                    checked={vehicle.trailerNeeded}
                    disabled
                  />
                  <span className="checkmark" />
                </label>
                <span className="vrf-label">Trailer Compatible?</span>
              </div>
            </div>
          )
          : null
        }
      </div>
    );
  });
};

const VehicleRequestDisplay = (props) => {
  return (
    <div className="vrf-container">
      <div className="vrf-title-container">
        <h2 className="p-trip-title vrf-title-size">Vehicle Request</h2>
        <span className="vrf-status-display">
          <span className="vrf-label">
            Status:
          </span>
          <span className="vrf-req-status-display">
            {props.vehicleRequest.status}
          </span>
          <span className="vrf-req-status-badge">
            <img className="status-badge" src={`/src/img/${props.vehicleRequest.status}_badge.svg`} alt={`${props.vehicleRequest.status}_badge`} />
          </span>
        </span>
      </div>

      {props.requestType === 'SOLO'
        ? (
          <div className="vrf-form-row">
            <span className="vrf-label">Request Details</span>
            <span className="vrf-req-details-display">{props.vehicleRequest.requestDetails}</span>
          </div>
        )
        : null}

      {getVehicles(props)}

      <div className="vrf-add-and-submit">
        <button type="button" className="vrf-add-button vrf-cancel-button vrf-small-cancel" onClick={props.addVehicle}>Cancel request</button>
        {props.vehicleRequest.status === 'pending'
          ? <button type="submit" className="vrf-submit-button signup-button" onClick={props.startEditing}>Update request</button>
          : <button type="submit" className="disabled vrf-submit-button" onClick={props.showError}>Update request</button>}
      </div>
    </div>
  );
};


export default VehicleRequestDisplay;
