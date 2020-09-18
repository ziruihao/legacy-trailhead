import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Badge from '../../badge';
import { Box } from '../../layout';
import confirmCancelImage from '../../../img/confirmCancel.svg';
import '../../../styles/tripdetails_trippee-style.scss';

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


const fourtyEightHoursAgo = (currentDate, Tripdate) => {
  const currentDateSecs = currentDate.getTime() + 2 * 24 * 60 * 60 * 1000;

  const tripdateSecs = Tripdate.getTime() + 24 * 60 * 60 * 1000;

  return currentDateSecs > tripdateSecs;
};

const fourtyEightHoursAgoWarning = (date) => {
  const now = new Date();
  const rawDate = new Date(date);
  if (fourtyEightHoursAgo(now, rawDate) && now < rawDate) {
    return true;
  } else {
    return false;
  }
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

const getGear = (props) => {
  if (props.trip.trippeeGear.length === 0) {
    return (
      <Box dir='row' justify='center' align='center'>
        <div className='p1 gray thin'>You can&apos;t edit requests after they&apos;ve been reviewed</div>
      </Box>
    );
  } else {
    const rows = [];
    const checkmarkClass = props.isEditing ? 'checkmark' : 'disabled-checkmark';
    props.trip.trippeeGear.forEach((gear, index, array) => {
      const checked = props.trippeeGear.some((userGear) => {
        return userGear.gearId === gear._id;
      });
      rows.push(
        <div key={gear._id}>
          <div className='detail-row'>
            <span className='detail-left'>{gear.name}</span>
            <span>
              <label className='checkbox-container' htmlFor={gear._id}>
                <input
                  type='checkbox'
                  name='gear'
                  id={gear._id}
                  data-_id={gear._id}
                  data-name={gear.name}
                  onChange={props.onGearChange}
                  checked={checked}
                  disabled={!props.isEditing}
                />
                <span className={checkmarkClass} />
              </label>
            </span>
          </div>
          {index !== array.length - 1 ? <hr className='detail-line' /> : null}
        </div>,
      );
    });
    return rows;
  }
};

// const getStatusBanner = (isUserOnTrip) => {
//   switch (isUserOnTrip) {
//     case 'NONE':
//       return null;
//     case 'PENDING':
//       return (
//         <div className="status-banner">
//           <span className="status-icon">
//             <img src={badges.pending} alt="pending_badge" />
//           </span>
//           <span className="status-message">
//             <h4>
//               You’ve signed up for this trip! Now we wait for the leader to confirm your spot.
//             </h4>
//           </span>
//         </div>
//       );
//     case 'APPROVED':
//       return (
//         <div className="status-banner">
//           <span className="status-icon">
//             <img src={badges.approved} alt="approved_badge" />
//           </span>
//           <span className="status-message">
//             <h4>
//               You’re officially on this trip! Please be at your pickup location 5 minutes before your start time. Have fun!
//             </h4>
//           </span>
//         </div>
//       );
//     default:
//       return null;
//   }
// };

const getAppropriateButton = (props) => {
  console.log(props.isUserOnTrip);
  switch (props.isUserOnTrip) {
    case 'NONE':
      return <button type='submit' className='signup-button' onClick={props.signUp}>Sign up for Trip!</button>;
    case 'PENDING':
      if (!props.isEditing) {
        if (props.trip.trippeeGear.length === 0) {
          return <button type='submit' className='disabled' disabled>Edit gear request</button>;
        } else {
          return <button type='submit' className='signup-button' onClick={props.startEditing}>Edit gear request</button>;
        }
      } else {
        return <button type='submit' className='signup-button' onClick={props.editGear}>Save</button>;
      }
    case 'APPROVED':
      return <button type='submit' className='disabled' onClick={props.showError}>Edit gear request</button>;
    default:
      return <button type='submit' className='signup-button' onClick={props.signUp}>Sign up for Trip!</button>;
  }
};

const getAppropriateLink = (props) => {
  switch (props.isUserOnTrip) {
    case 'NONE':
      return <span className='cancel-link' onClick={props.goBack} role='button' tabIndex={0}>Go Back</span>;
    case 'PENDING':
      if (!props.isEditing) {
        return <span className='cancel-link' onClick={props.activateTrippeeModal} role='button' tabIndex={0}>Cancel signup</span>;
      } else {
        return <span className='cancel-link' onClick={props.cancelChanges} role='button' tabIndex={0}>Cancel changes</span>;
      }
    case 'APPROVED':
      return <span className='cancel-link' onClick={props.activateTrippeeModal} role='button' tabIndex={0}>Cancel signup</span>;
    default:
      return <span className='cancel-link' onClick={props.goBack} role='button' tabIndex={0}>Go Back</span>;
  }
};

const TripeeTripDetails = (props) => {
  return (
    <div className='trip-details-container'>
      <div className='trip-details-close-button'>
        <i className='material-icons close-button' onClick={props.goBack} role='button' tabIndex={0}>close</i>
      </div>
      <div className='trip-details-content'>

        {/* {getStatusBanner(props.isUserOnTrip)} */}

        <h1 className='p-trip-title'>{props.trip.title}</h1>
        <div className='trip-club-container'>
          <span className='trip-club'>{props.trip.club.name}</span>
        </div>

        <div className='trip-description'>
          <p>
            {props.trip.description}
          </p>
        </div>
        <div className='invalid-email'>
          {fourtyEightHoursAgoWarning(props.trip.startDate) ? '* This trip is starting less than 48 hours from now. \n Contact the trip leader for more info *' : ''}
        </div>
        <div className='trip-detail'>
          <div className='detail-row'>
            <span className='detail-left'>Start</span>
            <span className='detail-right'>{formatDate(props.trip.startDate, props.trip.startTime)}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>End</span>
            <span className='detail-right'>{formatDate(props.trip.endDate, props.trip.endTime)}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Pickup</span>
            <span className='detail-right'>{props.trip.pickup}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Dropoff</span>
            <span className='detail-right'>{props.trip.dropoff}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Destination</span>
            <span className='detail-right'>{props.trip.location}</span>
          </div>
        </div>

        <div className='trip-detail'>
          <div className='detail-row'>
            <span className='detail-left'>Leader</span>
            <span className='detail-right'>{props.trip.owner.name}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Co-Leader(s)</span>
            <span className='detail-right'>{getCoLeaders(props.trip.leaders)}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Experience Needed?</span>
            <span className='detail-right'>{props.trip.experienceNeeded ? 'Yes' : 'No'} </span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Subclub</span>
            <span className='detail-right'>{props.trip.club.name}</span>
          </div>
          <hr className='detail-line' />

          <div className='detail-row'>
            <span className='detail-left'>Cost</span>
            <span className='detail-right'>${props.trip.cost}</span>
          </div>
        </div>

        <div className='trip-gear'>
          <div className='gear-header'>
            <span className='detail-left'>Gear Item</span>
            <span className='detail-left'>Need to Borrow?</span>
          </div>
          <div className='trip-detail'>
            {getGear(props)}
          </div>
        </div>

        <div className='center'>
          {getAppropriateButton(props)}
        </div>
        <div className='center'>
          {getAppropriateLink(props)}
        </div>
        <Modal
          centered
          show={props.showModal}
          onHide={props.closeModal}
        >
          <div className='trip-details-close-button'>
            <i className='material-icons close-button' onClick={props.closeModal} role='button' tabIndex={0}>close</i>
          </div>
          <img src={confirmCancelImage} alt='confirm-cancel' className='cancel-image' />
          <div className='cancel-content'>
            <p className='cancel-question'>Are you sure you want to cancel?</p>
            <p className='cancel-message'>This cute tree will die if you do and you’ll have to register for this trip again if you change your mind</p>
          </div>
          <button type='submit' className='confirm-cancel' onClick={props.cancelSignup}>Farewell Tree</button>

        </Modal>
      </div>
    </div>
  );
};

export default TripeeTripDetails;
