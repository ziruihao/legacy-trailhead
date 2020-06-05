import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TripeeTripDetails from './basic/tripdetails_trippee';
import LeaderTripDetails from './leader/tripdetails_leader';
import OPOTripDetails from './opo/tripdetails_opo';
import DOCLoading from '../doc-loading';
import * as constants from '../../constants';
import { fetchTrip, joinTrip, assignToLeader, moveToPending, deleteTrip, addToPending, editUserGear, leaveTrip, toggleTripReturnedStatus, appError } from '../../actions';

class TripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      pendingEmail: '',
      onTripEmail: '',
      showLeaderModal: false,
      trippeeProfileOpened: false,
      trippeeProfile: null,
      trippeeGear: [],
      isEditing: true,
      showTrippeeModal: false,
      profiles: {},
      status: 'approved',
      reasons: [],
      role: '',
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
          this.populateEmails();
          this.getProfiles();
        } else if (this.props.userTripStatus === 'PENDING') { // populate previously selected gear
          this.props.trip.pending.some((pender) => {
            if (pender.user._id === this.props.user._id) {
              this.setState({ trippeeGear: pender.gear, isEditing: false });
            }
            return pender.user._id === this.props.user._id;
          });
        } else if (this.props.userTripStatus === 'APPROVED') {
          this.props.trip.members.some((member) => {
            if (member.user._id === this.props.user._id) {
              this.setState({ trippeeGear: member.gear, isEditing: false });
            }
            return member.user._id === this.props.user._id;
          });
        }
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

  startEditing = () => {
    this.setState({ isEditing: true });
  }

  cancelChanges = () => {
    this.props.trip.pending.some((pender) => {
      if (pender.user._id === this.props.user._id) {
        this.setState({ trippeeGear: pender.gear, isEditing: false });
      }
      return pender.user._id === this.props.user._id;
    });
  }

  activateTrippeeModal = () => {
    this.setState({ showTrippeeModal: true });
  }

  closeTrippeeModal = () => {
    this.setState({ showTrippeeModal: false });
  }

  activateLeaderModal = () => {
    this.setState({ showLeaderModal: true });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  cancelSignup = () => {
    const cancelPromise = new Promise((resolve, reject) => {
      this.props.leaveTrip(this.props.trip._id, this.props.isUserOnTrip);
      resolve();
    });
    cancelPromise.then(() => {
      this.setState({ showTrippeeModal: false, trippeeGear: [], isEditing: true });
      window.scrollTo(0, 0);
    });
  }

  signUp = () => {
    if (!this.props.user.email || !this.props.user.name || !this.props.user.dash_number || !this.props.user.clothe_size || !this.props.user.shoe_size || !this.props.user.height) {
      this.props.appError('Please fill out all of your info before signing up');
      this.props.history.push('/user');
    } else {
      const signUpInfo = {
        id: this.props.trip._id,
        trippeeGear: this.state.trippeeGear,
      };
      const signupPromise = new Promise((resolve, reject) => {
        this.props.addToPending(signUpInfo);
        resolve();
      });
      signupPromise.then(() => {
        this.setState({ isEditing: false });
        window.scrollTo(0, 0);
      });
    }
  }

  editGear = () => {
    const signUpInfo = {
      id: this.props.trip._id,
      trippeeGear: this.state.trippeeGear,
    };
    const editPromise = new Promise((resolve, reject) => {
      this.props.editUserGear(signUpInfo);
      resolve();
    });
    editPromise.then(() => {
      this.setState({ isEditing: false });
    });
  }

  showError = () => {
    this.props.appError('You can\'t edit your gear after you\'ve been approved for a trip');
  }

  // LeaderTripDetails component methods
  moveToTrip = (pender) => {
    this.props.joinTrip(this.props.trip._id, pender)
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
    this.props.moveToPending(this.props.trip._id, member)
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

  populateEmails = () => {
    let pendingEmail = '';
    let onTripEmail = '';
    this.props.trip.pending.forEach((pender) => {
      pendingEmail += `${pender.user.email}, `;
    });
    this.props.trip.members.forEach((member) => {
      onTripEmail += `${member.user.email}, `;
    });
    pendingEmail = pendingEmail.substring(0, pendingEmail.length - 2);
    onTripEmail = onTripEmail.substring(0, onTripEmail.length - 2);
    this.setState({ pendingEmail, onTripEmail });
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
    if (!this.isObjectEmpty(this.props.trip)) {
      let appropriateComponent;
      if (this.state.role === 'LEADER' || this.state.role === 'OPO') {
        appropriateComponent = (
          <LeaderTripDetails
            trip={this.props.trip}
            onTripEmail={this.state.onTripEmail}
            pendingEmail={this.state.pendingEmail}
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
            assignToLeader={this.assignToLeader}
            moveToPending={this.moveToPending}
            copyPendingToClip={this.copyPendingToClip}
            copyOnTripToClip={this.copyOnTripToClip}
            toggleTripReturnedStatus={this.toggleTripReturnedStatus}
            ref={ref}
          />
        );
      } else {
        appropriateComponent = (
          <TripeeTripDetails
            trip={this.props.trip}
            trippeeGear={this.state.trippeeGear}
            isEditing={this.state.isEditing}
            showModal={this.state.showTrippeeModal}
            onGearChange={this.onGearChange}
            startEditing={this.startEditing}
            cancelChanges={this.cancelChanges}
            activateTrippeeModal={this.activateTrippeeModal}
            closeModal={this.closeTrippeeModal}
            cancelSignup={this.cancelSignup}
            signUp={this.signUp}
            editGear={this.editGear}
            goBack={this.goBack}
            showError={this.showError}
            isUserOnTrip={this.props.isUserOnTrip}
          />
        );
      }
      return (
        <div id="trip-details-page" className="center-view spacy">
          {appropriateComponent}
        </div>
      );
    } else {
      return (<DOCLoading type="doc" height="150" width="150" measure="px" />);
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
