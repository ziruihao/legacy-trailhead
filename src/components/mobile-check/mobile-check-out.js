import React, { PureComponent } from 'react';
import { withRouter, useLocation } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import Loading from '../loading';
import { fetchTrip, editTrip, setAttendingStatus } from '../../actions';
import utils from '../../utils';
import './mobile-check.scss';

class MobileCheckOut extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
    this.query = new URLSearchParams(this.props.location.search);
  }


  componentWillMount = () => {
    console.log(this.props.match.params.tripID);
    this.props.fetchTrip(this.props.match.params.tripID, this.query.get('token')).then(() => {
      this.setState({ loaded: true });
    });
  }

  toggleAttendence = (memberID, status) => {
    this.props.setAttendingStatus(this.props.match.params.tripID, memberID, status, this.query.get('token'));
  }

  toggleReturned = (status) => {
    this.props.trip.returned = status;
    this.props.editTrip(this.props.trip, null, this.props.trip._id, this.query.get('token'));
  }

  render() {
    if (!this.state.loaded) {
      return (<Loading type="doc" width="64" height="64" measure="px" />);
    } else {
      return (
        <div id="mobile-check-screen">
          <div id="mobile-check-header">
            <div className="doc-h3">{`Trip #${this.props.trip.number}`}</div>
            <div className="doc-h1">{`${this.props.trip.title}`}</div>
            <div className="doc-h3">{`Start: ${utils.dates.formatDate(this.props.trip.startDate)} ${utils.dates.formatTime(this.props.trip.startTime)}`}</div>
            <div className="doc-h3">{`Return: ${utils.dates.formatDate(this.props.trip.endDate)} ${utils.dates.formatTime(this.props.trip.endTime)}`}</div>
          </div>
          <hr />
          <div id="mobile-check-body">
            <div className="doc-h2">Welcome back!</div>
            <div className="p1">If you have returned safely without ANY incidents or near misses during the trip:</div>
            {this.props.trip.returned
              ? <div role="button" tabIndex={0} className="doc-button alarm" onClick={() => this.toggleReturned(false)}>Undo return</div>

              : <div role="button" tabIndex={0} className="doc-button" onClick={() => this.toggleReturned(true)}>We returned safely</div>
          }
            <div className="p1">If you need to file an incident or near miss report:</div>
            <div role="button" tabIndex={0} className="doc-button alarm" onClick={() => { window.open('https://docs.google.com/forms/u/1/d/e/1FAIpQLSeo9jIcTGNstZ1uADtovDjJT8kkPtS-YpRwzJC2MZkVkbH0hw/viewform', '_blank'); }}>File report</div>
            <div>Please close this tab after you have checked in for security purposes.</div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = reduxState => ({
  trip: reduxState.trips.trip,
});

export default connect(mapStateToProps, { fetchTrip, editTrip, setAttendingStatus })(withRouter(MobileCheckOut));
