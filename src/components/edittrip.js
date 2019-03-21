/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { editTrip, fetchTrip, appError } from '../actions';
import '../styles/edittrip-style.scss';

class EditTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      cost: '',
      limit: '',
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.editTrip = this.editTrip.bind(this);
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.fetchTrip(this.props.match.params.tripID);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trip) {
      this.setState({
        title: nextProps.trip.title,
        description: nextProps.trip.description,
        startDate: nextProps.trip.startDate,
        endDate: nextProps.trip.endDate,
        cost: nextProps.trip.cost,
        limit: nextProps.trip.limit,
      });
    }
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }


  formatDate = (date) => {
    // date fix adapted from https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off/31732581
    if (!date) {
      return '';
    }
    return new Date(date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString('en-US');
  }

  editTrip() {
    const trip = {
      title: this.state.title ? this.state.title : this.props.trip.title,
      description: this.state.description ? this.state.description : this.props.trip.description,
      startDate: this.state.startDate ? this.state.startDate : this.props.trip.startDate,
      endDate: this.state.endDate ? this.state.endDate : this.props.trip.endDate,
      cost: this.state.cost ? this.state.cost : this.props.trip.cost,
      limit: this.state.limit ? this.state.limit : this.props.trip.limit,
      id: this.props.trip.id,
    };

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (start.getTime() > end.getTime() || start.getTime() < Date.now() || end.getTime() < Date.now()) {
      this.props.appError('Please enter valid dates');
      return;
    }
    this.props.editTrip(trip, this.props.history);
  }


  render() {
    return (
      <div className="container">
        <div className="card card-edit-trip">
          <div className="card-header profile-header">Edit Your Trip</div>
          <div className="card-content">
            <div className="input-group field">
              <div className="input-group-prepend d-span">
                <span className="input-group-text d-span">Title</span>
              </div>
              <input name="title" onChange={this.onFieldChange} className="form-control" placeholder="Trip Title" value={this.state.title} />
            </div>
            <div className="input-group field">
              <div className="input-group-prepend d-span">
                <span className="input-group-text d-span">Limit</span>
              </div>
              <input type="number" name="limit" step="1.0" onChange={this.onFieldChange} className="form-control" placeholder="Max # of people (e.g. 8, 10, etc)" value={this.state.limit} />
            </div>
            <div className="input-group field">
              <div className="input-group-prepend">
                <span className="input-group-text">Description (markdown supported)</span>
              </div>
              <textarea className="form-control field" onChange={this.onFieldChange} name="description" placeholder="Trip description" value={this.state.description} />
            </div>
            <h5> Current Dates: {this.formatDate(this.state.startDate)} - {this.formatDate(this.state.endDate)} </h5>
            <div className="input-group field">
              <div className="input-group-prepend">
                <span className="input-group-text">Start Date and End Date</span>
              </div>
              <input type="date" name="startDate" onChange={this.onFieldChange} className="form-control" value={this.state.startDate} />
              <input type="date" name="endDate" onChange={this.onFieldChange} className="form-control" value={this.state.endDate} />
            </div>
            <div className="input-group field">
              <div className="input-group-prepend d-span">
                <span className="input-group-text d-span">Cost ($)</span>
              </div>
              <input type="number" name="cost" step="0.01" onChange={this.onFieldChange} className="form-control" value={this.state.cost} />
            </div>
            <button className="btn btn-success" onClick={this.editTrip}>Update Trip</button>
            <button className="btn btn-danger" onClick={() => this.props.history.push(`/trip/${this.props.trip.id}`)}>Cancel changes</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    trip: state.trips.trip,
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { editTrip, fetchTrip, appError })(EditTrip));
