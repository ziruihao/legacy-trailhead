import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { Switch } from 'react-router';
import Table from 'react-bootstrap/Table';
// import requireAuth from '../containers/requireAuth';
import { fetchCertApprovals, reviewCertRequest } from '../actions';
// import OpoCertApprovals from './opoStuff';
import '../styles/approvals-style.scss';
import '../styles/tripdetails_leader.scss';
import '../styles/opo-trips.scss';

class Approvals extends Component {
  TRAILER_CONSTANT = 'TRAILER';

  NONE_CONSTANT = 'NONE';

  componentDidMount(props) {
    this.props.fetchCertApprovals();
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
                  <th>Current Status</th>
                  <th>Requested Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{approval.user.name}</td>
                  <td>{this.displayCertifications(approval.user.trailer_cert, approval.user.driver_cert)}</td>
                  <td>{this.displayCertifications(approval.trailer_cert, approval.driver_cert)}</td>
                  <td>
                    <button data-id={approval.id} data-action="approve" type="button" className="btn btn-success approve-button" onClick={this.reviewRequest}>Approve</button>
                    <button data-id={approval.id} data-action="deny" type="button" className="btn btn-danger deny-button" onClick={this.reviewRequest}>Deny</button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        );
      } else {
        return null;
      }
    });
  }

  displayCertifications = (trailerCert, driverCert) => {
    let certifications = '';
    if (driverCert === null && !trailerCert) {
      certifications = this.NONE_CONSTANT;
    } else {
      driverCert = driverCert === null ? '' : `${driverCert}, `;
      certifications = trailerCert ? `${driverCert}${this.TRAILER_CONSTANT}` : driverCert;
    }
    return certifications;
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
                  <th>Approved Status</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{approval.user.name}</td>
                  <td>{this.displayCertifications(approval.user.trailer_cert, approval.user.driver_cert)}</td>
                  <td>{status}</td>
                </tr>
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
    const status = event.target.dataset.action === 'approve' ? 'approved' : 'denied';
    const review = {
      id: event.target.dataset.id,
      status,
    };
    this.props.reviewCertRequest(review);
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
    approvals: state.opo.certApprovals,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchCertApprovals, reviewCertRequest })(Approvals));
