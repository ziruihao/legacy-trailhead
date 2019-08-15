import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { Switch } from 'react-router';
// import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
// import requireAuth from '../containers/requireAuth';
import { fetchLeaderApprovals, reviewRoleRequest } from '../actions';
// import CertApprovals from './cert_approvals';
// import OpoApprovals from './opoStuff';
import '../styles/approvals-style.scss';
import '../styles/tripdetails_leader.scss';
import '../styles/opo-trips.scss';


class LeaderApprovals extends Component {
  componentDidMount(props) {
    this.props.fetchApprovals();
  }

  getPendingRequests = () => {
    const pendingApprovals = this.props.approvals.filter(approval => approval.status === 'pending');
    if (pendingApprovals.length === 0) {
      return <strong>None</strong>;
    }
    return pendingApprovals.map((approval) => {
      if (approval.status === 'pending') {
        return (
          <div key={approval.id} className="container">
            <Table responsive="lg" hover>
              <thead>
                <tr>
                  <th>Leader</th>
                  <th>Subclub(s)</th>
                  <th>Approve/Deny</th>
                </tr>
              </thead>
              <tbody>
                {approval.clubs.map(club => (
                  <tr key={club.id}>
                    <td>{approval.user.name}</td>
                    <td>{club.name}</td>
                    <td>
                      <button data-id={approval.id} data-action="approve" type="button" className="btn btn-success approve-button" onClick={this.reviewRequest}>Approve</button>
                      <button data-id={approval.id} data-action="deny" type="button" className="btn btn-danger deny-button" onClick={this.reviewRequest}>Deny</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        );
      } else {
        return null;
      }
    });
  }

  getReviewedRequests = () => {
    const reviewedApprovals = this.props.approvals.filter(approval => approval.status === 'approved');
    if (reviewedApprovals.length === 0) {
      return <strong>None</strong>;
    }
    return reviewedApprovals.map((approval) => {
      if (approval.status !== 'pending') {
        const status = approval.status === 'approved' ? 'Approved' : 'Denied';
        return (
          <div key={approval.id} className="container">
            <Table responsive="lg" hover>
              <thead>
                <tr>
                  <th>Leader</th>
                  <th>Subclub(s)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approval.clubs.map(club => (
                  <tr key={club.id}>
                    <td>{approval.user.name}</td>
                    <td>{club.name}</td>
                    <td>
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        );
      } else {
        return null;
      }
    });
  }

  reviewRequest = (event) => {
    event.persist();
    const status = event.target.dataset.action === 'approve' ? 'Approved' : 'Denied';
    const review = {
      id: event.target.dataset.id,
      status,
    };
    this.props.reviewRoleRequest(review);
  }

  render() {
    return (
      <div className="leader-details-container dashboard-container">
        <div className="trip-detail pending-table">
          {this.getPendingRequests()}
        </div>
        <div className="pending-and-dropdown">
          <h4 className="trip-status">Approved Requests</h4>
        </div>
        <div className="trip-detail pending-table">
          {this.getReviewedRequests()}
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => (
  {
    approvals: state.opo.leaderApprovals,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchApprovals: fetchLeaderApprovals, reviewRoleRequest })(LeaderApprovals));
