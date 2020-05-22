import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Toggle from '../../toggle/toggle';
import Loading from '../../loading';
import { fetchVehicleRequests } from '../../../actions';
import '../../../styles/tripdetails_leader.scss';
import '../opo-approvals.scss';

class OPOVehicleRequests extends Component {
  now = new Date();

  constructor(props) {
    super(props);
    this.state = {
      searchPendingTerm: '',
      seePastPendingRequests: false,
      searchReviewedTerm: '',
      seePastReviewedRequests: false,
      ready: false,
    };
  }

  componentDidMount() {
    this.props.fetchVehicleRequests()
      .then(() => {
        this.setState({ ready: true });
      });
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
    let pendingRequests = this.props.vehicleRequests.filter((request) => {
      return request.status === 'pending';
    });

    if (!this.state.seePastReviewedRequests) {
      const today = new Date();
      pendingRequests = pendingRequests.filter((request) => {
        const assignmentDates = request.assignments.map(assignment => new Date(assignment.assigned_returnDateAndTime));
        assignmentDates.sort((d1, d2) => {
          if (d1 < d2) return -1;
          else if (d1 > d2) return 1;
          else return 0;
        });
        if (assignmentDates.pop() < today) return false;
        else return true;
      });
    }

    if (pendingRequests.length === 0) {
      return (<div className="inactive">All set for now!</div>);
    }

    const searchedRequests = pendingRequests.filter((request) => {
      const reason = request.requestType === 'SOLO' ? request.requestDetails : request.associatedTrip.title;
      return request.requestDetails.concat([request.requester.name, reason]).toLowerCase().includes(this.state.searchPendingTerm.toLowerCase());
      // return true;
    });
    if (searchedRequests.length === 0) {
      return (<div className="inactive">None found.</div>);
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
    let approvedRequests = this.props.vehicleRequests.filter((request) => {
      return request.status !== 'pending';
    });

    if (!this.state.seePastReviewedRequests) {
      const today = new Date();
      approvedRequests = approvedRequests.filter((request) => {
        const assignmentDates = request.assignments.map(assignment => new Date(assignment.assigned_returnDateAndTime));
        assignmentDates.sort((d1, d2) => {
          if (d1 < d2) return -1;
          else if (d1 > d2) return 1;
          else return 0;
        });
        if (assignmentDates.pop() < today) return false;
        else return true;
      });
    }

    if (approvedRequests.length === 0) {
      return (<div className="inactive">All set for now!</div>);
    }
    const searchedRequests = approvedRequests.filter((request) => {
      const reason = request.requestType === 'SOLO' ? request.requestDetails : request.associatedTrip.title;
      // return true;
      return request.requestDetails.concat([request.requester.name, reason]).toLowerCase().includes(this.state.searchReviewedTerm.toLowerCase());
    });
    if (searchedRequests.length === 0) {
      return (<div className="inactive">None found.</div>);
    } else {
      return (
        <Table className="doc-table" responsive="lg" hover>
          <thead>
            <tr>
              <th>Requester</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.getApprovedRequestsRows(searchedRequests)}
          </tbody>
        </Table>
      );
    }
  }

  getReqStatus = (status) => {
    if (status === 'N/A') {
      return <td>N/A</td>;
    } else if (status === 'pending') {
      return <td className="pending">Pending</td>;
    } else if (status === 'approved') {
      return <td className="approved">Approved</td>;
    } else {
      return <td className="denied">Denied</td>;
    }
  }

  getPendingRequestRows = (pendingRequests) => {
    return pendingRequests.map(request => (
      <tr key={request._id} onClick={() => this.onRowClick(request._id)}>
        <td>{request.requester.name}</td>
        <td>{request.requestType === 'SOLO' ? request.requestDetails : request.associatedTrip.title}</td>
      </tr>
    ));
  }

  getApprovedRequestsRows = (approvedRequests) => {
    return approvedRequests.map(request => (
      <tr key={request._id} onClick={() => this.onRowClick(request._id)}>
        <td>{request.requester.name}</td>
        <td>{request.requestType === 'SOLO' ? request.requestDetails : request.associatedTrip.title}</td>
        {this.getReqStatus(request.status)}
      </tr>
    ));
  }

  render() {
    if (this.state.ready) {
      return (
        <div id="opo-trips-page" className="center-view">
          <div className="opo-trips-page-databox doc-card large-card">
            <div className="databox-heading">
              <div className="doc-h1">Pending V-Requests</div>
              <Toggle
                id="pending-requests-past-toggle"
                label="See past requests"
                value={this.state.seePastPendingRequests}
                onChange={() => this.setState((prevState) => { return { seePastPendingRequests: !prevState.seePastPendingRequests }; })}
              />
              <input
                name="searchPending"
                placeholder="Search pending requests"
                value={this.state.searchPendingTerm}
                onChange={this.onSearchPendingTermChange}
                className="databox-heading-search field"
              />
            </div>
            {this.getPendingTable()}
          </div>
          <div className="opo-trips-page-databox doc-card large-card">
            <div className="databox-heading">
              <h4 className="doc-h1">Reviewed V-Requests</h4>
              <Toggle
                id="reviewed-requests-past-toggle"
                label="See past requests"
                value={this.state.seePastReviewedRequests}
                onChange={() => this.setState((prevState) => { return { seePastReviewedRequests: !prevState.seePastReviewedRequests }; })}
              />
              <input
                name="searchReviewed"
                placeholder="Search reviewed requests"
                value={this.state.searchReviewedTerm}
                onChange={this.onSearchReviewedTermChange}
                className="databox-heading-search field"
              />
            </div>
            {this.getApprovedTable()}
          </div>

        </div>
      );
    } else {
      return (<Loading type="doc" height="150" width="150" measure="px" />);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    vehicleRequests: state.vehicleRequests.vehicleRequests,
  };
};

export default withRouter(connect(mapStateToProps, { fetchVehicleRequests })(OPOVehicleRequests));
