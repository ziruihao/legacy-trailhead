import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Form, Dropdown, DropdownButton, DropdownToggle } from 'react-bootstrap';
import { fetchVehicleRequests } from '../../actions';
import './fleet-management.scss';

class FleetManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVehicleNameField: null,
    };
  }

  changeNewVehicleNameField = (event) => {
    this.setState({ newVehicleNameField: event.target.value });
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
                <input className={`field ${this.state.newVehicleNameField && this.state.newVehicleNameField !== '' ? 'create-trip-error' : ''}`}
                  onChange={this.changeNewVehicleNameField}
                  name="title"
                  placeholder="Example van"
                  value={this.state.newVehicleNameField}
                />
                <div className="field-label">Vehicle type</div>
                <select className={`field ${this.state.newVehicleNameField && this.state.newVehicleNameField !== '' ? 'create-trip-error' : ''}`} />
                <div className="doc-button">Add</div>
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

export default withRouter(connect(mapStateToProps, { fetchVehicleRequests })(FleetManagement));
