import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { joinTrip, fetchTrip, leaveTrip, isOnTrip } from '../actions';
import '../styles/tripdetails-style.scss';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      showMembers: false,
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.toggleMembers = this.toggleMembers.bind(this);
    this.spotsTaken = this.spotsTaken.bind(this);
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.fetchTrip(this.props.match.params.tripID);
    this.props.isOnTrip(this.props.match.params.tripID);
  }

  onSubmit() {
    if (!this.props.user.email || !this.props.user.name || !this.props.user.dash_number) {
      alert('Please fill out all of your info before signing up');
      this.props.history.push('/user');
    } else {
      this.props.joinTrip(this.props.trip._id);
      this.props.fetchTrip(this.props.match.params.tripID);
    }
  }

  onLeave() {
    this.props.leaveTrip(this.props.trip._id);
    this.props.fetchTrip(this.props.match.params.tripID);
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

  formatDate = (date) => {
    // date fix adapted from https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off/31732581
    if (!date) {
      return '';
    }
    return new Date(date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString('en-US');
  }

  showMembers = (members) => {
    if (members.length < 1) {
      return (<p> No Members Yet </p>);
    }

    return (
      members.map((member) => {
        return (<p className="member-name" key={member.id}> {member.name} </p>);
      })
    );
  }

  toggleMembers() {
    const next = !this.state.showMembers;
    this.setState({ showMembers: next });
  }

  spotsTaken = (members, limit) => {
    if (!members) { return <p />; }
    return (`${members.length} / ${limit}`);
  }

  render() {
    return (
      <div className="trip-detail-div">
        <h1> {this.props.trip.title} </h1>
        <h2> Leaders: {this.getLeaders(this.props.trip.leaders)}</h2>
        <h3> Dates: {`${this.formatDate(this.props.trip.startDate)}-${this.formatDate(this.props.trip.endDate)}`}</h3>
        <h3> Cost: ${this.props.trip.cost}</h3>
        <h3> Limit: {this.props.trip.limit} people</h3><br />
        <h3 className="member-button" onClick={this.toggleMembers}> Members: </h3>
        <div className="spots-taken">{this.spotsTaken(this.props.trip.members, this.props.trip.limit)} spots taken</div>
        {this.state.showMembers ?
          (
            this.showMembers(this.props.trip.members)
          ) : (
            <p />
          )
        }
        { this.props.isUserOnTrip ?
          (
            <div>
              <p> You are currently signed up for this trip. Click below to leave. </p>
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
    authenticated: state.auth.authenticated,
    user: state.user,
  }
);

export default withRouter(connect(mapStateToProps, {
  joinTrip, fetchTrip, leaveTrip, isOnTrip,
})(TripDetails));
