import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Stack, Queue, Divider, Box } from '../layout';
import Field from '../field';
import Toggle from '../toggle';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import './vehicle-request-form.scss';
import '../../styles/vehicleRequestForm-style.scss';

const getApprpriateVehicleMenu = (userCertifications) => {
  let microbusVan;
  switch (userCertifications.driverCert) {
    case 'MICROBUS':
      microbusVan = (
        <>
          <Dropdown.Item eventKey="Microbus">Microbus</Dropdown.Item>
          <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
          <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
        </>
      );
      break;
    case 'VAN':
      microbusVan = (
        <>
          <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
          <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
        </>
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
        <Dropdown onSelect={eventKey => props.onVehicleTypeChange(eventKey, index)}>
          <Dropdown.Toggle className={`field ${vehicle.errorFields.vehicleType ? 'field-error' : ''}`}>
            <span>
              <span className="selected-size">{vehicleType.length === 0 ? 'Select a vehicle' : vehicleType}</span>
              <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="field-dropdown-menu">
            {getApprpriateVehicleMenu(props.userCertifications)}
          </Dropdown.Menu>
        </Dropdown>
        <Stack size={25} />
        <div className="doc-h2" htmlFor={`vehicle_details_${index}`}>Vehicle notes</div>
        <Stack size={25} />
        <Field
          id={`vehicle_details_${index}`}
          placeholder="e.g. I need Stakey!"
          width={600}
          name="vehicleDetails"
          value={vehicle.vehicleDetails}
          onChange={event => props.onVehicleDetailChange(event, index)}
        />
        {/* <input
          type="text"
          id={`vehicle_details_${index}`}
          className="field trip-detail vrf-vehicle-detail"
          placeholder="e.g. I need Stakey!"
          maxLength="50"
          name="vehicleDetails"
          value={vehicle.vehicleDetails}
          onChange={event => props.onVehicleDetailChange(event, index)}
        /> */}
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
        <Box dir="row" justify="between" width={800}>
          <Box dir="col">
            <div className="doc-h2">Pickup date</div>
            <Stack size={25} />
            <Field
              type="date"
              id={`pickup_date_${index}`}
              name="pickupDate"
              value={vehicle.pickupDate}
              onChange={event => props.onVehicleDetailChange(event, index)}
              error={vehicle.errorFields.pickupDate}
            />
          </Box>
          {vehicle.tripLength === 'single-day-trip' ? null
            : (
              <Box dir="col">
                <div className="doc-h2">Return date</div>
                <Stack size={25} />
                <Field
                  type="date"
                  id={`return_date_${index}`}
                  name="returnDate"
                  value={vehicle.returnDate}
                  onChange={event => props.onVehicleDetailChange(event, index)}
                  error={vehicle.errorFields.returnDate}
                />
              </Box>
            )
  }
        </Box>
        <Stack size={25} />
        {/* <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor={`pickup_date_${index}`}>Pickup Date</label>
            <input
              type="date"
              id={`pickup_date_${index}`}
              className={`trip-detail vrf-vehicle-detail  ${singleDayClass} ${vehicle.pickupDate.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.pickupDate ? '' : ''}`}
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
                  className={`trip-detail vrf-vehicle-detail ${vehicle.returnDate.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.returnDate ? '' : ''}`}
                  name="returnDate"
                  value={vehicle.returnDate}
                  onChange={event => props.onVehicleDetailChange(event, index)}
                />
              </span>
            )
          }
        </div> */}
        <Box dir="row" justify="between" width={800}>
          <Box dir="col">
            <div className="doc-h2">Pickup date</div>
            <Stack size={25} />
            <Field
              type="time"
              id={`pickup_time_${index}`}
              name="pickupTime"
              value={vehicle.pickupTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
              error={vehicle.errorFields.pickupTime}
            />
          </Box>
          <Box dir="col">
            <div className="doc-h2">Return date</div>
            <Stack size={25} />
            <Field
              type="time"
              id={`return_time_${index}`}
              name="returnTime"
              value={vehicle.returnTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
              error={vehicle.errorFields.returnDate}
            />
          </Box>
        </Box>

        {/* <div className="vrf-form-row vrf-req-dates">
          <span className="vrf-req-date">
            <label className="vrf-label" htmlFor={`pickup_time_${index}`}>Pickup Time</label>
            <input
              type="time"
              id={`pickup_time_${index}`}
              className={`trip-detail vrf-vehicle-detail ${vehicle.pickupTime.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.pickupTime ? '' : ''}`}
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
              className={`trip-detail vrf-vehicle-detail ${vehicle.returnTime.length === 0 ? 'no-date' : ''} ${vehicle.errorFields.returnTime ? '' : ''}`}
              name="returnTime"
              value={vehicle.returnTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
          </span>
        </div> */}

        <Stack size={25} />
        <div className="doc-h2">Misc.</div>
        <Stack size={25} />
        <Box dir="col" align="start">
          <Toggle id="wmnf-pass" name="passNeeded" value={vehicle.passNeeded} onChange={(event) => { console.log(event.target); props.onVehicleDetailChange(event, index); }} label="Need WMNF pass?" />
          <Stack size={25} />
          {props.userCertifications.trailerCert
            ? (
              <Toggle id="trailer-hitch" name="trailerNeeded" value={vehicle.trailerNeeded} onChange={(event) => { console.log(event.target); props.onVehicleDetailChange(event, index); }} label="Need trailer hitch?" />
            )
            : null
        }
        </Box>
        {index === props.vehicles.length - 1 ? null : <Stack size={50} />}
      </Box>
    );
  });
};

const getAppropriateButton = (props) => {
  if (props.requestType === 'TRIP') {
    return <div className="doc-button" onClick={props.nextTripPage} role="button" tabIndex={0}>Link request to trip</div>;
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
    <Box dir="col" pad={75} className="doc-card">
      <div className="doc-h1">Vehicle request form</div>
      <Stack size={50} />
      {props.requestType === 'SOLO'
        ? (
          <Box dir="col">
            <div className="doc-h2" htmlFor="request_detail">Request details</div>
            <Stack size={25} />
            <textarea
              value={props.requestDetails}
              onChange={props.onSoloReqDetailsChange}
              name="requestDetails"
              id="request_details"
              className={`field trip-detail vrf-req-details-input ${props.soloErrorFields.requestDetails ? 'field-error' : ''}`}
              placeholder="e.g. I need a car to deliver wood to Cabin A"
            />
            <Stack size={25} />
            <div className="doc-h2" htmlFor="noOfPeople">Number of people</div>
            <Stack size={25} />
            <Field
              width={100}
              type="number"
              id="noOfPeople"
              name="noOfPeople"
              placeholder="0"
              value={props.noOfPeople}
              onChange={props.onSoloReqDetailsChange}
              error={props.soloErrorFields.noOfPeople}
            />
            {/* <input
              type="number"
              id="noOfPeople"
              className={`field trip-detail vrf-vehicle-detail vrf-single-day-date ${Number(props.noOfPeople) === 0 ? 'no-date' : ''} ${props.soloErrorFields.noOfPeople ? 'field-error' : ''}`}
              name="noOfPeople"
              placeholder="0"
              value={props.noOfPeople}
              onChange={props.onSoloReqDetailsChange}
            /> */}
          </Box>
        )
        : null}
      <Stack size={25} />
      <div className="doc-h2" htmlFor="mileage">Estimated mileage</div>
      <Stack size={25} />
      <Field
        width={100}
        type="number"
        id="mileage"
        name="mileage"
        placeholder="0"
        value={props.mileage}
        onChange={props.onSoloReqDetailsChange}
        error={props.soloErrorFields.mileage}
      />
      {/* <input
        type="number"
        id="mileage"
        className={`field ${Number(props.mileage) === 0 ? 'no-date' : ''} ${props.soloErrorFields.mileage ? 'field-error' : ''}`}
        name="mileage"
        placeholder="0"
        value={props.mileage}
        onChange={props.onSoloReqDetailsChange}
      /> */}
      <Stack size={50} />
      {getVehicles(props)}
      <Stack size={50} />
      <Box dir="row" justify="between">
        <div className="doc-button hollow" onClick={props.addVehicle} role="button" tabIndex={0}>Add vehicle</div>
        {getAppropriateButton(props)}
      </Box>
    </Box>
  );
};


export default VehicleRequestForm;
