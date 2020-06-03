/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import { Stack, Queue, Divider, Box } from '../../layout';
import RequestGear from '../request-gear';
import Badge from '../../badge';
import Loading from '../../doc-loading';
import { addToPending, editUserGear } from '../../../actions';
import * as constants from '../../../constants';
import '../../trips/trip-card.scss';
import '../trip-details.scss';

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

class TripDetailsBasic extends Component {
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
    };
  }

  componentDidMount() {
    // calculates the final status of the trip
    const tripStatus = constants.calculateTripStatus(this.props.trip);
    this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
    const roleOnTrip = constants.determineRoleOnTrip(this.props.user, this.props.trip);
    this.setState({ role: roleOnTrip });
    if (roleOnTrip === 'NONE') this.setState({ editingGear: true });
    else if (roleOnTrip === 'APPROVED' || roleOnTrip === 'LEADER') this.setState({ requestedGear: this.extractUserGear(this.props.trip, this.props.user._id) });
    else if (roleOnTrip === 'PENDING') this.setState({ requestedGear: this.extractUserGear(this.props.trip, this.props.user._id) });
  }

  extractUserGear = (populatedTrip, userID) => {
    return populatedTrip.members.concat(populatedTrip.pending).filter(person => person.user._id.toString() === userID.toString())[0].gear;
  }

  onGearChange = (event) => {
    event.persist();
    if (event.target.checked) {
      this.setState(prevState => ({
        requestedGear: [...prevState.requestedGear, { gearId: event.target.dataset._id, name: event.target.dataset.name }],
      }));
    } else {
      this.setState((prevState) => {
        const withoutClickedGear = prevState.requestedGear.filter(gear => gear.gearId !== event.target.dataset._id.toString());
        return {
          requestedGear: withoutClickedGear,
        };
      });
    }
  }

  saveGearRequest = () => {
    this.setState({ actionPending: true });
    this.props.editUserGear({
      id: this.props.trip._id,
      trippeeGear: this.state.requestedGear,
    }).then((modifiedTrip) => {
      this.setState({ actionPending: false, editingGear: false });
    });
  };

  goToTripPage = () => {
    this.props.history.push(`/trip/${this.props.trip._id}`);
  };

  signUpForTrip = () => {
    this.setState({ actionPending: true });
    this.props.addToPending({
      id: this.props.trip._id,
      trippeeGear: this.state.requestedGear,
    }).then((modifiedTrip) => {
      this.setState({ actionPending: false, editingGear: false });
    });
  };

  renderTripActionButton = () => {
    const renderGearRequestButton = () => {
      if (this.state.editingGear) {
        return (
          <Box dir="row">
            <div className="doc-button alarm"
              onClick={() => this.setState({ editingGear: false, requestedGear: this.extractUserGear(this.props.trip, this.props.user._id) })}
              role="button"
              tabIndex={0}
            >
              Cancel
            </div>
            <Queue size={15} />
            <div className="doc-button" onClick={this.saveGearRequest} role="button" tabIndex={0}>Save your gear request</div>
          </Box>
        );
      } else return <div className="doc-button hollow" onClick={() => this.setState({ editingGear: true })} role="button" tabIndex={0}>Edit your gear request</div>;
    };
    switch (this.state.role) {
      case 'OPO':
        return <div className="doc-button" onClick={this.goToTripPage} role="button" tabIndex={0}>View trip as OPO staff</div>;
      case 'LEADER':
        return (
          <>
            <div className="doc-button" onClick={this.goToTripPage} role="button" tabIndex={0}>Manage your trip</div>
            <Queue size={30} />
            {renderGearRequestButton()}
          </>
        );
      case 'APPROVED':
        return (
          <>
            <div className="doc-button alarm" onClick={this.goToTripPage} role="button" tabIndex={0}>I can't go</div>
            <Queue size={30} />
            {renderGearRequestButton()}
          </>
        );
      case 'PENDING':
        return (
          <>
            <div className="doc-button alarm" onClick={this.goToTripPage} role="button" tabIndex={0}>I can't go</div>
            <Queue size={30} />
            {renderGearRequestButton()}
          </>
        );
      case 'NONE':
        return <div className="doc-button" onClick={this.signUpForTrip} role="button" tabIndex={0}>Sign up</div>;
      default:
        return <div className="doc-button" onClick={this.signUpForTrip} role="button" tabIndex={0}>Sign up</div>;
    }
  }

  render() {
    if (!this.props.trip) {
      return <Loading type="spin" width="50" height="50" measure="px" />;
    } else {
      return (
        <div className="trip-details">
          <div className="trip-number">{`TRIP #${this.props.trip.number}`}</div>
          <div className="doc-h1">{this.props.trip.title}</div>
          <Stack size={25} />
          <div className="trip-tags">
            <div className="trip-club-tag">{this.props.trip.club.name}</div>
            <div id="trip-statuses">
              {this.state.role === 'LEADER' ? <><Badge type="leader" dataTip dataFor="leader-on-trip-modal" /><ReactToolTip id="leader-on-trip-modal" place="bottom">Your are leading this trip</ReactToolTip></> : null}
              <Badge type={this.state.status} dataTip dataFor="trip-status-modal" />
              <ReactToolTip id="trip-status-modal" place="bottom">
                <Box dir="col">
                  {this.state.reasons.length > 0 ? this.state.reasons.map(reason => <div key={reason}>{reason}</div>) : null}
                </Box>
              </ReactToolTip>
            </div>
            {this.state.role !== 'OPO'
              ? (
                <div id="trip-modal-switch">
                  <div className={`trip-modal-switch-option p1 ${this.state.viewMode === 'info' ? 'active' : null}`} onClick={() => this.setState({ viewMode: 'info' })} role="button" tabIndex={0}>Info view</div>
                  <div className="trip-modal-switch-option p1">|</div>
                  <div className={`trip-modal-switch-option p1 ${this.state.viewMode === 'action' ? 'active' : null}`} onClick={() => this.setState({ viewMode: 'action' })} role="button" tabIndex={0}>Sign up view</div>
                </div>
              )
              : null
              }
          </div>
          <Stack size={25} />
          <Divider size={1} />
          <Stack size={25} />
          {this.state.viewMode === 'action'
            ? (
              <>
                <div id="trip-modal-description" className="p1">
                  Sign up for this trip here. Below are all the required gear for each trippee - request only what you need!
                </div>
                <Stack size={25} />
                <RequestGear trippeeGear={this.props.trip.trippeeGear} requestedGear={this.state.requestedGear} editingGear={this.state.editingGear} onGearChange={this.onGearChange} loading={this.state.actionPending} />
                <Stack size={25} />
                <Box dir="row" justify="center">
                  {this.renderTripActionButton()}
                </Box>
              </>
            )
            : (
              <>
                <div id="trip-modal-description" className="p1">
                  {this.props.trip.description}
                </div>
                <Stack size={25} />
                <Box dir="row" justify="center">
                  {this.state.role === 'OPO' ? <div className="doc-button" onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role="button" tabIndex={0}>View trip as OPO staff</div> : null}
                  {this.state.role === 'LEADER' ? <div className="doc-button" onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role="button" tabIndex={0}>Manage your trip</div> : null}
                </Box>
                <Stack size={25} />
                <div className="trip-details-table">
                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Start</span>
                    <span className="trip-details-table-right p2">{formatDate(this.props.trip.startDate, this.props.trip.startTime)}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">End</span>
                    <span className="trip-details-table-right p2">{formatDate(this.props.trip.endDate, this.props.trip.endTime)}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Pickup</span>
                    <span className="trip-details-table-right p2">{this.props.trip.pickup}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Dropoff</span>
                    <span className="trip-details-table-right p2">{this.props.trip.dropoff}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Destination</span>
                    <span className="trip-details-table-right p2">{this.props.trip.location}</span>
                  </div>
                </div>
                <Stack size={25} />
                <div className="trip-details-table">
                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Leader</span>
                    <span className="trip-details-table-right p2">{this.props.trip.leaders[0].name}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Co-Leader(s)</span>
                    <span className="trip-details-table-right p2">{getCoLeaders(this.props.trip.leaders)}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Experience Needed?</span>
                    <span className="trip-details-table-right p2">{this.props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Subclub</span>
                    <span className="trip-details-table-right p2">{this.props.trip.club.name}</span>
                  </div>
                  <hr className="trip-details-table-line" />

                  <div className="trip-details-table-row">
                    <span className="trip-details-table-left p2">Cost</span>
                    <span className="trip-details-table-right p2">${this.props.trip.cost}</span>
                  </div>
                </div>
              </>
            )
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
export default withRouter(connect(mapStateToProps, { addToPending, editUserGear })(TripDetailsBasic));
