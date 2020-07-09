import React from 'react';
import { Stack, Queue, Divider, Box } from './layout';
import Badge from './badge';
import utils from '../utils';
import '../styles/vehicleRequestForm-style.scss';

// const utils.dates.formatDateAndTime = (date, time) => {
//   let timeString = '';
//   const rawDate = new Date(date);
//   const dateString = rawDate.toUTCString();
//   timeString = dateString.substring(0, 11);
//   const splitTime = time.split(':');
//   splitTime.push(' AM');
//   const originalHour = splitTime[0];
//   splitTime[0] = originalHour % 12;
//   if (originalHour >= 12) {
//     splitTime[2] = ' PM';
//   }
//   if (splitTime[0] === 0) {
//     splitTime[0] = 12;
//   }
//   timeString = `${timeString}, ${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
//   return timeString;
// };

const getAssignment = (props, index) => {
  if (props.vehicleRequest.status === 'approved') {
    const assignment = props.vehicleRequest.assignments.find((element) => {
      return element.responseIndex === index;
    });
    if (assignment) {
      return (
        <div className="vrf-requested-vehicles">
          <div className="vrf-req-header">
            <h3 className="vrf-label vrf-req-no">Assigned vehicle</h3>
          </div>

          <div className="vrf-form-row">
            <span className="vrf-label">Vehicle</span>
            <span className="vrf-req-details-display">{assignment.assigned_vehicle.name}</span>
          </div>

          <div className="vrf-form-row">
            <span className="vrf-label">Key #</span>
            <span className="vrf-req-details-display">
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : assignment.assigned_key}
            </span>
          </div>

          <div className="vrf-form-row vrf-req-dates">
            <span className="vrf-req-date">
              <span className="vrf-label">Pickup Date & Time</span>
              <span className="vrf-req-details-display vrf-single-day-date">
                {assignment.assigned_vehicle.name === 'Enterprise'
                  ? '-'
                  : utils.dates.formatDateAndTime(assignment.assigned_pickupDate, assignment.assigned_pickupTime)}
              </span>
            </span>
          </div>

          <div className="vrf-form-row vrf-req-dates">
            <span className="vrf-req-date">
              <span className="vrf-label">Return Date & Time</span>
              <span className="vrf-req-details-display vrf-single-day-date">
                {assignment.assigned_vehicle.name === 'Enterprise'
                  ? '-'
                  : utils.dates.formatDateAndTime(assignment.assigned_returnDate, assignment.assigned_returnTime)}
              </span>
            </span>
          </div>

          {assignment.assigned_vehicle.name === 'Enterprise'
            ? null
            : (
              <div>
                <div className="vrf-form-row vrf-req-dates">
                  <div className="club-option">
                    <label className="checkbox-container club-checkbox" htmlFor={`pickedUp_${index}`}>
                      <input
                        type="checkbox"
                        name="pickedUp"
                        id={`pickedUp_${index}`}
                        checked={assignment.pickedUp}
                        disabled
                      />
                      <span className="checkmark" />
                    </label>
                    <span className="vrf-label">Picked up?</span>
                  </div>
                </div>
                <div className="vrf-form-row vrf-req-dates">
                  <div className="club-option">
                    <label className="checkbox-container club-checkbox" htmlFor={`returned_${index}`}>
                      <input
                        type="checkbox"
                        name="returned"
                        id={`returned_${index}`}
                        checked={assignment.returned}
                        disabled
                      />
                      <span className="checkmark" />
                    </label>
                    <span className="vrf-label">Returned?</span>
                  </div>
                </div>
              </div>
            )}
        </div>
      );
    } else {
      return (
        <div className="vrf-requested-vehicles vrf-skipped-assignment">
          Skipped assignment
        </div>
      );
    }
  } else {
    return null;
  }
};

const getVehicles = (props) => {
  return props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
    return (
      <div key={vehicle._id} className="vrf-req-group vrf-req-and-assignment">
        <div className="vrf-requested-vehicles">
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
              <span className="vrf-req-details-display vrf-single-day-date">{utils.dates.formatDateAndTime(vehicle.pickupDate, vehicle.pickupTime)}</span>
            </span>
          </div>

          <div className="vrf-form-row vrf-req-dates">
            <span className="vrf-req-date">
              <span className="vrf-label">Return Date & Time</span>
              <span className="vrf-req-details-display vrf-single-day-date">{utils.dates.formatDateAndTime(vehicle.returnDate, vehicle.returnTime)}</span>
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
              <span className="vrf-label">Trailer Hitch Required?</span>
            </div>
          </div>
        </div>
        {getAssignment(props, index)}
      </div>
    );
  });
};

const VehicleRequestDisplay = (props) => {
  return (
    <Box dir="col" className="vrf-full-width">
      <Box dir="row" justify="between">
        <div className="doc-h2">Vehicle Request</div>
        <Badge type={props.vehicleRequest.status} size={36} />
      </Box>
      {/* <Stack size={25} /> */}
      {props.requestType === 'SOLO'
        ? (
          <div className="vrf-solo-req">
            <div className="vrf-form-row">
              <span className="vrf-label">Request Details</span>
              <span className="vrf-req-details-display">{props.vehicleRequest.requestDetails}</span>
            </div>
            <div className="vrf-form-row">
              <span className="vrf-label">Number of people</span>
              <span className="vrf-req-details-display">{props.vehicleRequest.noOfPeople}</span>
            </div>
            <div className="vrf-form-row">
              <span className="vrf-label">Estimated mileage</span>
              <span className="vrf-req-details-display">{props.vehicleRequest.mileage}</span>
            </div>
          </div>
        )
        : null}
      <Stack size={50} />
      {getVehicles(props)}
      <Stack size={50} />
      {props.requestType === 'SOLO'
        ? (
          <div className="vrf-add-and-submit">
            {props.vehicleRequest.status !== 'approved'
              ? <button type="button" className="vrf-add-button vrf-cancel-button vrf-small-cancel" onClick={props.addVehicle}>Cancel request</button>
              : <button type="button" className="vrf-add-button vrf-small-cancel disabled-cancel-button" onClick={props.showError}>Cancel request</button>}
            {props.vehicleRequest.status !== 'approved'
              ? <button type="submit" className="vrf-submit-button signup-button" onClick={props.startEditing}>Update request</button>
              : <button type="submit" className="disabled vrf-submit-button" onClick={props.showError}>Update request</button>}
          </div>
        )
        : null}
    </Box>
  );
};


export default VehicleRequestDisplay;