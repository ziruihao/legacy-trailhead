/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createTrip, appError } from '../actions';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
  TRAILER_CONSTANT = 'TRAILER';

  NONE_CONSTANT = 'NONE';

  constructor(props) {
    super(props);
    this.state = {
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
      pickup: '',
      dropoff: '',
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
        <div>
          <input type="date" name="startDate" onChange={this.onDateChange} className="form-control" value={this.state.startDate} />
          <input type="date" name="endDate" onChange={this.onDateChange} className="form-control" value={this.state.endDate} />
        </div>
      );
    } else {
      return (
        <input type="date" name="startDate" onChange={this.onDateChange} className="form-control" value={this.state.startDate} />
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
    if (changeEvent.target.value === 'Yes') {
      this.setState({
        experienceNeeded: true,
      });
    } else {
      this.setState({
        experienceNeeded: false,
      });
    }
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
    return this.state.gearRequests.map((gearRequest, index) => {
      return (
        <div key={index}>
          <input type="text" name="gearRequest" onChange={event => this.onGearChange(event, index)} value={gearRequest} />
          <button className="btn btn-danger btn-xs delete-gear-button" onClick={() => this.removeGear(index)}>Delete</button>
        </div>
      );
    });
  }

  getTrippeeGear = () => {
    return this.state.trippeeGear.map((gearRequest, index) => {
      return (
        <div key={index}>
          <input type="text" name="trippeeGear" onChange={event => this.onTrippeeGearChange(event, index)} value={gearRequest} />
          <button className="btn btn-danger btn-xs delete-gear-button" onClick={() => this.removeTrippeeGear(index)}>Delete</button>
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

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  createTrip() {
    const club = this.isObjectEmpty(this.state.club) ? this.props.user.leader_for[0] : this.state.club;
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
      pickup: this.state.pickup,
      dropoff: this.state.dropoff,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      cost: this.state.cost,
      gearRequests,
      trippeeGear,
    };

    // Validate input
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

  render() {
    return (
      <div className="container">
        <div className="card-createTrip">
          <div className="card-header profile-header">Create your trip today!</div>
          <input className="form-control field top" onChange={this.onFieldChange} name="title" placeholder="Trip title" value={this.state.title} />
          <input
            className="form-control field"
            onChange={this.onFieldChange}
            name="leaders"
            placeholder="Leaders (comma separated emails, you are a leader by default)"
            value={this.state.leaders}
          />
          <select name="club" className="custom-select field" defaultValue="Select Club" onChange={this.onClubChange}>
            {this.getClubOptions()}
          </select>
          <div> Experience Needed </div>
          <form>
            <input
              type="radio"
              value="Yes"
              onChange={this.handleOptionChange}
              checked={this.state.experienceNeeded === true}
            />
            Yes
            <input
              type="radio"
              value="No"
              onChange={this.handleOptionChange}
              checked={this.state.experienceNeeded === false}
            />
            No
          </form>
          <textarea className="form-control field" onChange={this.onFieldChange} name="description" placeholder="Trip description (markdown supported)" value={this.state.description} />
          <input type="number" onChange={this.onFieldChange} name="mileage" placeholder="Estimated mileage" value={this.state.mileage} />
          <input onChange={this.onFieldChange} name="location" placeholder="Location" value={this.state.location} />
          <input onChange={this.onFieldChange} name="pickup" placeholder="Pickup Location" value={this.state.pickup} />
          <input onChange={this.onFieldChange} name="dropoff" placeholder="Dropoff Location" value={this.state.dropoff} />
          <div> Trip Duration </div>
          <form>
            <input
              type="radio"
              value="single"
              onChange={this.handleDateChange}
              checked={this.state.length === 'single'}
            />
            Single Day
            <input
              type="radio"
              value="multi"
              onChange={this.handleDateChange}
              checked={this.state.length === 'multi'}
            />
            Multi-Day
          </form>
          <div className="input-group field">
            <div className="input-group-prepend">
              <span className="input-group-text">Start Date and End Date</span>
            </div>
            {this.getDateOptions()}
          </div>
          <div className="input-group field">
            <div className="input-group-prepend">
              <span className="input-group-text">Start Time and End Time</span>
            </div>
            <input type="time" name="startTime" onChange={this.onFieldChange} className="form-control" value={this.state.startTime} />
            <input type="time" name="endTime" onChange={this.onFieldChange} className="form-control" value={this.state.endTime} />
          </div>
          <div className="input-group field">
            <div className="input-group-prepend">
              <span className="input-group-text">Cost ($)</span>
            </div>
            <input type="number" name="cost" step="0.01" onChange={this.onFieldChange} className="form-control" value={this.state.cost} />
          </div>
          <div>
            {this.getGearInputs()}
            <button className="btn btn-primary btn-xs gear-button" onClick={this.addGear}>Request gear</button>
          </div>
          <div>
            {this.getTrippeeGear()}
            <button className="btn btn-primary btn-xs gear-button" onClick={this.addTrippeeGear}>Trippee gear</button>
          </div>
          <div>
            <p>Vehicles you can request:</p>
            {this.getVehicleRequest()}
          </div>
          <button className="btn btn-success post-button" onClick={this.createTrip}>Post trip</button>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, { createTrip, appError })(CreateTrip));
