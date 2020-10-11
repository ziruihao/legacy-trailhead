/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import { Stack, Queue, Divider, Box } from '../../layout';
import RequestGear from '../request-gear';
import Badge from '../../badge';
import DOCLoading from '../../doc-loading';
import Text from '../../text';
import { applyToTrip, editUserGear } from '../../../actions';
import * as constants from '../../../constants';
import '../../trip-card/trip-card.scss';
import '../trip-details.scss';
import utils from '../../../utils';

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
    const tripStatus = utils.trips.calculateTripStatus(this.props.trip);
    this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
    const roleOnTrip = utils.trips.determineRoleOnTrip(this.props.user, this.props.trip);
    this.setState({ role: roleOnTrip });
    if (roleOnTrip === 'NONE') this.setState({ editingGear: true });
    else if (roleOnTrip === 'APPROVED' || roleOnTrip === 'LEADER') this.setState({ requestedGear: this.extractUserGear(this.props.trip, this.props.user._id) });
    else if (roleOnTrip === 'PENDING') this.setState({ requestedGear: this.extractUserGear(this.props.trip, this.props.user._id) });
  }

  extractUserGear = (populatedTrip, userID) => {
    return populatedTrip.members.concat(populatedTrip.pending).filter(person => person.user._id.toString() === userID.toString())[0].requestedGear;
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
    }).then(() => {
      this.setState({ actionPending: false, editingGear: false });
    });
  };

  signUpForTrip = () => {
    this.setState({ actionPending: true });
    this.props.applyToTrip({
      id: this.props.trip._id,
      trippeeGear: this.state.requestedGear,
    }).then(() => {
      this.setState({ actionPending: false, editingGear: false, role: 'PENDING' });
    });
  };

  renderTripActionButton = () => {
    const renderGearRequestButton = () => {
      if (this.state.editingGear) {
        return (
          <Box dir='row'>
            <div className='doc-button alarm hollow'
              onClick={() => this.setState({ editingGear: false, requestedGear: this.extractUserGear(this.props.trip, this.props.user._id) })}
              role='button'
              tabIndex={0}
            >
              Cancel
            </div>
            <Queue size={15} />
            <div className='doc-button' onClick={this.saveGearRequest} role='button' tabIndex={0}>Save your gear request</div>
          </Box>
        );
      } else if (this.props.trip.trippeeGearStatus === 'pending' || this.props.isUserOnTrip === 'PENDING') {
        return <div className='doc-button hollow' onClick={() => this.setState({ editingGear: true })} role='button' tabIndex={0}>Edit your gear request</div>;
      } else {
        return (
          <>
            <div className='doc-button hollow disabled' data-tip data-for='cannot-edit-trippee-gear-request' role='button' tabIndex={0}>Edit your gear request</div>
            <ReactToolTip id='cannot-edit-trippee-gear-request' place='bottom'>You can't edit your requests because OPO staff already either approved or denied this trip's requests. Please reach out to the trip leader and OPO staff if you need gear accomodations.</ReactToolTip>
          </>
        );
      }
    };
    switch (this.state.role) {
      case 'OPO':
        return <div className='doc-button' onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role='button' tabIndex={0}>View trip as OPO staff</div>;
      case 'LEADER':
        return (
          <>
            <div className='doc-button' onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role='button' tabIndex={0}>Manage your trip</div>
            <Queue size={30} />
            {renderGearRequestButton()}
          </>
        );
      case 'APPROVED':
        return (
          <>
            <div className='doc-button alarm' onClick={this.props.openCancellationModal} role='button' tabIndex={0}>I can't go</div>
            <Queue size={30} />
            {renderGearRequestButton()}
          </>
        );
      case 'PENDING':
        return (
          <>
            <div className='doc-button alarm' onClick={this.props.openCancellationModal} role='button' tabIndex={0}>I can't go</div>
            <Queue size={30} />
            {renderGearRequestButton()}
          </>
        );
      case 'NONE':
        return <div className='doc-button' onClick={this.signUpForTrip} role='button' tabIndex={0}>Sign up</div>;
      default:
        return <div className='doc-button' onClick={this.signUpForTrip} role='button' tabIndex={0}>Sign up</div>;
    }
  }

  render() {
    if (!this.props.trip) {
      return <DOCLoading type='spin' width='50' height='50' measure='px' />;
    } else {
      return (
        <div className='trip-details'>
          <div className='trip-number'>{`TRIP #${this.props.trip.number}`}</div>

          <Text type='h1'>{this.props.trip.title}</Text>
          <Stack size={25} />
          <Box dir='row' align='center' className='trip-tags'>
            <Box pad='0 0.5em' align='center' className='trip-club-tag'>{this.props.trip.club.name}</Box>
            <Queue size={36} />
            <Box dir='row'>
              {this.state.role === 'LEADER' ? <><Badge type='leader' size={36} dataTip dataFor='leader-on-trip-modal' /><Queue size={36} /><ReactToolTip id='leader-on-trip-modal' place='bottom'>Your are leading this trip</ReactToolTip></> : null}
              {this.state.role === 'APPROVED' ? <><Badge type='person-approved' size={36} dataTip dataFor='approved-on-trip-modal' /><Queue size={36} /><ReactToolTip id='approved-on-trip-modal' place='bottom'>You've been approved to attend this trip</ReactToolTip></> : null}
              {this.state.role === 'PENDING' ? <><Badge type='person-pending' size={36} dataTip dataFor='pending-on-trip-modal' /><Queue size={36} /><ReactToolTip id='pending-on-trip-modal' place='bottom'>The leader has not approved you yet</ReactToolTip></> : null}
              <Badge type={`trip-${this.state.status}`} size={36} dataTip dataFor='trip-status-modal' />
              <ReactToolTip id='trip-status-modal' place='bottom'>
                <Box dir='col'>
                  {this.state.reasons.length > 0 ? this.state.reasons.map(reason => <div key={reason}>{reason}</div>) : 'This trip is all approved!'}
                </Box>
              </ReactToolTip>
            </Box>
            <Queue expand />
            {this.state.role !== 'OPO'
              ? (
                <div id='trip-modal-switch'>
                  <div className={`trip-modal-switch-option p1 ${this.state.viewMode === 'info' ? 'active' : null}`} onClick={() => this.setState({ viewMode: 'info' })} role='button' tabIndex={0}>Info view</div>
                  <div className='trip-modal-switch-option p1'>|</div>
                  <div className={`trip-modal-switch-option p1 ${this.state.viewMode === 'action' ? 'active' : null}`} onClick={() => this.setState({ viewMode: 'action' })} role='button' tabIndex={0}>Sign up view</div>
                </div>
              )
              : null
              }
          </Box>
          <Stack size={25} />
          <Divider size={1} />
          <Stack size={25} />
          {this.state.viewMode === 'action'
            ? (
              <>
                <Box dir='row' align='stretch'>
                  <Box dir='row' expand>
                    <Text type='p1' spacing='relaxed'>
                      Sign up for this trip here. Below are all the required gear for each trippee - request only what you need!
                    </Text>
                  </Box>
                  <Box width={50} />
                  <Box dir='row' align='center'>
                    <Text type='overline' weight='thick' color='gray3'>{`[${this.props.trip.members.length + this.props.trip.pending.length} signups]`}</Text>
                  </Box>
                </Box>
                <Stack size={25} />
                <RequestGear trippeeGear={this.props.trip.trippeeGear} requestedGear={this.state.requestedGear} editingGear={this.state.editingGear} onGearChange={this.onGearChange} loading={this.state.actionPending} />
                <Stack size={25} />
                <Box dir='row' justify='center'>
                  {this.renderTripActionButton()}
                </Box>
              </>
            )
            : (
              <>
                <div id='trip-modal-description' className='p1'>
                  {this.props.trip.description}
                </div>
                <Stack size={25} />
                <Box dir='row' justify='center'>
                  {this.state.role === 'OPO' ? <div className='doc-button' onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role='button' tabIndex={0}>View trip as OPO staff</div> : null}
                  {this.state.role === 'LEADER' ? <div className='doc-button' onClick={() => this.props.history.push(`/trip/${this.props.trip._id}`)} role='button' tabIndex={0}>Manage your trip</div> : null}
                </Box>
                <Stack size={25} />
                <div className='trip-details-table'>
                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Start</span>
                    <span className='trip-details-table-right p2'>{utils.dates.formatDate(new Date(this.props.trip.startDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(this.props.trip.startDateAndTime), { timezone: true })}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>End</span>
                    <span className='trip-details-table-right p2'>{utils.dates.formatDate(new Date(this.props.trip.endDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(this.props.trip.endDateAndTime), { timezone: true })}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Pickup</span>
                    <span className='trip-details-table-right p2'>{this.props.trip.pickup}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Dropoff</span>
                    <span className='trip-details-table-right p2'>{this.props.trip.dropoff}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Destination</span>
                    <span className='trip-details-table-right p2'>{this.props.trip.location}</span>
                  </div>
                </div>
                <Stack size={25} />
                <div className='trip-details-table'>
                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Leader</span>
                    <span className='trip-details-table-right p2'>{this.props.trip.owner.name}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Co-Leader(s)</span>
                    <span className='trip-details-table-right p2'>{utils.trips.extractCoLeaderNames(this.props.trip)}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Experience Needed?</span>
                    <span className='trip-details-table-right p2'>{this.props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Subclub</span>
                    <span className='trip-details-table-right p2'>{this.props.trip.club.name}</span>
                  </div>
                  <hr className='trip-details-table-line' />

                  <div className='trip-details-table-row'>
                    <span className='trip-details-table-left p2'>Cost</span>
                    <span className='trip-details-table-right p2'>${this.props.trip.cost}</span>
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
export default withRouter(connect(mapStateToProps, { applyToTrip, editUserGear })(TripDetailsBasic));
