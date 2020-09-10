import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Stack, Queue, Divider, Box } from './layout';
import Field from './field';
import CoLeadersAutoComplete from './coLeadersAutoComplete';
import Toggle from './toggle';
import DOCLoading from './doc-loading';
import dropdownIcon from '../img/dropdown-toggle.svg';
import '../styles/createtrip-style.scss';

const BasicTripInfo = (props) => {
  return (
    <div className="create-trip-form-content">
      <div className="page-header">
        <div className="doc-h1">Basic trip information</div>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Trip name</div>
        <input className={`field field-full-width create-trip-form-bottom-margin ${props.errorFields.title ? 'field-error' : ''}`}
          onChange={props.onFieldChange}
          name="title"
          placeholder="e.g. Weekend Mt. Moosilauke Hike!"
          value={props.titleValue}
        />
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Subclub</div>
        <Dropdown onSelect={props.onClubChange}>
          <Dropdown.Toggle className="field create-trip-form-bottom-margin">
            <span className="field-dropdown-bootstrap">{props.selectedClub === null ? 'Select club' : props.selectedClub.name}</span>
            <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="field-dropdown-menu">
            {props.clubOptions.sort((a, b) => {
              if (a.name > b.name) return 1;
              else if (b.name > a.name) return -1;
              else return 0;
            }).map(club => (
              <Dropdown.Item eventKey={club._id} key={club._id}>{club.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Cost</div>
        <input className={`field create-trip-form-bottom-margin ${props.errorFields.cost ? 'field-error' : ''}`}
          onChange={props.onFieldChange}
          name="cost"
          type="number"
          value={props.costValue}
        />
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Invite co-leaders</div>
        {props.loaded
          ? <CoLeadersAutoComplete updateLeaderValue={props.updateLeaderValue} currentLeaders={props.leaderValue} name="leaders" />
          : <DOCLoading type="cubes" />
      }

      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Misc.</div>
        <Toggle id="co-leader-access" value={props.accessValue} onChange={props.toggleAccess} label="Give co-leaders edit access to this trip?" />
        <Toggle id="beginner" value={props.experienceValue} onChange={props.experienceOption} label="Do trippees need prior experience?" />
      </div>
      {/* <div className="page-sub-headers">
        <p>Tag as non-beginner trip</p>
        <div className="checkbox-beginner">
          <input
            type="checkbox"
            value="Yes"
            id="beginner"
            onChange={props.experienceOption}
            checked={props.experienceValue}
          />
          <label htmlFor="beginner">
            Select if trippees need prior experience to go on this trip
          </label>
        </div>
      </div> */}
    </div>

  );
};

const DatesLocation = (props) => {
  return (
    <div className="create-trip-form-content">
      <div className="page-header date-loc-header">
        <div className="doc-h1">Dates and Location</div>
      </div>
      <div className="page-sub-headers checkbox-beginner">
        <div className="doc-h2">Type</div>
        <Dropdown onSelect={props.onDateLengthChange}>
          <Dropdown.Toggle className="field create-trip-form-bottom-margin">
            <span className="field-dropdown-bootstrap">{props.dateLength}</span>
            <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="field-dropdown-menu">
            <Dropdown.Item eventKey="single">Single-day trip</Dropdown.Item>
            <Dropdown.Item eventKey="multi">Multi-day trip</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="trip-date-range-inputs">
        <div className="page-sub-headers">
          <div className="doc-h2">{props.dateLength === 'multi' ? 'Start' : 'Trip'} date</div>
          <input type="date" name="startDate" onChange={props.onDateChange} className={`field create-trip-form-bottom-margin leaders ${props.errorFields.startDate ? 'field-error' : ''}`} value={props.startDate} />
        </div>
        {props.dateLength === 'multi'
          ? (
            <div className="page-sub-headers">
              <div className="doc-h2">End date</div>
              <input type="date" name="endDate" onChange={props.onDateChange} className={`field create-trip-form-bottom-margin leaders ${props.errorFields.endDate ? 'field-error' : ''}`} value={props.endDate} />
            </div>
          )
          : null}
      </div>
      <Link to="/vehicle-calendar" className="calendar-link" target="_blank">View Vehicle Calendar</Link>
      <div className="trip-date-range-inputs">
        <div className="page-sub-headers">
          <div className="doc-h2">Start time</div>
          <input
            type="time"
            name="startTime"
            onChange={props.onFieldChange}
            className={`field create-trip-form-bottom-margin leaders pickupDropoff ${props.errorFields.startTime ? 'field-error' : ''}`}
            value={props.theStartTime}
          />
        </div>
        <div className="page-sub-headers">
          <div className="doc-h2">End time</div>
          <input
            type="time"
            name="endTime"
            onChange={props.onFieldChange}
            className={`field create-trip-form-bottom-margin leaders pickupDropoff ${props.errorFields.endTime ? 'field-error' : ''}`}
            value={props.theEndTime}
          />
        </div>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Location</div>
        <input
          className={`field create-trip-form-bottom-margin leaders ${props.errorFields.location ? 'field-error' : ''}`}
          name="location"
          onChange={props.onFieldChange}
          placeholder="e.g. Orford, NH - include town, state, and any trails"
          value={props.tripLocation}
        />
      </div>
    </div>
  );
};

const AboutTheTrip = (props) => {
  return (
    <div className="create-trip-form-content">
      <div className="page-header">
        <div className="doc-h1">About the trip</div>
      </div>
      <div className="trip-date-range-inputs">
        <div className="page-sub-headers">
          <div className="doc-h3">Pickup</div>
          <input
            className={`field create-trip-form-bottom-margin pickupDropoff ${props.errorFields.pickup ? 'field-error' : ''}`}
            onChange={props.onFieldChange}
            name="pickup"
            placeholder="e.g. Robinson Hall"
            value={props.pickUp}
          />
        </div>
        <div className="page-sub-headers">
          <div className="doc-h3">Dropoff</div>
          <input
            className={`field create-trip-form-bottom-margin pickupDropoff ${props.errorFields.dropoff ? 'field-error' : ''}`}
            onChange={props.onFieldChange}
            name="dropoff"
            placeholder="e.g. McNutt Hall"
            value={props.dropOff}
          />
        </div>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h3">Trip decription</div>
        <textarea
          className={`field field-full-width trip-descrip-box ${props.errorFields.description ? 'field-error' : ''}`}
          onChange={props.onFieldChange}
          name="description"
          placeholder="e.g. Our trip will feature amazing views and fun times..."
          value={props.DescripValue}
        />
      </div>
      <div className="page-sub-headers">
        <div className="doc-h3">Things you must include</div>
        <ul className="descrip-list">
          <li>What you&apos;ll be doing on the trip</li>
          <li>Short Introduction of Leaders for prospective Trippees</li>
          <li>Level of prior experience (if applicable) and what gear or clothing might be needed</li>
          <li>Rough itinerary - this is your trip plan on file, so please include route plan details like where the vehicle will be parked, main and alternate routes, in case of emergency. </li>
        </ul>
      </div>
    </div>
  );
};

const getTrippeeGear = (props) => {
  if (!props.trippeeGearStatus || props.trippeeGearStatus === 'pending' || props.trippeeGearStatus === 'N/A') {
    return props.trippeeGear.map((gearRequest, index) => {
      return (
        <div key={gearRequest._id}>
          <Box dir="row" align="start" className="gear-container">
            <div className="gear-and-size">
              <input
                type="text"
                className={`field ${gearRequest.hasError ? 'field-error' : ''}`}
                name="trippeeGear"
                placeholder="Item name"
                onChange={event => props.onTrippeeGearChange(event, index)}
                value={gearRequest.name}
              />
              <Dropdown onSelect={eventKey => props.onSizeTypeChange(eventKey, index)}>
                <Dropdown.Toggle className="field field-full-width">
                  <span className="field-dropdown-bootstrap">{gearRequest.size_type === 'N/A' ? 'No measurement' : gearRequest.size_type}</span>
                  <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="field-dropdown-menu">
                  <Dropdown.Item eventKey="N/A">No measurement</Dropdown.Item>
                  <Dropdown.Item eventKey="Clothe">Measured by clothing size</Dropdown.Item>
                  <Dropdown.Item eventKey="Shoe">Measured by shoe size</Dropdown.Item>
                  <Dropdown.Item eventKey="Height">Measured by height</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <i className="material-icons close-button remove-gear-button" onClick={() => props.removeTrippeeGear(index)} role="button" tabIndex={0}>close</i>
          </Box>
          <hr className="line" />
        </div>
      );
    });
  } else {
    return (
      <div className="no-gear">
        <div className="trip-detail">
          <div className="no-on-trip">
            <h4 className="none-f-now">You can&apos;t edit requests after they&apos;ve been reviewed</h4>
          </div>
        </div>
      </div>
    );
  }
};

const getGearInputs = (props) => {
  if (!props.gearStatus || props.gearStatus === 'pending' || props.gearStatus === 'N/A') {
    return props.gearRequests.map((gearRequest, index) => {
      return (
        <div key={gearRequest._id}>
          <Box dir="row" align="center" className="gear-container">
            <input
              type="text"
              className={`field ${gearRequest.hasError ? 'field-error' : ''}`}
              name="opogearRequest"
              placeholder="Item name"
              onChange={event => props.onGearChangeName(event, index)}
              value={gearRequest.groupGearName}
            />
            <Queue size={15} />
            <Field
              type="number"
              // className={`field ${gearRequest.hasError ? 'field-error' : ''}`}
              name="opogearRequestQuantity"
              placeholder="Qty."
              onChange={event => props.onGearChangeQuantity(event, index)}
              value={gearRequest.groupGearQuantity}
              width={100}
              error={gearRequest.hasError}
            />
            <i className="material-icons close-button remove-gear-button" onClick={() => props.removeGear(index)} role="button" tabIndex={0}>close</i>
          </Box>
          <hr className="line" />
        </div>
      );
    });
  } else {
    return (
      <div className="no-gear">
        <div className="trip-detail">
          <div className="no-on-trip">
            <h4 className="none-f-now">You can&apos;t edit requests after they&apos;ve been reviewed</h4>
          </div>
        </div>
      </div>
    );
  }
};

const Equipment = (props) => {
  return (
    <div className="create-trip-form-content">
      <div className="page-header">
        <div className="doc-h1">Equipment</div>
      </div>
      <div className="trip-date-range-inputs">
        <div className="page-sub-headers">
          <div className="doc-h2">Individual gear</div>
          <div className="p1">Gear trippees should bring/rent</div>
          {getTrippeeGear(props)}
          {(!props.trippeeGearStatus || props.trippeeGearStatus === 'pending' || props.trippeeGearStatus === 'N/A')
            ? <div className="doc-button hollow" onClick={props.addTrippeeGear} role="button" tabIndex={0}>Add item</div>
            : null}
        </div>
        <div className="page-sub-headers">
          <div className="doc-h2">Group Gear</div>
          <div className="p1">Gear for the entire group that needs to be rented</div>
          {getGearInputs(props)}
          {(!props.gearStatus || props.gearStatus === 'pending' || props.gearStatus === 'N/A')
            ? <div className="doc-button hollow" onClick={props.addGear} role="button" tabIndex={0}>Add item</div>
            : null}
        </div>
      </div>
    </div>
  );
};

export {
  BasicTripInfo,
  Equipment,
  AboutTheTrip,
  DatesLocation,
};
