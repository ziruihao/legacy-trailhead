import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrippeeGearRequests, reviewTrippeeGearRequest } from '../actions';

class trippeeGearRequests extends Component {
  componentDidMount(props) {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.fetchTrippeeGearRequests();
  }

  getPendingRequests = () => {
    if (this.props.trippeeGearRequests.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.trippeeGearRequests.map((gearRequest) => {
      const gearData = {};
      gearRequest.trippeeGear.forEach((gear) => {
        gearData[gear._id] = {};
      });
      gearRequest.members.forEach((member) => {
        member.gear.forEach((gear) => {
          const update = {};
          if (Object.prototype.hasOwnProperty.call(gearData[gear.gearId], member.user.clothe_size)) {
            update[member.user.clothe_size] = gearData[gear.gearId][member.user.clothe_size] + 1;
            gearData[gear.gearId] = Object.assign({}, gearData[gear.gearId], update);
          } else {
            update[member.user.clothe_size] = 1;
            gearData[gear.gearId] = Object.assign({}, gearData[gear.gearId], update);
          }
        });
      });
      if (gearRequest.trippeeGearStatus === 'pending') {
        return (
          <div key={gearRequest.id} className="container">
            <div>
              <span>{gearRequest.leaders[0].name} is requesting the following gear for trippees</span>
              <button data-id={gearRequest.id} data-action="approve" type="button" className="btn btn-success" onClick={this.reviewRequest}>Approve</button>
              <button data-id={gearRequest.id} data-action="deny" type="button" className="btn btn-danger" onClick={this.reviewRequest}>Deny</button>
              <br />
            </div>
            <span>Gear - Size - Qty</span>
            {gearRequest.trippeeGear.map((gear, index) => {
              if (Object.prototype.hasOwnProperty.call(gearData, gear._id)) {
                const entries = Object.entries(gearData[gear._id]);
                return entries.map(entry => (
                  <li key={`${gear._id}_${entry[0]}`}>{gear.gear} - {entry[0]} - {entry[1]}</li>
                ));
              } else {
                return <li key={`${gear._id}_${index}`}>{gear.gear} - N/A - {gear.quantity}</li>;
              }
            })}
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
    if (this.props.trippeeGearRequests.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.trippeeGearRequests.map((gearRequest) => {
      const gearData = {};
      gearRequest.trippeeGear.forEach((gear) => {
        gearData[gear._id] = {};
      });
      gearRequest.members.forEach((member) => {
        member.gear.forEach((gear) => {
          const update = {};
          if (Object.prototype.hasOwnProperty.call(gearData[gear.gearId], member.user.clothe_size)) {
            update[member.user.clothe_size] = gearData[gear.gearId][member.user.clothe_size] + 1;
            gearData[gear.gearId] = Object.assign({}, gearData[gear.gearId], update);
          } else {
            update[member.user.clothe_size] = 1;
            gearData[gear.gearId] = Object.assign({}, gearData[gear.gearId], update);
          }
        });
      });
      if (gearRequest.trippeeGearStatus !== 'pending') {
        const status = gearRequest.trippeeGearStatus === 'approved' ? 'approved' : 'denied';
        return (
          <div key={gearRequest.id} className="container">
            <div>
              <span>You {status} {gearRequest.leaders[0].name}&apos;s request for the following gear:</span>
            </div>
            <span>Gear - Size - Qty</span>
            {gearRequest.trippeeGear.map((gear, index) => {
              if (Object.prototype.hasOwnProperty.call(gearData, gear._id)) {
                const entries = Object.entries(gearData[gear._id]);
                return entries.map(entry => (
                  <li key={`${gear._id}_${entry[0]}`}>{gear.gear} - {entry[0]} - {entry[1]}</li>
                ));
              } else {
                return <li key={`${gear._id}_${index}`}>{gear.gear} - N/A - {gear.quantity}</li>;
              }
            })}
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
    this.props.reviewTrippeeGearRequest(review);
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
    trippeeGearRequests: state.opo.trippeeGearRequests,
    authenticated: state.auth.authenticated,
  }
);


export default withRouter(connect(mapStateToProps, { fetchTrippeeGearRequests, reviewTrippeeGearRequest })(trippeeGearRequests));
