import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchGearRequests, reviewGearRequest } from '../actions';

class gearRequests extends Component {
  componentDidMount(props) {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.fetchGearRequests();
  }

  getPendingRequests = () => {
    console.log(this.props.gearRequests);
    if (this.props.gearRequests.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.gearRequests.map((gearRequest) => {
      if (gearRequest.gearStatus === 'pending') {
        return (
          <div key={gearRequest.id} className="container">
            <div>
              <span>{gearRequest.leaders[0].name} is requesting the following gear</span>
              <button data-id={gearRequest.id} data-action="approve" type="button" className="btn btn-success" onClick={this.reviewRequest}>Approve</button>
              <button data-id={gearRequest.id} data-action="deny" type="button" className="btn btn-danger" onClick={this.reviewRequest}>Deny</button>
            </div>
            {gearRequest.OPOGearRequests.map((gear, index) => (
              <li key={`${gear}_${index}`}>{gear}</li>
            ))}
            <div>
              <p>for the following trip:</p>
              <p>Trip Name: {gearRequest.title}</p>
              <p>Trip Club: {gearRequest.club.name}</p>
            </div>
          </div>
        );
      } else {
        return null;
      }
    });
  }

  getReviewedRequests = () => {
    if (this.props.gearRequests.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.gearRequests.map((gearRequest) => {
      if (gearRequest.gearStatus !== 'pending') {
        const status = gearRequest.gearStatus === 'approved' ? 'approved' : 'denied';
        return (
          <div key={gearRequest.id} className="container">
            <div>
              <span>You {status} {gearRequest.leaders[0].name}&apos;s request for the following gear:</span>
            </div>
            {gearRequest.OPOGearRequests.map(gear => (
              <li key={gear}>{gear}</li>
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
    this.props.reviewGearRequest(review);
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
    gearRequests: state.opo.gearRequests,
    authenticated: state.auth.authenticated,
  }
);


export default withRouter(connect(mapStateToProps, { fetchGearRequests, reviewGearRequest })(gearRequests));
