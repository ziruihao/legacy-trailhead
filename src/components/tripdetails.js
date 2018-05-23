import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { joinTrip, fetchTrip, leaveTrip, isOnTrip } from '../actions';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onleave = this.onleave.bind(this);
  }

  componentDidMount() {
    this.props.fetchTrip(this.props.match.params.tripID);
    this.props.isOnTrip(this.props.match.params.tripID);
  }

  onSubmit() {
    this.props.joinTrip(this.props.trip._id);
  }

  onleave() {
    this.props.leaveTrip(this.props.trip._id);
  }

  render() {
    return (
      <div className="trip-detail-div">
        <h1> {this.props.trip.title} </h1>
        <h2> Leaders: {this.props.trip.leaders}</h2>
        <h3> Date: {this.props.trip.date}</h3>
        <h3> Club: {this.props.trip.club}</h3><br />
        {/* <div>
          <button className="button" onClick={this.onSubmit}>Sign Up</button>
          <button className="button" onClick={this.onleave}>Leave Trip</button>
        </div> <br /> */}
        { this.props.isUserOnTrip ?
          (
            <div>
              <p> You are currently signed up for this trip. Click below to leave the trip </p>
              <button className="button" onClick={this.onleave}>Leave Trip</button>
            </div>
          ) :
          (
            <button className="button" onClick={this.onSubmit}>Sign Up</button>
          )
        }
        <br /><NavLink to="/mytrips"> View your trips! </NavLink>
      </div>
    );
  }
}


// connects particular parts of redux state to this components props
const mapStateToProps = state => (
  {
    trip: state.trips.trip,
    isUserOnTrip: state.trips.isUserOnTrip,
  }
);

export default withRouter(connect(mapStateToProps, {
  joinTrip, fetchTrip, leaveTrip, isOnTrip,
})(TripDetails));
// export default withRouter(connect(null, { signUpTrip, fetchTrip, leaveTrip, isOnTrip })(TripDetails));
