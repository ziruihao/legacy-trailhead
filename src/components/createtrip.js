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
      // club: '',
      description: '',
      startDate: '',
      endDate: '',
      cost: '',
      limit: '',
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.getClubs();
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getClubOptions = () => {
    const options = this.props.clubs.map((club) => {
      return <option key={club.id} value={club.id}>{club.name}</option>;
    });
    return options;
  }

  createTrip() {
    // const defaultClub = () => {
    //   for (const club of this.props.clubs) {
    //     if (club.name === 'Ledyard') {
    //       return club.id;
    //     }
    //   }
    //   return '';
    // };

    console.log('1creatign trip from createtrip.js');

    const trip = {
      title: this.state.title,
      leaders: this.state.leaders.trim().split(','),
      // club: this.state.club !== '' ? this.state.club : defaultClub(),
      club: 'Ledyard',
      description: this.state.description,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      cost: this.state.cost,
      limit: this.state.limit,
    };
    console.log('2creatign trip from createtrip.js');

    // Validate input
    if (!(trip.title && trip.leaders && trip.club && trip.description && trip.startDate && trip.endDate && trip.cost && trip.limit)) {
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
          <input className="form-control field" type="number" onChange={this.onFieldChange} name="limit" placeholder="Max # of people (e.g. 8, 10, etc)" value={this.state.limit} />
          <textarea className="form-control field" onChange={this.onFieldChange} name="description" placeholder="Trip description (markdown supported)" value={this.state.description} />
          <div className="input-group field">
            <div className="input-group-prepend">
              <span className="input-group-text">Start Date and End Date</span>
            </div>
            <input type="date" name="startDate" onChange={this.onFieldChange} className="form-control" value={this.state.startDate} />
            <input type="date" name="endDate" onChange={this.onFieldChange} className="form-control" value={this.state.endDate} />
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
