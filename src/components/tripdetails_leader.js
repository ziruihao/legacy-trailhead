/* eslint-disable no-return-assign */
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { withRouter, Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// import { fetchTrip, joinTrip, moveToPending, deleteTrip } from '../actions';
import '../styles/tripdetails_leader.scss';
import '../styles/tripdetails_trippee-style.scss';

// class LeaderTripDetails extends Component {
// constructor(props) {
//   super(props);
//   this.state = ({
//     pendingEmail: '',
//     onTripEmail: '',
//     showModal: false,
//   });
// }

// componentDidMount() {
//   this.props.fetchTrip(this.props.match.params.tripID)
//     .then(() => {
//       let pendingEmail = '';
//       let onTripEmail = '';
//       this.props.trip.pending.forEach((pender) => {
//         pendingEmail += `${pender.user.email}, `;
//       });
//       this.props.trip.members.forEach((member) => {
//         onTripEmail += `${member.user.email}, `;
//       });
//       pendingEmail = pendingEmail.substring(0, pendingEmail.length - 2);
//       onTripEmail = onTripEmail.substring(0, onTripEmail.length - 2);
//       this.setState({ pendingEmail, onTripEmail });
//     });
// }

const getCoLeaders = (leaders) => {
  let coleaders = '';
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

// isObjectEmpty = (object) => {
//   return Object.entries(object).length === 0 && object.constructor === Object;
// }

getPending = (props, pendingEmailRef) => {
  if (props.trip.pending.length === 0) {
    return (
      <div className="no-on-trip">
        <h4 className="none-f-now">None</h4>
      </div>
    );
  } else {
    return (
      <div>
        <div className="leader-detail-row">
          <span>Name</span>
          <span>Email</span>
          <span>Gear Requests</span>
          <span>Action</span>
        </div>
        <hr className="detail-line" />

        {getPendingRows()}

        <div>
          <h5>Emails</h5>
          <div className="emails">
            <Form className="col-9">
              <Form.Control ref={pendingEmailRef} as="textarea" value={props.pendingEmail} name="pendingEmail" onChange={props.onTextChange} />
            </Form>
            <button type="button" className="signup-button leader-signup-button copy-button" onClick={props.copyPendingToClip}>Copy</button>
          </div>
        </div>
      </div>
    );
  }
}

getPendingRows = (penders) => {
  return penders.map(pender => (
    <div key={pender._id} className="leader-detail-row">
      <span>{pender.user.name}</span>
      <span>{pender.user.email}</span>
      <span>
        {pender.gear.map(gear => (
          <li key={gear._id}>{gear.gear}</li>
        ))}
      </span>
      <button type="button" className="signup-button leader-signup-button" onClick={() => props.moveToTrip(pender)}>Move to trip</button>
    </div>
  ));
}

getOnTrip = () => {
  if (this.props.trip.members.length === 0) {
    return (
      <div className="no-on-trip">
        <h4 className="none-f-now">None</h4>
      </div>
    );
  } else {
    return (
      <div className="leader-on-trip-details">
        <div className="leader-detail-row">
          <span>Name</span>
          <span>Email</span>
          <span>Gear Requests</span>
          <span>Action</span>
        </div>
        <hr className="detail-line" />

        {this.getOnTripRows()}

        <div>
          <h5>Emails</h5>
          <div className="emails">
            <Form className="col-9">
              <Form.Control ref={onTripEmail => this.onTripEmail = onTripEmail} as="textarea" value={this.state.onTripEmail} name="onTripEmail" onChange={this.onTextChange} />
            </Form>
            <button type="button" className="signup-button leader-signup-button copy-button" onClick={this.copyOnTripToClip}>Copy</button>
          </div>
        </div>

      </div>
    );
  }
}

getOnTripRows = () => {
  return this.props.trip.members.map(member => (
    <div key={member._id} className="leader-detail-row">
      <span>{member.user.name}</span>
      <span>{member.user.email}</span>
      <span>
        {member.gear.map(gear => (
          <li key={gear._id}>{gear.gear}</li>
        ))}
      </span>
      <button type="button" className="leader-cancel-button" onClick={() => this.moveToPending(member)}>Move to pending</button>
    </div>
  ));
}

onTextChange = (event) => {
  this.setState({
    [event.target.name]: event.target.value,
  });
}

// copyPendingToClip = (event) => {
//   this.pendingEmail.select();
//   document.execCommand('copy');
//   event.target.focus();
// }

copyOnTripToClip = (event) => {
  this.onTripEmail.select();
  document.execCommand('copy');
  event.target.focus();
}

// moveToTrip = (pender) => {
//   this.props.joinTrip(this.props.trip._id, pender);
// }

// moveToPending = (member) => {
//   this.props.moveToPending(this.props.trip._id, member);
// }

getIndividualGear = () => {
  if (this.props.trip.trippeeGear.length === 0) {
    return (
      <div className="no-gear">
        <div className="trip-detail">
          <div className="no-on-trip">
            <h4 className="none-f-now">None</h4>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="detail-row gear-status">
          <span className="detail-left">Status</span>
          {this.getGearStatus(this.props.trip.trippeeGearStatus)}
        </div>
        <div className="trip-detail">
          <div className="detail-row gear-header">
            <h4 className="leader-detail-left">Gear</h4>
            <h4 className="leader-detail-right">Quantity requested</h4>
          </div>
          <hr className="detail-line" />
          {this.props.trip.trippeeGear.map((gear, index, array) => (
            <div key={gear._id}>
              <div className="detail-row">
                <span>{gear.gear}</span>
                <span>{gear.quantity}</span>
              </div>
              {index !== array.length - 1 ? <hr className="detail-line" /> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

getGroupGear = () => {
  if (this.props.trip.OPOGearRequests.length === 0) {
    return (
      <div className="no-gear">
        <div className="trip-detail">
          <div className="no-on-trip">
            <h4 className="none-f-now">None</h4>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="detail-row gear-status">
          <span className="detail-left">Status</span>
          {this.getGearStatus(this.props.trip.gearStatus)}
        </div>
        <div className="trip-detail">
          <div className="leader-trip-detail-row">
            <h4>Gear</h4>
          </div>
          <hr className="detail-line" />
          {this.props.trip.OPOGearRequests.map((gear, index, array) => (
            <div key={gear._id}>
              <div className="leader-trip-detail-row">
                <span>{gear}</span>
              </div>
              {index !== array.length - 1 ? <hr className="detail-line" /> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

showModal = () => {
  this.setState({ showModal: true });
}

closeModal = () => {
  this.setState({ showModal: false });
}

getGearStatus = (gearStatus) => {
  switch (gearStatus) {
    case 'pending':
      return (
        <span className="detail-right">Pending <img className="status-badge" src="/src/img/pending_badge.svg" alt="pending_badge" /> </span>
      );
    case 'approved':
      return (
        <span className="detail-right">Approved <img className="status-badge" src="/src/img/approved_badge.svg" alt="approved_badge" /> </span>
      );
    case 'denied':
      return (
        <span className="leader-detail-right">Denied <img className="status-badge" src="/src/img/denied_badge.svg" alt="denied_badge" /> </span>
      );
    default:
      return (
        <span className="detail-right">Pending <img className="status-badge" src="/src/img/pending_badge.svg" alt="pending_badge" /> </span>
      );
  }
}

// deleteTrip = () => {
//   this.props.deleteTrip(this.props.trip.id, this.props.history);
// }

export default React.forwardRef((props, ref) => {
  const { pendingEmailRef, onTripEmailRef } = ref;
  return (
    <div className="leader-details-container">
      <h1 className="trip-title">{props.trip.title}</h1>
      <div className="trip-club-container">
        <span className="trip-club">{props.trip.club.name}</span>
      </div>
      <div className="leader-trip-info-and-desc">
        <h3>Trip info</h3>
        <div className="trip-description">
          <p>
            {props.trip.description}
          </p>
        </div>

        <div className="leader-trip-info">
          <div className="trip-detail leader-trip-detail left-detail">
            <div className="detail-row">
              <span className="detail-left">Start</span>
              <span className="detail-right">{this.formatDate(props.trip.startDate, props.trip.startTime)}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">End</span>
              <span className="detail-right">{this.formatDate(props.trip.endDate, props.trip.endTime)}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Pickup</span>
              <span className="detail-right">{props.trip.pickup}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Dropoff</span>
              <span className="detail-right">{props.trip.dropoff}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Destination</span>
              <span className="detail-right">{props.trip.location}</span>
            </div>
          </div>

          <div className="trip-detail leader-trip-detail right-detail">
            <div className="detail-row">
              <span className="detail-left">Leader</span>
              <span className="detail-right">{props.trip.leaders[0].name}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Co-Leader(s)</span>
              <span className="detail-right">{getCoLeaders(props.trip.leaders)}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Experience Needed?</span>
              <span className="detail-right">{props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Subclub</span>
              <span className="detail-right">{props.trip.club.name}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">Cost</span>
              <span className="detail-right">${props.trip.cost}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="on-trip">
        <h2>On trip ({props.trip.members.length})</h2>
        <div className="trip-detail">
          {this.getOnTrip(onTripEmailRef)}
        </div>
      </div>

      <div className="pending">
        <h2>Pending ({props.trip.pending.length})</h2>
        <div className="trip-detail">
          {getPending(props, pendingEmailRef)}
        </div>
      </div>

      <div className="gear-requests leader-trip-info">
        <div className="individual-gear leader-trip-detail left-detail">
          <h3>Individual gear</h3>
          {getIndividualGear()}
        </div>
        <div className="group-gear leader-trip-detail right-detail">
          <h3>Group gear</h3>
          {getGroupGear()}
        </div>
      </div>

      <div className="center">
        <Link to={`/edittrip/${props.trip.id}`} className="signup-button"><button type="submit" className="signup-button">Edit Trip</button></Link>
      </div>

      <div className="center">
        <span className="cancel-link" onClick={props.activateLeaderModal} role="button" tabIndex={0}>Delete trip</span>
      </div>

      <Modal
        centered
        show={props.showModal}
        onHide={props.closeModal}
      >
        <div className="trip-details-close-button">
          <i className="material-icons close-button" onClick={props.closeModal} role="button" tabIndex={0}>close</i>
        </div>
        <img src="/src/img/confirmDelete.jpg" alt="confirm-delete" className="cancel-image" />
        <div className="cancel-content">
          <p className="cancel-question">Are you sure you want to delete this trip?</p>
          <p className="cancel-message">You&apos;ll be letting down a lot of trees if you do</p>
        </div>
        <button type="submit" className="leader-cancel-button confirm-cancel" onClick={props.deleteTrip}>It be like that sometimes</button>

      </Modal>
    </div>
  );
});
// }

// const mapStateToProps = state => (
//   {
//     trip: state.trips.trip,
//     userTripStatus: state.trips.userTripStatus,
//     user: state.user,
//   }
// );

// export default withRouter(connect(mapStateToProps, { fetchTrip, joinTrip, moveToPending, deleteTrip })(LeaderTripDetails));