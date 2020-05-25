/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import Badge from '../badge';
import * as constants from '../../constants';
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
          status: 'approved',
          reasons: [],
        }
    }
    componentDidMount() {
      if (!this.props.authenticated) {
        alert('Please sign in/sign up to view this page');
        this.props.history.push('/');
      }
      // calculates the final status of the trip
      const tripStatus = constants.calculateTripStatus(this.props.trip);
      this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
    }

    renderTripActionButton = () => {
      const goToTripPage = () => {
        this.props.history.push(`/trip/${this.props.trip._id}`);
      }
      switch(constants.determineRoleOnTrip(this.props.user, this.props.trip)) {
        case 'OPO':
          return <div className="doc-button disabled" onClick={goToTripPage}>View trip</div>
        case 'LEADER':
          return <div className="doc-button disabled" onClick={goToTripPage}>Manage your trip</div>
        case 'MEMBER':
          return <div className="doc-button disabled" onClick={goToTripPage}>Already on trip</div>
        case 'PENDING':
          return <div className="doc-button disabled" onClick={goToTripPage}>Awaiting approval</div>
        case 'NONE':
          return <div className="doc-button" onClick={goToTripPage}>Sign up</div>
        default:
          return <div className="doc-button" onClick={goToTripPage}>Sign up</div>
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
        <div id="trip-modal">
            <div id="trip-modal-title" className="doc-h1">{this.props.trip.title}</div>
            <div id="trip-modal-tags">
              <div id="trip-modal-club">{this.props.trip.club.name}</div>
              <div id="trip-modal-statuses">
                {isLeading ? <Badge type="leader" data-tip data-for="leader-on-trip-modal"></Badge> : null}
                <Badge type={this.state.status} dataTip={true} dataFor="trip-status-modal"/>
                <ReactToolTip id="leader-on-trip-modal" place="bottom">Your are leading this trip</ReactToolTip>
                <ReactToolTip id="trip-status-modal" place="bottom">
                  Reasons: {this.state.reasons.length > 0 ? this.state.reasons.reduce((all, current) => `${all}, ${current}`) : null}
                </ReactToolTip>
              </div>
            </div>
            <div id="trip-modal-description" className="p1">
                {this.props.trip.description}
            </div>
            {this.renderTripActionButton()}
            <div className="trip-modal-details">
              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Start</span>
                <span className="trip-modal-details-right p2">{formatDate(this.props.trip.startDate, this.props.trip.startTime)}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">End</span>
                <span className="trip-modal-details-right p2">{formatDate(this.props.trip.endDate, this.props.trip.endTime)}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Pickup</span>
                <span className="trip-modal-details-right p2">{this.props.trip.pickup}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Dropoff</span>
                <span className="trip-modal-details-right p2">{this.props.trip.dropoff}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Destination</span>
                <span className="trip-modal-details-right p2">{this.props.trip.location}</span>
              </div>
            </div>
            <div className="trip-modal-details">
              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Leader</span>
                <span className="trip-modal-details-right p2">{this.props.trip.leaders[0].name}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Co-Leader(s)</span>
                <span className="trip-modal-details-right p2">{getCoLeaders(this.props.trip.leaders)}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Experience Needed?</span>
                <span className="trip-modal-details-right p2">{this.props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Subclub</span>
                <span className="trip-modal-details-right p2">{this.props.trip.club.name}</span>
              </div>
              <hr className="trip-modal-details-line" />

              <div className="trip-modal-details-row">
                <span className="trip-modal-details-left p2">Cost</span>
                <span className="trip-modal-details-right p2">${this.props.trip.cost}</span>
              </div>
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
