import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Dropdown } from 'react-bootstrap';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import { fetchVehicleRequests, createVehicle } from '../../actions';
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

  render() {
    return (
      <div id="fleet-management-page" className="center-view">
        <div className="h1">DOC Vehicles</div>
        <div id="fleet-management">
          <div id="fleet">
            <Table className="doc-table" responsive="lg" hover>
              <thead>
                <tr>
                  <th>Vehicle Name</th>
                  <th>Type</th>
                  <th id="fleet-management-book-col">Booked by</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.props.vehicles.map(vehicle => (
                  <tr key={vehicle._id} onClick={() => this.onRowClick(vehicle._id)}>
                    <td>{vehicle.name}</td>
                    <td>{vehicle.type}</td>
                    <td id="fleet-management-book-col">To implement</td>
                    <td className="fleet-delete-button-area"><div id="fleet-delete-button" className="doc-button">Delete</div></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div id="management">
            <div className="doc-card">
              <div className="doc-form">
                <div className="h2">Add New Vehicle</div>
                <div className="field-label">Vehicle name</div>
                <input className={`field ${this.state.newVehicleNameError ? 'field-error' : ''}`}
                  onChange={event => this.changeNewVehicleFields(event.target.value, 'newVehicleName')}
                  name="title"
                  placeholder="Example van"
                  value={this.state.newVehicleName}
                />
                <div className="field-label">Vehicle type</div>
                <Dropdown onSelect={eventKey => this.changeNewVehicleFields(eventKey, 'newVehicleType')}>
                  <Dropdown.Toggle className={`field ${this.state.newVehicleTypeError ? 'field-error' : ''}`}>
                    <span className="field-dropdown-bootstrap">{this.state.newVehicleType ? this.state.newVehicleType : 'Select vehicle type'}</span>
                    <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="field-dropdown">
                    <Dropdown.Item eventKey="Microbus">Microbus</Dropdown.Item>
                    <Dropdown.Item eventKey="Van">Van</Dropdown.Item>
                    <Dropdown.Item eventKey="Truck">Truck</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <select className={`field ${this.state.newVehicleNameField && this.state.newVehicleNameField !== '' ? 'create-trip-error' : ''}`} /> */}
                <div className="doc-button" onClick={this.submitForm} role="button" tabIndex={0}>Add</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vehicles: state.vehicleRequests.vehicles,
  };
};

export default withRouter(connect(mapStateToProps, { fetchVehicleRequests, createVehicle })(FleetManagement));
