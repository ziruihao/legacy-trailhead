import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLeaderApprovals, reviewRoleRequest } from '../actions';
import '../styles/approvals-style.scss';

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
            <div>
              <span>{approval.user.name} is requesting leader access for the following club(s):</span>
              <button data-id={approval.id} data-action="approve" type="button" className="btn btn-success" onClick={this.reviewRequest}>Approve</button>
              <button data-id={approval.id} data-action="deny" type="button" className="btn btn-danger" onClick={this.reviewRequest}>Deny</button>
            </div>
            {approval.clubs.map(club => (
              <li key={club.id}>{club.name}</li>
            ))}
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
        const status = approval.status === 'approved' ? 'granted' : 'denied';
        return (
          <div key={approval.id} className="container">
            <div>
              <span>You {status} {approval.user.name} leader access for the following club(s):</span>
            </div>
            {approval.clubs.map(club => (
              <li key={club.id}>{club.name}</li>
            ))}
          </div>
        );
      } else {
        return null;
      }
    });
  }


  reviewRequest = (event) => {
    event.persist();
    const status = event.target.dataset.action === 'approve' ? 'approved' : 'denied';
    const review = {
      id: event.target.dataset.id,
      status,
    };
    this.props.reviewRoleRequest(review);
  }

  render() {
    return (
      <div>
        <div>
          <h2>Pending Requests</h2>
          {this.getPendingRequests()}
        </div>
        <div>
          <h2>Reviewed Requests</h2>
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
