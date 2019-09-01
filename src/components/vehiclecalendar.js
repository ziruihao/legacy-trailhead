import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError, getVehicles } from '../actions';
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
    this.props.getVehicles()
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
          <div className="vcc-container">
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
  };
};

export default withRouter(connect(mapStateToProps, { appError, getVehicles })(VehicleCalendar));
