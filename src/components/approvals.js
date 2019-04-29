import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchApprovals, reviewRoleRequest } from '../actions';
import '../styles/approvals-style.scss';

class Approvals extends Component {
  componentDidMount(props) {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.fetchApprovals();
  }

  getPendingRequests = () => {
    if (this.props.approvals.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.approvals.map((approval) => {
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
    if (this.props.approvals.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.approvals.map((approval) => {
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
    approvals: state.opo.approvals,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchApprovals, reviewRoleRequest })(Approvals));
