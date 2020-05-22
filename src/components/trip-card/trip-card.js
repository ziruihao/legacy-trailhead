import React from 'react';
import leaderBadge from './leader-badge.svg';
import * as constants from '../../constants';

class TripCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsLeader: false,
    };
  }

  componentDidMount() {
    // determines whether the user is a leader or co-leader in this trip
    this.props.trip.leaders.forEach(((leader) => {
      if (leader._id === this.props.user._id) {
        this.setState({ userIsLeader: true });
      }
    }));
  }

  render() {
    return (
      <div className="card trip-card margins">

        <div className="card-body" id={constants.clubDictionary(this.props.trip.club.name)}>
          <div className="label-text">TRIP #{this.props.trip.number}</div>
          <div className="h1">{this.state.userIsLeader ? '[L]' : null} {this.props.trip.title}</div>
          <p className="card-text">{constants.formatDate(this.props.trip.startDate)} - {constants.formatDate(this.props.trip.endDate)}</p>
          <p className="card-club">{this.props.trip.club ? this.props.trip.club.name : ''}</p>
        </div>
      </div>
    );
  }
}

export default TripCard;
