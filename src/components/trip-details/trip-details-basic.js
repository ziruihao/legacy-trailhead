/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import RequestGear from './request-gear'
import ReactToolTip from 'react-tooltip';
import Badge from '../badge';
import {addToPending, editUserGear} from '../../actions';
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
          viewMode: 'info',
          role: true,
          status: 'approved',
          reasons: [],
          requestedGear: [],
          editingGear: false,
          actionPending: false,
        }
    }
    componentWillMount() {
      // calculates the final status of the trip
      const tripStatus = constants.calculateTripStatus(this.props.trip);
      this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
      const roleOnTrip = constants.determineRoleOnTrip(this.props.user, this.props.trip);
      this.setState({role: roleOnTrip})
      if (roleOnTrip === 'NONE') this.setState({editingGear: true})
      else if (roleOnTrip === 'APPROVED' || roleOnTrip === 'LEADER') this.setState({requestedGear: this.props.trip.members.filter(member => member.user._id === this.props.user._id)[0].gear});
      else if (roleOnTrip === 'PENDING') this.setState({requestedGear: this.props.trip.pending.filter(pender => pender.user._id === this.props.user._id)[0].gear});
    }

    renderTripActionButton = () => {
      const goToTripPage = () => {
        this.props.history.push(`/trip/${this.props.trip._id}`);
      }
      const signUpForTrip = () => {
        this.setState({actionPending: true});
        this.props.addToPending({
          id: this.props.trip._id,
          trippeeGear: this.state.requestedGear,
        }).then(modifiedTrip => {
          this.setState({actionPending: false});
        });
      }
      const saveGearRequest = () => {
        this.setState({actionPending: true});
        this.props.editUserGear({
          id: this.props.trip._id,
          trippeeGear: this.state.requestedGear,
        }).then(modifiedTrip => {
          this.setState({actionPending: false});
        });
      }
      const renderGearRequestButton = () => {
        if (this.state.editingGear) return <div className="doc-button" onClick={saveGearRequest}>Save your gear request</div>
        else return <div className="doc-button hollow" onClick={() => this.setState({editingGear: true})}>Edit your gear request</div>
      }
      switch(this.state.role) {
        case 'OPO':
          return <div className="doc-button" onClick={goToTripPage}>View trip as OPO staff</div>
        case 'LEADER':
          return (
            <>
              <div className="doc-button" onClick={goToTripPage}>Manage your trip</div>
              {renderGearRequestButton()}
            </>
          )
        case 'MEMBER':
          return (
            <>
              <div className="doc-button alarm" onClick={goToTripPage}>I can't go</div>
              {renderGearRequestButton()}
            </>
          )
        case 'PENDING':
          return (
            <>
              <div className="doc-button alarm" onClick={goToTripPage}>I can't go</div>
              {renderGearRequestButton()}
            </>
          )
        case 'NONE':
          return <div className="doc-button" onClick={signUpForTrip}>Sign up</div>
        default:
          return <div className="doc-button" onClick={signUpForTrip}>Sign up</div>
      }
    }

    render() {
      if (!this.props.trip) {
        return <Loading type="spin" width="50" height="50" measure="px"></Loading>
      } else {
        return (
          <div id="trip-modal">
              <div id="trip-modal-number">{`TRIP #${this.props.trip.number}`}</div>
              <div id="trip-modal-title" className="doc-h1">{this.props.trip.title}</div>
              <div id="trip-modal-tags">
                <div id="trip-modal-club">{this.props.trip.club.name}</div>
                <div id="trip-modal-statuses">
                  {this.state.role === 'LEADER' ? <Badge type="leader" data-tip data-for="leader-on-trip-modal"></Badge> : null}
                  <Badge type={this.state.status} dataTip={true} dataFor="trip-status-modal"/>
                  <ReactToolTip id="leader-on-trip-modal" place="bottom">Your are leading this trip</ReactToolTip>
                  <ReactToolTip id="trip-status-modal" place="bottom">
                    Reasons: {this.state.reasons.length > 0 ? this.state.reasons.reduce((all, current) => `${all}, ${current}`) : null}
                  </ReactToolTip>
                </div>
                <div id="trip-modal-switch">
                  <div className={`trip-modal-switch-option p1 ${this.state.viewMode === "info" ? "active" : null}`} onClick={() => this.setState({viewMode: "info"})}>Info view</div>
                  <div className="trip-modal-switch-option p1">|</div>
                  <div className={`trip-modal-switch-option p1 ${this.state.viewMode === "action" ? "active" : null}`} onClick={() => this.setState({viewMode: "action"})}>Sign up view</div>
                </div>
              </div>
              <hr className="heavy-line"></hr>
              {this.state.viewMode === 'action' ?
                <>
                  <div id="trip-modal-description" className="p1">
                    Sign up for this trip here. Below are all the required gear for each trippee - request only what you need!
                  </div>
                  <RequestGear trippeeGear={this.props.trip.trippeeGear} selfGear={this.state.requestedGear} isEditing={this.state.editingGear} updateGear={(update) => this.setState({requestedGear: update})} loading={this.state.actionPending}></RequestGear>
                  <div className="trip-modal-actions">
                    {this.renderTripActionButton()}
                  </div>
                </>
                :
                <>
                  <div id="trip-modal-description" className="p1">
                    {this.props.trip.description}
                  </div>
                  {this.state.role === 'OPO' ? <div className="doc-button" onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role="button" tabIndex={0}>View trip as OPO staff</div> : null}
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
                </>
              }
          </div>
        );
      }
    }
}

const mapStateToProps = state => (
    {
      trip: state.trips.trip,
      isUserOnTrip: state.trips.isUserOnTrip,
      authenticated: state.auth.authenticated,
      user: state.user.user,
    }
  );
export default withRouter(connect(mapStateToProps, {addToPending, editUserGear})(TripDetailsModal)); // connected component
