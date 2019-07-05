import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchCertApprovals, reviewCertRequest } from '../actions';
import '../styles/approvals-style.scss';

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
            <div>
              <span>{approval.user.name} wants to make the following changes to their driver certifications</span>
              <button data-id={approval.id} data-action="approve" type="button" className="btn btn-success" onClick={this.reviewRequest}>Approve</button>
              <button data-id={approval.id} data-action="deny" type="button" className="btn btn-danger" onClick={this.reviewRequest}>Deny</button>
            </div>
            <div>
              <div>
                <h3>Current</h3>
                {this.displayCertifications(approval.user.trailer_cert, approval.user.driver_cert)}
              </div>
              <div>
                <h3>Proposed</h3>
                {this.displayCertifications(approval.trailer_cert, approval.driver_cert)}
              </div>
            </div>
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
      certifications = trailerCert ? `${driverCert}, ${this.TRAILER_CONSTANT}` : driverCert;
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
        const status = approval.status === 'approved' ? 'granted' : 'denied';
        return (
          <div key={approval.id} className="container">
            <div>
              <span>You {status} the following changes to {approval.user.name}&apos; driver certifications</span>
            </div>
            <div>
              <div>
                <h3>Current</h3>
                {this.displayCertifications(approval.user.trailer_cert, approval.user.driver_cert)}
              </div>
              <div>
                <h3>Previous</h3>
                {this.displayCertifications(approval.trailer_cert, approval.driver_cert)}
              </div>
            </div>
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
    approvals: state.opo.certApprovals,
    authenticated: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { fetchCertApprovals, reviewCertRequest })(Approvals));
