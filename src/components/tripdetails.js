import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { joinTrip, fetchTrip, leaveTrip, isOnTrip } from '../actions';
import '../styles/tripdetails-style.scss';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  componentDidMount() {
    this.props.fetchTrip(this.props.match.params.tripID);
    this.props.isOnTrip(this.props.match.params.tripID);
  }

  onSubmit() {
    this.props.joinTrip(this.props.trip._id);
  }

  onLeave() {
    this.props.leaveTrip(this.props.trip._id);
  }

  getLeaders = (leaders) => {
    if (leaders) {
      let leaderString = '';
      for (const leader of leaders) {
        leaderString = leaderString.concat(`${leader.name}, `);
      }
      return leaderString.substring(0, leaderString.length - 2);
    }
    return '';
  }

  render() {
    return (
      <div className="trip-detail-div">
        <h1> {this.props.trip.title} </h1>
        <h2> Leaders: {this.getLeaders(this.props.trip.leaders)}</h2>
        <h3>{`Date: ${new Date(this.props.trip.startDate).toLocaleDateString('en-US')}-${new Date(this.props.trip.endDate).toLocaleDateString('en-US')}`}</h3>
        <h3> Club: {this.props.trip.club}</h3><br />
        { this.props.isUserOnTrip ?
          (
            <div>
              <p> You are currently signed up for this trip. Click below to leave the trip </p>
              <button className="button" onClick={this.onLeave}>Leave Trip</button>
            </div>
          ) :
          (
            <button className="button" onClick={this.onSubmit}>Sign Up</button>
          )
        }
        <br /><NavLink to="/mytrips">View your trips!</NavLink>
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
