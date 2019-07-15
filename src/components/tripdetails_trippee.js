import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { addToPending, editUserGear, fetchTrip, leaveTrip, appError } from '../actions';
import '../styles/tripdetails_trippee-style.scss';

class TripeeTripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      trippeeGear: [],
      isEditing: true,
      showModal: false,
    });
    this.onGearChange = this.onGearChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.props.fetchTrip(this.props.match.params.tripID)
      .then(() => {
        if (this.props.userTripStatus === 'PENDING') {
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

  getCoLeaders = () => {
    let coleaders = '';
    const { leaders } = this.props.trip;
    leaders.forEach((leader, index) => {
      if (index !== 0) {
        coleaders += `${leader.name}, `;
      }
    });
    coleaders = coleaders.substring(0, coleaders.length - 2);
    return coleaders;
  }

  formatDate = (date, time) => {
    let timeString = '';
    const rawDate = new Date(date);
    const dateString = rawDate.toString();
    timeString = `${dateString.slice(0, 3)},${dateString.slice(3, 10)}`;
    const splitTime = time.split(':');
    splitTime.push('am');
    if (splitTime[0] > 12) {
      splitTime[0] -= 12;
      splitTime[2] = 'pm';
    }
    timeString = `${timeString}, ${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
    return timeString;
  }

  isObjectEmpty = (object) => {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  getGear = () => {
    const rows = [];
    const checkmarkClass = this.state.isEditing ? 'checkmark' : 'disabled-checkmark';
    this.props.trip.trippeeGear.forEach((gear, index, array) => {
      const checked = this.state.trippeeGear.some((userGear) => {
        return userGear.gearId === gear._id;
      });
      rows.push(
        <div key={gear._id}>
          <div className="detail-row">
            <span className="detail-left">{gear.gear}</span>
            <span>
              <label className="checkbox-container" htmlFor={gear._id}>
                <input
                  type="checkbox"
                  name="gear"
                  id={gear._id}
                  data-id={gear._id}
                  data-gear={gear.gear}
                  onChange={this.onGearChange}
                  checked={checked}
                  disabled={!this.state.isEditing}
                />
                <span className={checkmarkClass} />
              </label>
            </span>
          </div>
          {index !== array.length - 1 ? <hr className="detail-line" /> : null}
        </div>,
      );
    });
    return rows;
  }

  goBack = () => {
    this.props.history.goBack();
  }

  getStatusBanner = () => {
    switch (this.props.userTripStatus) {
      case 'NONE':
        return null;
      case 'PENDING':
        return (
          <div className="status-banner">
            <span className="status-icon">
              <img src="/src/img/pending_badge.svg" alt="pending_badge" />
            </span>
            <span className="status-message">
              <h4>
                You’ve signed up for this trip! Now we wait for the leader to confirm your spot.
              </h4>
            </span>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="status-banner">
            <span className="status-icon">
              <img src="/src/img/approved_badge.svg" alt="approved_badge" />
            </span>
            <span className="status-message">
              <h4>
                You’re officially on this trip! Please be at your pickup location 5 minutes before your start time. Have fun!
              </h4>
            </span>
          </div>
        );
      default:
        return null;
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

  showError = () => {
    this.props.appError('You can\'t edit your gear after you\'ve been approved for a trip');
  }

  showModal = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  cancelSignup = () => {
    const cancelPromise = new Promise((resolve, reject) => {
      this.props.leaveTrip(this.props.trip._id, this.props.userTripStatus);
      resolve();
    });
    cancelPromise.then(() => {
      this.setState({ showModal: false, trippeeGear: [] });
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

  getAppropriateButton = () => {
    switch (this.props.userTripStatus) {
      case 'NONE':
        return <button type="submit" className="signup-button" onClick={this.signUp}>Sign up for Trip!</button>;
      case 'PENDING':
        if (!this.state.isEditing) {
          return <button type="submit" className="signup-button" onClick={this.startEditing}>Edit gear request</button>;
        } else {
          return <button type="submit" className="signup-button" onClick={this.editGear}>Submit</button>;
        }
      case 'APPROVED':
        return <button type="submit" className="disabled" onClick={this.showError}>Edit gear request</button>;
      default:
        return <button type="submit" className="signup-button" onClick={this.signUp}>Sign up for Trip!</button>;
    }
  }

  getAppropriateLink = () => {
    switch (this.props.userTripStatus) {
      case 'NONE':
        return <span className="cancel-link" onClick={this.goBack} role="button" tabIndex={0}>Cancel</span>;
      case 'PENDING':
        if (!this.state.isEditing) {
          return <span className="cancel-link" onClick={this.showModal} role="button" tabIndex={0}>Cancel signup</span>;
        } else {
          return <span className="cancel-link" onClick={this.cancelChanges} role="button" tabIndex={0}>Cancel changes</span>;
        }
      case 'APPROVED':
        return <span className="cancel-link" onClick={this.showModal} role="button" tabIndex={0}>Cancel signup</span>;
      default:
        return <span className="cancel-link" onClick={this.goBack} role="button" tabIndex={0}>Cancel</span>;
    }
  }

  render() {
    if (!this.isObjectEmpty(this.props.trip)) {
      return (
        <div className="trip-details-container">
          <div className="trip-details-close-button">
            <i className="material-icons close-button" onClick={this.goBack} role="button" tabIndex={0}>close</i>
          </div>
          <div className="trip-details-content">

            {this.getStatusBanner()}

            <h1 className="trip-title">{this.props.trip.title}</h1>
            <div className="trip-club-container">
              <span className="trip-club">{this.props.trip.club.name}</span>
            </div>

            <div className="trip-description">
              <p>
                {this.props.trip.description}
              </p>
            </div>

            <div className="trip-detail">
              <div className="detail-row">
                <span className="detail-left">Start</span>
                <span className="detail-right">{this.formatDate(this.props.trip.startDate, this.props.trip.startTime)}</span>
              </div>
              <hr className="detail-line" />

              <div className="detail-row">
                <span className="detail-left">End</span>
                <span className="detail-right">{this.formatDate(this.props.trip.endDate, this.props.trip.endTime)}</span>
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
                <span className="detail-right">{this.getCoLeaders()}</span>
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

            <div className="trip-gear">
              <div className="gear-header">
                <span className="detail-left">Gear Item</span>
                <span className="detail-left">Need to Borrow?</span>
              </div>
              <div className="trip-detail">
                {this.getGear()}
              </div>
            </div>

            <div className="center">
              {this.getAppropriateButton()}
            </div>
            <div className="center">
              {this.getAppropriateLink()}
            </div>
            <Modal
              centered
              show={this.state.showModal}
              onHide={this.closeModal}
            >
              <div className="trip-details-close-button">
                <i className="material-icons close-button" onClick={this.closeModal} role="button" tabIndex={0}>close</i>
              </div>
              <img src="/src/img/confirmCancel.svg" alt="confirm-cancel" className="cancel-image" />
              <div className="cancel-content">
                <p className="cancel-question">Are you sure you want to cancel?</p>
                <p className="cancel-message">This cute tree will die if you do and you’ll have to register for this trip again if you change your mind</p>
              </div>
              <button type="submit" className="confirm-cancel" onClick={this.cancelSignup}>Farewell Tree</button>

            </Modal>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2>LOADING</h2>
        </div>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    trip: state.trips.trip,
    userTripStatus: state.trips.userTripStatus,
    user: state.user,
  }
);

export default withRouter(connect(mapStateToProps, {
  addToPending, editUserGear, fetchTrip, leaveTrip, appError,
})(TripeeTripDetails));
