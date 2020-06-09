import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import DOCLoading from '../../../doc-loading';
import { Stack, Queue, Divider, Box } from '../../../layout';
import { fetchLeaderApprovals, reviewRoleRequest } from '../../../../actions';
import '../../approvals-style.scss';
import '../../../../styles/tripdetails_leader.scss';
import '../../opo-approvals.scss';

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

  getPendingRequests = (pendingApprovals) => {
    return pendingApprovals.map((approval) => {
      return (
        <tr key={approval._id}>
          <td>{approval.name}</td>
          <td>
            {approval.requested_clubs.map(club => club.name).join(', ')}
          </td>
          <td>
            <Box dir="row" justify="end">
              <div className="doc-button alarm" onClick={() => this.reviewRequest(approval._id, 'denied')} role="button" tabIndex={0}>Deny</div>
              <Queue size={15} />
              <div className="doc-button" onClick={() => this.reviewRequest(approval._id, 'approved')} role="button" tabIndex={0}>Approve</div>
            </Box>
          </td>
        </tr>
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
      if (this.props.approvals.length === 0) {
        return (
          <Box dir="col" align="center" className="p1 gray thin">All set for now!</Box>
        );
      } else {
        return (
          <Table className="doc-table" responsive="lg" hover>
            <thead>
              <tr>
                <th>Person</th>
                <th>Requests</th>
                <th>
                  <Box dir="row" justify="end">
                    Action
                  </Box>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.getPendingRequests(this.props.approvals)}
            </tbody>
          </Table>
        );
      }
    } else {
      return (<DOCLoading type="doc" height="150" width="150" measure="px" />);
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
