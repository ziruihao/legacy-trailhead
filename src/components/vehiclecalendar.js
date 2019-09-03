import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, getVehicles, fetchVehicleAssignments } from '../actions';
import VehicleCalendarComponent from './vehicleCalendarComponent';
import '../styles/vehicle-calendar-style.scss';

class VehicleCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    Promise.all([this.props.getVehicles(), this.props.fetchVehicleAssignments()])
      .then(() => {
        this.setState({ ready: true });
      });
  }

  render() {
    if (this.state.ready) {
      return (
        <div className="vehicle-calendar-container">
          <div className="mytrips-flex-start">
            <h1 className="mytrips-header">Vehicle Calendar</h1>
          </div>
          <div className="vcc-container trip-detail">
            <VehicleCalendarComponent
              vehicles={this.props.vehicles}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
          <img src="/src/img/loading-gif.gif" alt="loading-gif" />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    vehicles: state.vehicleRequests.vehicles,
    assignments: state.vehicleRequests.allAssignments,
  };
};

export default withRouter(connect(mapStateToProps, { appError, getVehicles, fetchVehicleAssignments })(VehicleCalendar));
