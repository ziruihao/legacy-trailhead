import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Stack, Queue, Divider, Box } from '../layout';
import Toggle from '../toggle';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import './vehicle-request-form.scss';
import '../../styles/vehicleRequestForm-style.scss';

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
  return microbusVan;
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
      <Box dir="col" key={vehicle._id}>
        <Divider size={1} />
        <Stack size={50} />
        <Box dir="row" justify="between" align="center">
          <div className="doc-h1">Vehicle #{index + 1}</div>
          <i className="material-icons close-button" onClick={event => props.removeVehicle(event, index)} role="button" tabIndex={0}>close</i>
        </Box>
        {/* <div className="vrf-req-header">
          <h3 className="vrf-label vrf-req-no">Vehicle #{index + 1}</h3>
          <div className="trip-details-close-button" />
        </div> */}
        <Stack size={50} />
        <div className="doc-h2" htmlFor="vehicle_type">Vehicle type</div>
        <Stack size={25} />
        <Dropdown id={`vehicle_type_${index}`} onSelect={eventKey => props.onVehicleTypeChange(eventKey, index)}>
          <Dropdown.Toggle className={`field vehicle-type-dropdown ${vehicle.errorFields.vehicleType ? 'field-error vrf-error' : ''}`}>
            <span>
              <span className="selected-size">{vehicleType.length === 0 ? 'Select a vehicle' : vehicleType}</span>
              <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
            </span>
            <Dropdown.Menu className="field-dropdown-menu">
              {getApprpriateVehicleMenu(props.userCertifications)}
            </Dropdown.Menu>
          </Dropdown.Toggle>
        </Dropdown>
        <Stack size={25} />
        <div className="doc-h2" htmlFor={`vehicle_details_${index}`}>Vehicle notes</div>
        <Stack size={25} />
        <input
          type="text"
          id={`vehicle_details_${index}`}
          className="field trip-detail vrf-vehicle-detail"
          placeholder="e.g. I need Stakey!"
          maxLength="50"
          name="vehicleDetails"
          value={vehicle.vehicleDetails}
          onChange={event => props.onVehicleDetailChange(event, index)}
        />
        <Stack size={25} />
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
        <Stack size={25} />
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

        <Stack size={25} />
        <div className="doc-h2">Misc.</div>
        <Stack size={25} />
        <Box dir="col" align="start">
          <Toggle id="wmnf-pass" value={vehicle.passNeeded} onChange={event => props.onVehicleDetailChange(event, index)} label="Need WMNF pass?" />
          <Stack size={25} />
          {props.userCertifications.trailerCert
            ? (
              <Toggle id="trailer-hitch" value={vehicle.trailerNeeded} onChange={event => props.onVehicleDetailChange(event, index)} label="Need trailer hitch?" />
            // <div className="vrf-form-row vrf-req-dates">
            //   <div className="club-option">
            //     <label className="checkbox-container club-checkbox" htmlFor={`trailerNeeded_${index}`}>
            //       <input
            //         type="checkbox"
            //         name="trailerNeeded"
            //         id={`trailerNeeded_${index}`}
            //         checked={vehicle.trailerNeeded}
            //         onChange={event => props.onVehicleDetailChange(event, index)}
            //       />
            //       <span className="checkmark" />
            //     </label>
            //     <span className="vrf-label">Trailer Hitch Required?</span>
            //   </div>
            // </div>
            )
            : null
        }
        </Box>
        {/* <div className="vrf-form-row vrf-req-dates">
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
        </div> */}
      </Box>
    );
  });
};

const getAppropriateButton = (props) => {
  if (props.requestType === 'TRIP') {
    return <button type="submit" className="vrf-submit-button signup-button" onClick={props.nextTripPage}>Next</button>;
  } else if (props.requestType === 'SOLO') {
    if (props.asUpdate) {
      return (
        <>
          <div className="doc-button hollow alarm" onClick={props.cancelUpdate} role="button" tabIndex={0}>Cancel update</div>
          <Queue size={15} />
          <div className="doc-button" onClick={props.update} role="button" tabIndex={0}>Update</div>
        </>
      );
    } else {
      return <div className="doc-button" onClick={props.submit} role="button" tabIndex={0}>Submit</div>;
    }
  } else {
    return null;
  }
};

const VehicleRequestForm = (props) => {
  return (
    <Box dir="col" pad={50} id="vehicle-request-form" className="doc-card">
      <div className="doc-h1">Vehicle request form</div>
      <Stack size={50} />
      {props.requestType === 'SOLO'
        ? (
          <Box dir="col">
            <div className="doc-h3" htmlFor="request_detail">Request details</div>
            <Stack size={25} />
            <textarea
              value={props.requestDetails}
              onChange={props.onSoloReqDetailsChange}
              name="requestDetails"
              id="request_details"
              className={`field trip-detail vrf-req-details-input ${props.soloErrorFields.requestDetails ? 'field-error vrf-error' : ''}`}
              placeholder="e.g. I need a car to deliver wood to Cabin A"
            />
            <Stack size={25} />
            <div className="doc-h3" htmlFor="noOfPeople">Number of people</div>
            <Stack size={25} />
            <input
              type="number"
              id="noOfPeople"
              className={`field trip-detail vrf-vehicle-detail vrf-single-day-date ${Number(props.noOfPeople) === 0 ? 'no-date' : ''} ${props.soloErrorFields.noOfPeople ? 'field-error vrf-error' : ''}`}
              name="noOfPeople"
              placeholder="0"
              value={props.noOfPeople}
              onChange={props.onSoloReqDetailsChange}
            />
          </Box>
        )
        : null}
      <Stack size={25} />
      <div className="doc-h3" htmlFor="mileage">Estimated mileage</div>
      <Stack size={25} />
      <input
        type="number"
        id="mileage"
        className={`field trip-detail vrf-vehicle-detail vrf-single-day-date ${Number(props.mileage) === 0 ? 'no-date' : ''} ${props.soloErrorFields.mileage ? 'field-error vrf-error' : ''}`}
        name="mileage"
        placeholder="0"
        value={props.mileage}
        onChange={props.onSoloReqDetailsChange}
      />
      <Stack size={50} />
      {getVehicles(props)}
      <Box dir="row" justify="end">
        <div className="doc-button hollow" onClick={props.addVehicle} role="button" tabIndex={0}>Add vehicle</div>
        <Queue size={25} />
        {getAppropriateButton(props)}
      </Box>
    </Box>
  );
};


export default VehicleRequestForm;
