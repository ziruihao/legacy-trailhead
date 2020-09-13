import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Stack, Queue, Divider, Box } from '../../layout';
import Field from '../../field';
import Toggle from '../../toggle';
import Text from '../../text';
import dropdownIcon from '../../../img/dropdown-toggle.svg';
import './vehicle-request-form.scss';
import '../../../styles/vehicleRequestForm-style.scss';

const getApprpriateVehicleMenu = (userCertifications) => {
  let microbusVan;
  switch (userCertifications.driverCert) {
    case 'MICROBUS':
      microbusVan = (
        <>
          <Dropdown.Item eventKey='Microbus'>Microbus</Dropdown.Item>
          <Dropdown.Item eventKey='Van'>Van</Dropdown.Item>
          <Dropdown.Item eventKey='Truck'>Truck</Dropdown.Item>
        </>
      );
      break;
    case 'VAN':
      microbusVan = (
        <>
          <Dropdown.Item eventKey='Van'>Van</Dropdown.Item>
          <Dropdown.Item eventKey='Truck'>Truck</Dropdown.Item>
        </>
      );
      break;
    default:
      microbusVan = null;
  }

  if (userCertifications.driverCert === null && !userCertifications.trailerCert) {
    microbusVan = <Dropdown.Item eventKey=''>Request access in profile page</Dropdown.Item>;
  }
  return microbusVan;
};

const getVehicles = (props) => {
  return props.vehicles.map((vehicle, index) => {
    const { vehicleType } = vehicle;
    const singleDayClass = vehicle.tripLength === 'single-day-trip' ? 'vrf-single-day-date' : '';
    return (
      <Box dir='col' key={vehicle._id}>
        <Divider size={1} />
        <Stack size={50} />
        <Box dir='row' justify='between' align='center'>
          <Text type='h1'>Vehicle #{index + 1}</Text>
          <i className='material-icons close-button' onClick={event => props.removeVehicle(event, index)} role='button' tabIndex={0}>close</i>
        </Box>
        <Stack size={50} />
        <Text type='h2' htmlFor='vehicle_type'>Vehicle type</Text>
        <Stack size={25} />
        <Dropdown onSelect={eventKey => props.onVehicleTypeChange(eventKey, index)}>
          <Dropdown.Toggle className={`field ${vehicle.errorFields.vehicleType ? 'field-error' : ''}`}>
            <span>
              <span className='selected-size'>{vehicleType.length === 0 ? 'Select a vehicle' : vehicleType}</span>
              <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            {getApprpriateVehicleMenu(props.userCertifications)}
          </Dropdown.Menu>
        </Dropdown>
        <Stack size={25} />
        <Text type='h2' htmlFor={`vehicle_details_${index}`}>Vehicle notes</Text>
        <Stack size={25} />
        <Field
          id={`vehicle_details_${index}`}
          placeholder='e.g. I need Stakey!'
          width={600}
          name='vehicleDetails'
          value={vehicle.vehicleDetails}
          onChange={event => props.onVehicleDetailChange(event, index)}
        />
        <Stack size={25} />
        <Dropdown onSelect={eventKey => props.onVehicleDetailChange(eventKey, index)}>
          <Dropdown.Toggle className='field'>
            <span className='field-dropdown-bootstrap'>{vehicle.tripLength === 'single-day-trip' ? 'Single-day trip' : 'Multi-day trip'}</span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='single-day-trip'>Single-day trip</Dropdown.Item>
            <Dropdown.Item eventKey='multi-day-trip'>Multi-day trip</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* <div className='vrf-radio-row'>
          <label className='checkbox-container' htmlFor={`single-day-trip-${index}`}>
            <input
              type='radio'
              name={`tripLength[${index}]`}
              id={`single-day-trip-${index}`}
              value='single-day-trip'
              checked={vehicle.tripLength === 'single-day-trip'}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <span className='radio-button' />
          </label>
          <span className='vrf-label vrf-trip-length'>Single-day trip</span>
        </div>
        <div className='vrf-radio-row'>
          <label className='checkbox-container' htmlFor={`multi-day-trip-${index}`}>
            <input
              type='radio'
              name={`tripLength[${index}]`}
              id={`multi-day-trip-${index}`}
              value='multi-day-trip'
              checked={vehicle.tripLength === 'multi-day-trip'}
              onChange={event => props.onVehicleDetailChange(event, index)}
            />
            <span className='radio-button' />
          </label>
          <span className='vrf-label vrf-trip-length'>Multi-day trip</span>
        </div> */}
        <Stack size={25} />
        <Box dir='row' justify='between' width={800}>
          <Box dir='col'>
            <Text type='h2'>Pickup date</Text>
            <Stack size={25} />
            <Field
              type='date'
              id={`pickup_date_${index}`}
              name='pickupDate'
              value={vehicle.pickupDate}
              onChange={event => props.onVehicleDetailChange(event, index)}
              error={vehicle.errorFields.pickupDate}
            />
          </Box>
          {vehicle.tripLength === 'single-day-trip' ? null
            : (
              <Box dir='col'>
                <Text type='h2'>Return date</Text>
                <Stack size={25} />
                <Field
                  type='date'
                  id={`return_date_${index}`}
                  name='returnDate'
                  value={vehicle.returnDate}
                  onChange={event => props.onVehicleDetailChange(event, index)}
                  error={vehicle.errorFields.returnDate}
                />
              </Box>
            )
          }
        </Box>
        <Stack size={25} />
        <Box dir='row' justify='between' width={800}>
          <Box dir='col'>
            <Text type='h2'>Pickup time</Text>
            <Stack size={25} />
            <Field
              type='time'
              id={`pickup_time_${index}`}
              name='pickupTime'
              value={vehicle.pickupTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
              error={vehicle.errorFields.pickupTime}
            />
          </Box>
          <Box dir='col'>
            <Text type='h2'>Return time</Text>
            <Stack size={25} />
            <Field
              type='time'
              id={`return_time_${index}`}
              name='returnTime'
              value={vehicle.returnTime}
              onChange={event => props.onVehicleDetailChange(event, index)}
              error={vehicle.errorFields.returnDate}
            />
          </Box>
        </Box>
        <Stack size={25} />
        <Text type='h2'>Misc.</Text>
        <Stack size={25} />
        <Box dir='col' align='start'>
          <Toggle id={`wmnf-pass-${index}`} name='passNeeded' value={vehicle.passNeeded} onChange={(event) => { props.onVehicleDetailChange(event, index); }} label='Need WMNF pass?' />
          <Stack size={25} />
          {props.userCertifications.trailerCert
            ? (
              <Toggle id={`trailer-hitch-${index}`} name='trailerNeeded' value={vehicle.trailerNeeded} onChange={(event) => { props.onVehicleDetailChange(event, index); }} label='Need trailer hitch?' />
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
    return <div className='doc-button' onClick={props.nextTripPage} role='button' tabIndex={0}>Link request to trip</div>;
  } else if (props.requestType === 'SOLO') {
    if (props.asUpdate) {
      return (
        <Box dir='row'>
          <div className='doc-button hollow alarm' onClick={props.cancelUpdate} role='button' tabIndex={0}>Cancel update</div>
          <Queue size={15} />
          <div className='doc-button' onClick={props.update} role='button' tabIndex={0}>Update</div>
        </Box>
      );
    } else {
      return <div className='doc-button' onClick={props.submit} role='button' tabIndex={0}>Submit</div>;
    }
  } else {
    return null;
  }
};

const VehicleRequestForm = (props) => {
  return (
    <Box dir='col' pad={75} className='doc-card'>
      <Text type='h1'>Vehicle request form</Text>
      <Stack size={50} />
      {props.requestType === 'SOLO'
        ? (
          <Box dir='col'>
            <Text type='h2' htmlFor='request_detail'>Request details</Text>
            <Stack size={25} />
            <textarea
              value={props.requestDetails}
              onChange={props.onSoloReqDetailsChange}
              name='requestDetails'
              id='request_details'
              className={`field trip-detail vrf-req-details-input ${props.soloErrorFields.requestDetails ? 'field-error' : ''}`}
              placeholder='e.g. I need a car to deliver wood to Cabin A'
            />
            <Stack size={25} />
            <Text type='h2' htmlFor='noOfPeople'>Number of people</Text>
            <Stack size={25} />
            <Field
              width={100}
              type='number'
              id='noOfPeople'
              name='noOfPeople'
              placeholder='0'
              value={props.noOfPeople}
              onChange={props.onSoloReqDetailsChange}
              error={props.soloErrorFields.noOfPeople}
            />
          </Box>
        )
        : null}
      <Stack size={25} />
      <Text type='h2' htmlFor='mileage'>Estimated mileage</Text>
      <Stack size={25} />
      <Field
        width={100}
        type='number'
        id='mileage'
        name='mileage'
        placeholder='0'
        value={props.mileage}
        onChange={props.onSoloReqDetailsChange}
        error={props.soloErrorFields.mileage}
      />
      <Stack size={50} />
      {getVehicles(props)}
      <Stack size={50} />
      <Box dir='row' justify='between'>
        <div className='doc-button hollow' onClick={props.addVehicle} role='button' tabIndex={0}>Add vehicle</div>
        {getAppropriateButton(props)}
      </Box>
    </Box>
  );
};


export default VehicleRequestForm;
