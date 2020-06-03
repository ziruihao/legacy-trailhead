/* eslint-disable */
import React from 'react';
import Table from 'react-bootstrap/Table';
import Badge from './badge';
import { Stack, Queue, Divider, Box } from './layout';
import '../styles/tripdetails_opo.scss';
import ReactTooltip from 'react-tooltip';

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

const getApprovedTrippees = (members, leaders) => {
  let trippees = '';
  leaders = leaders.map(leader => leader._id);
  members.forEach((member) => {
    if (!leaders.includes(member.user._id)) {
      trippees += `${member.user.name}, `;
    }
  });
  trippees = trippees.substring(0, trippees.length - 2);
  trippees = trippees.length === 0 ? 'None' : trippees;
  return trippees;
}

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
      if (gear.name) {
        console.log('gear',gear)
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
      }
    });
  });
  return trip.trippeeGear.map((gear, index) => {
    if (Object.prototype.hasOwnProperty.call(gearData, gear._id)) {
      const entries = Object.entries(gearData[gear._id]);
      console.log(entries);
      return entries.map(entry => (
        <tr key={`${gear._id}_${entry[0]}`}>
          <td>{gear.name}</td>
          <td>{entry[0]}</td>
          <td>{entry[1]}</td>
        </tr>
      ));
    } else {
      return (
        <tr key={`${gear._id}_${index}`}>
          <td>{gear.name}</td>
          <td>{gear.size_type}</td>
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
    <>
      <div className="doc-h1">Trip #{trip.number}: {trip.title}</div>
      <Stack size={50}></Stack>
      <div className="doc-h2">Basic details</div>
      <Stack size={25}></Stack>
      <Box dir="row" align="stretch">
        <Box dir="col">
            <div className="p1 thick gray">Date</div>
            <Stack size={18}></Stack>
            <div className="p1 thick gray">Subclub</div>
            <Stack size={18}></Stack>
            <div className="p1 thick gray">Leader</div>
            <Stack size={18}></Stack>
            <div className="p1 thick gray">Co-Leader(s)</div>
            <Stack size={18}></Stack>
            <div className="p1 thick gray">Approved Trippees</div>
        </Box>
        <Queue size={25}></Queue>
        <Divider dir="col" size={1}></Divider>
        <Queue size={25}></Queue>
        <Box dir="col">
            <div className="p1">{formatDate(trip.startDate, trip.endDate, trip.startTime, trip.endTime)}</div>
            <Stack size={18}></Stack>
            <div className="p1">{trip.club.name}</div>
            <Stack size={18}></Stack>
            <div className="p1">{trip.leaders[0].name}</div>
            <Stack size={18}></Stack>
            <div className="p1">{getCoLeaders(trip.leaders)}</div>
            <Stack size={18}></Stack>
            <div className="p1">{getApprovedTrippees(trip.members, trip.leaders)}</div>
        </Box>
      </Box>
      <Stack size={50}></Stack>
      <div className="doc-h2">Description</div>
      <Stack size={25}></Stack>
      <div className="p1">{trip.description}</div>
      {/* <div className="otd-trip-description">
        <span className="sub-titles">Description</span>
        <div className="otd-row">
          <div className="description-field sub-fields">
            {trip.description}
          </div>
        </div>
      </div> */}
    </>
  );
}

const GearRequest = (props) => {
  const { trip } = props;
  return (
    <>
      <div className="doc-h1">Gear requests</div>
      <Stack size={50}></Stack>
      <Box dir="row" justify="center">
        {trip.gearStatus !== 'N/A'
          ? (
            <Box dir="col" expand>
              <Box dir="row" justify="between" align="center">
                <div className="doc-h2">For the group</div>
                <Badge type={trip.gearStatus} size={36}></Badge>
              </Box>
              <Stack size={25}></Stack>
              <Box className="doc-bordered doc-card" pad={10}>
              <Table className="doc-table">
                <thead>
                  <tr>
                    <th>Item</th>
                  </tr>
                </thead>
                <tbody>
                  {getGroupGear(trip.OPOGearRequests)}
                </tbody>
              </Table>
              </Box>
              <Stack size={25}></Stack>
              <Box dir="row" justify="center">
                {(props.trip.gearStatus !== 'approved')
                  ? < div className="doc-button hollow" onClick={() => props.reviewGroupGearRequest('approved')} role="button" tabIndex={0}>Approve</div>
                  : <div className="doc-button hollow disabled" role="button" tabIndex={0}>Approved</div>}
                <Queue size={25}></Queue>
                {(props.trip.gearStatus !== 'denied')
                  ? (
                    <div className="doc-button alarm" onClick={() => props.reviewGroupGearRequest('denied')} role="button" tabIndex={0}>
                      Deny
                    </div>
                  )
                  : (
                    <div className="doc-button alarm disabled">
                      Denied
                    </div>
                  )
                }
              </Box>
            </Box>
          )
          : null}
        <Queue size={50}></Queue>
        {trip.trippeeGearStatus !== 'N/A'
          ? (
            <Box dir="col" expand>
              <Box dir="row" justify="between" align="center">
                <div className="doc-h2">For trippees</div>
                <Badge type={trip.trippeeGearStatus} size={36}></Badge>
              </Box>
              <Stack size={25}></Stack>
              <Box className="doc-bordered doc-card" pad={10}>
                <Table className="doc-table">
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
              </Box>
              <Stack size={25}></Stack>
              <Box dir="row" justify="center">
                {(props.trip.trippeeGearStatus !== 'approved')
                  ? < div className="doc-button hollow" onClick={() => props.reviewTrippeeGearRequest('approved')} role="button" tabIndex={0}>Approve</div>
                  : <div className="doc-button hollow disabled" role="button" tabIndex={0}>Approved</div>}
                <Queue size={25}></Queue>
                {(props.trip.trippeeGearStatus !== 'denied')
                  ? (
                    <div className="doc-button alarm" onClick={() => props.reviewTrippeeGearRequest('denied')} role="button" tabIndex={0}>
                      Deny
                    </div>
                  )
                  : (
                    <div className="doc-button alarm disabled">
                      Denied
                    </div>
                  )
                }
              </Box>
            </Box>
          )
          : null}
      </Box>
    </>
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
    <>
      <Box dir="row" justify="between">
        <div className="doc-h1">P-Card request</div>
        <Badge type={pcardStatus} size={36}></Badge>
      </Box>
      <Stack size={50}></Stack>
      <Box dir="row">
      <Box dir="col">
      <div className="doc-h2">{!props.isEditingPcard ? 'Assign P-Card' : 'Assigned P-Card'}</div>
          <Stack size={25}></Stack>
          {!props.isEditingPcard
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
      </Box>
      <Queue size={100}></Queue>
      <Box dir="col">
        <div className="doc-h2">People count</div>
        <Stack size={25}></Stack>
        <Box dir="row">
          <div className="p1 thick" data-tip data-for="estimated-trip-participants-help">Estimated trip participants (?): </div>
          <ReactTooltip id="estimated-trip-participants-help">How many people the trip leader estiamtes will actually attend the trip.</ReactTooltip>
          <div className="p1">{pcardRequest.numPeople}</div>
          
        </Box>
        <Box dir="row">
          <div className="p1 thick">Current approved participants: </div>
          <div className="p1">{props.trip.members.length}</div>
        </Box>
      </Box>
      </Box>
        <Stack size={50}></Stack>
        <Box dir="col" className="doc-card" pad={10}>
        <Table className="doc-table" responsive="lg">
          <thead>
            <tr>
              <th>Expense Details</th>
              <th>Unit Cost</th>
              <th>Qty per participant</th>
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
        <Stack size={25}></Stack>
        <Box self="end">
        <div className="doc-h2">
          Total Cost: ${total}
        </div>
        </Box>
      </Box>

      <div className="otd-pcard-response-buttons">
        {getAppropriateLink(props)}
        {(!props.isEditingPcard)
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
    </>
  );
}

export {
  GearRequest,
  BasicInfo,
  PCardRequest,
}
