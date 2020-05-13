import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrippeeGearRequests, reviewTrippeeGearRequest } from '../actions';

class trippeeGearRequests extends Component {
  componentDidMount(props) {
    this.props.fetchTrippeeGearRequests();
  }

  getPendingRequests = () => {
    if (this.props.trippeeGearRequests.length === 0) {
      return <strong>None</strong>;
    }
    return this.props.trippeeGearRequests.map((gearRequest) => {
      const gearData = {};
      const gearSizeType = {};
      gearRequest.trippeeGear.forEach((gear) => {
        gearSizeType[gear._id] = gear.size_type;
        if (gear.size_type !== 'N/A') {
          gearData[gear._id] = {};
        }
      });
      gearRequest.members.forEach((member) => {
        member.gear.forEach((gear) => {
          const { gearId } = gear;
          const { user } = member;
          if (gearSizeType[gearId] !== 'N/A') {
            const sizeType = gearSizeType[gearId];
            let indexer = '';
            switch (sizeType) {
              case 'Height':
                indexer = 'height';
                break;
              case 'Clothe':
                indexer = 'clothe_size';
                break;
              case 'Shoe':
                indexer = 'shoe_size';
                break;
              default:
                indexer = '';
            }
            const update = {};
            if (Object.prototype.hasOwnProperty.call(gearData[gearId], user[indexer])) {
              update[user[indexer]] = gearData[gearId][user[indexer]] + 1;
              gearData[gearId] = Object.assign({}, gearData[gearId], update);
            } else {
              update[user[indexer]] = 1;
              gearData[gearId] = Object.assign({}, gearData[gearId], update);
            }
          }
        });
      });
      if (gearRequest.trippeeGearStatus === 'pending') {
        return (
          <div key={gearRequest._id} className="container">
            <div>
              <span>{gearRequest.leaders[0].name} is requesting the following gear for trippees</span>
              <button data-id={gearRequest._id} data-action="approve" type="button" className="btn btn-success" onClick={this.reviewRequest}>Approve</button>
              <button data-id={gearRequest._id} data-action="deny" type="button" className="btn btn-danger" onClick={this.reviewRequest}>Deny</button>
              <br />
            </div>
            <span>Gear - Size - Qty</span>
            {gearRequest.trippeeGear.map((gear, index) => {
              if (Object.prototype.hasOwnProperty.call(gearData, gear._id)) {
                const entries = Object.entries(gearData[gear._id]);
                return entries.map(entry => (
                  <li key={`${gear._id}_${entry[0]}`}>{gear.name} - {entry[0]} - {entry[1]}</li>
                ));
              } else {
                return <li key={gear._id}>{gear.name} - N/A - {gear.quantity}</li>;
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
      const gearSizeType = {};
      gearRequest.trippeeGear.forEach((gear) => {
        gearSizeType[gear._id] = gear.size_type;
        if (gear.size_type !== 'N/A') {
          gearData[gear._id] = {};
        }
      });
      gearRequest.members.forEach((member) => {
        member.gear.forEach((gear) => {
          const { gearId } = gear;
          const { user } = member;
          if (gearSizeType[gearId] !== 'N/A') {
            const sizeType = gearSizeType[gearId];
            let indexer = '';
            switch (sizeType) {
              case 'Height':
                indexer = 'height';
                break;
              case 'Clothe':
                indexer = 'clothe_size';
                break;
              case 'Shoe':
                indexer = 'shoe_size';
                break;
              default:
                indexer = '';
            }
            const update = {};
            if (Object.prototype.hasOwnProperty.call(gearData[gearId], user[indexer])) {
              update[user[indexer]] = gearData[gearId][user[indexer]] + 1;
              gearData[gearId] = Object.assign({}, gearData[gearId], update);
            } else {
              update[user[indexer]] = 1;
              gearData[gearId] = Object.assign({}, gearData[gearId], update);
            }
          }
        });
      });
      if (gearRequest.trippeeGearStatus !== 'pending') {
        const status = gearRequest.trippeeGearStatus === 'approved' ? 'approved' : 'denied';
        return (
          <div key={gearRequest._id} className="container">
            <div>
              <span>You {status} {gearRequest.leaders[0].name}&apos;s request for the following gear:</span>
            </div>
            <span>Gear - Size - Qty</span>
            {gearRequest.trippeeGear.map((gear, index) => {
              if (Object.prototype.hasOwnProperty.call(gearData, gear._id)) {
                const entries = Object.entries(gearData[gear._id]);
                return entries.map(entry => (
                  <li key={`${gear._id}_${entry[0]}`}>{gear.name} - {entry[0]} - {entry[1]}</li>
                ));
              } else {
                return <li key={gear._id}>{gear.name} - N/A - {gear.quantity}</li>;
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
