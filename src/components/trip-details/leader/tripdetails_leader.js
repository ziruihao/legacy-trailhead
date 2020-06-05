import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form, Collapse, Table } from 'react-bootstrap';
import ReactToolTip from 'react-tooltip';
import { ProfileCard } from '../../profile-card';
import Badge from '../../badge';
import Toggle from '../../toggle';
import { Stack, Queue, Divider, Box } from '../../layout';
import utils from '../../../utils';
import '../../../styles/tripdetails_leader.scss';
import confirmDeleteImage from '../../../img/confirmDelete.jpg';
import VehicleRequestDisplay from '../../vehicleRequestDisplay';

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

const getPending = (props, pendingEmailRef) => {
  if (props.trip.pending.length === 0) {
    return (
      <Box dir="row" justify="center" align="center" expand>
        <div className="p1 gray thin">None
        </div>
      </Box>
    );
  } else {
    return (
      <>
        <Table className="doc-table" responsive="lg" hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Allergies/Diet Restrictions</th>
              <th>Medical conditions</th>
              <th>Gear Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.trip.pending.map(pender => (
              <tr key={pender.user._id} onClick={() => props.openTrippeeProfile(pender.user)}>
                <td>{pender.user.name}</td>
                <td>{pender.user.medical_conditions}</td>
                <td>{pender.user.allergies_dietary_restrictions}</td>
                <td>
                  {pender.gear.length !== 0 ? pender.gear.map(gear => (
                    <li key={gear.gearId}>{gear.name}</li>
                  )) : 'None'}
                </td>
                <td>
                  <div className="doc-button hollow" onClick={(event) => { props.moveToTrip(pender); event.stopPropagation(); }} role="button" tabIndex={0}>Admit to trip</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Divider size={1} />
        <Stack size={18} />
        <Box dir="row" justify="center" align="stretch" wrap expand>
          <div className="doc-button" onClick={() => window.open(`mailto:${props.pendingEmail}`, '_blank')} role="button" tabIndex={0}>Send email to all</div>
        </Box>
      </>
    //     <h5>Emails</h5>
    //     <div className="emails">
    //       <Form className="col-9">
    //         <Form.Control className="emails-input" ref={pendingEmailRef} as="textarea" value={props.pendingEmail} name="pendingEmail" onChange={props.onTextChange} />
    //       </Form>
    //       <button type="button" className="signup-button leader-signup-button copy-button" onClick={props.copyPendingToClip}>Copy</button>
    //     </div>
    );
  }
};

const getOnTrip = (props, onTripEmailRef) => {
  const renderAttendence = (status) => {
    if (new Date() >= new Date(props.trip.startDateAndTime)) {
      if (status) return 'Yes';
      else return 'No';
    } else {
      return 'N/A';
    }
  };
  if (props.trip.members.length === 0) {
    return (
      <Box dir="row" justify="center" align="center" expand>
        <div className="p1 gray thin">None
        </div>
      </Box>
    );
  } else {
    return (
      <>
        <Table className="doc-table" responsive="lg" hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Attended</th>
              <th>Allergies/Diet Restrictions</th>
              <th>Medical conditions</th>
              <th>Gear Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.trip.members.map(member => (
              <tr key={member.user._id} onClick={() => props.openTrippeeProfile(member.user)}>
                <td>{member.user.name}</td>
                <td>{renderAttendence(member.attendedTrip)}</td>
                <td>{member.user.medical_conditions}</td>
                <td>{member.user.allergies_dietary_restrictions}</td>
                <td>
                  {member.gear.length !== 0 ? member.gear.map(gear => (
                    <li key={gear.gearId}>{gear.name}</li>
                  )) : 'None'}
                </td>
                <td>
                  <div className="doc-button hollow" onClick={(event) => { props.moveToPending(member); event.stopPropagation(); }} role="button" tabIndex={0}>Back to pending</div>

                  <div className="doc-button hollow" onClick={(event) => { props.assignToLeader(member); event.stopPropagation(); }} role="button" tabIndex={0}>Assign to leader</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Divider size={1} />
        <Stack size={18} />
        <Box dir="row" justify="center">
          <div className="doc-button" onClick={() => window.open(`mailto:${props.onTripEmail}`, '_blank')} role="button" tabIndex={0}>Send email to all</div>
        </Box>
      </>
    //     <h5>Emails</h5>
    //     <div className="emails">
    //       <Form className="col-9">
    //         <Form.Control className="emails-input" ref={onTripEmailRef} as="textarea" value={props.onTripEmail} name="onTripEmail" onChange={props.onTextChange} />
    //       </Form>
    //       <button type="button" className="signup-button leader-signup-button copy-button" onClick={props.copyOnTripToClip}>Copy</button>
    //     </div>
    );
  }
};

const getIndividualGear = (individualGearArray, individualGearStatus) => {
  if (individualGearArray.length === 0) {
    return (
      <Box dir="row" justify="center" align="center" expand>
        <div className="p1 gray thin">None
        </div>
      </Box>
    );
  } else {
    return (
      <div>
        {individualGearArray.map((gear, index, array) => (
          <div key={gear.gearId}>
            <div className="trip-details-table-row">
              <span>{gear.name}</span>
              <span>{gear.quantity} people need this</span>
            </div>
            {index !== array.length - 1 ? <hr className="detail-line" /> : null}
          </div>
        ))}
      </div>
    );
  }
};

const getGroupGear = (groupGearArray, groupGearStatus) => {
  if (groupGearArray.length === 0) {
    return (
      <Box dir="row" justify="center" align="center" expand>
        <div className="p1 gray thin">None
        </div>
      </Box>
    );
  } else {
    return (
      <div>
        {groupGearArray.map((gear, index, array) => (
          <div key={gear._id}>
            <div className="trip-details-table-row">
              <span>{gear}</span>
            </div>
            {index !== array.length - 1 ? <hr className="detail-line" /> : null}
          </div>
        ))}
      </div>
    );
  }
};

const getPcard = (pcard, pcardStatus, assignedPCard) => {
  if (pcard.length === 0) {
    return (
      <Box dir="row" justify="center" align="center" expand>
        <div className="p1 gray thin">None
        </div>
      </Box>
    );
  } else {
    const pcardReq = pcard[0];
    return (
      <>
        <div className="trip-details-table-row">
          <span>Snacks</span>
          <span>{pcardReq.snacks} per person</span>
        </div>
        <hr className="detail-line" />
        <div className="trip-details-table-row">
          <span>Breakfast</span>
          <span>{pcardReq.breakfast} per person</span>
        </div>
        <hr className="detail-line" />
        <div className="trip-details-table-row">
          <span>Lunch</span>
          <span>{pcardReq.lunch} per person</span>
        </div>
        <hr className="detail-line" />
        <div className="trip-details-table-row">
          <span>Dinner</span>
          <span>{pcardReq.dinner} per person</span>
        </div>
        <hr className="detail-line" />
        {pcardReq.otherCosts.map((cost, index, array) => (
          <div key={cost._id}>
            <div className="trip-details-table-row">
              <span>{cost.title}</span>
              <span>{cost.cost}</span>
            </div>
            {index !== array.length - 1 ? <hr className="detail-line" /> : null}
          </div>
        ))}
      </>
    );
  }
};

export default React.forwardRef((props, ref) => {
  const { pendingEmailRef, onTripEmailRef } = ref;

  const renderBadgeToolTipText = (status) => {
    switch (props.trip.gearStatus) {
      case 'approved': return 'Approved by OPO';
      case 'pending': return 'Awaiting OPO approval';
      case 'denied': return 'Denied by OPO';
      default: return 'Unknown status';
    }
  };

  return (
    <div className="doc-card trip-details">
      <Box dir="col" pad={75}>
        <div className="trip-number">Trip #{props.trip.number}</div>
        <div className="doc-h1">{props.trip.title}</div>
        <Stack size={25} />
        <div className="trip-tags">
          <div className="trip-club-tag">{props.trip.club.name}</div>
          <div id="trip-statuses">
            {props.role === 'LEADER' ? <Badge type="leader" dataTip dataFor="leader-on-trip-modal" /> : null}
            <Badge type={props.status} dataTip dataFor="trip-status-modal" />
            <ReactToolTip id="leader-on-trip-modal" place="bottom">Your are leading this trip</ReactToolTip>
            <ReactToolTip id="trip-status-modal" place="bottom">
              Reasons: {props.reasons.length > 0 ? props.reasons.reduce((all, current) => `${all}, ${current}`) : null}
            </ReactToolTip>
          </div>
          <div className="trip-tags-spacer" />
          <div id="trip-returned">
            <Toggle id="trip-returned-toggle" value={props.trip.returned} onChange={event => props.toggleTripReturnedStatus(event.target.checked)} label="Returned" />
          </div>
        </div>
        <Stack size={25} />
        <Divider size={1} />
        <Stack size={25} />
        <div className="doc-h2">Description</div>
        <Stack size={25} />
        <div className="trip-description p1">
          {props.trip.description}
        </div>
        <Stack size={25} />
        <div className="doc-h2">Details</div>
        <Stack size={25} />
        <div className="leader-trip-info">
          <div className="trip-details-table leader-trip-detail left-detail">
            <div className="trip-details-table-row">
              <div className="p1 thick">Start</div>
              <div className="p1 thin gray">{`${utils.dates.formatDate(props.trip.startDate)}, ${utils.dates.formatTime(props.trip.startTime)}`}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">End</div>
              <div className="p1 thin gray">{`${utils.dates.formatDate(props.trip.endDate)}, ${utils.dates.formatTime(props.trip.endTime)}`}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">Pickup</div>
              <div className="p1 thin gray">{props.trip.pickup}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">Dropoff</div>
              <div className="p1 thin gray">{props.trip.dropoff}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">Destination</div>
              <div className="p1 thin gray">{props.trip.location}</div>
            </div>
          </div>

          <div className="trip-details-table leader-trip-detail right-detail">
            <div className="trip-details-table-row">
              <div className="p1 thick">Leader</div>
              <div className="p1 thin gray">{props.trip.leaders[0].name}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">Co-Leader(s)</div>
              <div className="p1 thin gray">{getCoLeaders(props.trip.leaders)}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">Experience needed?</div>
              <div className="p1 thin gray">{props.trip.experienceNeeded ? 'Yes' : 'No'} </div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">Subclub</div>
              <div className="p1 thin gray">{props.trip.club.name}</div>
            </div>
            <hr className="detail-line" />

            <div className="trip-details-table-row">
              <div className="p1 thick">cost</div>
              <div className="p1 thin gray">${props.trip.cost}</div>
            </div>
          </div>
        </div>
        <Stack size={25} />
        <div className="doc-h2">Approved trippees</div>
        <Stack size={25} />
        <div className="trip-details-table">
          {getOnTrip(props, onTripEmailRef)}
        </div>
        <Stack size={25} />
        <div className="doc-h2">Pending trippees</div>
        <Stack size={25} />
        <div className="trip-details-table">
          {getPending(props, pendingEmailRef)}
        </div>
        <Stack size={25} />
        <Box dir="row">
          <Box dir="col" expand>
            <Box dir="row" justify="between" align="center">
              <div className="doc-h2">Individual gear</div>
              <Badge type={props.trip.trippeeGearStatus} size={36} dataTip dataFor="trippee-gear-status" />
              <ReactToolTip id="trippee-gear-status">{renderBadgeToolTipText(props.trip.trippeeGearStatus)}</ReactToolTip>
            </Box>
            <Stack size={10} />
            <div className="trip-details-table">
              {getIndividualGear(props.trip.trippeeGear, props.trip.trippeeGearStatus)}
            </div>
          </Box>
          <Queue size={50} />
          <Box dir="col" expand>
            <Box dir="row" justify="between" align="center">
              <div className="doc-h2">Group gear</div>
              <Badge type={props.trip.gearStatus} size={36} dataTip dataFor="group-gear-status" />
              <ReactToolTip id="group-gear-status">{renderBadgeToolTipText(props.trip.gearStatus)}</ReactToolTip>
            </Box>
            <Stack size={10} />
            <div className="trip-details-table">
              {getGroupGear(props.trip.OPOGearRequests, props.trip.gearStatus)}
            </div>
          </Box>
        </Box>
        <Stack size={25} />

        <Box dir="col">
          <Box dir="row" justify="between" align="center">
            <div className="doc-h2">P-Card request</div>
            <Badge type={props.trip.pcardStatus} size={36} dataTip dataFor="pcard-gear-status" />
            <ReactToolTip id="pcard-gear-status">{renderBadgeToolTipText(props.trip.pcardStatus)}</ReactToolTip>
          </Box>
          <Stack size={10} />
          <div className="p1">Expected {props.trip.pcard[0].numPeople} total people on trip.</div>
          {props.trip.pcardStatus === 'approved' ? <div className="p1">Assigned P-Card: {props.trip.pcardAssigned}</div> : null }
          <Stack size={10} />
          <div className="trip-details-table">
            {getPcard(props.trip.pcard, props.trip.pcardStatus, props.trip.pcardAssigned)}
          </div>
        </Box>

        {props.trip.vehicleStatus !== 'N/A'
          ? (
            <div className="tripdetail-gear-requests leader-trip-info">
              <VehicleRequestDisplay
                requestType="TRIP"
                vehicleRequest={props.trip.vehicleRequest}
              />
            </div>
          )
          : null}
        <div className="center">
          <Link to={`/edittrip/${props.trip._id}`} className="signup-button leader-edit-link"><button type="submit" className="signup-button">Edit Trip</button></Link>
        </div>

        <div className="center">
          <span className="cancel-link" onClick={props.activateLeaderModal} role="button" tabIndex={0}>Delete trip</span>
        </div>
        <Modal
          centered
          show={props.trippeeProfileOpened}
          onHide={props.hideTrippeeProfile}
          size="lg"
        >
          <ProfileCard
            asProfilePage={false}
            isEditing={false}
            user={props.trippeeProfile}
          />
        </Modal>
        <Modal
          centered
          show={props.showModal}
          onHide={props.closeModal}
        >
          <div className="trip-details-close-button">
            <i className="material-icons close-button" onClick={props.closeModal} role="button" tabIndex={0}>close</i>
          </div>
          <img src={confirmDeleteImage} alt="confirm-delete" className="cancel-image" />
          <div className="cancel-content">
            <p className="cancel-question">Are you sure you want to delete this trip?</p>
            <p className="cancel-message">You&apos;ll be letting down a lot of trees if you do</p>
          </div>
          <button type="submit" className="leader-cancel-button confirm-cancel" onClick={props.deleteTrip}>It be like that sometimes</button>

        </Modal>
      </Box>

    </div>
  );
});
