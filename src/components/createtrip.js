/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createTrip, getClubs, appError } from '../actions';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      leaders: '',
      club: '',
      experienceNeeded: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      mileage: '',
      location: '',
      cost: '',
      length: '',
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.getClubs();
  }

  onFieldChange(event) {
    console.log(`field changing${event}and name ${event.target.name}and value ${event.target.value}`);
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
    const listOfClubs = ['Ledyard', 'CNT', 'DMC'];
    const options = listOfClubs.map((club) => {
      return <option key={club} value={club}>{club}</option>;
    });
    return options;
  }

  getDateOptions = () => {
    if (this.state.length === 'multi') {
      return (
        <div>
          <input type="date" name="startDate" onChange={this.onDateChange} className="form-control" value={this.state.startDate} />
          <input type="date" name="startDate" onChange={this.onDateChange} className="form-control" value={this.state.startDate} />
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
      this.setState({
        length: 'single',
      });
    } else {
      this.setState({
        length: 'multi',
      });
    }
  };

  createTrip() {
    const trip = {
      title: this.state.title,
      leaders: this.state.leaders.trim().split(','),
      club: this.state.club,
      experienceNeeded: this.state.experienceNeeded,
      description: this.state.description,
      mileage: this.state.mileage,
      location: this.state.location,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      cost: this.state.cost,
    };

    if (!trip.startDate) {
      console.log('startdate');
    }
    if (!trip.endDate) {
      console.log('endDate');
    }
    if (!trip.startTime) {
      console.log('startTime');
    }
    if (!trip.endTime) {
      console.log('endTime');
    }
    // Validate input
    if (!(trip.title && trip.leaders && trip.club && trip.description && trip.startDate && trip.endDate && trip.startTime && trip.endTime
      && trip.cost && trip.experienceNeeded && trip.mileage && trip.location)) {
      this.props.appError('All trip fields must be filled out');
      return;
    }
    console.log('3creatign trip from createtrip.js');

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    console.log(Date.now());
    if (start.getTime() > end.getTime() || start.getTime() < Date.now() || end.getTime() < Date.now()) {
      this.props.appError('Please enter valid dates');
      return;
    }
    console.log('4creatign trip from createtrip.js');


    console.log('creatign trip from createtrip.js');
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
          <select name="club" className="custom-select field" defaultValue="Ledyard" onChange={this.onFieldChange}>
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
          <input onChange={this.onFieldChange} name="mileage" placeholder="Estimated mileage" value={this.state.mileage} />
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
          <button className="btn btn-success post-button" onClick={this.createTrip}>Post trip</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    clubs: state.clubs,
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { createTrip, getClubs, appError })(CreateTrip));
