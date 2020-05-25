/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import Badge from '../badge';
import '../trips/trip-card.scss';
import './trip-details.scss';

const getCoLeaders = (leaders) => {
  let coleaders = '';
  leaders.forEach((leader, index) => {
    if (index !== 0) {
      coleaders += `${leader.name}, `;
    }
  });
  coleaders = coleaders.substring(0, coleaders.length - 2);
  coleaders = coleaders.length === 0 ? 'None' : coleaders;
  return coleaders;
};

const formatDate = (date, time) => {
  let timeString = '';
  const rawDate = new Date(date);
  const dateString = rawDate.toUTCString();
  timeString = dateString.substring(0, 11);
  const splitTime = time.split(':');
  splitTime.push(' AM');
  const originalHour = splitTime[0];
  splitTime[0] = originalHour % 12;
  if (originalHour >= 12) {
    splitTime[2] = ' PM';
  }
  if (splitTime[0] === 0) {
    splitTime[0] = 12;
  }
  timeString = `${timeString}, ${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
  return timeString;
};

class TripDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          leadingTrip: true,
        }
    }
    componentDidMount() {
        if (!this.props.authenticated) {
          alert('Please sign in/sign up to view this page');
          this.props.history.push('/');
        }
      }

      renderTripActionButton = () => {
        if (this.props.user.role === 'Trippee') {
          console.log(this.props.isUserOnTrip);
          switch(this.props.isUserOnTrip) {
            case 'APPROVED':
              return 'You are on this trip.'
            case 'PENDING':
              return 'Waiting leader approval'
            case 'NONE':
              return 'Sign up for trip!'
            default:
              return 'Sign up for trip!'
          }
        }
          else 
          {
            return 'Manage this trip'
          }
      }

    render() {
      let isLeading = false;
      this.props.trip.leaders.some((leader) => {
        if (leader._id === this.props.user._id) {
          isLeading = true;
        }
      });

      return (
        <div id="trip-details-modal">
          <div className="content">
            <div className="trip-details-modal-title doc-h1">{this.props.trip.title}</div>
            <div className="trip-club-container">
              <span className="trip-club">{this.props.trip.club.name}</span>
            </div>
            <div className="trip-details-modal-statuses">
              {isLeading ? <Badge type="leader" data-tip data-for="leader-on-trip-modal"></Badge> : null}
              <ReactTooltip id="leader-on-trip-modal" place="bottom">Your are leading this trip</ReactTooltip>
            </div>
            <div className="trip-description">
              <p>
                {this.props.trip.description}
              </p>
            </div>

            <div className="trip-detail">
              <div className="detail-row">
                <span className="detail-left">Start</span>
                <span className="detail-right">{formatDate(this.props.trip.startDate, this.props.trip.startTime)}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">End</span>
                <span className="detail-right">{formatDate(this.props.trip.endDate, this.props.trip.endTime)}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Pickup</span>
                <span className="detail-right">{this.props.trip.pickup}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Dropoff</span>
                <span className="detail-right">{this.props.trip.dropoff}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Destination</span>
                <span className="detail-right">{this.props.trip.location}</span>
              </div>
            </div>
            <div className="trip-detail">
              <div className="detail-row">
                <span className="detail-left">Leader</span>
                <span className="detail-right">{this.props.trip.leaders[0].name}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Co-Leader(s)</span>
                <span className="detail-right">{getCoLeaders(this.props.trip.leaders)}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Experience Needed?</span>
                <span className="detail-right">{this.props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Subclub</span>
                <span className="detail-right">{this.props.trip.club.name}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">Cost</span>
                <span className="detail-right">${this.props.trip.cost}</span>
              </div>
            </div>
          </div>
          <div className="button-container">
            <NavLink className="btn btn-primary" id="signup-button" to={`/trip/${this.props.trip._id}`}>
              {this.renderTripActionButton()}
            </NavLink>
          </div>
        </div>
      );
    }
}

const mapStateToProps = state => (
    {
      isUserOnTrip: state.trips.isUserOnTrip,
      authenticated: state.auth.authenticated,
      user: state.user.user,
    }
  );
export default withRouter(connect(mapStateToProps, null)(TripDetailsModal)); // connected component
