import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import dropdownIcon from '../img/dropdown-toggle.svg';
import '../styles/vehicleRequestForm-style.scss';

const getApprpriateVehicleMenu = (userCertifications) => {
  let microbusVan;
  switch (userCertifications.driverCert) {
    case 'MICROBUS':
      microbusVan = (
        <div>
          <Dropdown.Item eventKey="Microbus">Microbus</Dropdown.Item>
          <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
          <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
        </div>
      );
      break;
    case 'VAN':
      microbusVan = (
        <div>
          <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
          <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
        </div>
      );
      break;
    default:
      microbusVan = null;
  }

  if (userCertifications.driverCert === null && !userCertifications.trailerCert) {
    microbusVan = <Dropdown.Item eventKey="">Request access in profile page</Dropdown.Item>;
  }
  return (
    <Dropdown.Menu className="vrf-req-options">
      {microbusVan}
    </Dropdown.Menu>
  );
};

const formatDate = (date) => {
  // date fix adapted from https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off/31732581
  if (!date) {
    return '';
  }
  return new Date(date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString('en-US');
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

const getVehicles = (props) => {
  return props.vehicles.map((vehicle, index) => {
    const { vehicleType } = vehicle;
    const singleDayClass = vehicle.tripLength === 'single-day-trip' ? 'vrf-single-day-date' : '';
    return (
      <div key={vehicle._id} className="vrf-req-group">
        <div className="vrf-req-header">
          <h3 className="vrf-label vrf-req-no">Vehicle #{index + 1}</h3>
          <div className="trip-details-close-button">
            <i className="material-icons close-button" onClick={event => props.removeVehicle(event, index)} role="button" tabIndex={0}>close</i>
          </div>
        </div>

        <div className="vrf-form-row">
          <label className="vrf-label" htmlFor="vehicle_type">Vehicle Type</label>
          <Dropdown id={`vehicle_type_${index}`} onSelect={eventKey => props.onVehicleTypeChange(eventKey, index)}>
            <Dropdown.Toggle className={`vehicle-type-dropdown ${vehicle.errorFields.vehicleType ? 'vrf-error' : ''}`}>
              <span>
                <span className="selected-size">{vehicleType.length === 0 ? 'Select a vehicle' : vehicleType}</span>
                <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
              </span>
            </Dropdown.Toggle>
            {getApprpriateVehicleMenu(props.userCertifications)}
          </Dropdown>
        </div>

        <div className="vrf-form-row">
          <label className="vrf-label" htmlFor={`vehicle_details_${index}`}>Vehicle Details</label>
          <input
            type="text"
            id={`vehicle_details_${index}`}
            className="trip-detail vrf-vehicle-detail"
            placeholder="e.g. I need Stakey!"
            maxLength="50"
            name="vehicleDetails"
            value={vehicle.vehicleDetails}
            onChange={event => props.onVehicleDetailChange(event, index)}
          />
        </div>

        <div className="vrf-radio-row">
          <label className="checkbox-container" htmlFor={`single-day-trip-${index}`}>
            <input
              type="radio"
              name={`tripLength[${index}]`}
              id={`single-day-trip-${index}`}
              value="single-day-trip"
              checked={vehicle.tripLength === 'single-day-trip'}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <span className="radio-button" />
          </label>
          <span className="vrf-label vrf-trip-length">Single day trip</span>
        </div>

        <div className="vrf-radio-row">
          <label className="checkbox-container" htmlFor={`multi-day-trip-${index}`}>
            <input
              type="radio"
              name={`tripLength[${index}]`}
              id={`multi-day-trip-${index}`}
              value="multi-day-trip"
              checked={vehicle.tripLength === 'multi-day-trip'}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <span className="radio-button" />
          </label>
          <span className="vrf-label vrf-trip-length">Multi-day trip</span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor={`pickup_date_${index}`}>Pickup Date</label>
            <input
              {...console.log(props.startDate)}
              type="date"
              id={`pickup_date_${index}`}
              className={`trip-detail vrf-vehicle-detail  ${singleDayClass} ${vehicle.pickupDate.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.pickupDate ? 'vrf-error' : ''}`}
              name="pickupDate"
              value={vehicle.pickupDate}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <div className="vrf-label"> Trip Start Date is {formatDate(props.startDate)}</div>

          </span>
          {vehicle.tripLength === 'single-day-trip' ? null
            : (
              <span className="vrf-req-date">
                <label className="vrf-label" htmlFor={`return_date_${index}`}>Return Date</label>
                <input
                  type="date"
                  id={`return_date_${index}`}
                  className={`trip-detail vrf-vehicle-detail ${vehicle.returnDate.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.returnDate ? 'vrf-error' : ''}`}
                  name="returnDate"
                  value={vehicle.returnDate}
                  onChange={event => props.onVehicleDetailChange(event, index)}
                />
                <div className="vrf-label"> Trip End Date is {formatDate(props.endDate)}</div>
              </span>
            )
          }
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor={`pickup_time_${index}`}>Pickup Time</label>
            <input
              type="time"
              id={`pickup_time_${index}`}
              className={`trip-detail vrf-vehicle-detail ${vehicle.pickupTime.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.pickupTime ? 'vrf-error' : ''}`}
              name="pickupTime"
              value={vehicle.pickupTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <div className="vrf-label"> Trip Start Time is {formatTime(props.startTime)}</div>

          </span>

          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor={`return_time_${index}`}>Return Time</label>
            <input
              type="time"
              id={`return_time_${index}`}
              className={`trip-detail vrf-vehicle-detail ${vehicle.returnTime.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.returnTime ? 'vrf-error' : ''}`}
              name="returnTime"
              value={vehicle.returnTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <div className="vrf-label"> Trip End Time is {formatTime(props.endTime)}</div>
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
                onChange={event => props.onVehicleDetailChange(event, index)}
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
                    onChange={event => props.onVehicleDetailChange(event, index)}
                  />
                  <span className="checkmark" />
                </label>
                <span className="vrf-label">Trailer Hitch Required?</span>
              </div>
            </div>
          )
          : null
        }

      </div>
    );
  });
};

const getAppropriateButton = (props) => {
  if (props.requestType === 'TRIP') {
    return <button type="submit" className="vrf-submit-button signup-button" onClick={props.nextTripPage}>Next</button>;
  } else if (props.requestType === 'SOLO') {
    if (props.asUpdate) {
      return (
        <div className="vrf-cancel-and-update-buttons">
          <button type="button" className="vrf-add-button vrf-cancel-button vrf-cancel-update-button" onClick={props.cancelUpdate}>Cancel update</button>
          <button type="submit" className="vrf-submit-button signup-button" onClick={props.update}>Update</button>
        </div>
      );
    } else {
      return <button type="submit" className="vrf-submit-button signup-button" onClick={props.submit}>Submit</button>;
    }
  } else {
    return null;
  }
};

const VehicleRequestForm = (props) => {
  return (
    <div className="vrf-container">
      <div className="vrf-title-container">
        <h2 className="p-trip-title vrf-title-size">Vehicle Request</h2>
      </div>

      {props.requestType === 'SOLO'
        ? (
          <div className="vrf-solo-req">
            <div className="vrf-form-row">
              <label className="vrf-label" htmlFor="request_detail">Request Details</label>
              <textarea
                value={props.requestDetails}
                onChange={props.onSoloReqDetailsChange}
                name="requestDetails"
                id="request_details"
                className={`trip-detail vrf-req-details-input ${props.soloErrorFields.requestDetails ? 'vrf-error' : ''}`}
                placeholder="e.g. I need a car to deliver wood to Cabin A"
              />
            </div>
            <span className="vrf-form-row">
              <label className="vrf-label" htmlFor="noOfPeople">Number of people</label>
              <input
                // type="number"
                id="noOfPeople"
                className={`trip-detail vrf-vehicle-detail vrf-single-day-date ${Number(props.noOfPeople) === 0 ? 'no-date' : ''} ${props.soloErrorFields.noOfPeople ? 'vrf-error' : ''}`}
                name="noOfPeople"
                placeholder="0"
                value={props.noOfPeople}
                onChange={props.onSoloReqDetailsChange}
              />
            </span>
            <span className="vrf-form-row">
              <label className="vrf-label" htmlFor="mileage">Estimated mileage</label>
              <input
                // type="number"
                id="mileage"
                className={`trip-detail vrf-vehicle-detail vrf-single-day-date ${Number(props.mileage) === 0 ? 'no-date' : ''} ${props.soloErrorFields.mileage ? 'vrf-error' : ''}`}
                name="mileage"
                placeholder="0"
                value={props.mileage}
                onChange={props.onSoloReqDetailsChange}
              />
            </span>
          </div>
        )
        : null}

      {getVehicles(props)}

      <div className="vrf-add-and-submit">
        <button type="button" className="vrf-add-button vrf-small-add" onClick={props.addVehicle}>Add Vehicle</button>
        {getAppropriateButton(props)}
      </div>
    </div>
  );
};


export default VehicleRequestForm;
