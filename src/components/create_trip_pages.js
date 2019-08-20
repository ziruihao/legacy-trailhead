import React from 'react';
import '../styles/createtrip-style.scss';


const LeftColumn = (props) => {
  return (
    <div className="col-3 left-column">
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
        <p className={props.currentStep === 5 ? 'text-highlight' : ''}>P-Card Request</p>
      </div>
      <div className="row column-sub-headers">
        <p className={props.currentStep === 6 ? 'text-highlight' : ''}>Vehicle Request</p>
      </div>
    </div>
  );
};

const BasicTripInfo = (props) => {
  return (
    <div className="col-9 right-column">
      <div className="row page-header">
        <p>Basic trip information</p>
      </div>
      <div className="row page-sub-headers">
        <p>Trip name</p>
        <input className="form-control field top-create-trip"
          onChange={props.onFieldChange}
          name="title"
          placeholder="e.g. Weekend Mt. Moosilauke Hike!"
          value={props.titleValue}
        />
      </div>
      <div className="row page-sub-headers">
        <p>Subclub</p>
        <select name="club" className="custom-select field top-create-trip" defaultValue="Select Club" onChange={props.onClubChange}>
          {props.clubOptions}
        </select>
      </div>
      <div className="row page-sub-headers">
        <p>Cost</p>
        <input className="form-control field top-create-trip"
          onChange={props.onFieldChange}
          name="cost"
          placeholder="0"
          type="number"
          value={props.costValue}
        />
      </div>
      <div className="row page-sub-headers">
        <p>Co-leader name(s)</p>
        <input
          className="form-control field top-create-trip leaders"
          onChange={props.onFieldChange}
          name="leaders"
          placeholder="Tim Tregubov"
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
        <p>Beginner trip</p>
        <div className="checkbox-beginner">
          <input
            type="checkbox"
            value="Yes"
            id="beginner"
            onChange={props.experienceOption}
            checked={props.experienceValue}
          />
          <label htmlFor="beginner">
            Do Trippees need prior experience to go on this trip?
          </label>
        </div>
      </div>
      <div className="row button-placement correct">
        <button disabled={props.validate()} type="button" className="btn next-button" onClick={props.nextButton}>Next</button>
      </div>
    </div>

  );
};

const DatesLocation = (props) => {
  return (
    <div className="col-9 right-column">
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
      <p className="see-vehic-cal">See Vehicle Calendar</p>
      <div id="date-picker" className="row page-sub-headers trip-date-header">
        <div>
          <p>Start time</p>
          <input type="time" name="startTime" onChange={props.onFieldChange} className="field top-create-trip leaders" value={props.theStartTime} />
        </div>
        <div>
          <p>End time</p>
          <input type="time" name="endTime" onChange={props.onFieldChange} className="field top-create-trip leaders" value={props.theEndTime} />
        </div>
      </div>
      <div className="row page-sub-headers">
        <p>Location</p>
        <input
          className="form-control field top-create-trip leaders"
          name="location"
          onChange={props.onFieldChange}
          placeholder="e.g. Mt. Cube"
          value={props.tripLocation}
        />
      </div>
      <div className="row page-sub-headers trip-date-header">
        <p>Estimated mileage (round trip)</p>
        <input type="number" onChange={props.onFieldChange} name="mileage" placeholder="Estimated mileage" className="field top-create-trip leaders" value={props.tripMileage} />
      </div>
      <div className="row button-placement">
        <button type="button" id="prev-button" className="btn btn-outline-success" onClick={props.prevButton}>Previous</button>
        <button disabled={props.validate()} type="button" className="btn next-button" onClick={props.nextButton}>Next</button>
      </div>
    </div>
  );
};

const AboutTheTrip = (props) => {
  return (
    <div className="col-9 right-column">
      <div className="row page-header">
        <p>About the trip</p>
      </div>
      <div id="date-picker" className="row page-sub-headers">
        <div>
          <p>Pickup</p>
          <input
            className="form-control field top-create-trip pickupDropoff"
            onChange={props.onFieldChange}
            name="pickup"
            placeholder="eg. Robo Hall"
            value={props.pickUp}
          />
        </div>
        <div>
          <p>Dropoff</p>
          <input
            className="form-control field top-create-trip pickupDropoff"
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
          className="form-control field trip-descrip-box"
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
      <div className="row button-placement">
        <button type="button" id="prev-button" className="btn btn-outline-success" onClick={props.prevButton}>Previous</button>
        <button disabled={props.validate()} type="button" className="btn next-button" onClick={props.nextButton}>Next</button>
      </div>
    </div>
  );
};

const Equipment = (props) => {
  return (
    <div className="col-9 right-column">
      <div className="row page-header">
        <p>Equipment</p>
      </div>
      <div className="row gearForm">
        <div id="gear-content" className="page-sub-headers">
          <p>Individual gear</p>
          <span id="equipment-description">Gear trippees should bring/rent</span>
          {props.getTrippeeGear}
          <button className="add-gear-button" type="button" onClick={props.addTrippeeGear}>Add item</button>
        </div>
        <div id="gear-content" className="page-sub-headers">
          <p>Group Gear</p>
          <span id="equipment-description">Gear for the entire group that needs to be rented</span>
          {props.getGearInputs}
          <button className="add-gear-button" type="button" onClick={props.addGear}>Add item</button>
        </div>
      </div>
      <div className="row button-placement">
        <button type="button" id="prev-button" className="btn btn-outline-success" onClick={props.prevButton}>Previous</button>
        <button disabled={props.validate()} type="button" className="btn next-button" onClick={props.nextButton}>Next</button>
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
