import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import CoLeadersAutoComplete from './coLeadersAutoComplete';
import Toggle from './toggle';
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
        <input className={`field field-full-width create-trip-form-bottom-margin ${props.errorFields.title ? 'create-trip-error' : ''}`}
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
            {props.clubOptions.map(club => (
              <Dropdown.Item eventKey={club._id} key={club._id}>{club.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Cost</div>
        <input className={`field create-trip-form-bottom-margin ${props.errorFields.cost ? 'create-trip-error' : ''}`}
          onChange={props.onFieldChange}
          name="cost"
          placeholder="0"
          type="number"
          value={props.costValue}
        />
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Invite co-leaders</div>
        <CoLeadersAutoComplete updateLeaderValue={props.updateLeaderValue} name="leaders" />
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
          <input type="date" name="startDate" onChange={props.onDateChange} className={`field create-trip-form-bottom-margin leaders ${props.errorFields.startDate ? 'create-trip-error' : ''}`} value={props.startDate} />
        </div>
        {props.dateLength === 'multi'
          ? (
            <div className="page-sub-headers">
              <div className="doc-h2">End date</div>
              <input type="date" name="endDate" onChange={props.onDateChange} className={`field create-trip-form-bottom-margin leaders ${props.errorFields.endDate ? 'create-trip-error' : ''}`} value={props.endDate} />
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
            className={`field create-trip-form-bottom-margin leaders pickupDropoff ${props.errorFields.startTime ? 'create-trip-error' : ''}`}
            value={props.theStartTime}
          />
        </div>
        <div className="page-sub-headers">
          <div className="doc-h2">End time</div>
          <input
            type="time"
            name="endTime"
            onChange={props.onFieldChange}
            className={`field create-trip-form-bottom-margin leaders pickupDropoff ${props.errorFields.endTime ? 'create-trip-error' : ''}`}
            value={props.theEndTime}
          />
        </div>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h2">Location</div>
        <input
          className={`field create-trip-form-bottom-margin leaders ${props.errorFields.location ? 'create-trip-error' : ''}`}
          name="location"
          onChange={props.onFieldChange}
          placeholder="e.g. Mt. Cube"
          value={props.tripLocation}
        />
      </div>
      <div className="page-sub-headers trip-date-header">
        <div className="doc-h2">Estimated mileage (round trip)</div>
        <input
          type="number"
          onChange={props.onFieldChange}
          name="mileage"
          placeholder="Estimated mileage"
          className={`field create-trip-form-bottom-margin leaders ${props.errorFields.mileage ? 'create-trip-error' : ''}`}
          value={props.tripMileage}
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
            className={`field create-trip-form-bottom-margin pickupDropoff ${props.errorFields.pickup ? 'create-trip-error' : ''}`}
            onChange={props.onFieldChange}
            name="pickup"
            placeholder="eg. Robo Hall"
            value={props.pickUp}
          />
        </div>
        <div className="page-sub-headers">
          <div className="doc-h3">Dropoff</div>
          <input
            className={`field create-trip-form-bottom-margin pickupDropoff ${props.errorFields.dropoff ? 'create-trip-error' : ''}`}
            onChange={props.onFieldChange}
            name="dropoff"
            placeholder="eg. McNutt Hall"
            value={props.dropOff}
          />
        </div>
      </div>
      <div className="page-sub-headers">
        <div className="doc-h3">Trip decription</div>
        <textarea
          className={`field field-full-width trip-descrip-box ${props.errorFields.description ? 'create-trip-error' : ''}`}
          onChange={props.onFieldChange}
          name="description"
          placeholder="e.g. Our trip will feature amazing views and fun times..."
          value={props.DescripValue}
        />
      </div>
      <div className="page-sub-headers">
        <div className="doc-h3">Things you can include</div>
        <ul className="descrip-list">
          <li>What you&apos;ll be doing on the trip</li>
          <li>Prior experience that would be helpful (if applicable)</li>
          <li>Rough iternary of events and activities</li>
          <li>Short introduction of leaders</li>
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
          <div className="gear-container">
            <div className="gear-and-size">
              <input
                type="text"
                className={`field ${gearRequest.hasError ? 'create-trip-error' : ''}`}
                name="trippeeGear"
                placeholder="Item name"
                onChange={event => props.onTrippeeGearChange(event, index)}
                value={gearRequest.name}
              />
              <Dropdown onSelect={eventKey => props.onSizeTypeChange(eventKey, index)}>
                <Dropdown.Toggle className="field field-full-width">
                  <span className="field-dropdown-bootstrap">{gearRequest.size_type}</span>
                  <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="field-dropdown-menu">
                  <Dropdown.Item eventKey="N/A">N/A</Dropdown.Item>
                  <Dropdown.Item eventKey="Clothe">Measured by clothing size</Dropdown.Item>
                  <Dropdown.Item eventKey="Shoe">Measured by shoe size</Dropdown.Item>
                  <Dropdown.Item eventKey="Height">Measured by height</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <i className="material-icons close-button remove-gear-button" onClick={() => props.removeTrippeeGear(index)} role="button" tabIndex={0}>close</i>
          </div>
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
          <div className="gear-container">
            <input
              type="text"
              className={`field ${gearRequest.hasError ? 'create-trip-error' : ''}`}
              name="opogearRequest"
              placeholder="Item name"
              onChange={event => props.onGearChange(event, index)}
              value={gearRequest.groupGear}
            />
            <i className="material-icons close-button remove-gear-button" onClick={() => props.removeGear(index)} role="button" tabIndex={0}>close</i>
          </div>
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
