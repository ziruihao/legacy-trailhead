import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrip, joinTrip, moveToPending, deleteTrip, addToPending, editUserGear, leaveTrip, appError } from '../actions';
import TripeeTripDetails from './tripdetails_trippee';
import LeaderTripDetails from './tripdetails_leader';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      pendingEmail: '',
      onTripEmail: '',
      showLeaderModal: false,
      trippeeGear: [],
      isEditing: true,
      showTrippeeModal: false,
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
        if (this.props.isLeaderOnTrip) { // populate trip participant emails
          this.populateEmails();
        } else if (this.props.userTripStatus === 'PENDING') { // populate previously selected gear
          this.props.trip.pending.some((pender) => {
            if (pender.user._id === this.props.user.id) {
              this.setState({ trippeeGear: pender.gear, isEditing: false });
            }
            return pender.user._id === this.props.user.id;
          });
        } else if (this.props.userTripStatus === 'APPROVED') {
          this.props.trip.members.some((member) => {
            if (member.user._id === this.props.user.id) {
              this.setState({ trippeeGear: member.gear, isEditing: false });
            }
            return member.user._id === this.props.user.id;
          });
        }
      });
  }

  // TrippeeTripDetails component methods
  onGearChange(event) {
    event.persist();
    if (event.target.checked) {
      this.setState(prevState => ({
        trippeeGear: [...prevState.trippeeGear, { gearId: event.target.dataset.id, gear: event.target.dataset.gear }],
      }));
    } else {
      this.setState((prevState) => {
        const withoutClickedGear = prevState.trippeeGear.filter(gear => gear.gearId !== event.target.dataset.id);
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
      if (pender.user._id === this.props.user.id) {
        this.setState({ trippeeGear: pender.gear, isEditing: false });
      }
      return pender.user._id === this.props.user.id;
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
      this.props.leaveTrip(this.props.trip._id, this.props.userTripStatus);
      resolve();
    });
    cancelPromise.then(() => {
      this.setState({ showTrippeeModal: false, trippeeGear: [], isEditing: true });
      window.scrollTo(0, 0);
    });
  }

  signUp = () => {
    if (!this.props.user.email || !this.props.user.name || !this.props.user.dash_number) {
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
      });
  }

  moveToPending = (member) => {
    this.props.moveToPending(this.props.trip._id, member)
      .then(() => {
        this.populateEmails();
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
    this.props.deleteTrip(this.props.trip.id, this.props.history);
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

  render() {
    // ref used for copy to clipboard functionality
    const ref = { pendingEmailRef: this.pendingEmailRef, onTripEmailRef: this.onTripEmailRef };
    if (!this.isObjectEmpty(this.props.trip)) {
      const appropriateComponent = this.props.isLeaderOnTrip
        ? (
          <LeaderTripDetails
            trip={this.props.trip}
            onTripEmail={this.state.onTripEmail}
            pendingEmail={this.state.pendingEmail}
            showModal={this.state.showLeaderModal}
            onTextChange={this.onTextChange}
            activateLeaderModal={this.activateLeaderModal}
            closeModal={this.closeLeaderModal}
            deleteTrip={this.deleteTrip}
            moveToTrip={this.moveToTrip}
            moveToPending={this.moveToPending}
            copyPendingToClip={this.copyPendingToClip}
            copyOnTripToClip={this.copyOnTripToClip}
            ref={ref}
          />
        )
        : (
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
            userTripStatus={this.props.userTripStatus}
          />
        );
      return (
        appropriateComponent
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
          <img src="/src/img/loading-gif.gif" alt="loading-gif" />
        </div>
      );
    }
  }
}

// connects particular parts of redux state to this components props
const mapStateToProps = state => (
  {
    trip: state.trips.trip,
    userTripStatus: state.trips.userTripStatus,
    isLeaderOnTrip: state.trips.isLeaderOnTrip,
    user: state.user,
  }
);

export default withRouter(connect(mapStateToProps, {
  fetchTrip, joinTrip, moveToPending, deleteTrip, addToPending, editUserGear, leaveTrip, appError,
})(TripDetails));
