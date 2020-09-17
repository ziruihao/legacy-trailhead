/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import TripDetailsBasic from './basic/trip-details-basic';
import TripDetailsFull from './full/trip-details-full';
import DOCLoading from '../doc-loading';
import Text from '../text';
import * as constants from '../../constants';
import { assignToLeader, fetchTrip, joinTrip, moveToPending, deleteTrip, addToPending, editUserGear, leaveTrip, toggleTripReturnedStatus, appError } from '../../actions';
import confirmCancel from './confirm-cancel.svg';

class TripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      showLeaderModal: false,
      trippeeProfileOpened: false,
      trippeeProfile: null,
      trippeeGear: [],
      showCancellationModal: false,
      cachedPerson: {},
      tripChangesModalOpen: false,
      profiles: {},
      status: 'approved',
      reasons: [],
      role: '',
      loaded: false,
    });
    this.onGearChange = this.onGearChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.pendingEmailRef = React.createRef();
    this.onTripEmailRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchTrip(this.props.match.params.tripID)
      .then(() => {
        // calculates the final status of the trip
        const tripStatus = constants.calculateTripStatus(this.props.trip);
        this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
        const roleOnTrip = constants.determineRoleOnTrip(this.props.user, this.props.trip);
        this.setState({ role: roleOnTrip });

        if (this.props.isLeaderOnTrip) { // populate trip participant emails
          this.getProfiles();
        }

        this.setState({ loaded: true });
      });
  }

  // TrippeeTripDetails component methods
  onGearChange(event) {
    event.persist();
    if (event.target.checked) {
      this.setState(prevState => ({
        trippeeGear: [...prevState.trippeeGear, { gearId: event.target.dataset._id, name: event.target.dataset.name }],
      }));
    } else {
      this.setState((prevState) => {
        const withoutClickedGear = prevState.trippeeGear.filter(gear => gear.gearId !== event.target.dataset._id.toString());
        return {
          trippeeGear: withoutClickedGear,
        };
      });
    }
  }

  activateLeaderModal = () => {
    this.setState({ showLeaderModal: true });
  }

  cancelSignup = () => {
    this.props.leaveTrip(this.props.trip._id, this.props.user._id);
    this.props.history.push('/all-trips');
  }

  goBack = () => {
    this.props.history.goBack();
  }

  showError = () => {
    this.props.appError('You can\'t edit your gear after you\'ve been approved for a trip');
  }

  moveToTrip = (pender) => {
    this.props.joinTrip(this.props.trip._id, pender.user._id)
      .then(() => {
        this.populateEmails();
        this.getProfiles();
      });
  }

  leaveTrip = (pender) => {
    this.props.leaveTrip(this.props.trip._id, pender.user._id)
      .then(() => {
        this.populateEmails();
        this.getProfiles();
      });
  }

  // LeaderTripDetails component methods
  assignToLeader = (member) => {
    this.props.assignToLeader(this.props.trip._id, member)
      .then(() => {
        this.populateEmails();
        this.getProfiles();
      });
  }

  moveToPending = (member) => {
    this.props.moveToPending(this.props.trip._id, member.user._id)
      .then(() => {
        this.populateEmails();
        this.getProfiles();
      });
  }

  copyPendingToClip = (event) => {
    this.pendingEmailRef.current.select();
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Copied to clipboard!');
  }

  copyOnTripToClip = (event) => {
    this.onTripEmailRef.current.select();
    document.execCommand('copy');
    event.target.focus();
    this.props.appError('Copied to clipboard!');
  }

  onTextChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  deleteTrip = () => {
    this.props.deleteTrip(this.props.trip._id, this.props.history);
  }

  toggleTripReturnedStatus = (status) => {
    this.props.toggleTripReturnedStatus(this.props.trip._id, status);
  }

  closeLeaderModal = () => {
    this.setState({ showLeaderModal: false });
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  getProfiles = () => {
    const profiles = {};
    this.props.trip.pending.forEach((pender) => {
      profiles[pender._id] = false;
    });
    this.props.trip.members.forEach((member) => {
      profiles[member._id] = false;
    });
    this.setState({ profiles });
  }

  render() {
    // ref used for copy to clipboard functionality
    const ref = { pendingEmailRef: this.pendingEmailRef, onTripEmailRef: this.onTripEmailRef };
    if (this.state.loaded) {
      let appropriateComponent;
      if (this.state.role === 'LEADER' || this.state.role === 'OPO') {
        appropriateComponent = (
          <TripDetailsFull
            trip={this.props.trip}
            onTripEmail={constants.getEmails(this.props.trip.members)}
            pendingEmail={constants.getEmails(this.props.trip.pending)}
            showModal={this.state.showLeaderModal}
            trippeeProfileOpened={this.state.trippeeProfileOpened}
            openTrippeeProfile={trippeeProfile => this.setState({ trippeeProfileOpened: true, trippeeProfile })}
            trippeeProfile={this.state.trippeeProfile}
            hideTrippeeProfile={() => this.setState({ trippeeProfileOpened: false })}
            profiles={this.state.profiles}
            status={this.state.status}
            reasons={this.state.reasons}
            role={this.state.role}
            onTextChange={this.onTextChange}
            activateLeaderModal={this.activateLeaderModal}
            closeModal={this.closeLeaderModal}
            deleteTrip={this.deleteTrip}
            moveToTrip={this.moveToTrip}
            leaveTrip={this.leaveTrip}
            assignToLeader={this.assignToLeader}
            moveToPending={this.moveToPending}
            copyPendingToClip={this.copyPendingToClip}
            copyOnTripToClip={this.copyOnTripToClip}
            toggleTripReturnedStatus={this.toggleTripReturnedStatus}
            tripChangesModalOpen={this.state.tripChangesModalOpen}
            showTripChangesModal={() => { this.setState({ tripChangesModalOpen: true }); }}
            hideTripChangesModal={() => { this.setState({ tripChangesModalOpen: false }); }}
            cachedPerson={this.state.cachedPerson}
            setCachedPerson={(person) => { this.setState({ cachedPerson: person }); }}
            ref={ref}
          />
        );
      } else {
        appropriateComponent = (
          <Box pad={50}>
            <Box className='doc-card' pad={50}>
              <TripDetailsBasic openCancellationModal={() => this.setState({ showCancellationModal: true })} hideCancellationModal={() => this.setState({ showCancellationModal: false })} />
            </Box>
          </Box>
        );
      }
      return (
        <div id='trip-details-page' className='center-view spacy'>
          {appropriateComponent}
          <Modal
            centered
            show={this.state.showCancellationModal}
            onHide={() => this.setState({ showCancellationModal: false })}
          >
            <Box dir='col' align='center' pad={25}>
              <img src={confirmCancel} alt='confirm-cancel' className='cancel-image' />
              <Stack size={24} />
              <Text type='h2'>Are you sure you want to cancel?</Text>
              <Stack size={24} />
              <div className='p1 center-text'>This cute tree will die if you do and you’ll have to register for this trip again if you change your mind. Don't worry - we inform the trip leaders know so you don't have to.</div>
              <Stack size={24} />
              <Box dir='row' justify='center'>
                <div className='doc-button' onClick={() => this.setState({ showCancellationModal: false })} role='button' tabIndex={0}>Wait no</div>
                <Queue size={15} />
                <div className='doc-button alarm' onClick={this.cancelSignup} role='button' tabIndex={0}>Remove me</div>
              </Box>
            </Box>
          </Modal>
        </div>
      );
    } else {
      return (<DOCLoading type='doc' height='150' width='150' measure='px' />);
    }
  }
}

// connects particular parts of redux state to this components props
const mapStateToProps = state => (
  {
    trip: state.trips.trip,
    isUserOnTrip: state.trips.isUserOnTrip,
    isLeaderOnTrip: state.trips.isLeaderOnTrip,
    user: state.user.user,
  }
);
export default withRouter(connect(mapStateToProps, {
  fetchTrip, joinTrip, assignToLeader, moveToPending, deleteTrip, addToPending, editUserGear, leaveTrip, toggleTripReturnedStatus, appError,
})(TripDetails));
