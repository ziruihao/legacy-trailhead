import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../../../layout';
import DOCLoading from '../../../doc-loading';
import { fetchCertApprovals, reviewCertRequest } from '../../../../actions';
import '../../approvals-style.scss';
import '../../../../styles/tripdetails_leader.scss';
import '../../opo-approvals.scss';

class Approvals extends Component {
  TRAILER_CONSTANT = 'TRAILER';

  NONE_CONSTANT = 'NONE';

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount(props) {
    this.props.fetchCertApprovals()
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
            {`${approval.requested_certs.driver_cert}${approval.requested_certs.trailer_cert ? ', TRAILER' : ''}`}
          </td>
          <td>
            <Box dir='row' justify='end'>
              <div className='doc-button alarm' onClick={() => this.reviewRequest(approval._id, 'denied')} role='button' tabIndex={0}>Deny</div>
              <Queue size={15} />
              <div className='doc-button' onClick={() => this.reviewRequest(approval._id, 'approved')} role='button' tabIndex={0}>Approve</div>
            </Box>
          </td>
        </tr>
      // <div key={approval._id} className="trip-detail ola-approval">
      //   <div className="ola-requester-name">
      //     {approval.name} ({approval.email}) is requesting the following driver certification(s):
      //   </div>
      //   <div className="ola-requested-clubs">
      //     <ul>
      //       <li>{approval.requested_certs.driver_cert}</li>
      //       {approval.requested_certs.trailer_cert
      //         ? <li>TRAILER</li>
      //         : null
      //       }
      //     </ul>
      //   </div>
      //   <div className="ola-action-buttons">
      //     <button type="submit" className="ola-approve-button signup-button" onClick={() => this.reviewRequest(approval._id, 'approved')}>Approve</button>
      //     <span className="cancel-link ovr-bottom-link" onClick={() => this.reviewRequest(approval._id, 'denied')} role="button" tabIndex={0}>
      //       Deny
      //     </span>
      //   </div>
      // </div>
      );
    });
  }

  reviewRequest = (userId, status) => {
    const review = {
      userId,
      status,
    };
    this.props.reviewCertRequest(review);
  }

  render() {
    if (this.state.ready) {
      if (this.props.approvals.length === 0) {
        return (
          <Box dir='col' align='center' className='p1 gray thin'>All set for now!</Box>
        );
      } else {
        return (
          <Table className='doc-table' responsive='lg' hover>
            <thead>
              <tr>
                <th>Person</th>
                <th>Requests</th>
                <th>
                  <Box dir='row' justify='end'>
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
      return (
        <DOCLoading type='balls' />
      );
    }
  }
}

const mapStateToProps = state => (
  {
    approvals: state.opo.certApprovals,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchCertApprovals, reviewCertRequest })(Approvals));
