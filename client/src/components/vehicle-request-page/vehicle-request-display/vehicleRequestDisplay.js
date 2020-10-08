import React from 'react';
import { Modal } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../../layout';
import Badge from '../../badge';
import Text from '../../text';
import Toggle from '../../toggle';
import DOCLoading from '../../doc-loading';
import utils from '../../../utils';
import '../../../styles/vehicleRequestForm-style.scss';

const getAssignment = (vehicleRequest, index) => {
  if (vehicleRequest.status === 'approved') {
    const assignment = vehicleRequest.assignments.find((element) => {
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
            ? <Text type='p1' color='gray3'>N/A</Text>
            : <Text type='p1'>{utils.dates.formatDate(new Date(assignment.assigned_pickupDateAndTime), { weekday: true })} @ {utils.dates.formatDate(new Date(assignment.assigned_pickupDateAndTime), { timezone: true })}</Text>
      }
          <Stack size={25} />
          <Text type='h3'>Assigned return</Text>
          <Stack size={25} />
          {assignment.assigned_vehicle.name === 'Enterprise'
            ? <Text type='p1' color='gray3'>N/A</Text>
            : <Text type='p1'>{utils.dates.formatDate(new Date(assignment.assigned_returnDateAndTime), { weekday: true })} @ {utils.dates.formatDate(new Date(assignment.assigned_returnDateAndTime), { timezone: true })}</Text>
          }
          <Stack size={25} />
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

const getVehicles = (vehicleRequest) => {
  return vehicleRequest.requestedVehicles.map((vehicle, index) => {
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
            <Text type='p1'>{utils.dates.formatDate(new Date(vehicle.pickupDateAndTime), { weekday: true })} @ {utils.dates.formatDate(new Date(vehicle.pickupDateAndTime), { timezone: true })}</Text>
            <Stack size={25} />
            <Text type='h3'>Return</Text>
            <Stack size={25} />
            <Text type='p1'>{utils.dates.formatDate(new Date(vehicle.returnDateAndTime), { weekday: true })} @ {utils.dates.formatDate(new Date(vehicle.returnDateAndTime), { timezone: true })}</Text>
            <Stack size={25} />
          </Box>
          <Box dir='col' expand>
            {getAssignment(vehicleRequest, index)}
          </Box>
        </Box>
        <Stack size={50} />
      </>
    );
  });
};

class VehicleRequestDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCancellationModal: false,
      cancelling: false,
      cancellationError: null,
    };
  }

  initiateCancel = () => {
    this.setState({ cancelling: true });
    this.props.cancelVehicleRequest(this.props.vehicleRequest._id, this.props.history)
      .then(() => {
        this.setState({ cancelling: false, showCancellationModal: false });
      })
      .catch((error) => {
        this.setState({ cancelling: false, cancellationError: error.message });
      });
  }

  renderCancellationModal = () => {
    if (this.state.cancelling) {
      return (
        <>
          <Stack size={25} />
          <DOCLoading type='spin' width='35' height='35' measure='px' />
          <Stack size={25} />
        </>
      );
    } else if (this.state.cancellationError) {
      return (
        <>
          <Badge type='denied' size={50} />
          <Stack size={24} />
          <Text type='h2'>There was an error cancelling</Text>
          <Stack size={24} />
          <div className='p1 center-text'>{this.state.cancellationError}</div>
          <Stack size={24} />
          <Box dir='row' justify='center'>
            <div className='doc-button hollow' onClick={() => this.setState({ showCancellationModal: false })} role='button' tabIndex={0}>Close</div>
            <Queue size={15} />
            <div className='doc-button alarm' onClick={this.initiateCancel} role='button' tabIndex={0}>Try again</div>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Badge type='warning' size={50} />
          <Stack size={24} />
          <Text type='h2'>Are you sure you want to cancel?</Text>
          <Stack size={24} />
          <div className='p1 center-text'>If you need this vehicle again, you would have to request it again. We will notify OPO staff so they can offer the vehicle to another group.</div>
          <Stack size={24} />
          <Box dir='row' justify='center'>
            <div className='doc-button' onClick={() => this.setState({ showCancellationModal: false })} role='button' tabIndex={0}>Wait no</div>
            <Queue size={15} />
            <div className='doc-button alarm' onClick={this.initiateCancel} role='button' tabIndex={0}>Cancel request</div>
          </Box>
        </>
      );
    }
  }

  render() {
    return (
      <Box dir='col' pad={75} className='doc-card'>
        <Box dir='row' justify='between'>
          <Box dir='row' align='center'>
            <Text type='h1'>V-Req #{this.props.vehicleRequest.number}</Text>
            {this.props.requestType !== 'SOLO'
              ? (
                <>
                  <Queue size={25} />
                  <Divider dir='col' size={1} />
                  <Queue size={25} />
                  <Text type='h2' color='gray3' weight='thin'>TRIP #{this.props.vehicleRequest.associatedTrip.number || this.props.trip.number}</Text>
                </>
              )
              : null
          }
          </Box>
          <Badge type={this.props.vehicleRequest.status} size={36} />
        </Box>
        <Stack size={50} />
        {this.props.requestType === 'SOLO'
          ? (
            <Box dir='col'>
              <Text type='h3'>Request details</Text>
              <Stack size={25} />
              <Text type='p1'>{this.props.vehicleRequest.requestDetails}</Text>
              <Stack size={25} />
              <Box dir='row' justify='between'>
                <Box dir='col' expand>
                  <Text type='h3'>Number of people</Text>
                  <Stack size={25} />
                  <Text type='p1'>{this.props.vehicleRequest.noOfPeople}</Text>
                  <Stack size={25} />
                </Box>
                <Queue size={25} />
                <Box dir='col' expand>
                  <Text type='h3'>Estimated mileage</Text>
                  <Stack size={25} />
                  <Text type='p1'>{this.props.vehicleRequest.mileage}</Text>
                </Box>
              </Box>
            </Box>
          )
          : null}
        {getVehicles(this.props.vehicleRequest)}
        <Stack size={50} />
        {this.props.requestType === 'SOLO'
          ? (
            <Box dir='row' justify='between' align='center'>
              <div className='doc-button alarm' onClick={() => this.setState({ showCancellationModal: true })} role='button' tabIndex={0}>Cancel request</div>
              {this.props.vehicleRequest.status !== 'approved'
                ? <div className='doc-button hollow' onClick={this.props.startEditing} role='button' tabIndex={0}>Edit request</div>
                : <div className='doc-button hollow disabled' role='button' tabIndex={0}>Edit request</div>
            }
            </Box>
          )
          : null}
        <Modal
          centered
          show={this.state.showCancellationModal}
          onHide={() => this.setState({ showCancellationModal: false })}
        >
          <Box dir='col' align='center' pad={25}>
            {this.renderCancellationModal()}
          </Box>
        </Modal>
      </Box>
    );
  }
}


export default VehicleRequestDisplay;
