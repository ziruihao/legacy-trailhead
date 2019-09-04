/* eslint-disable */
import React from 'react';
import Table from 'react-bootstrap/Table';
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
  const startAsDate = new Date(startDate);
  const startDateString = startAsDate.toUTCString();
  const displayStartDate = startDateString.substring(0, 11);

  const splitStartTime = startTime.split(':');
  splitStartTime.push(' AM');
  const originalStartHour = splitStartTime[0];
  splitStartTime[0] = originalStartHour % 12;
  if (originalStartHour >= 12) {
    splitStartTime[2] = ' PM';
  }
  if (splitStartTime[0] === 0) {
    splitStartTime[0] = 12;
  }
  const displayStartTime = `${splitStartTime[0]}:${splitStartTime[1]}${splitStartTime[2]}`;

  const endAsDate = new Date(endDate);
  const endDateString = endAsDate.toUTCString();
  const displayEndDate = endDateString.substring(0, 11);

  const splitEndTime = endTime.split(':');
  splitEndTime.push(' AM');
  const originalEndHour = splitEndTime[0];
  splitEndTime[0] = originalEndHour % 12;
  if (originalEndHour >= 12) {
    splitEndTime[2] = ' PM';
  }
  if (splitEndTime[0] === 0) {
    splitEndTime[0] = 12;
  }
  const displayEndTime = `${splitEndTime[0]}:${splitEndTime[1]}${splitEndTime[2]}`;

  return `${displayStartDate}, ${displayStartTime} - ${displayEndDate}, ${displayEndTime}`;
};

const isStringEmpty = (string) => {
  return string.length === 0 || !string.toString().trim();
};

const getIndividualGear = (trip) => {
  const gearData = {};
  const gearSizeType = {};
  trip.trippeeGear.forEach((gear) => {
    gearSizeType[gear._id] = gear.size_type;
    if (gear.size_type !== 'N/A') {
      gearData[gear._id] = {};
    }
  });
  trip.members.forEach((member) => {
    member.gear.forEach((gear) => {
      const { gearId } = gear;
      const { user } = member;
      if (gearSizeType[gearId] !== 'N/A') {
        const sizeType = gearSizeType[gearId];
        let indexer = '';
        switch (sizeType) {
          case 'Height':
            indexer = 'height';
            break;
          case 'Clothe':
            indexer = 'clothe_size';
            break;
          case 'Shoe':
            indexer = 'shoe_size';
            break;
          default:
            indexer = '';
        }
        const update = {};
        if (Object.prototype.hasOwnProperty.call(gearData[gearId], user[indexer])) {
          update[user[indexer]] = gearData[gearId][user[indexer]] + 1;
          gearData[gearId] = Object.assign({}, gearData[gearId], update);
        } else {
          update[user[indexer]] = 1;
          gearData[gearId] = Object.assign({}, gearData[gearId], update);
        }
      }
    });
  });
  return trip.trippeeGear.map((gear, index) => {
    if (Object.prototype.hasOwnProperty.call(gearData, gear._id)) {
      const entries = Object.entries(gearData[gear._id]);
      return entries.map(entry => (
        <tr key={`${gear._id}_${entry[0]}`}>
          <td>{gear.gear}</td>
          <td>{entry[0]}</td>
          <td>{entry[1]}</td>
        </tr>
      ));
    } else {
      return (
        <tr key={`${gear._id}_${index}`}>
          <td>{gear.gear}</td>
          <td>N/A</td>
          <td>{gear.quantity}</td>
        </tr>
      );
    }
  });
};

const getGroupGear = (groupGearArray) => {
  return groupGearArray.map((groupGear, index) => {
    return (
      <tr key={`groupGear_${index}`}>
        <td>{groupGear}</td>
      </tr>
    );
  });
};

const BasicInfo = (props) => {
  const { trip } = props;
  return (
    <div className="create-trip-form-content otd-basic-info">
      <div className="vrf-title-container otd-title-container">
        <h2 className="p-trip-title otd-title-size">Basic Information</h2>
      </div>
      <div className="otd-trip-details">
        <div className="otd-details-labels">
          <div className="otd-row">
            <span className="sub-titles">Date</span>
          </div>
          <div className="otd-row">
            <span className="sub-titles">Subclub</span>
          </div>
          <div className="otd-row">
            <span className="sub-titles">Leader</span>
          </div>
          <div className="otd-row">
            <span className="sub-titles">Co-Leader(s)</span>
          </div>
        </div>
        <div className="otd-details-column">
          <div className="otd-row">
            <span className="sub-fields">{formatDate(trip.startDate, trip.endDate, trip.startTime, trip.endTime)}</span>
          </div>
          <div className="otd-row">
            <span className="sub-fields">{trip.club.name}</span>
          </div>
          <div className="otd-row">
            <span className="sub-fields">{trip.leaders[0].name}</span>
          </div>
          <div className="otd-row">
            <span className="sub-fields">{getCoLeaders(trip.leaders)}</span>
          </div>
        </div>
      </div>
      <div className="otd-trip-description">
        <span className="sub-titles">Description</span>
        <div className="otd-row">
          <div className="description-field sub-fields">{trip.description}</div>
        </div>
      </div>
    </div>
  );
}

const GearRequest = (props) => {
  const { trip } = props;
  return (
    <div className="create-trip-form-content otd-basic-info">
      <div className="vrf-title-container otd-title-container">
        <h2 className="p-trip-title otd-title-size">Gear Request</h2>
      </div>
      <div className="otd-both-gear">
        {trip.gearStatus !== 'N/A'
          ? (
            <div className="otd-group-gear">
              <span className="sub-titles">Group Gear</span>
              <div className="detail-row gear-status">
                <span className="detail-left">Status</span>
                <span className="detail-right otd-req-status">{trip.gearStatus} <img className="status-badge" src={`/src/img/${trip.gearStatus}_badge.svg`} alt={`${trip.gearStatus}_badge`} /> </span>
              </div>
              <div className="trip-detail otd-group-gear-table ovr-white-background">
                <Table responsive="lg">
                  <thead>
                    <tr>
                      <th>Item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGroupGear(trip.OPOGearRequests)}
                  </tbody>
                </Table>
              </div>
              <div className="otd-response-buttons">
                {(props.trip.gearStatus !== 'approved')
                  ? < button type="submit" className="vrf-submit-button signup-button otd-approve-gear-button" onClick={() => props.reviewGroupGearRequest('approved')}>Approve Group Gear Request</button>
                  : <button type="submit" className="disabled vrf-submit-button otd-approve-gear-button otd-disabled-button">Approve Group Gear Request</button>}
                {(props.trip.gearStatus !== 'denied')
                  ? (
                    <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={() => props.reviewGroupGearRequest('denied')} role="button" tabIndex={0}>
                      Deny Group Gear Request
                    </span>
                  )
                  : (
                    <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button otd-disabled-link">
                      Deny Group Gear Request
                    </span>
                  )
                }
              </div>
            </div>
          )
          : null}

        {trip.trippeeGearStatus !== 'N/A'
          ? (
            <div className="otd-individual-gear">
              <span className="sub-titles">Individual Gear</span>
              <div className="detail-row gear-status">
                <span className="detail-left">Status</span>
                <span className="detail-right otd-req-status">{trip.trippeeGearStatus} <img className="status-badge" src={`/src/img/${trip.trippeeGearStatus}_badge.svg`} alt={`${trip.trippeeGearStatus}_badge`} /> </span>
              </div>
              <div className="trip-detail otd-group-gear-table ovr-white-background">
                <Table responsive="lg">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Size</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getIndividualGear(trip)}
                  </tbody>
                </Table>
              </div>
              <div className="otd-response-buttons">
                {(props.trip.trippeeGearStatus !== 'approved')
                  ? < button type="submit" className="vrf-submit-button signup-button otd-approve-gear-button" onClick={() => props.reviewTrippeeGearRequest('approved')}>Approve Individual Gear Request</button>
                  : <button type="submit" className="disabled vrf-submit-button otd-approve-gear-button otd-disabled-button">Approve Individual Gear Request</button>}
                {(props.trip.trippeeGearStatus !== 'denied')
                  ? (
                    <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={() => props.reviewTrippeeGearRequest('denied')} role="button" tabIndex={0}>
                      Deny Individual Gear Request
                    </span>
                  )
                  : (
                    <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button otd-disabled-link">
                      Deny Individual Gear Request
                    </span>
                  )
                }
              </div>
            </div>
          )
          : null}
      </div>
    </div>
  );
}

const getAppropriateLink = (props) => {
  const { pcardStatus } = props.trip;
  if (props.isEditingPcard) {
    return (
      <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={props.cancelPcardUpdate} role="button" tabIndex={0}>
        Cancel update
      </span>
    )
  } else {
    if (pcardStatus !== 'denied') {
      return (
        <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button" onClick={() => props.reviewPcardRequest('denied')} role="button" tabIndex={0}>
          Deny P-Card Request
        </span>
      )
    } else {
      return (
        <span className="cancel-link ovr-bottom-link ovr-skip-vehicle-button otd-disabled-link">
          Deny P-Card Request
        </span>
      )
    }
  }
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
  const pcardStatus = props.trip.pcardStatus;
  return (
    <div className="create-trip-form-content otd-basic-info">
      <div className="vrf-title-container otd-title-container">
        <h2 className="p-trip-title otd-title-size">P-Card Request</h2>
        <span className="vrf-status-display">
          <span className="vrf-label">
            Status:
                </span>
          <span className="vrf-req-status-display">
            {pcardStatus}
          </span>
          <span className="vrf-req-status-badge">
            <img className="status-badge" src={`/src/img/${pcardStatus}_badge.svg`} alt={`${pcardStatus}_badge`} />
          </span>
        </span>
      </div>
      <div className="otd-pcard-top-part">
        <div className="trip-detail otd-group-gear-table ovr-white-background otd-pcard-numPeople">
          <Table responsive="lg">
            <thead>
              <tr>
                <th>Approx. # of participants</th>
                <th># on trip (including leaders)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{pcardRequest.numPeople}</td>
                <td>{props.trip.members.length + props.trip.leaders.length}</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="pcard-assign">
          <span className="otd-pcard-assign-label">{props.isEditingPcard ? 'Assign P-Card' : 'Assigned P-Card'}</span>
          {props.isEditingPcard
            ? (
              <input
                className="pcard-assign-input"
                onChange={props.onFieldChange}
                name="pcardAssigned"
                placeholder="e.g. 1234"
                value={props.pcardAssigned}
              />
            )
            : (
              <span className={`otd-pcard-assign-label trip-detail ovr-white-background ${pcardStatus === 'denied' ? 'ovr-skipped-detail' : ''}`}>
                {pcardStatus === 'denied' ? 'Denied' : props.trip.pcardAssigned}
              </span>
            )
          }
        </div>
      </div>
      <div className="trip-detail otd-group-gear-table ovr-white-background">
        <Table responsive="lg">
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
        </Table>
        <span className="otd-pcard-total">
          Total Cost: ${total}
        </span>
      </div>
      <div className="otd-pcard-response-buttons">
        {getAppropriateLink(props)}
        {(props.isEditingPcard)
          ? (
            <button
              type="submit"
              className="vrf-submit-button signup-button otd-approve-pcard-button"
              onClick={() => props.reviewPcardRequest('approved')}
            >
              {pcardStatus === 'pending' ? 'Approve P-Card Request' : 'Save'}
            </button>
          )
          : (
            <button
              type="submit"
              className="vrf-submit-button signup-button otd-approve-pcard-button"
              onClick={props.startEditingPcard}
            >
              Update Assignment
            </button>
          )}
      </div>
    </div>

  );
}

export {
  GearRequest,
  BasicInfo,
  PCardRequest,
}
