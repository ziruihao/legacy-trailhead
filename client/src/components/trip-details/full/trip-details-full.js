import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form, Collapse, Table } from 'react-bootstrap';
import ReactToolTip from 'react-tooltip';
import { ProfileCard } from '../../profile-card';
import Badge from '../../badge';
import Toggle from '../../toggle';
import { Stack, Queue, Divider, Box } from '../../layout';
import AttendeeTable from './attendee-table/attendee-table';
import utils from '../../../utils';
import Icon from '../../icon';
import sadTree from '../../trips/sad-tree.png';
import Text from '../../text';
import * as constants from '../../../constants';
import '../../../styles/tripdetails_leader.scss';
import confirmDeleteImage from '../../../img/confirmDelete.jpg';
import VehicleRequestDisplay from '../../vehicle-request-page/vehicle-request-display/vehicleRequestDisplay';

const getIndividualGear = (individualGearArray, individualGearStatus) => {
  if (individualGearArray.length === 0) {
    return (
      <Box dir='row' justify='center' align='center' expand>
        <div className='p1 gray thin'>None
        </div>
      </Box>
    );
  } else {
    return (
      <div>
        {individualGearArray.map((gear, index, array) => (
          <div key={gear.gearId}>
            <div className='trip-details-table-row'>
              <span>{gear.name}</span>
              <span>{gear.quantity} people need this</span>
            </div>
            {index !== array.length - 1 ? <hr className='detail-line' /> : null}
          </div>
        ))}
      </div>
    );
  }
};

const getGroupGear = (groupGearArray, groupGearStatus) => {
  if (groupGearArray.length === 0) {
    return (
      <Box dir='row' justify='center' align='center' expand>
        <div className='p1 gray thin'>None</div>
      </Box>
    );
  } else {
    return (
      <div>
        {groupGearArray.map((gear, index, array) => (
          <div key={gear._id}>
            <div className='trip-details-table-row'>
              <span>{gear.name}</span>
              <span>{gear.quantity}</span>
            </div>
            {index !== array.length - 1 ? <hr className='detail-line' /> : null}
          </div>
        ))}
      </div>
    );
  }
};

const getPcard = (pcard, pcardStatus, assignedPCard) => {
  if (pcard.length === 0) {
    return (
      <Box dir='row' justify='center' align='center' expand>
        <div className='p1 gray thin'>None
        </div>
      </Box>
    );
  } else {
    const pcardReq = pcard[0];
    return (
      <>
        <div className='trip-details-table-row'>
          <span>Snacks</span>
          <span>${pcardReq.snacks} per person</span>
        </div>
        <hr className='detail-line' />
        <div className='trip-details-table-row'>
          <span>Breakfast</span>
          <span>${pcardReq.breakfast} per person</span>
        </div>
        <hr className='detail-line' />
        <div className='trip-details-table-row'>
          <span>Lunch</span>
          <span>${pcardReq.lunch} per person</span>
        </div>
        <hr className='detail-line' />
        <div className='trip-details-table-row'>
          <span>Dinner</span>
          <span>${pcardReq.dinner} per person</span>
        </div>
        <hr className='detail-line' />
        {pcardReq.otherCosts.map((cost, index, array) => (
          <div key={cost._id}>
            <div className='trip-details-table-row'>
              <span>{cost.title}</span>
              <span>${cost.cost}</span>
            </div>
            {index !== array.length - 1 ? <hr className='detail-line' /> : null}
          </div>
        ))}
      </>
    );
  }
};

export default React.forwardRef((props, ref) => {
  const renderBadgeToolTipText = (status) => {
    switch (props.trip.gearStatus) {
      case 'approved': return 'Approved by OPO';
      case 'pending': return 'Awaiting OPO approval';
      case 'denied': return 'Denied by OPO';
      default: return 'Unknown status';
    }
  };

  const renderTripEditButton = () => {
    if (props.isLeaderOnTrip) {
      return (<Link to={`/edittrip/${props.trip._id}`} className='doc-button hollow'>Edit trip</Link>);
    } else {
      return (
        <>
          <div className='doc-button hollow disabled' role='button' tabIndex={0} data-tip data-for='no-edit-trip-permission'>Edit trip</div>
          <ReactToolTip id='no-edit-trip-permission' place='bottom'>You do not have permission to edit this trip</ReactToolTip>
        </>
      );
    }
    // } else {
    //   return (
    //     <>
    //       <div className='doc-button hollow disabled' role='button' tabIndex={0} data-tip data-for='too-late-to-edit-trip'>Edit trip</div>
    //       <ReactToolTip id='too-late-to-edit-trip' place='bottom'>You cannot edit the trip within 24 hours of its start time</ReactToolTip>
    //     </>
    //   );
    // }
  };

  return (
    <div className='doc-card trip-details'>
      <Box dir='col' pad={75}>
        <Text type='h2' color='gray3'>TRIP #{props.trip.number}</Text>
        <Stack size={10} />
        <Text type='h1'>{props.trip.title}</Text>
        <Stack size={25} />
        <Box dir='row' className='trip-tags'>
          <Box pad='0 0.5em' align='center' className='trip-club-tag'>{props.trip.club.name}</Box>
          <Box dir='row'>
            <Queue size={36} />
            <Badge type={props.status} size={36} dataTip dataFor='trip-status-modal' />
            {props.role === 'LEADER' ? <><Queue size={36} /><Badge type='leader' size={36} dataTip dataFor='leader-on-trip-modal' /></> : null}
            <ReactToolTip id='leader-on-trip-modal' place='bottom'>Your are leading this trip</ReactToolTip>
            <ReactToolTip id='trip-status-modal' place='bottom'>
              <Box dir='col'>
                {props.reasons.length > 0 ? props.reasons.map(reason => <div key={reason}>{reason}</div>) : 'This trip is all approved!'}
              </Box>
            </ReactToolTip>
          </Box>
          <div className='trip-tags-spacer' />
          <Box dir='row'>
            <Toggle id='trip-left-toggle' value={props.trip.left} onChange={event => props.toggleTripLeftStatus(event.target.checked)} label='Left' disabled={props.role !== 'OPO'} dataTip dataFor='trip-left-toggle-warning' />
            {props.role !== 'OPO'
              ? <ReactToolTip id='trip-left-toggle-warning' place='bottom'><div>Trip leaders should mark trip left / returned status via the mobile link in your email.</div><div>Only OPO staff can directly change this value here.</div></ReactToolTip>
              : null
            }
            <Queue size={25} />
            <Toggle id='trip-returned-toggle' value={props.trip.returned} onChange={event => props.toggleTripReturnedStatus(event.target.checked)} label='Returned' disabled={props.role !== 'OPO'} dataTip dataFor='trip-returned-toggle-warning' />
            {props.role !== 'OPO'
              ? <ReactToolTip id='trip-returned-toggle-warning' place='bottom'><div>Trip leaders should mark trip left / returned status via the mobile link in your email.</div><div>Only OPO staff can directly change this value here.</div></ReactToolTip>
              : null
            }
          </Box>
        </Box>
        <Stack size={25} />
        <Divider size={1} />
        <Stack size={25} />
        <Text type='h2'>Description</Text>
        <Stack size={25} />
        <div className='trip-description p1'>
          {props.trip.description}
        </div>
        <Stack size={25} />
        <Text type='h2'>Details</Text>
        <Stack size={25} />
        <div className='leader-trip-info'>
          <div className='trip-details-table leader-trip-detail left-detail'>
            <div className='trip-details-table-row'>
              <div className='p1 thick'>Start</div>
              <div className='p1 thin gray'>{utils.dates.formatDate(new Date(props.trip.startDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(props.trip.startDateAndTime), { timezone: true })}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>End</div>
              <div className='p1 thin gray'>{utils.dates.formatDate(new Date(props.trip.endDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(props.trip.endDateAndTime), { timezone: true })}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>Pickup</div>
              <div className='p1 thin gray'>{props.trip.pickup}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>Dropoff</div>
              <div className='p1 thin gray'>{props.trip.dropoff}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>Destination</div>
              <div className='p1 thin gray'>{props.trip.location}</div>
            </div>
          </div>

          <div className='trip-details-table leader-trip-detail right-detail'>
            <div className='trip-details-table-row'>
              <div className='p1 thick'>Leader</div>
              <div className='p1 thin gray'>{props.trip.owner.name}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>Co-Leader(s)</div>
              <div className='p1 thin gray'>{utils.trips.extractCoLeaderNames(props.trip)}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>Experience needed?</div>
              <div className='p1 thin gray'>{props.trip.experienceNeeded ? 'Yes' : 'No'} </div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>Subclub</div>
              <div className='p1 thin gray'>{props.trip.club.name}</div>
            </div>
            <hr className='detail-line' />

            <div className='trip-details-table-row'>
              <div className='p1 thick'>cost</div>
              <div className='p1 thin gray'>${props.trip.cost}</div>
            </div>
          </div>
        </div>
        <Stack size={25} />
        <Text type='h2'>Approved trippees</Text>
        <Stack size={25} />
        <div className='trip-details-table'>
          <AttendeeTable
            showAttendence
            tripLeft={props.trip.left}
            people={props.trip.members}
            startDateAndTime={props.trip.startDateAndTime}
            actions={[
              { callback: props.unAdmitToTrip, message: 'Un-admit' },
              { callback: props.toggleTripLeadership, message: (person) => { if (utils.trips.determineRoleOnTrip(person, props.trip) === 'LEADER') { return 'Demote to trippee'; } else { return 'Make co-leader'; } } },
            ]}
            openProfile={props.openTrippeeProfile}
          />
        </div>
        <Stack size={25} />
        <Text type='h2'>Pending trippees</Text>
        <Stack size={25} />
        <div className='trip-details-table'>
          <AttendeeTable
            people={props.trip.pending}
            startDateAndTime={props.trip.startDateAndTime}
            actions={[
              { callback: (person) => {
                if (props.trip.trippeeGearStatus === 'approved') {
                  props.setCachedPerson(person);
                  props.showTripChangesModal();
                } else {
                  props.admitToTrip(person);
                }
              },
              message: 'Admit' },
              { callback: props.rejectFromTrip,
                message: 'Reject' },
            ]}
            openProfile={props.openTrippeeProfile}
          />
        </div>
        <Stack size={25} />
        <Box dir='row'>
          <Box dir='col' expand>
            <Box dir='row' justify='between' align='center'>
              <Text type='h2'>Individual gear</Text>
              <Badge type={props.trip.trippeeGearStatus} size={36} dataTip dataFor='trippee-gear-status' />
              <ReactToolTip id='trippee-gear-status'>{renderBadgeToolTipText(props.trip.trippeeGearStatus)}</ReactToolTip>
            </Box>
            <Stack size={10} />
            <div className='trip-details-table'>
              {getIndividualGear(props.trip.trippeeGear, props.trip.trippeeGearStatus)}
            </div>
          </Box>
          <Queue size={50} />
          <Box dir='col' expand>
            <Box dir='row' justify='between' align='center'>
              <Text type='h2'>Group gear</Text>
              <Badge type={props.trip.gearStatus} size={36} dataTip dataFor='group-gear-status' />
              <ReactToolTip id='group-gear-status'>{renderBadgeToolTipText(props.trip.gearStatus)}</ReactToolTip>
            </Box>
            <Stack size={10} />
            <div className='trip-details-table'>
              {getGroupGear(props.trip.OPOGearRequests, props.trip.gearStatus)}
            </div>
          </Box>
        </Box>
        <Stack size={25} />
        {
          props.trip.pcardStatus !== 'N/A'
            ? (
              <Box dir='col'>
                <Box dir='row' justify='between' align='center'>
                  <Text type='h2'>P-Card request</Text>
                  <Badge type={props.trip.pcardStatus} size={36} dataTip dataFor='pcard-gear-status' />
                  <ReactToolTip id='pcard-gear-status'>{renderBadgeToolTipText(props.trip.pcardStatus)}</ReactToolTip>
                </Box>
                <Stack size={10} />
                <div className='p1'>Expected {props.trip.pcard[0].numPeople} total people on trip.</div>
                {props.trip.pcardStatus === 'approved' ? <div className='p1'>Assigned P-Card: {props.trip.pcardAssigned}</div> : null }
                <Stack size={10} />
                <div className='trip-details-table'>
                  {getPcard(props.trip.pcard, props.trip.pcardStatus, props.trip.pcardAssigned)}
                </div>
              </Box>
            )
            : null
        }
        <Stack size={25} />
        {props.trip.vehicleStatus !== 'N/A'
          ? (
            <VehicleRequestDisplay
              requestType='TRIP'
              trip={props.trip}
              vehicleRequest={props.trip.vehicleRequest}
            />
          )
          : null}
        <Stack size={100} />
        <Box dir='row' justify='center'>
          {renderTripEditButton()}
          <Queue size={50} />
          <div className='doc-button alarm' onClick={props.showDeleteTripModal} role='button' tabIndex={0}>Delete trip</div>
        </Box>
        <Modal
          centered
          show={props.trippeeProfileOpened}
          onHide={props.hideTrippeeProfile}
          size='lg'
        >
          <ProfileCard
            asProfilePage={false}
            isEditing={false}
            user={props.trippeeProfile}
          />
        </Modal>
        <Modal
          centered
          show={props.tripChangesModalOpen}
          onHide={props.hideTripChangesModal}
        >
          <Box dir='col' align='center' pad={25}>
            <Icon type='warning' size={50} />
            <Stack size={24} />
            <Text type='h2'>This will alter your gear requests</Text>
            <Stack size={24} />
            <div className='p1 center-text'>If you admit this trippee, their individual gear requests will alter your trip&apos;s total gear requests, which already has been approved by OPO staff. This will revert your trip status back to pending and you must await gear approval again before continuing.</div>
            <Stack size={24} />
            <Box dir='row' justify='center'>
              <div className='doc-button' onClick={props.hideTripChangesModal} role='button' tabIndex={0}>Wait no</div>
              <Queue size={15} />
              <div className='doc-button alarm' onClick={() => { props.admitToTrip(props.cachedPerson); props.hideTripChangesModal(); }} role='button' tabIndex={0}>Admit</div>
            </Box>
          </Box>
        </Modal>
        <Modal
          centered
          show={props.deleteTripModalOpen}
          onHide={props.hideDeleteTripModal}
        >
          <Box dir='col' align='center' pad={25}>
            <img src={sadTree} alt='delete-trip' />
            <Stack size={24} />
            <Text type='h2'>Delete this trip</Text>
            <Stack size={24} />
            <div className='p1 center-text'>You&apos;ll be letting down a lot of trees if you do. This will also cancel any associated gear, P-Card, and vehicle requests.</div>
            <Stack size={24} />
            <Box dir='row' justify='center'>
              <div className='doc-button' onClick={props.hideDeleteTripModal} role='button' tabIndex={0}>Wait no</div>
              <Queue size={15} />
              <div className='doc-button alarm' onClick={() => { props.deleteTrip(); props.hideDeleteTripModal(); }} role='button' tabIndex={0}>Delete</div>
            </Box>
          </Box>
        </Modal>
      </Box>

    </div>
  );
});
