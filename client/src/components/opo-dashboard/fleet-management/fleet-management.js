import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Dropdown } from 'react-bootstrap';
import Icon from '../../icon';
import Text from '../../text';
import { Stack, Queue, Divider, Box } from '../../layout';
import { fetchVehicleRequests, createVehicle, deleteVehicle } from '../../../actions';
import './fleet-management.scss';

class FleetManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVehicleName: '',
      newVehicleNameError: false,
      newVehicleType: null,
      newVehicleTypeError: false,
    };
  }

  changeNewVehicleFields = (value, field) => {
    const update = {};
    update[field] = value;
    this.setState(update);
  }

  submitForm = () => {
    if (!this.state.newVehicleName || this.state.newVehicleName === '') {
      this.setState({ newVehicleNameError: true });
    }
    if (!this.state.newVehicleType) {
      this.setState({ newVehicleTypeError: true });
    } else {
      this.setState({ newVehicleNameError: false, newVehicleTypeError: false });
      console.log({ name: this.state.newVehicleName, type: this.state.newVehicleType });
      this.props.createVehicle({ name: this.state.newVehicleName, type: this.state.newVehicleType }).then(() => {
        this.setState({ newVehicleName: '', newVehicleType: null });
      });
    }
  }

  handleDeleteVehicleButton = (vehicleID) => {
    this.props.deleteVehicle(vehicleID);
  }

  render() {
    return (
      <div id='fleet-management-page' className='center-view'>
        <div id='fleet-management'>
          <div id='fleet'>
            <div className='doc-card large-card'>
              <Text type='h1'>Vehicle Fleet</Text>
              <Stack size={50} />
              <Table className='doc-table' responsive='lg' hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th id='fleet-management-book-col'>Booked by</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.vehicles.map(vehicle => (
                    <tr key={vehicle._id} onClick={() => this.onRowClick(vehicle._id)}>
                      <td>{vehicle.name}</td>
                      <td>{vehicle.type}</td>
                      <td id='fleet-management-book-col'>To implement</td>
                      <td className='fleet-delete-button-area'><div id='fleet-delete-button' className='doc-button' onClick={() => this.handleDeleteVehicleButton(vehicle._id)} role='button' tabIndex={0}>Delete</div></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

          </div>
          <div id='management'>
            <Box className='doc-card' pad={25}>
              <div className='doc-form'>
                <Text type='h2'>Add New Vehicle</Text>
                <div className='field-label'>Vehicle name</div>
                <input className={`field ${this.state.newVehicleNameError ? 'field-error' : ''}`}
                  onChange={event => this.changeNewVehicleFields(event.target.value, 'newVehicleName')}
                  name='title'
                  placeholder='Example van'
                  value={this.state.newVehicleName}
                />
                <div className='field-label'>Vehicle type</div>
                <Dropdown onSelect={eventKey => this.changeNewVehicleFields(eventKey, 'newVehicleType')}>
                  <Dropdown.Toggle className={`field ${this.state.newVehicleTypeError ? 'field-error' : ''}`}>
                    <span className='field-dropdown-bootstrap'>{this.state.newVehicleType ? this.state.newVehicleType : 'Select vehicle type'}</span>
                    <Queue size={20} />
                    <Icon type='dropdown' size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='field-dropdown-menu'>
                    <Dropdown.Item eventKey='Microbus'>Microbus</Dropdown.Item>
                    <Dropdown.Item eventKey='Van'>Van</Dropdown.Item>
                    <Dropdown.Item eventKey='Truck'>Truck</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className='doc-button' onClick={this.submitForm} role='button' tabIndex={0}>Add</div>
              </div>
            </Box>
          </div>
        </div>
        <Stack size={100} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vehicles: state.vehicleRequests.vehicles,
  };
};

export default withRouter(connect(mapStateToProps, { fetchVehicleRequests, createVehicle, deleteVehicle })(FleetManagement));
