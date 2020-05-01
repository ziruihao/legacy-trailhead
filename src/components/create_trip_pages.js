import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import dropdownIcon from '../img/dropdown-toggle.svg';
import '../styles/createtrip-style.scss';


const LeftColumn = (props) => {
  return (
    <div className="ovr-sidebar">
      <div className="row column-headers column-adjust">
        <p>Create a trip</p>
      </div>
      <div className="row column-sub-headers">
        <div className={props.currentStep === 1 ? 'side-bar-highlight' : ''} />
        <p className={props.currentStep === 1 ? 'text-highlight' : ''}>Basic information</p>
      </div>
      <div className="row column-sub-headers">
        <div className={props.currentStep === 2 ? 'side-bar-highlight' : ''} />
        <p className={props.currentStep === 2 ? 'text-highlight' : ''}>Dates and location</p>
      </div>
      <div className="row column-headers">
        <p>Trips description</p>
      </div>
      <div className="row column-sub-headers">
        <div className={props.currentStep === 3 ? 'side-bar-highlight' : ''} />
        <p className={props.currentStep === 3 ? 'text-highlight' : ''}>About the trip</p>
      </div>
      <div className="row column-sub-headers">
        <div className={props.currentStep === 4 ? 'side-bar-highlight' : ''} />
        <p className={props.currentStep === 4 ? 'text-highlight' : ''}>What you&apos;ll need</p>
      </div>
      <div className="row column-headers">
        <p>Additional details</p>
      </div>
      <div className="row column-sub-headers">
        <p className={props.currentStep === 5 ? 'text-highlight' : ''}>Vehicle Request</p>
      </div>
      <div className="row column-sub-headers">
        <p className={props.currentStep === 6 ? 'text-highlight' : ''}>P-Card Request</p>
      </div>
    </div>
  );
};

const BasicTripInfo = (props) => {
  console.log(props.clubOptions);
  return (
    <div className="create-trip-form-content">
      <div className="row page-header">
        <p>Basic trip information</p>
      </div>
      <div className="row page-sub-headers">
        <p>Trip name</p>
        <input className={`field top-create-trip ${props.errorFields.title ? 'create-trip-error' : ''}`}
          onChange={props.onFieldChange}
          name="title"
          placeholder="e.g. Weekend Mt. Moosilauke Hike!"
          value={props.titleValue}
        />
      </div>
      <div className="row page-sub-headers">
        <p>Subclub</p>
        {props.clubOptions.length > 0
          ? (
            <select name="club" className="field select top-create-trip" defaultValue="Select Club" onChange={props.onClubChange}>
              {props.clubOptions}
            </select>
          )
          : (
            <select name="club" className="field select top-create-trip" defaultValue="You are not a leader in any club." onChange={props.onClubChange}>
              {props.clubOptions}
            </select>
          )
      }

      </div>
      <div className="row page-sub-headers">
        <p>Cost</p>
        <input className={`field top-create-trip ${props.errorFields.cost ? 'create-trip-error' : ''}`}
          onChange={props.onFieldChange}
          name="cost"
          placeholder="0"
          type="number"
          value={props.costValue}
        />
      </div>
      <div className="row page-sub-headers">
        <p>Co-leader email addresses, seperated by commas</p>
        <input
          className="field top-create-trip leaders"
          onChange={props.onFieldChange}
          name="leaders"
          placeholder="my.buddy.21@dartmouth.edu, my.driver.21@dartmouth.edu"
          value={props.leaderValue}
        />
        <div className="checkbox-beginner">
          <input
            type="checkbox"
            name="access"
            id="co-leader-access"
            onChange={props.toggleAccess}
            checked={props.accessValue}
          />
          <label htmlFor="co-leader-access">
            Give co-leaders edit access to this trip?
          </label>
        </div>
      </div>
      <div className="row page-sub-headers">
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
      </div>
    </div>

  );
};

const DatesLocation = (props) => {
  return (
    <div className="create-trip-form-content">
      <div className="row page-header date-loc-header">
        <p>Dates and Location</p>
      </div>
      <div className="row checkbox-beginner">
        <input
          type="checkbox"
          value="single"
          id="single-day"
          onChange={props.onDateChange}
          checked={props.dateLength === 'single'}
        />
        <label htmlFor="single-day">
          Single day trip
        </label>
      </div>
      <div className="row checkbox-beginner">
        <input
          type="checkbox"
          value="multi"
          id="multi-day"
          onChange={props.onDateChange}
          checked={props.dateLength === 'multi'}
        />
        <label htmlFor="multi-day">
          Multi-day trip
        </label>
      </div>
      {props.dateOptions}
      <Link to="/vehicle-calendar" className="calendar-link" target="_blank">View Vehicle Calendar</Link>
      <div className="row page-sub-headers trip-date-header create-trip-bottom-buttons">
        <div className="createtrips-one-of-two">
          <p>Start time</p>
          <input
            type="time"
            name="startTime"
            onChange={props.onFieldChange}
            className={`field top-create-trip leaders pickupDropoff ${props.errorFields.startTime ? 'create-trip-error' : ''}`}
            value={props.theStartTime}
          />
        </div>
        <div className="createtrips-one-of-two">
          <p>End time</p>
          <input
            type="time"
            name="endTime"
            onChange={props.onFieldChange}
            className={`field top-create-trip leaders pickupDropoff ${props.errorFields.endTime ? 'create-trip-error' : ''}`}
            value={props.theEndTime}
          />
        </div>
      </div>
      <div className="row page-sub-headers">
        <p>Location</p>
        <input
          className={`field top-create-trip leaders ${props.errorFields.location ? 'create-trip-error' : ''}`}
          name="location"
          onChange={props.onFieldChange}
          placeholder="e.g. Mt. Cube"
          value={props.tripLocation}
        />
      </div>
      <div className="row page-sub-headers trip-date-header">
        <p>Estimated mileage (round trip)</p>
        <input
          type="number"
          onChange={props.onFieldChange}
          name="mileage"
          placeholder="Estimated mileage"
          className={`field top-create-trip leaders ${props.errorFields.mileage ? 'create-trip-error' : ''}`}
          value={props.tripMileage}
        />
      </div>
    </div>
  );
};

const AboutTheTrip = (props) => {
  return (
    <div className="create-trip-form-content">
      <div className="row page-header">
        <p>About the trip</p>
      </div>
      <div id="date-picker" className="row page-sub-headers create-trip-bottom-buttons">
        <div className="createtrips-one-of-two">
          <p>Pickup</p>
          <input
            className={`field top-create-trip pickupDropoff ${props.errorFields.pickup ? 'create-trip-error' : ''}`}
            onChange={props.onFieldChange}
            name="pickup"
            placeholder="eg. Robo Hall"
            value={props.pickUp}
          />
        </div>
        <div className="createtrips-one-of-two">
          <p>Dropoff</p>
          <input
            className={`field top-create-trip pickupDropoff ${props.errorFields.dropoff ? 'create-trip-error' : ''}`}
            onChange={props.onFieldChange}
            name="dropoff"
            placeholder="eg. McNutt Hall"
            value={props.dropOff}
          />
        </div>
      </div>
      <div className="row page-sub-headers">
        <p>Trip decription</p>
        <textarea
          className={`field trip-descrip-box ${props.errorFields.description ? 'create-trip-error' : ''}`}
          onChange={props.onFieldChange}
          name="description"
          placeholder="e.g. Our trip will feature amazing views and fun times..."
          value={props.DescripValue}
        />
      </div>
      <div className="row page-sub-headers">
        <p>Things you can include</p>
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
              <div className="gear-field-and-form">
                <span className="gear-field">Gear:</span>
                <input
                  type="text"
                  className={`my-gear-input ${gearRequest.hasError ? 'create-trip-error' : ''}`}
                  name="trippeeGear"
                  placeholder="Add Item"
                  onChange={event => props.onTrippeeGearChange(event, index)}
                  value={gearRequest.gear}
                />
              </div>
              <div className="gear-field-and-form">
                <span className="gear-field">Size Type:</span>
                <Dropdown onSelect={eventKey => props.onSizeTypeChange(eventKey, index)}>
                  <Dropdown.Toggle id="size-type-dropdown">
                    <span>
                      <span className="selected-size">{gearRequest.size_type}</span>
                      <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="filter-options clothe-options">
                    <Dropdown.Item eventKey="N/A">N/A</Dropdown.Item>
                    <Dropdown.Item eventKey="Clothe">Clothes</Dropdown.Item>
                    <Dropdown.Item eventKey="Shoe">Shoe</Dropdown.Item>
                    <Dropdown.Item eventKey="Height">Height</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <button type="button" className="delete-gear-button" onClick={() => props.removeTrippeeGear(index)}>X</button>
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
        <div className="gear-container" key={gearRequest._id}>
          <input
            type="text"
            className={`gear-input ${gearRequest.hasError ? 'create-trip-error' : ''}`}
            name="opogearRequest"
            placeholder="Add Item"
            onChange={event => props.onGearChange(event, index)}
            value={gearRequest.groupGear}
          />
          <button
            type="button"
            className="delete-gear-button"
            onClick={() => props.removeGear(index)}
          >
            X
          </button>
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
      <div className="row page-header">
        <p>Equipment</p>
      </div>
      <div className="row gearForm">
        <div className="page-sub-headers gear-content">
          <p>Individual gear</p>
          <span id="equipment-description">Gear trippees should bring/rent</span>
          {getTrippeeGear(props)}
          {(!props.trippeeGearStatus || props.trippeeGearStatus === 'pending' || props.trippeeGearStatus === 'N/A')
            ? <button className="add-gear-button" type="button" onClick={props.addTrippeeGear}>Add item</button>
            : null}
        </div>
        <div className="page-sub-headers gear-content">
          <p>Group Gear</p>
          <span id="equipment-description">Gear for the entire group that needs to be rented</span>
          {getGearInputs(props)}
          {(!props.gearStatus || props.gearStatus === 'pending' || props.gearStatus === 'N/A')
            ? <button className="add-gear-button" type="button" onClick={props.addGear}>Add item</button>
            : null}
        </div>
      </div>
    </div>
  );
};

export {
  LeftColumn,
  BasicTripInfo,
  Equipment,
  AboutTheTrip,
  DatesLocation,
};
