import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { fetchVehicleRequests } from '../actions';
import '../styles/tripdetails_leader.scss';
import '../styles/opo-trips.scss';

class OpoVehicleRequests extends Component {
  now = new Date();

  constructor(props) {
    super(props);
    this.state = {
      searchPendingTerm: '',
      searchReviewedTerm: '',
    };
  }

  componentDidMount() {
    this.props.fetchVehicleRequests();
  }

  onSearchPendingTermChange = (event) => {
    event.persist();
    this.setState({ searchPendingTerm: event.target.value });
  }

  onSearchReviewedTermChange = (event) => {
    event.persist();
    this.setState({ searchReviewedTerm: event.target.value });
  }

  onRowClick = (id) => {
    this.props.history.push(`/opo-vehicle-request/${id}`);
  }

  formatDate = (date, time) => {
    let timeString = '';
    const rawDate = new Date(date);
    const dateString = rawDate.toUTCString();
    timeString = dateString.substring(0, 11);
    const splitTime = time.split(':');
    splitTime.push(' AM');
    const originalHour = splitTime[0];
    splitTime[0] = originalHour % 12;
    if (originalHour >= 12) {
      splitTime[2] = ' PM';
    }
    if (splitTime[0] === 0) {
      splitTime[0] = 12;
    }
    timeString = `${timeString}, ${splitTime[0]}:${splitTime[1]}${splitTime[2]}`;
    return timeString;
  };

  getPendingTable = () => {
    const pendingRequests = this.props.vehicleRequests.filter((request) => {
      return request.status === 'pending';
    });

    if (pendingRequests.length === 0) {
      return (
        <div className="no-on-trip">
          <h4 className="none-f-now">None</h4>
        </div>
      );
    }

    const searchedRequests = pendingRequests.filter((request) => {
      const reason = request.requestType === 'SOLO' ? request.requestDetails : request.associatedTrip.title;
      return request.requestDetails.concat([request.requester.name, reason]).toLowerCase().includes(this.state.searchPendingTerm.toLowerCase());
    });
    if (searchedRequests.length === 0) {
      return (
        <div className="no-on-trip">
          <h4 className="none-f-now">None</h4>
        </div>
      );
    } else {
      return (
        <Table responsive="lg" hover>
          <thead>
            <tr>
              <th>Requester</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {this.getPendingRequestRows(searchedRequests)}
          </tbody>
        </Table>
      );
    }
  }

  getApprovedTable = () => {
    const approvedRequests = this.props.vehicleRequests.filter((request) => {
      return request.status !== 'pending';
    });
    if (approvedRequests.length === 0) {
      return (
        <div className="no-on-trip">
          <h4 className="none-f-now">None</h4>
        </div>
      );
    }
    const searchedRequests = approvedRequests.filter((request) => {
      const reason = request.requestType === 'SOLO' ? request.requestDetails : request.associatedTrip.title;
      return request.requestDetails.concat([request.requester.name, reason]).toLowerCase().includes(this.state.searchReviewedTerm.toLowerCase());
    });
    if (searchedRequests.length === 0) {
      return (
        <div className="no-on-trip">
          <h4 className="none-f-now">None</h4>
        </div>
      );
    } else {
      return (
        <Table responsive="lg" hover>
          <thead>
            <tr>
              <th>Requester</th>
              <th>Reason</th>
              <th>Assigned Vehicle</th>
              <th>Picked up</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            {this.getApprovedRequestsRows(searchedRequests)}
          </tbody>
        </Table>
      );
    }
  }

  getPendingRequestRows = (pendingRequests) => {
    return pendingRequests.map(request => (
      <tr key={request.id} onClick={() => this.onRowClick(request.id)}>
        <td>{request.requester.name}</td>
        {request.requestType === 'SOLO'
          ? <td>{request.requestDetails}</td>
          : <td>{request.associatedTrip.title}</td>}
      </tr>
    ));
  }

  getApprovedRequestsRows = (approvedRequests) => {
    return approvedRequests.map(request => (
      <div />
    ));
  }

  render() {
    return (
      <div className="leader-details-container dashboard-container">
        <div className="pending-and-dropdown">
          <h4 className="trip-status">Pending Requests</h4>
          <input
            name="searchPending"
            placeholder="Search pending requests"
            value={this.state.searchPendingTerm}
            onChange={this.onSearchPendingTermChange}
            className="searchbox"
          />
        </div>
        <div className="trip-detail pending-table">
          {this.getPendingTable()}
        </div>

        <div className="calendar-link-div">
          <Link to="/vehiclescheduler" className="calendar-link">View Vehicle Calendar</Link>
        </div>

        <div className="pending-and-dropdown">
          <h4 className="trip-status">Reviewed & Past Requests</h4>
          <input
            name="searchReviewed"
            placeholder="Search reviewed & past requests"
            value={this.state.searchReviewedTerm}
            onChange={this.onSearchReviewedTermChange}
            className="searchbox"
          />
        </div>
        <div className="trip-detail pending-table">
          {this.getApprovedTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vehicleRequests: state.vehicleRequests.vehicleRequests,
  };
};

export default withRouter(connect(mapStateToProps, { fetchVehicleRequests })(OpoVehicleRequests));
