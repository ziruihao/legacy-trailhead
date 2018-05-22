import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createTrip } from '../actions';
import '../styles/createtrip-style.scss';

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      leaders: '',
      club: '',
      description: '',
      startDate: '',
      endDate: '',
      cost: '',
      limit: '',
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  createTrip() {
    const trip = {
      title: this.state.title,
      leaders: this.state.leaders.trim().split(','),
      club: this.state.club,
      description: this.state.description,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      cost: this.state.cost,
      limit: this.state.limit,
    };
    this.props.createTrip(trip, this.props.history);
  }

  render() {
    return (
      <div className="container">
        <h1>Create your trip today!</h1>
        <input className="form-control field" onChange={this.onFieldChange} name="title" placeholder="Trip title" value={this.state.title} />
        <input className="form-control field" onChange={this.onFieldChange} name="leaders" placeholder="Leaders (please write emails, comma separated)" value={this.state.leaders} />
        <input className="form-control field" onChange={this.onFieldChange} name="club" placeholder="Associated club" value={this.state.club} />
        <input className="form-control field" type="number" onChange={this.onFieldChange} name="limit" placeholder="Max # of people (e.g. 8, 10, etc)" value={this.state.limit} />
        <textarea className="form-control field" onChange={this.onFieldChange} name="description" placeholder="Trip description" value={this.state.description} />
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
    );
  }
}

export default withRouter(connect(null, { createTrip })(CreateTrip));
