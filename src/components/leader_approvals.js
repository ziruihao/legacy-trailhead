import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLeaderApprovals, reviewRoleRequest } from '../actions';
import loadingGif from '../img/loading-gif.gif';
import '../styles/approvals-style.scss';
import '../styles/tripdetails_leader.scss';
import '../styles/opo-trips.scss';


class LeaderApprovals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    this.props.fetchApprovals()
      .then(() => {
        this.setState({ ready: true });
      });
  }

  getPendingRequests = () => {
    const pendingApprovals = this.props.approvals;
    if (pendingApprovals.length === 0) {
      return (
        <div className="no-on-trip trip-detail">
          <h4 className="none-f-now">None</h4>
        </div>
      );
    }
    return pendingApprovals.map((approval) => {
      return (
        <div key={approval._id} className="trip-detail ola-approval">
          <div className="ola-requester-name">
            {approval.name} ({approval.email}) is requesting leader access to the following club(s):
          </div>
          <div className="ola-requested-clubs">
            <ul>
              {approval.requested_clubs.map(club => (
                <li key={club._id}>{club.name}</li>
              ))}
            </ul>
          </div>
          <div className="ola-action-buttons">
            <button type="submit" className="ola-approve-button signup-button" onClick={() => this.reviewRequest(approval.id, 'approved')}>Approve</button>
            <span className="cancel-link ovr-bottom-link" onClick={() => this.reviewRequest(approval.id, 'denied')} role="button" tabIndex={0}>
              Deny
            </span>
          </div>
        </div>
      );
    });
  }

  reviewRequest = (userId, status) => {
    const review = {
      userId,
      status,
    };
    this.props.reviewRoleRequest(review);
  }

  render() {
    if (this.state.ready) {
      return (
        <div className="leader-details-container dashboard-container">
          {this.getPendingRequests()}
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
          <img src={loadingGif} alt="loading-gif" />
        </div>
      );
    }
  }
}


const mapStateToProps = state => (
  {
    approvals: state.opo.leaderApprovals,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchApprovals: fetchLeaderApprovals, reviewRoleRequest })(LeaderApprovals));
