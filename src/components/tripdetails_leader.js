import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import ProfileCard from './profilecard';
import '../styles/tripdetails_leader.scss';
import '../styles/tripdetails_trippee-style.scss';

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
};

const getPending = (props, pendingEmailRef) => {
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
          <span className="detail-cell">Name</span>
          <span className="detail-cell">Email</span>
          <span className="detail-cell">Allergies/Diet Restrictions</span>
          <span className="detail-cell">Gear Requests</span>
          <span className="detail-cell">Actions</span>
        </div>
        <hr className="detail-line" />

        {props.trip.pending.map(pender => (
          <div key={pender._id}>
            <div className="leader-detail-row">
              <span className="detail-cell">{pender.user.name}</span>
              <span className="detail-cell">{pender.user.email}</span>
              <span className="detail-cell">{pender.user.allergies_dietary_restrictions}</span>
              <span className="detail-cell detail-gear">
                {pender.gear.length !== 0 ? pender.gear.map(gear => (
                  <li key={gear._id}>{gear.gear}</li>
                )) : <span>None</span>}
              </span>
              <span className="detail-cell">
                <button type="button" className="leader-signup-button toggle-profile" onClick={() => props.toggleProfile(pender._id)}>{props.profiles[pender._id] ? 'Hide' : 'Show'} Profile</button>
                <button type="button" className="signup-button leader-signup-button" onClick={() => props.moveToTrip(pender)}>Move to trip</button>
              </span>
            </div>
            <Collapse
              in={props.profiles[pender._id]}
            >
              <div className="leader-profile-card">
                <ProfileCard
                  asProfilePage={false}
                  isEditing={false}
                  user={pender.user}
                />
              </div>
            </Collapse>
            <hr className="line" />
          </div>
        ))}

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
};

const getOnTrip = (props, onTripEmailRef) => {
  if (props.trip.members.length === 0) {
    return (
      <div className="no-on-trip">
        <h4 className="none-f-now">None</h4>
      </div>
    );
  } else {
    return (
      <div className="leader-on-trip-details">
        <div className="leader-detail-row">
          <span className="detail-cell">Name</span>
          <span className="detail-cell">Email</span>
          <span className="detail-cell">Allergies/Diet Restrictions</span>
          <span className="detail-cell">Gear Requests</span>
          <span className="detail-cell">Actions</span>
        </div>
        <hr className="detail-line" />

        {props.trip.members.map(member => (
          <div key={member._id}>
            <div className="leader-detail-row">
              <span className="detail-cell">{member.user.name}</span>
              <span className="detail-cell">{member.user.email}</span>
              <span className="detail-cell">{member.user.allergies_dietary_restrictions}</span>
              <span className="detail-cell detail-gear">
                {member.gear.length !== 0 ? member.gear.map(gear => (
                  <li key={gear._id}>{gear.gear}</li>
                )) : <span>None</span>}
              </span>
              <span className="detail-cell">
                <button type="button" className="leader-signup-button toggle-profile" onClick={() => props.toggleProfile(member._id)}>{props.profiles[member._id] ? 'Hide' : 'Show'} Profile</button>
                <button type="button" className="leader-cancel-button" onClick={() => props.moveToPending(member)}>Move to pending</button>
              </span>
            </div>
            <Collapse
              in={props.profiles[member._id]}
            >
              <div className="leader-profile-card">
                <ProfileCard
                  asProfilePage={false}
                  isEditing={false}
                  user={member.user}
                />
              </div>
            </Collapse>
            <hr className="line" />
          </div>
        ))}

        <div>
          <h5>Emails</h5>
          <div className="emails">
            <Form className="col-9">
              <Form.Control ref={onTripEmailRef} as="textarea" value={props.onTripEmail} name="onTripEmail" onChange={props.onTextChange} />
            </Form>
            <button type="button" className="signup-button leader-signup-button copy-button" onClick={props.copyOnTripToClip}>Copy</button>
          </div>
        </div>

      </div>
    );
  }
};

const getGearStatus = (gearStatus) => {
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
};

const getIndividualGear = (individualGearArray, individualGearStatus) => {
  if (individualGearArray.length === 0) {
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
          {getGearStatus(individualGearStatus)}
        </div>
        <div className="trip-detail">
          <div className="detail-row gear-header">
            <h4 className="leader-detail-left">Gear</h4>
            <h4 className="leader-detail-right">Quantity</h4>
          </div>
          <hr className="detail-line" />
          {individualGearArray.map((gear, index, array) => (
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
};

const getGroupGear = (groupGearArray, groupGearStatus) => {
  if (groupGearArray.length === 0) {
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
          {getGearStatus(groupGearStatus)}
        </div>
        <div className="trip-detail">
          <div className="leader-trip-detail-row">
            <h4>Gear</h4>
          </div>
          <hr className="detail-line" />
          {groupGearArray.map((gear, index, array) => (
            <div key={index}>
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
};

export default React.forwardRef((props, ref) => {
  console.log(props.trip.id);
  const { pendingEmailRef, onTripEmailRef } = ref;
  return (
    <div className="leader-details-container">
      <h1 className="p-trip-title">{props.trip.title}</h1>
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
              <span className="detail-right">{formatDate(props.trip.startDate, props.trip.startTime)}</span>
            </div>
            <hr className="detail-line" />

            <div className="detail-row">
              <span className="detail-left">End</span>
              <span className="detail-right">{formatDate(props.trip.endDate, props.trip.endTime)}</span>
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
        <div className="leader-table-title">
          <h2>On trip ({props.trip.members.length})</h2>
          {props.trip.members.length === 0
            ? null
            : <span className="toggle-all" onClick={props.toggleAllOnTripProfiles} role="button" tabIndex={0}>{props.showAllOnTripProfiles ? 'Hide' : 'Show'} all profiles</span>}
        </div>
        <div className="trip-detail">
          {getOnTrip(props, onTripEmailRef)}
        </div>
      </div>

      <div className="pending">
        <div className="leader-table-title">
          <h2>Pending ({props.trip.pending.length})</h2>
          {props.trip.pending.length === 0
            ? null
            : <span className="toggle-all" onClick={props.toggleAllPendingProfiles} role="button" tabIndex={0}>{props.showAllPendingProfiles ? 'Hide' : 'Show'} all profiles</span>}
        </div>
        <div className="trip-detail">
          {getPending(props, pendingEmailRef)}
        </div>
      </div>

      <div className="tripdetail-gear-requests leader-trip-info">
        <div className="individual-gear leader-trip-detail left-detail">
          <h3>Individual gear</h3>
          {getIndividualGear(props.trip.trippeeGear, props.trip.trippeeGearStatus)}
        </div>
        <div className="group-gear leader-trip-detail right-detail">
          <h3>Group gear</h3>
          {getGroupGear(props.trip.OPOGearRequests, props.trip.gearStatus)}
        </div>
      </div>

      <div className="center">
        <Link to={`/edittrip/${props.trip.id}`} className="signup-button leader-edit-link"><button type="submit" className="signup-button">Edit Trip</button></Link>
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
