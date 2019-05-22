/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createTrip, appError } from '../actions';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      leaders: '',
      club: '',
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
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
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
    if (this.props.userClubs) {
      options = this.props.userClubs.map((club) => {
        return <option key={club.id} value={club.name}>{club.name}</option>;
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

  createTrip() {
    const club = this.state.club ? this.state.club : this.props.userClubs[0];
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
          <select name="club" className="custom-select field" defaultValue="Select Club" onChange={this.onFieldChange}>
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
          <button className="btn btn-success post-button" onClick={this.createTrip}>Post trip</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userClubs: state.user.leader_for,
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { createTrip, appError })(CreateTrip));
