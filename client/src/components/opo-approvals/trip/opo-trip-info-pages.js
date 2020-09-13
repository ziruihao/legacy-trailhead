/* eslint-disable camelcase */
import React from 'react';
import Table from 'react-bootstrap/Table';
import ReactTooltip from 'react-tooltip';
import Badge from '../../badge';
import Text from '../../text';
import { Stack, Queue, Divider, Box } from '../../layout';
import './tripdetails_opo.scss';

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

const getIndividualGear = (trip) => {
  const gearData = {};
  const gearSizeType = {};
  trip.trippeeGear.forEach((gear) => {
    gearSizeType[gear._id] = gear.sizeType;
    if (gear.sizeType !== 'N/A') {
      gearData[gear._id] = {};
    }
  });
  trip.members.forEach((member) => {
    member.requestedGear.forEach((gear) => {
      if (gear.name) {
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
      return entries.map(entry => (
        <tr key={gear._id}>
          <td>{gear.name}</td>
          <td>{entry[0]}</td>
          <td>{entry[1]}</td>
        </tr>
      ));
    } else if (gear.quantity > 0) {
      return (
        <tr key={gear._id}>
          <td>{gear.name}</td>
          <td>{gear.sizeType}</td>
          <td>{gear.quantity}</td>
        </tr>
      );
    } else return null;
  });
};

const getGroupGear = (groupGearArray) => {
  return groupGearArray.map((groupGear) => {
    if (groupGear.quantity > 0) {
      return (
        <tr key={groupGear}>
          <td>{groupGear.name}</td>
          <td>{groupGear.quantity}</td>
        </tr>
      );
    } else return null;
  });
};

const BasicInfo = (props) => {
  const { trip } = props;
  return (
    <>
      <Text type='h1'>Trip #{trip.number}: {trip.title}</Text>
      <Stack size={50} />
      <Text type='h2'>Basic details</Text>
      <Stack size={25} />
      <Box dir='row' align='stretch'>
        <Box dir='col'>
          <div className='p1 thick gray'>Date</div>
          <Stack size={18} />
          <div className='p1 thick gray'>Subclub</div>
          <Stack size={18} />
          <div className='p1 thick gray'>Leader</div>
          <Stack size={18} />
          <div className='p1 thick gray'>Co-Leader(s)</div>
          <Stack size={18} />
          <div className='p1 thick gray'>Approved Trippees</div>
        </Box>
        <Queue size={25} />
        <Divider dir='col' size={1} />
        <Queue size={25} />
        <Box dir='col'>
          <div className='p1'>{formatDate(trip.startDate, trip.endDate, trip.startTime, trip.endTime)}</div>
          <Stack size={18} />
          <div className='p1'>{trip.club.name}</div>
          <Stack size={18} />
          <div className='p1'>{trip.leaders[0].name}</div>
          <Stack size={18} />
          <div className='p1'>{getCoLeaders(trip.leaders)}</div>
          <Stack size={18} />
          <div className='p1'>{getApprovedTrippees(trip.members, trip.leaders)}</div>
        </Box>
      </Box>
      <Stack size={50} />
      <Text type='h2'>Description</Text>
      <Stack size={25} />
      <div className='p1'>{trip.description}</div>
    </>
  );
};

const GearRequest = (props) => {
  const { trip } = props;
  return (
    <>
      <Text type='h1'>Gear requests</Text>
      <Stack size={50} />
      <Box dir='row' justify='center'>
        {trip.gearStatus !== 'N/A'
          ? (
            <Box dir='col' expand>
              <Box dir='row' justify='between' align='center'>
                <Text type='h2'>For the group</Text>
                <Badge type={trip.gearStatus} size={36} />
              </Box>
              <Stack size={25} />
              <Box className='doc-bordered' pad={10}>
                <Table className='doc-table'>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGroupGear(trip.OPOGearRequests)}
                  </tbody>
                </Table>
              </Box>
              <Stack size={25} />
              <Box dir='row' justify='center'>
                {(props.trip.gearStatus !== 'approved')
                  ? <div className='doc-button hollow' onClick={() => props.reviewGroupGearRequest('approved')} role='button' tabIndex={0}>Approve</div>
                  : <div className='doc-button hollow' onClick={() => props.reviewGroupGearRequest('pending')} role='button' tabIndex={0}>Un-approve</div>}
                <Queue size={25} />
                {(props.trip.gearStatus !== 'denied')
                  ? <div className='doc-button alarm' onClick={() => props.reviewGroupGearRequest('denied')} role='button' tabIndex={0}>Deny</div>
                  : <div className='doc-button alarm' onClick={() => props.reviewGroupGearRequest('pending')} role='button' tabIndex={0}>Un-deny</div>
                }
              </Box>
            </Box>
          )
          : null}
        <Queue size={50} />
        {trip.trippeeGearStatus !== 'N/A'
          ? (
            <Box dir='col' expand>
              <Box dir='row' justify='between' align='center'>
                <Text type='h2'>For trippees</Text>
                <Badge type={trip.trippeeGearStatus} size={36} />
              </Box>
              <Stack size={25} />
              <Box className='doc-bordered' pad={10}>
                <Table className='doc-table'>
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
              <Stack size={25} />
              <Box dir='row' justify='center'>
                {(props.trip.trippeeGearStatus !== 'approved')
                  ? <div className='doc-button hollow' onClick={() => props.reviewTrippeeGearRequest('approved')} role='button' tabIndex={0}>Approve</div>
                  : <div className='doc-button hollow' onClick={() => props.reviewTrippeeGearRequest('pending')} role='button' tabIndex={0}>Un-approve</div>}
                <Queue size={25} />
                {(props.trip.trippeeGearStatus !== 'denied')
                  ? <div className='doc-button alarm' onClick={() => props.reviewTrippeeGearRequest('denied')} role='button' tabIndex={0}>Deny</div>
                  : <div className='doc-button alarm' onClick={() => props.reviewTrippeeGearRequest('pending')} role='button' tabIndex={0}>Un-deny</div>
                }
              </Box>
            </Box>
          )
          : null}
      </Box>
    </>
  );
};

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
  const { pcardStatus } = props.trip;
  return (
    <>
      <Box dir='row' justify='between'>
        <Text type='h1'>P-Card request</Text>
        <Badge type={pcardStatus} size={36} />
      </Box>
      <Stack size={50} />
      <Box dir='row'>
        <Box dir='col'>
          <Text type='h2'>People count</Text>
          <Stack size={25} />
          <Box dir='row'>
            <div className='p1' data-tip data-for='estimated-trip-participants-help'>Estimated trip participants (?):</div>
            <ReactTooltip id='estimated-trip-participants-help'>How many people the trip leader estiamtes will actually attend the trip.</ReactTooltip>
            <Queue size={18} />
            <div className='p1'>{pcardRequest.numPeople}</div>
          </Box>
          <Box dir='row'>
            <div className='p1'>Current approved participants: </div>
            <Queue size={18} />
            <div className='p1'>{props.trip.members.length}</div>
          </Box>
        </Box>
        <Queue size={100} />
        <Box dir='col'>
          <Text type='h2'>{props.isEditingPcard ? 'Assign P-Card' : 'Assigned P-Card'}</Text>
          <Stack size={25} />
          {props.isEditingPcard
            ? (
              <input
                className='field'
                onChange={props.onFieldChange}
                name='pcardAssigned'
                placeholder='e.g. 7799'
                value={props.pcardAssigned}
              />
            )
            : (
              <span className={`field otd-pcard-assign-label trip-detail ovr-white-background ${pcardStatus === 'denied' ? 'field-disabled ovr-skipped-detail' : ''}`}>
                {pcardStatus === 'denied' ? 'Denied' : props.trip.pcardAssigned}
              </span>
            )
          }
        </Box>
      </Box>
      <Stack size={50} />
      <Text type='h2'>Cost breakdown</Text>
      <Stack size={25} />
      <Box dir='col' className='doc-bordered' pad={20}>
        <Table className='doc-table' responsive='lg'>
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
                <tr key={otherCost.title}>
                  <td>{otherCost.title}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>${otherCost.cost}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Divider size={1} />
        <Stack size={25} />
        <Box self='end'>
          <div className='doc-h3'>
            Total Cost: ${total}
          </div>
        </Box>
      </Box>
      <Stack size={25} />
      <Box dir='row' justify='end'>
        <div className={`doc-button alarm ${props.trip.pcardStatus === 'denied' ? 'disabled' : ''}`} onClick={props.trip.pcardStatus !== 'denied' ? () => props.reviewPCardRequest('denied') : null} role='button' tabIndex={0}>Deny</div>
        <Queue size={25} />
        {props.isEditingPcard
          ? (
            <>
              <div className='doc-button alarm hollow' onClick={props.cancelPcardUpdate} role='button' tabIndex={0}>Cancel</div>
              <Queue size={15} />
              <div className='doc-button' onClick={() => props.reviewPCardRequest('approved')} role='button' tabIndex={0}>Update</div>
            </>
          )
          : (
            <>
              {props.trip.pcardStatus === 'approved'
                ? <div className='doc-button' onClick={() => props.reviewPCardRequest('approved')} role='button' tabIndex={0}>Edit</div>
                : <div className='doc-button' onClick={props.startEditingPcard} role='button' tabIndex={0}>Approve</div>
              }
            </>
          )
        }
      </Box>
    </>
  );
};

export {
  GearRequest,
  BasicInfo,
  PCardRequest,
};
