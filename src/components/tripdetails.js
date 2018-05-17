import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import '../style.scss';
import { joinTrip, fetchTrip, cancelTrip, isOnTrip } from '../actions';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.props.fetchTrip(this.props.trip.id);
    this.props.isOnTrip(this.props.trip.id);
  }

  onSubmit() {
    console.log('onSubmitClick');

    this.props.joinTrip(this.props.trip.id);
  }

  onCancel() {
    console.log('onCancelClick');

    this.props.cancelTrip(this.props.trip.id);
  }

  render() {
    return (
      <div>
        <h1> Hi Brian </h1>
        {/* <h1> {this.props.trip.title} </h1>
        <h2> {this.props.trip.leader}</h2>
        <h3> {this.props.trip.time}</h3>
        { this.props.isOnTrip ?
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
