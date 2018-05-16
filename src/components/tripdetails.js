import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import '../style.scss';
import { signUpTrip, fetchTrip, cancelTrip } from '../actions';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  // componentDidMount() {
  //   this.props.loadTrip(this.props.trip.id);
  // }

  onSubmit() {
    console.log('onSubmitClick');

    this.props.signUpTrip(this.props.trip.id);
  }

  onCancel() {
    console.log('onCancelClick');

    this.props.cancelTrip(this.props.trip.id);
  }

  render() {
    return (
      <div>
        {/*
          <h1> {this.props.trip.title}</h3>
          <h2> {this.props.trip.leader}</h2>
          <h3> {this.props.trip.time}</h3>
          <p> conditional on {this.props.trip.isAttending} </p>
        */}
        <h1> Whitewater Kayaking</h1>
        <h2> Lead by: Sam Sam, Ben Ben </h2>
        <h3> Tuesday May 15, 3am - 5am </h3>
        <p> You are not currently signed up for this trip </p>
        <button className="button" onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}


// connects particular parts of redux state to this components props
// const mapStateToProps = state => (
//   {
//     trip: state.trips.trip,
//   }
// );

// export default withRouter(connect(mapStateToProps, { signUpTrip, fetchTrip, cancelTrip })(TripDetails));
export default withRouter(connect(null, { signUpTrip, fetchTrip, cancelTrip })(TripDetails));
