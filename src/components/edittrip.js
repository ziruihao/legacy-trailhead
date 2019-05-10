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
      gearRequests: [],
      newRequest: false,
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
        startDate: nextProps.trip.startDate.substring(0, 10),
        endDate: nextProps.trip.endDate.substring(0, 10),
        cost: nextProps.trip.cost,
        gearRequests: nextProps.trip.OPOGearRequests,
      });
    }
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getGearForm = () => {
    if (this.props.trip.title) {
      if (this.props.trip.gearStatus === 'pending' || this.state.newRequest) {
        return (
          <div>
            <h4>Gear Requests:</h4>
            {this.getGearInputs()}
            <button className="btn btn-primary btn-xs gear-button" onClick={this.addGear}> Request gear</button>
          </div>
        );
      } else {
        let gearRequests, requestStatus;
        if (this.props.trip.OPOGearRequests.length === 0) {
          gearRequests = <p>None</p>;
          requestStatus = null;
        } else {
          gearRequests = this.props.trip.OPOGearRequests.map(gearrequest => (
            <li key={gearrequest}>{gearrequest}</li>
          ));
          requestStatus = <h3>Request Status: {this.props.trip.gearStatus}</h3>;
        }
        return (
          <div>
            <h4>Gear Requests:</h4>
            {gearRequests}
            {requestStatus}
            <button className="btn btn-primary btn-xs gear-button" onClick={this.newGearRequest}> New Gear Request</button>
          </div>
        );
      }
    } else {
      return null;
    }
  }

  addGear = () => {
    this.setState(prevState => ({ gearRequests: [...prevState.gearRequests, ''] }));
  }

  newGearRequest = () => {
    this.setState({ newRequest: true });
  }

  removeGear = (index) => {
    this.setState((prevState) => {
      const withoutDeleted = prevState.gearRequests.slice(0, index).concat(prevState.gearRequests.slice(index + 1));
      return {
        gearRequests: withoutDeleted,
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

  editTrip() {
    const gearRequests = this.state.gearRequests.filter(gear => gear.length > 0);
    const trip = {
      title: this.state.title ? this.state.title : this.props.trip.title,
      description: this.state.description ? this.state.description : this.props.trip.description,
      startDate: this.state.startDate ? this.state.startDate : this.props.trip.startDate,
      endDate: this.state.endDate ? this.state.endDate : this.props.trip.endDate,
      cost: this.state.cost ? this.state.cost : this.props.trip.cost,
      gearRequests,
      newRequest: this.state.newRequest,
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
              <div className="input-group-prepend">
                <span className="input-group-text">Description (markdown supported)</span>
              </div>
              <textarea className="form-control field" onChange={this.onFieldChange} name="description" placeholder="Trip description" value={this.state.description} />
            </div>
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
            {this.getGearForm()}
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
