import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/vehicleRequestForm-style.scss';

const VehicleRequestForm = (props) => {
  return (
    <div className="vrf-container">
      <div className="vrf-title-container">
        <h2 className="p-trip-title vrf-title-size">Vehicle Request</h2>
      </div>

      <div className="vrf-form-row">
        <label className="vrf-label" htmlFor="request_detail">Request Details</label>
        <textarea name="request_details" rows="2" id="request_details" className="trip-detail vrf-req-details-input" placeholder="e.g. I need a car to deliver wood to Cabin A" />
      </div>
      <div className="vrf-req-group">
        <div className="vrf-req-header">
          <h3 className="vrf-label vrf-req-no">Vehicle #1</h3>
          <div className="trip-details-close-button">
            <i className="material-icons close-button" onClick={props.goBack} role="button" tabIndex={0}>close</i>
          </div>
        </div>

        <div className="vrf-form-row">
          <label className="vrf-label" htmlFor="vehicle_type">Vehicle type</label>
          <Dropdown id="vehicle_type" onSelect={props.onVehicleTypeChange}>
            <Dropdown.Toggle id="vehicle-type-dropdown">
              <span>
                <span className="selected-size">Select a vehicle</span>
                <img className="dropdown-icon" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="vrf-req-options">
              <Dropdown.Item eventKey="NONE">Select a vehicle</Dropdown.Item>
              <Dropdown.Item eventKey="MICROBUS">Microbus</Dropdown.Item>
              <Dropdown.Item eventKey="VAN">Van</Dropdown.Item>
              <Dropdown.Item eventKey="TRAILER">Trailer</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="vrf-form-row">
          <label className="vrf-label" htmlFor="vehicle_details">Vehicle Details</label>
          <input type="text" name="vehicle_details" id="vehicle_details" className="trip-detail vrf-vehicle-detail" placeholder="e.g. I need Steakie!" />
        </div>

        <div className="vrf-radio-row">
          <label className="checkbox-container" htmlFor="single-day-trip">
            <input
              type="radio"
              name="trip-length"
              id="single-day-trip"
              value="single-day-trip"
              onChange={props.onFieldChange}
            />
            <span className="radio-button" />
          </label>
          <span className="vrf-label vrf-trip-length">Single day trip</span>
        </div>

        <div className="vrf-radio-row">
          <label className="checkbox-container" htmlFor="multi-day-trip">
            <input
              type="radio"
              name="trip-length"
              id="multi-day-trip"
              value="multi-day-trip"
              onChange={props.onFieldChange}
              defaultChecked
            />
            <span className="radio-button" />
          </label>
          <span className="vrf-label vrf-trip-length">Multi-day trip</span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor="pickup_date">Pickup Date</label>
            <input type="date" name="pickup_date" id="pickup_date" className="trip-detail vrf-vehicle-detail no-date" />
          </span>
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor="return_date">Return Date</label>
            <input type="date" name="return_date" id="return_date" className="trip-detail vrf-vehicle-detail no-date" />
          </span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor="pickup_time">Pickup Time</label>
            <input type="time" defaultValue="12:00" name="pickup_time" id="pickup_time" className="trip-detail vrf-vehicle-detail no-date" />
          </span>
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor="return_time">Return Time</label>
            <input type="time" defaultValue="12:00" name="return_time" id="return_time" className="trip-detail vrf-vehicle-detail no-date" />
          </span>
        </div>

        <div className="vrf-form-row vrf-req-dates">
          <div className="club-option">
            <label className="checkbox-container club-checkbox" htmlFor="isPassNeeded">
              <input
                type="checkbox"
                name="isPassNeeded"
                id="isPassNeeded"
                onChange={props.onFieldChangeChange}
                defaultChecked
              />
              <span className="checkmark" />
            </label>
            <span className="vrf-label">WMNF Pass Needed?</span>
          </div>
        </div>

      </div>
      <div className="vrf-add-and-submit">
        <button type="button" className="vrf-add-button" onClick={props.addRequest}>Add Vehicle</button>
        <button type="submit" className="vrf-submit-button signup-button" onClick={props.submit}>Submit</button>
      </div>
    </div>
  );
};


export default VehicleRequestForm;
