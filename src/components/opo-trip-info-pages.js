/* eslint-disable */
import React from 'react';
import Modal from 'react-bootstrap/Modal';

import '../styles/createtrip-style.scss';
import '../styles/tripdetails_leader.scss';
import '../styles/tripdetails_trippee-style.scss';
import '../styles/tripdetails_opo.scss';




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

const formatDate = (startDate, endDate, startTime, endTime) => {
  let timeString = '';
  const rawStartDate = new Date(startDate);
  const startDateString = rawStartDate.toString();

  const startSplitTime = startTime.split(':');
  const endSplitTime = endTime.split(':');
  startSplitTime.push('am');
  endSplitTime.push('pm');
  if (startSplitTime[0] > 12) {
    startSplitTime[0] -= 12;
    startSplitTime[2] = 'pm';
  }
  if (endSplitTime[0] > 12) {
    endSplitTime[0] -= 12;
    endSplitTime[2] = 'am';
  }
  if (endDate === startDate) {
    timeString = `${startDateString.slice(0, 3)},${startDateString.slice(3, 10)}`;
    timeString = `${timeString} || ${startSplitTime[0]}:${startSplitTime[1]}${startSplitTime[2]} - ${endSplitTime[0]}:${endSplitTime[1]}${endSplitTime[2]}`;
  }
  else if (endDate !== ''){
    const rawEndDate = new Date(endDate);
    const endDateString = rawEndDate.toString();
    timeString = `${startDateString.slice(0, 3)},${startDateString.slice(3, 10)} - ${endDateString.slice(0, 3)},${endDateString.slice(3, 10)}`;

    timeString = `${timeString} || ${startSplitTime[0]}:${startSplitTime[1]}${startSplitTime[2]} - ${endSplitTime[0]}:${endSplitTime[1]}${endSplitTime[2]}`;
  }

  return timeString;
};

const getIndividualGear = (individualGearArray) => {
  if (individualGearArray.length === 0) {
    return (
      <div className="no-gears">
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
        <div className="trip-detail">
          {individualGearArray.map((gear, index, array) => (
            <div key={gear._id}>
              <div className="detail-row gear-content">
                <span>{gear.gear}</span>
                <span>{gear.size}</span>
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
      <div className="no-gears">
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
        <div className="trip-detail">
          {groupGearArray.map((gear, index, array) => (
            <div key={index}>
              <div className="detail-row gear-content-group">
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

const LeftColumn = (props) => {
  return (
    <div className="left-column">
      <span className="trip-title">{props.title}</span>
      <div className="row column-headers column-adjust">
        <p>Trip Overview</p>
      </div>
      <div className="row column-sub-headers">
        <div className={props.step === 1 ? 'side-bar-highlight' : ''} />
        <button className={props.step === 1 ? 'btn side-links text-highlight' : 'btn side-links'} onClick={() => props.setState(1)}>Basic information</button>
      </div>
      <div className="row column-headers">
        <p>OPO Requests</p>
      </div>
      <div className="row column-sub-headers">
        <div className={props.step === 2 ? 'side-bar-highlight' : ''} />
        <button className={props.step === 2 ? 'btn side-links text-highlight' : 'btn side-links'} onClick={() => props.setState(2)}>Gear Request</button>
      </div>
      <div className="row column-sub-headers">
        <div className={props.step === 3 ? 'side-bar-highlight' : ''} />
        <button className={props.step === 3 ? 'btn side-links text-highlight' : 'btn side-links'} onClick={() => props.setState(3)}>P-Card Request</button>
      </div>
    </div>
  );
}

const BasicInfo = (props) => {
  return (
    <div className="create-trip-form-content">
      <span className="page-title">Basic Information</span>
      <div className="row">
        <span className="sub-titles">Date</span>
        <span className="sub-fields">{formatDate(props.startDate, props.endDate, props.startTime, props.endTime)}</span>
      </div>
      <div className="row">
        <span className="sub-titles">Subclub</span>
        <span className="sub-fields">{props.clubName}</span>
      </div>
      <div className="row">
        <span className="sub-titles">Leader</span>
        <span className="sub-fields">{props.leaders}</span>
      </div>
      <div className="row">
        <span className="sub-titles">Co-Leader(s)</span>
        <span className="sub-fields">{getCoLeaders(props.coLeaders)}</span>
      </div>
      <div className="row">
        <span id="description" className="sub-titles">Description</span>
      </div>
      <div className="row">
        <span id="description-field" className="sub-fields">{props.description}</span>
      </div>
    </div>
  );
}


const PCardRequest = (props) => {
  const pcardRequest = props.trip.pcard[0];
  const snacks_unit = 3;
  const breakfast_unit = 4;
  const lunch_unit = 5;
  const dinner_unit = 6;
  const snack_total = snacks_unit * pcardRequest.snacks * pcardRequest.numPeople;
  const breakfast_total = breakfast_unit * pcardRequest.breakfast * pcardRequest.numPeople;
  const lunch_total = lunch_unit * pcardRequest.lunch * pcardRequest.numPeople;
  const dinner_total = dinner_unit * pcardRequest.dinner * pcardRequest.numPeople;
  let total = snack_total + breakfast_total + lunch_total + dinner_total;
  pcardRequest.otherCosts.forEach((otherCost) => {
    total += otherCost.cost;
  });
  return(
    <div className= "create-trip-form-content">
      <Modal
    centered
    show = {props.showModal}
  >
    <div className="trip-details-close-button">
      <i className="material-icons close-button" onClick={props.closeModal} role="button" tabIndex={0}>close</i>
    </div>
    <div className="cancel-content">
      <p className="cancel-question">Contact Leader</p>
      <p className="cancel-message">To contact the trip leader, please copy their email address and send them an email</p>
      <p className="cancel-question" id = "leader-email">{props.trip.leaders[0].email}</p>
    </div>
    <button type="button" className="btn email-copy-button" onClick={props.copy}>copy email</button>

  </Modal>
      <h1> P-Card Request </h1>
      <div>
          <table className = "pcard-overview-table">
            <thead>
              <tr>
              <th>Subclub</th>
              <th># of Participants</th>
              <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                <td>{props.trip.club.name}</td>
                <td>{pcardRequest.numPeople}</td>
                <td>${total}</td>
                </tr>
            </tbody>
          </table>
          <table>
          <thead>
            <tr>
            <th>Expense Details</th>
            <th>Unit Cost</th>
            <th># per participant</th>
            <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Snacks</td>
              <td>${snacks_unit}</td>
              <td>{pcardRequest.snacks}</td>
              <td>${snack_total}</td>
            </tr>
            <tr>
              <td>Breakfast</td>
              <td>${breakfast_unit}</td>
              <td>{pcardRequest.breakfast}</td>
              <td>${breakfast_total}</td>
            </tr>
            <tr>
              <td>Lunch</td>
              <td>${lunch_unit}</td>
              <td>{pcardRequest.lunch}</td>
              <td>${lunch_total}</td>
            </tr>
            <tr>
              <td>Dinner</td>
              <td>${dinner_unit}</td>
              <td>{pcardRequest.dinner}</td>
              <td>${dinner_total}</td>
            </tr>
            
            {pcardRequest.otherCosts.map((otherCost, index) => {
              return (
                <tr key={`othercosts_${index}`}>
                  <td>{otherCost.title}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>${otherCost.cost}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className = "pcard-assign">
            <p style= {{display: "block", fontWeight: "bold", fontSize: "12pt"}}>P-Card Assigned</p>
            <input
                    className = "pcard-assign-input"
                    onChange={props.onFieldChange}
                    name="pcardAssigned"
                    placeholder="e.g. 1234"
                    value={props.pcardAssigned}
                    />
          </div>
      </div>
      <div className="pcard-bottom-buttons">
        <span className="create-trip-pcard-add-other" onClick={props.deny} role="button" tabIndex={0}>Contact Leader</span>
        <button type="button" className="btn approve-button" onClick={props.approve}>Approve and Notify Leader</button>
      </div>
    </div>

  );
}
const GearRequest = (props) => {
  return (
    <div className="create-trip-form-content">
      <span className="page-title">Gear Request</span>
      <div className="row">
        <div className="gear-requests individual">
          <h3 className="trip-title page-headings">Individual gear</h3>
          <div className="detail-row gear-header">
            <span className="sub-titles gear-titles">Item</span>
            <span className="sub-titles gear-titles">Size</span>
            <span className="sub-titles gear-titles">Quantity</span>
          </div>
          {getIndividualGear(props.trippeeGear)}
        </div>
        <div className="gear-requests group">
          <h3 className="trip-title page-headings">Group gear</h3>
          <div className="detail-row gear-header">
            <span className="sub-titles gear-titles">Item</span>
          </div>
          {getGroupGear(props.groupGear, props.gearStatus)}
        </div>
      </div>
    </div>
  );
}

export {
  GearRequest,
  BasicInfo,
  LeftColumn,
  PCardRequest,
}
