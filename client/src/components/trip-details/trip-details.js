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
import utils from '../../utils';
import { toggleTripLeadership, fetchTrip, admitToTrip, unAdmitToTrip, deleteTrip, applyToTrip, rejectFromTrip, editUserGear, leaveTrip, toggleTripLeftStatus, toggleTripReturnedStatus, appError } from '../../actions';
import confirmCancel from './confirm-cancel.svg';

class TripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      trippeeProfileOpened: false,
      trippeeProfile: null,
      trippeeGear: [],
      showCancellationModal: false,
      cachedPerson: {},
      tripChangesModalOpen: false,
      deleteTripModalOpen: false,
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
        const tripStatus = utils.trips.calculateTripStatus(this.props.trip);
        this.setState({ status: tripStatus.status, reasons: tripStatus.reasons });
        const roleOnTrip = utils.trips.determineRoleOnTrip(this.props.user, this.props.trip);
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

  admitToTrip = (pender) => {
    this.props.admitToTrip(this.props.trip._id, pender.user._id)
      .then(() => {
        this.getProfiles();
      });
  }

  rejectFromTrip = (pender) => {
    this.props.rejectFromTrip(this.props.trip._id, pender.user._id)
      .then(() => {
        this.getProfiles();
      });
  }

  // LeaderTripDetails component methods
  toggleTripLeadership = (member) => {
    this.props.toggleTripLeadership(this.props.trip._id, member)
      .then(() => {
        this.getProfiles();
      });
  }

  unAdmitToTrip = (member) => {
    this.props.unAdmitToTrip(this.props.trip._id, member.user._id)
      .then(() => {
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

  toggleTripLeftStatus = (status) => {
    this.props.toggleTripLeftStatus(this.props.trip._id, status);
  }

  toggleTripReturnedStatus = (status) => {
    this.props.toggleTripReturnedStatus(this.props.trip._id, status);
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
            isLeaderOnTrip={this.props.isLeaderOnTrip}
            onTripEmail={utils.users.extractEmails(this.props.trip.members)}
            pendingEmail={utils.users.extractEmails(this.props.trip.pending)}
            trippeeProfileOpened={this.state.trippeeProfileOpened}
            openTrippeeProfile={trippeeProfile => this.setState({ trippeeProfileOpened: true, trippeeProfile })}
            trippeeProfile={this.state.trippeeProfile}
            hideTrippeeProfile={() => this.setState({ trippeeProfileOpened: false })}
            profiles={this.state.profiles}
            status={this.state.status}
            reasons={this.state.reasons}
            role={this.state.role}
            onTextChange={this.onTextChange}
            deleteTrip={this.deleteTrip}
            admitToTrip={this.admitToTrip}
            rejectFromTrip={this.rejectFromTrip}
            toggleTripLeadership={this.toggleTripLeadership}
            unAdmitToTrip={this.unAdmitToTrip}
            copyPendingToClip={this.copyPendingToClip}
            copyOnTripToClip={this.copyOnTripToClip}
            toggleTripLeftStatus={this.toggleTripLeftStatus}
            toggleTripReturnedStatus={this.toggleTripReturnedStatus}
            tripChangesModalOpen={this.state.tripChangesModalOpen}
            showTripChangesModal={() => { this.setState({ tripChangesModalOpen: true }); }}
            hideTripChangesModal={() => { this.setState({ tripChangesModalOpen: false }); }}
            deleteTripModalOpen={this.state.deleteTripModalOpen}
            showDeleteTripModal={() => { this.setState({ deleteTripModalOpen: true }); }}
            hideDeleteTripModal={() => { this.setState({ deleteTripModalOpen: false }); }}
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
  fetchTrip, admitToTrip, toggleTripLeadership, unAdmitToTrip, deleteTrip, applyToTrip, rejectFromTrip, editUserGear, leaveTrip, toggleTripLeftStatus, toggleTripReturnedStatus, appError,
})(TripDetails));
