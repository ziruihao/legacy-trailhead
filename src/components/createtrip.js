import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createTrip, appError } from '../actions';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      title: '',
      leaders: '',
      club: {},
      experienceNeeded: false,
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      mileage: '',
      location: '',
      cost: '',
      length: 'single',
      gearRequests: [],
      trippeeGear: [],
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onGearChange = this.onGearChange.bind(this);
    this.onClubChange = this.onClubChange.bind(this);
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onClubChange(event) {
    event.persist();
    console.log(event);
    this.setState({
      club: { _id: event.target[event.target.selectedIndex].dataset.id, name: event.target.value },
    });
  }

  onDateChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (this.state.length === 'single') {
      this.setState({
        endDate: event.target.value,
      });
    }
  }

    getClubOptions = () => {
      let options = null;
      if (this.props.user.leader_for) {
        options = this.props.user.leader_for.map((club) => {
          return <option key={club.id} data-id={club.id} value={club.name}>{club.name}</option>;
        });
      }
      return options;
    }

    getDateOptions = () => {
      if (this.state.length === 'multi') {
        return (
          <div id="date-picker" className="row page-sub-headers trip-date-header">
            <div>
              <p>Start date</p>
              <input type="date" name="startDate" onChange={this.onDateChange} className="field top-create-trip leaders" value={this.state.startDate} />
            </div>
            <div>
              <p>End date</p>
              <input type="date" name="endDate" onChange={this.onDateChange} className="field top-create-trip leaders" value={this.state.endDate} />
            </div>
          </div>
        );
        } else {
        return (
          <div className="row page-sub-headers trip-date-header">
            <p>Trip date</p>
            <input type="date" name="startDate" onChange={this.onDateChange} className="field top-create-trip leaders" value={this.state.startDate} />
          </div>
        );
      }
    }

    getVehicleRequest() {
      let certifications = '';
      if (this.props.user.driver_cert === null && !this.props.user.trailer_cert) {
        certifications = this.NONE_CONSTANT;
      } else {
        certifications = this.props.user.trailer_cert ? `${this.props.user.driver_cert}, ${this.TRAILER_CONSTANT}` : this.props.driver_cert;
      }
      return certifications;
    }

    handleDateChange = (changeEvent) => {
      if (changeEvent.target.value === 'single') {
        this.setState(prevState => (
          {
            length: 'single',
            endDate: prevState.startDate,
          }
        ));
      } else {
        this.setState({
          length: 'multi',
        });
      }
    };

    addGear = () => {
      this.setState(prevState => ({ gearRequests: [...prevState.gearRequests, ''] }));
      console.log('addGear working');
      console.log(this.state.gearRequests);
    }

    addTrippeeGear = () => {
      this.setState(prevState => ({ trippeeGear: [...prevState.trippeeGear, ''] }));
    }

    removeGear = (index) => {
      this.setState((prevState) => {
        const withoutDeleted = prevState.gearRequests.slice(0, index).concat(prevState.gearRequests.slice(index + 1));
        return {
          gearRequests: withoutDeleted,
        };
      });
    }

    handleOptionChange = (changeEvent) => {
      this.setState({ experienceNeeded: changeEvent.target.checked });
    // if (changeEvent.target.checked) {
    //   this.setState({
    //     experienceNeeded: true,
    //   });
    // } else {
    //   this.setState({
    //     experienceNeeded: false,
    //   });
    // }
    };

    handleStateChange = (event) => {
      const { name, value } = event.target;
      this.setState({
        [name]: value,
      });
    };


    removeTrippeeGear = (index) => {
      this.setState((prevState) => {
        const withoutDeleted = prevState.trippeeGear.slice(0, index).concat(prevState.trippeeGear.slice(index + 1));
        return {
          trippeeGear: withoutDeleted,
        };
      });
    }

    getGearInputs = () => {
      console.log('wadup');
      return this.state.gearRequests.map((gearRequest, index) => {
        return (
          <div className="gear-container" key={index}>
            <input type="text" className="gear-input" name="opogearRequest" onChange={event => this.onGearChange(event, index)} value={gearRequest} autoFocus />
            <button type="button" className="delete-gear-button" onClick={() => this.removeGear(index)}>X</button>
          </div>
        );
      });
    }

    getTrippeeGear = () => {
      return this.state.trippeeGear.map((gearRequest, index) => {
        return (
          <div className="gear-container" key={index}>
            <input type="text" className="gear-input" name="trippeeGear" onChange={event => this.onTrippeeGearChange(event, index)} value={gearRequest} autoFocus />
            <button type="button" className="delete-gear-button" onClick={() => this.removeTrippeeGear(index)}>X</button>
          </div>
        );
      });
    }

    onGearChange = (event, idx) => {
      event.persist();
      this.setState((prevState) => {
        const gearRequests = [...prevState.gearRequests];
        gearRequests[idx] = event.target.value;
        return {
          gearRequests,
        };
      });
    }

    onTrippeeGearChange = (event, idx) => {
      event.persist();
      this.setState((prevState) => {
        const trippeeGear = [...prevState.trippeeGear];
        trippeeGear[idx] = event.target.value;
        return {
          trippeeGear,
        };
      });
    }


    _next = () => {
      let thecurrentStep;
      thecurrentStep = this.state.currentStep;
      thecurrentStep = thecurrentStep >= 5 ? 6 : thecurrentStep + 1;
      this.setState({
      currentStep: thecurrentStep,
      });
    }

    _prev = () => {
      let thecurrentStep;
      thecurrentStep = this.state.currentStep;
      thecurrentStep = thecurrentStep <= 1 ? 1 : thecurrentStep - 1;
      this.setState({
      currentStep: thecurrentStep,
      });
    }

    

    createTrip() {
      const club = this.state.club ? this.state.club : this.props.user.leader_for[0];
      const gearRequests = this.state.gearRequests.filter(gear => gear.length > 0);
      const trippeeGearStrings = this.state.trippeeGear.filter(gear => gear.length > 0);
      const trippeeGear = trippeeGearStrings.map(gear => ({ gear, quantity: 0 }));
      const trip = {
        title: this.state.title,
        leaders: this.state.leaders.trim().split(','),
        club,
        experienceNeeded: this.state.experienceNeeded,
        description: this.state.description,
        mileage: this.state.mileage,
        location: this.state.location,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        cost: this.state.cost,
        gearRequests,
        trippeeGear,
      };

      if (!(trip.title && trip.description && trip.startDate && trip.endDate && trip.startTime && trip.endTime
        && trip.cost && trip.mileage && trip.location && trip.club)) {
        this.props.appError('All trip fields must be filled out');
        return;
      }

      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      if (start.getTime() > end.getTime() || start.getTime() < Date.now() || end.getTime() < Date.now()) {
        this.props.appError('Please enter valid dates');
        return;
      }

      this.props.createTrip(trip, this.props.history);
    }

    previousButton() {
      if (this.state.currentStep !== 1) {
        return (
          <button type="button" id="prev-button" className="btn btn-outline-success" onClick={this._prev}>Previous</button>
        );
      }
      return null;
    }

    nextButton() {
      if (this.state.currentStep < 6) {
        return (
          <button type="button" id="next-button" className="btn btn-outline-success" onClick={this._next}>Next</button>
        );
      }
      return null;
    }



    render() {
      return (
        <div className="row my-row">
          <div className="col-3 left-column">
            <div className="row column-headers column-adjust">
              <p>Create a trip</p>
            </div>
            <div className="row column-sub-headers">
              <div className="side-bar-highlight" />
              <p>Basic information</p>
            </div>
            <div className="row column-sub-headers">
              <div className="side-bar-highlight" />
              <p>Dates and location</p>
            </div>
            <div className="row column-headers">
              <p>Trips description</p>
            </div>
            <div className="row column-sub-headers">
              <div className="side-bar-highlight" />
              <p>About the trip</p>
            </div>
            <div className="row column-sub-headers">
              <div className="side-bar-highlight" />
              <p>What you'll need</p>
            </div>
            <div className="row column-headers">
              <p>Additional details</p>
            </div>
            <div className="row column-sub-headers">
              <div className="side-bar-highlight" />
              <p>About the trip</p>
            </div>
            <div className="row column-sub-headers">
              <div className="side-bar-highlight" />
              <p>What you'll need</p>
            </div>
          </div>
          <BasicTripInfo
            currentStep={this.state.currentStep}
            onFieldChange={this.onFieldChange}
            titleValue={this.state.title}
            leaderValue={this.state.leaders}
            experienceValue={this.state.experienceNeeded}
            experienceOption={this.handleOptionChange}
            clubOptions={this.getClubOptions()}
          />
          <DatesLocation
            currentStep={this.state.currentStep}
            onFieldChange={this.onFieldChange}
            onDateChange={this.handleDateChange}
            dateLength={this.state.length}
            dateOptions={this.getDateOptions()}
            theStartTime={this.state.startTime}
            theEndTime={this.state.endTime}
            tripLocation={this.state.location}
            tripMileage={this.state.mileage}
          />
          <AboutTheTrip
            currentStep={this.state.currentStep}
            onFieldChange={this.onFieldChange}
            DescripValue={this.state.description}
          />
          <Equipment
            currentStep={this.state.currentStep}
            addTrippeeGear={this.addTrippeeGear}
            addGear={this.addGear}
            getGearInputs={this.getGearInputs}
            getTrippeeGear={this.getTrippeeGear}
          />
          <div className="row right-column button-placement">
            {this.nextButton()}
            {this.previousButton()}
          </div>

        </div>

      );
    }
}


function BasicTripInfo(props) {
  if (props.currentStep !== 1) {
    return null;
  }
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
        <select name="club" className="custom-select field top-create-trip" defaultValue="Select Club" onChange={props.onFieldChange}>
          {props.clubOptions}
        </select>
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
          <div className="radio-button" />
        </div>
      </div>
    </div>

  );
}

function DatesLocation(props) {
  if (props.currentStep !== 2) {
    return null;
  }
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

    </div>
  );
}

function AboutTheTrip(props) {
  if (props.currentStep !== 3) {
    return null;
  }
  return (
    <div className="col-9 right-column">
      <div className="row page-header">
        <p>About the trip</p>
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
          <li>What you'll be doing on the trip</li>
          <li>Prior experience that would be helpful (if applicable)</li>
          <li>Rough iternary of events and activities</li>
          <li>Short introduction of leaders</li>
        </ul>
      </div>
    </div>
  );
}

function Equipment(props) {
  if (props.currentStep !== 4) {
    return null;
  }
  return (
    <div className="col-4 right-column">
      <div className="row page-header">
        <p>Equipment</p>
      </div>
      <div className="row gearForm">
        <div id="gear-content" className="page-sub-headers">
          <p>Individual gear</p>
          <span id="equipment-description">Gear trippees should bring/rent</span>
          {props.getTrippeeGear()}
          <button className="add-gear-button" type="button" onClick={props.addTrippeeGear}>Add item</button>
        </div>
        <div id="gear-content" className="page-sub-headers">
          <p>Group Gear</p>
          <span id="equipment-description">Gear for the entire group that needs to be rented</span>
          {props.getGearInputs()}
          <button className="add-gear-button" type="button" onClick={props.addGear}>Add item</button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, { createTrip, appError })(CreateTrip));
