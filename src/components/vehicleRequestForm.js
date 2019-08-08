import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/vehicleRequestForm-style.scss';

const getVehicles = (props) => {
  return props.vehicles.map((vehicle, index) => {
    const { vehicleType } = vehicle;
    const singleDayClass = vehicle.tripLength === 'single-day-trip' ? 'vrf-single-day-date' : '';
    return (
      <div key={index} className="vrf-req-group">
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
                <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="vrf-req-options">
              <Dropdown.Item eventKey="Microbus">Microbus</Dropdown.Item>
              <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
              <Dropdown.Item eventKey="Trailer">Trailer</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="vrf-form-row">
          <label className="vrf-label" htmlFor={`vehicle_details_${index}`}>Vehicle Details</label>
          <input
            type="text"
            id={`vehicle_details_${index}`}
            className={`trip-detail vrf-vehicle-detail ${vehicle.errorFields.vehicleDetails ? 'vrf-error' : ''}`}
            placeholder="e.g. I need Steakie!"
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
              type="date"
              id={`pickup_date_${index}`}
              className={`trip-detail vrf-vehicle-detail  ${singleDayClass} ${vehicle.pickupDate.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.pickupDate ? 'vrf-error' : ''}`}
              name="pickupDate"
              value={vehicle.pickupDate}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
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

      </div>
    );
  });
};

const VehicleRequestForm = (props) => {
  return (
    <div className="vrf-container">
      <div className="vrf-title-container">
        <h2 className="p-trip-title vrf-title-size">Vehicle Request</h2>
      </div>

      <div className="vrf-form-row">
        <label className="vrf-label" htmlFor="request_detail">Request Details</label>
        <textarea
          value={props.requestDetails}
          onChange={props.onReqDetailsChange}
          id="request_details"
          className={`trip-detail vrf-req-details-input ${props.reqDetailsError ? 'vrf-error' : ''}`}
          placeholder="e.g. I need a car to deliver wood to Cabin A"
        />
      </div>

      {getVehicles(props)}

      <div className="vrf-add-and-submit">
        <button type="button" className="vrf-add-button" onClick={props.addVehicle}>Add Vehicle</button>
        <button type="submit" className="vrf-submit-button signup-button" onClick={props.submit}>Submit</button>
      </div>
    </div>
  );
};


export default VehicleRequestForm;
