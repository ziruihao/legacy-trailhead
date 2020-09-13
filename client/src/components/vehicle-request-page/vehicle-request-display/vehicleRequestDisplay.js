import React from 'react';
import { Stack, Queue, Divider, Box } from '../../layout';
import Badge from '../../badge';
import Text from '../../text';
import Toggle from '../../toggle';
import utils from '../../../utils';
import '../../../styles/vehicleRequestForm-style.scss';

const getAssignment = (props, index) => {
  if (props.vehicleRequest.status === 'approved') {
    const assignment = props.vehicleRequest.assignments.find((element) => {
      return element.responseIndex === index;
    });
    if (assignment) {
      return (
        <>
          <Text type='h3'>Assigned vehicle</Text>
          <Stack size={25} />
          <Text type='p1'>{assignment.assigned_vehicle.name}</Text>
          <Stack size={25} />
          <Text type='h3'>Key #</Text>
          <Stack size={25} />
          <Text type='p1'>{assignment.assigned_key}</Text>
          <Stack size={25} />
          <Text type='h3'>Assigned pickup</Text>
          <Stack size={25} />
          {assignment.assigned_vehicle.name === 'Enterprise'
            ? <Text type='p1' color='gray'>N/A</Text>
            : <Text type='p1'>{utils.dates.formatDateAndTime(new Date(assignment.assigned_pickupDateAndTime), 'LONG')}</Text>
      }
          <Stack size={25} />
          <Text type='h3'>Assigned return</Text>
          <Stack size={25} />
          {assignment.assigned_vehicle.name === 'Enterprise'
            ? <Text type='p1' color='gray'>N/A</Text>
            : <Text type='p1'>{utils.dates.formatDateAndTime(new Date(assignment.assigned_returnDateAndTime), 'LONG')}</Text>
    }
          <Stack size={25} />
          {/* <div className='vrf-requested-vehicles'>
          <div className='vrf-req-header'>
            <h3 className='vrf-label vrf-req-no'>Assigned vehicle</h3>
          </div>

          <div className='vrf-form-row'>
            <span className='vrf-label'>Vehicle</span>
            <span className='vrf-req-details-display'>{assignment.assigned_vehicle.name}</span>
          </div>

          <div className='vrf-form-row'>
            <span className='vrf-label'>Key #</span>
            <span className='vrf-req-details-display'>
              {assignment.assigned_vehicle.name === 'Enterprise'
                ? '-'
                : assignment.assigned_key}
            </span>
          </div>

          <div className='vrf-form-row vrf-req-dates'>
            <span className='vrf-req-date'>
              <span className='vrf-label'>Pickup Date & Time</span>
              <span className='vrf-req-details-display vrf-single-day-date'>
                {assignment.assigned_vehicle.name === 'Enterprise'
                  ? '-'
                  : utils.dates.formatDateAndTime(new Date(assignment.assigned_pickupDateAndTime), 'LONG')}
              </span>
            </span>
          </div>

          <div className='vrf-form-row vrf-req-dates'>
            <span className='vrf-req-date'>
              <span className='vrf-label'>Return Date & Time</span>
              <span className='vrf-req-details-display vrf-single-day-date'>
                {assignment.assigned_vehicle.name === 'Enterprise'
                  ? '-'
                  : utils.dates.formatDateAndTime(new Date(assignment.assigned_returnDateAndTime), 'LONG')}
              </span>
            </span>
          </div>
        </div> */}
        </>
      );
    } else {
      return (
        <div className='vrf-requested-vehicles vrf-skipped-assignment'>
          Skipped assignment
        </div>
      );
    }
  } else {
    return null;
  }
};

const getVehicles = (props) => {
  return props.vehicleRequest.requestedVehicles.map((vehicle, index) => {
    return (
      <>
        <Divider dir='row' size={1} />
        <Stack size={50} />
        <Box dir='row' justify='between' align='center'>
          <Text type='h2'>Vehicle {index + 1}</Text>
          <Box dir='row' align='center'>
            <Toggle disabled id={`passNeeded_${index}`} name='passNeeded' value={vehicle.passNeeded} label='Need WMNF pass?' />
            <Queue size={25} />
            <Toggle disabled id={`trailerNeeded_${index}`} name='trailerNeeded' value={vehicle.trailerNeeded} label='Need trailer hitch?' />
          </Box>
        </Box>
        <Stack size={50} />
        <Box dir='row'>
          <Box dir='col' expand>
            <Text type='h3'>Vehicle type</Text>
            <Stack size={25} />
            <Text type='p1'>{vehicle.vehicleType}</Text>
            <Stack size={25} />
            <Text type='h3'>Notes</Text>
            <Stack size={25} />
            <Text type='p1'>{vehicle.vehicleDetails}</Text>
            <Stack size={25} />
            <Text type='h3'>Pickup</Text>
            <Stack size={25} />
            <Text type='p1'>{utils.dates.formatDateAndTime(new Date(vehicle.pickupDateAndTime), 'LONG')}</Text>
            <Stack size={25} />
            <Text type='h3'>Return</Text>
            <Stack size={25} />
            <Text type='p1'>{utils.dates.formatDateAndTime(new Date(vehicle.returnDateAndTime), 'LONG')}</Text>
            <Stack size={25} />
          </Box>
          <Box dir='col' expand>
            {getAssignment(props, index)}
          </Box>
        </Box>
        <Stack size={50} />
      </>
      // <div key={vehicle._id} className='vrf-req-group vrf-req-and-assignment'>
      //   <div className='vrf-requested-vehicles'>
      //     <div className='vrf-req-header'>
      //       <h3 className='vrf-label vrf-req-no'>Vehicle #{index + 1}</h3>
      //     </div>

    //     <div className='vrf-form-row'>
    //       <span className='vrf-label'>Vehicle Type</span>
    //       <span className='vrf-req-details-display'>{vehicle.vehicleType}</span>
    //     </div>

    //     <div className='vrf-form-row'>
    //       <span className='vrf-label'>Vehicle Details</span>
    //       <span className='vrf-req-details-display'>{vehicle.vehicleDetails}</span>
    //     </div>

    //     <div className='vrf-form-row vrf-req-dates'>
    //       <span className='vrf-req-date'>
    //         <span className='vrf-label'>Pickup Date & Time</span>
    //         <span className='vrf-req-details-display vrf-single-day-date'>{utils.dates.formatDateAndTime(new Date(vehicle.pickupDateAndTime), 'LONG')}</span>
    //       </span>
    //     </div>

    //     <div className='vrf-form-row vrf-req-dates'>
    //       <span className='vrf-req-date'>
    //         <span className='vrf-label'>Return Date & Time</span>
    //         <span className='vrf-req-details-display vrf-single-day-date'>{utils.dates.formatDateAndTime(new Date(vehicle.returnDateAndTime), 'LONG')}</span>
    //       </span>
    //     </div>

    //     <div className='vrf-form-row vrf-req-dates'>
    //       <div className='club-option'>
    //         <label className='checkbox-container club-checkbox' htmlFor={`passNeeded_${index}`}>
    //           <input
    //             type='checkbox'
    //             name='passNeeded'
    //             id={`passNeeded_${index}`}
    //             checked={vehicle.passNeeded}
    //             disabled
    //           />
    //           <span className='checkmark' />
    //         </label>
    //         <span className='vrf-label'>WMNF Pass Needed?</span>
    //       </div>
    //     </div>
    //     <div className='vrf-form-row vrf-req-dates'>
    //       <div className='club-option'>
    //         <label className='checkbox-container club-checkbox' htmlFor={`trailerNeeded_${index}`}>
    //           <input
    //             type='checkbox'
    //             name='trailerNeeded'
    //             id={`trailerNeeded_${index}`}
    //             checked={vehicle.trailerNeeded}
    //             disabled
    //           />
    //           <span className='checkmark' />
    //         </label>
    //         <span className='vrf-label'>Trailer Hitch Required?</span>
    //       </div>
    //     </div>
    //   </div>

    // </div>
    );
  });
};

const VehicleRequestDisplay = (props) => {
  return (
    <Box dir='col' pad={75} className='doc-card'>
      <Box dir='row' justify='between'>
        <Box dir='row' align='center'>
          <Text type='h1'>V-Req #{props.vehicleRequest.number}</Text>
          {props.requestType !== 'SOLO'
            ? (
              <>
                <Queue size={25} />
                <Divider dir='col' size={1} />
                <Queue size={25} />
                <Text type='h2' color='gray' weight='thin'>TRIP #{props.vehicleRequest.associatedTrip.number || props.trip.number}</Text>
              </>
            )
            : null
          }
        </Box>
        <Badge type={props.vehicleRequest.status} size={36} />
      </Box>
      <Stack size={50} />
      {props.requestType === 'SOLO'
        ? (
          <Box dir='col'>
            <Text type='h3'>Request details</Text>
            <Stack size={25} />
            <Text type='p1'>{props.vehicleRequest.requestDetails}</Text>
            <Stack size={25} />
            <Box dir='row' justify='between'>
              <Box dir='col' expand>
                <Text type='h3'>Number of people</Text>
                <Stack size={25} />
                <Text type='p1'>{props.vehicleRequest.noOfPeople}</Text>
                <Stack size={25} />
              </Box>
              <Queue size={25} />
              <Box dir='col' expand>
                <Text type='h3'>Estimated mileage</Text>
                <Stack size={25} />
                <Text type='p1'>{props.vehicleRequest.mileage}</Text>
              </Box>
            </Box>
          </Box>
        )
        : null}
      {getVehicles(props)}
      <Stack size={50} />
      {props.requestType === 'SOLO'
        ? (
          <Box dir='row' justify='between' align='center'>
            <div className='doc-button alarm' onClick={props.showError} role='button' tabIndex={0}>Cancel request</div>
            {props.vehicleRequest.status !== 'approved'
              ? <div className='doc-button hollow' onClick={props.startEditing} role='button' tabIndex={0}>Edit request</div>
              : <div className='doc-button hollow disabled' onClick={props.startEditing} role='button' tabIndex={0}>Edit request</div>
            }
          </Box>
          // <div className='vrf-add-and-submit'>
          //   {props.vehicleRequest.status !== 'approved'
          //     ? <button type='button' className='vrf-add-button vrf-cancel-button vrf-small-cancel' onClick={props.addVehicle}>Cancel request</button>
          //     : <button type='button' className='vrf-add-button vrf-small-cancel disabled-cancel-button' onClick={props.showError}>Cancel request</button>}
          //   {props.vehicleRequest.status !== 'approved'
          //     ? <button type='submit' className='vrf-submit-button signup-button' onClick={props.startEditing}>Update request</button>
          //     : <button type='submit' className='disabled vrf-submit-button' onClick={props.showError}>Update request</button>}
          // </div>
        )
        : null}
    </Box>
  );
};


export default VehicleRequestDisplay;
