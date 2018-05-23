import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { joinTrip, fetchTrip, cancelTrip, isOnTrip } from '../actions';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    console.log('trip id');
    console.log(this.props.match.params.tripID);
    this.props.fetchTrip(this.props.match.params.tripID);
    // this.props.isOnTrip(this.props.match.params.tripID);
  }

  onSubmit() {
    console.log('onSubmitClick: joining trip');

    this.props.joinTrip(this.props.trip._id);
  }

  onCancel() {
    console.log('onCancelClick');

    this.props.cancelTrip(this.props.trip._id);
  }

  render() {
    return (
      <div className="trip-detail-div">
        <h1> {this.props.trip.title} </h1>
        <h2> Leaders: {this.props.trip.leaders}</h2>
        <h3> Date: {this.props.trip.date}</h3>
        <h3> Club: {this.props.trip.club}</h3><br />
        <div>
          <button className="button" onClick={this.onSubmit}>Sign Up</button>
          <button className="button" onClick={this.onCancel}>Cancel Trip</button>
        </div> <br />
        {/* { this.props.isOnTrip ?
          (
            <div>
              <p> You are currently signed up for this trip. Click below to cancel </p>
              <button className="button" onClick={this.onCancel}>Cancel Trip</button>
            </div>
          ) :
          (
            <button className="button" onClick={this.onSubmit}>Sign Up</button>
          )
        } */}
        <NavLink to="/mytrips"> View your trips! </NavLink>
      </div>
    );
  }
}


// connects particular parts of redux state to this components props
const mapStateToProps = state => (
  {
    trip: state.trips.trip,
    isOnTrip: state.isOnTrip,
  }
);

export default withRouter(connect(mapStateToProps, {
  joinTrip, fetchTrip, cancelTrip, isOnTrip,
})(TripDetails));
// export default withRouter(connect(null, { signUpTrip, fetchTrip, cancelTrip, isOnTrip })(TripDetails));
