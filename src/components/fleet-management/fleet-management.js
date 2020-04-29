import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { fetchVehicleRequests } from '../../actions';
import Toggle from '../toggle/toggle';
import loadingGif from '../../img/loading-gif.gif';
import './fleet-management.scss';

class FleetManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div id="fleet-management">
        <div id="fleet">
          <div className="h1">DOC Vehicles</div>
          <Table responsive="lg" hover>
            <thead>
              <tr>
                <th>Vehicle Name</th>
                <th>Type</th>
                <th>Booked by</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.vehicles.map(vehicle => (
                <tr key={vehicle._id} onClick={() => this.onRowClick(vehicle._id)}>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.type}</td>
                  <td>To implement</td>
                  <td className="fleet-delete-button-area"><div id="fleet-delete-button" className="doc-button">Delete</div></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div id="management">
          <div className="h1">Add New Vehicle</div>
          <div id="fleet-management-input">
            <p>Manage</p>
            <input className={`form-control field top-create-trip ${false ? 'create-trip-error' : ''}`}
                // onChange={props.onFieldChange}
              name="title"
              placeholder="e.g. Weekend Mt. Moosilauke Hike!"
              value="test"
            />
            <div className="doc-button">Add</div>
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
