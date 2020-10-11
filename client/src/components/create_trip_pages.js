import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Stack, Queue, Divider, Box } from './layout';
import Field from './field';
import Text from './text';
import utils from '../utils';
import Select from './select/select';
import Toggle from './toggle';
import DOCLoading from './doc-loading';
import dropdownIcon from '../img/dropdown-toggle.svg';
import '../styles/createtrip-style.scss';

const BasicTripInfo = (props) => {
  return (
    <Box dir='col' className='create-trip-form-content'>
      <Text type='h1'>Basic trip information</Text>
      <Stack size={50} />
      <div className='page-sub-headers'>
        <Text type='h2'>Trip name</Text>
        <input className={`field field-full-width create-trip-form-bottom-margin ${props.errorFields.title ? 'field-error' : ''}`}
          onChange={props.onFieldChange}
          name='title'
          placeholder='e.g. Weekend Mt. Moosilauke Hike!'
          value={props.titleValue}
        />
      </div>
      <div className='page-sub-headers'>
        <Text type='h2'>Subclub</Text>
        <Dropdown onSelect={props.onClubChange}>
          <Dropdown.Toggle className='field create-trip-form-bottom-margin'>
            <span className='field-dropdown-bootstrap'>{props.selectedClub === null ? 'Select club' : props.selectedClub.name}</span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            {props.clubOptions.filter(club => club.active).sort((a, b) => {
              if (a.name > b.name) return 1;
              else if (b.name > a.name) return -1;
              else return 0;
            }).map(club => (
              <Dropdown.Item eventKey={club._id} key={club._id}>{club.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Text type='h2'>Cost per person</Text>
      <Stack size={25} />
      <Box dir='row' align='center'>
        <div className='doc-h3'>$</div>
        <Queue size={10} />
        <Field
          onChange={props.onFieldChange}
          name='cost'
          type='number'
          value={props.costValue}
          error={props.errorFields.cost}
          placeholder='USD'
        />
      </Box>
      <Stack size={50} />
      <div className='page-sub-headers'>
        <Text type='h2'>Invite co-leaders</Text>
        {props.loaded
          ? <Select updateLeaderValue={props.updateLeaderValue} currentLeaders={props.leaderValue} name='leaders' placeholder='Enter email(s)' />
          : <DOCLoading type='cubes' />
      }

      </div>
      <div className='page-sub-headers'>
        <Text type='h2'>Misc.</Text>
        <Toggle id='co-leader-access' value={props.accessValue} onChange={props.toggleAccess} label='Give co-leaders edit access to this trip?' />
        <Toggle id='beginner' value={props.experienceValue} onChange={props.experienceOption} label='Do trippees need prior experience?' />
        <Toggle id='private' value={props.privateValue} onChange={props.togglePrivate} label='Is this a private trip? (check this if this is just a gear request)' />
      </div>
    </Box>

  );
};

const DatesLocation = (props) => {
  return (
    <Box dir='col' className='create-trip-form-content'>
      <Text type='h1'>Dates and Location</Text>
      <Stack size={50} />
      <Text type='h2'>Type</Text>
      <Stack size={25} />
      <Box dir='row' align='center'>
        <Dropdown onSelect={props.onDateLengthChange}>
          <Dropdown.Toggle className='field'>
            <span className='field-dropdown-bootstrap'>{props.dateLength === 'single' ? 'Single-day trip' : 'Multi-day trip'}</span>
            <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
          </Dropdown.Toggle>
          <Dropdown.Menu className='field-dropdown-menu'>
            <Dropdown.Item eventKey='single'>Single-day trip</Dropdown.Item>
            <Dropdown.Item eventKey='multi'>Multi-day trip</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Queue size={50} />
        <Text type='overline'>Your local timezone: {utils.dates.timezone()}</Text>
      </Box>
      <Stack size={25} />
      <div className='trip-date-range-inputs'>
        <div className='page-sub-headers'>
          <Text type='h2'>{props.dateLength === 'multi' ? 'Start' : 'Trip'} date</Text>
          <input type='date' name='startDate' onChange={props.onDateChange} className={`field create-trip-form-bottom-margin leaders ${props.errorFields.startDate ? 'field-error' : ''}`} value={props.startDate} placeholder='yyyy-mm-dd' />
        </div>
        {props.dateLength === 'multi'
          ? (
            <div className='page-sub-headers'>
              <Text type='h2'>End date</Text>
              <input type='date' name='endDate' onChange={props.onDateChange} className={`field create-trip-form-bottom-margin leaders ${props.errorFields.endDate ? 'field-error' : ''}`} value={props.endDate} placeholder='yyyy-mm-dd' />
            </div>
          )
          : null}
      </div>
      <Link to='/vehicle-calendar' className='calendar-link' target='_blank'>View Vehicle Calendar</Link>
      <div className='trip-date-range-inputs'>
        <div className='page-sub-headers'>
          <Text type='h2'>Start time</Text>
          <input
            type='time'
            name='startTime'
            onChange={props.onFieldChange}
            className={`field create-trip-form-bottom-margin leaders pickupDropoff ${props.errorFields.startTime ? 'field-error' : ''}`}
            value={props.theStartTime}
            placeholder='hh:mm'
          />
        </div>
        <div className='page-sub-headers'>
          <Text type='h2'>End time</Text>
          <input
            type='time'
            name='endTime'
            onChange={props.onFieldChange}
            className={`field create-trip-form-bottom-margin leaders pickupDropoff ${props.errorFields.endTime ? 'field-error' : ''}`}
            value={props.theEndTime}
            placeholder='hh:mm'
          />
        </div>
      </div>
      <Text type='h2'>Location</Text>
      <Stack size={25} />
      <Field
        name='location'
        className='field'
        width='100%'
        type='text'
        value={props.tripLocation}
        onChange={props.onFieldChange}
        placeholder='e.g. Orford, NH - include town, state, and any trails'
        error={props.errorFields.location}
      />
    </Box>
  );
};

const AboutTheTrip = (props) => {
  return (
    <Box dir='col' className='create-trip-form-content'>
      <Text type='h1'>About the trip</Text>
      <Stack size={50} />
      <Box dir='row' justify='between'>
        <Box dir='col' expand>
          <Text type='h3'>Pickup</Text>
          <Stack size={25} />
          <Field
            onChange={props.onFieldChange}
            name='pickup'
            placeholder='e.g. Robinson Hall'
            value={props.pickUp}
            error={props.errorFields.pickup}
          />

        </Box>
        <Queue size={50} />
        <Box dir='col' expand>
          <Text type='h3'>Dropoff</Text>
          <Stack size={25} />
          <Field
            onChange={props.onFieldChange}
            name='dropoff'
            placeholder='e.g. McNutt Hall'
            value={props.dropOff}
            error={props.errorFields.dropoff}
          />
        </Box>
      </Box>
      <Stack size={25} />
      <Text type='h3'>Trip description</Text>
      <Stack size={25} />
      <textarea
        className={`field description-box ${props.errorFields.description ? 'field-error' : ''}`}
        onChange={props.onFieldChange}
        name='description'
        placeholder='e.g. Our trip will feature amazing views and fun times...'
        value={props.DescripValue}
        error={props.errorFields.description}
        height={200}
      />
      <Stack size={25} />
      <Text type='p1'>Things you must include:</Text>
      <Stack size={10} />
      <ul>
        <li><Text type='p2'>What you&apos;ll be doing on the trip</Text></li>
        <Stack size={10} />
        <li><Text type='p2'>Short Introduction of Leaders for prospective Trippees</Text></li>
        <Stack size={10} />
        <li><Text type='p2'>Level of prior experience (if applicable) and what gear or clothing might be needed</Text></li>
        <Stack size={10} />
        <li><Text type='p2'>Rough itinerary - this is your trip plan on file, so please include route plan details like where the vehicle will be parked, main and alternate routes, in case of emergency.</Text></li>
      </ul>
    </Box>
  );
};

const getTrippeeGear = (props) => {
  if (!props.trippeeGearStatus || props.trippeeGearStatus === 'pending' || props.trippeeGearStatus === 'N/A') {
    return props.trippeeGear.map((gearRequest, index) => {
      return (
        <div key={gearRequest._id}>
          <Box dir='row' align='start' className='gear-container'>
            <div className='gear-and-size'>
              <input
                type='text'
                className={`field ${gearRequest.hasError ? 'field-error' : ''}`}
                name='trippeeGear'
                placeholder='Item name'
                onChange={event => props.onTrippeeGearChange(event, index)}
                value={gearRequest.name}
              />
              <Dropdown onSelect={eventKey => props.onSizeTypeChange(eventKey, index)}>
                <Dropdown.Toggle className='field field-full-width'>
                  <span className='field-dropdown-bootstrap'>{gearRequest.sizeType === 'N/A' ? 'No measurement' : gearRequest.sizeType}</span>
                  <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
                </Dropdown.Toggle>
                <Dropdown.Menu className='field-dropdown-menu'>
                  <Dropdown.Item eventKey='N/A'>No measurement</Dropdown.Item>
                  <Dropdown.Item eventKey='Clothe'>Measured by clothing size</Dropdown.Item>
                  <Dropdown.Item eventKey='Shoe'>Measured by shoe size</Dropdown.Item>
                  <Dropdown.Item eventKey='Height'>Measured by height</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <i className='material-icons close-button remove-gear-button' onClick={() => props.removeTrippeeGear(index)} role='button' tabIndex={0}>close</i>
          </Box>
          <hr className='line' />
        </div>
      );
    });
  } else {
    return (
      <Box dir='row' justify='center' align='center'>
        <div className='p1 gray thin'>You can&apos;t edit requests after they&apos;ve been reviewed</div>
      </Box>
    );
  }
};

const getGearInputs = (props) => {
  if (!props.gearStatus || props.gearStatus === 'pending' || props.gearStatus === 'N/A') {
    return props.gearRequests.map((gearRequest, index) => {
      return (
        <div key={gearRequest._id}>
          <Box dir='row' align='center' className='gear-container'>
            <Field
              type='text'
              name='opogearRequest'
              value={gearRequest.name}
              onChange={event => props.onGearChangeName(event, index)}
              placeholder='Item name'
              error={gearRequest.hasError}
            />
            <Queue size={15} />
            <Field
              type='number'
              name='opogearRequestQuantity'
              value={gearRequest.quantity}
              onChange={event => props.onGearChangeQuantity(event, index)}
              placeholder='Qty.'
              error={gearRequest.hasError}
              width={100}
            />
            <i className='material-icons close-button remove-gear-button' onClick={() => props.removeGear(index)} role='button' tabIndex={0}>close</i>
          </Box>
          <hr className='line' />
        </div>
      );
    });
  } else {
    return (
      <Box dir='row' justify='center' align='center'>
        <div className='p1 gray thin'>You can&apos;t edit requests after they&apos;ve been reviewed</div>
      </Box>
    );
  }
};

const Equipment = (props) => {
  return (
    <Box dir='col' className='create-trip-form-content'>
      <Text type='h1'>Equipment</Text>
      <Stack size={50} />
      <div className='trip-date-range-inputs'>
        <div className='page-sub-headers'>
          <Text type='h2'>Individual gear</Text>
          <div className='p1'>Gear trippees should bring/rent</div>
          {getTrippeeGear(props)}
          {(!props.trippeeGearStatus || props.trippeeGearStatus === 'pending' || props.trippeeGearStatus === 'N/A')
            ? <div className='doc-button hollow' onClick={props.addTrippeeGear} role='button' tabIndex={0}>Add item</div>
            : null}
        </div>
        <div className='page-sub-headers'>
          <Text type='h2'>Group Gear</Text>
          <div className='p1'>Gear for the entire group that needs to be rented</div>
          {getGearInputs(props)}
          {(!props.gearStatus || props.gearStatus === 'pending' || props.gearStatus === 'N/A')
            ? <div className='doc-button hollow' onClick={props.addGear} role='button' tabIndex={0}>Add item</div>
            : null}
        </div>
      </div>
    </Box>
  );
};

export {
  BasicTripInfo,
  Equipment,
  AboutTheTrip,
  DatesLocation,
};
