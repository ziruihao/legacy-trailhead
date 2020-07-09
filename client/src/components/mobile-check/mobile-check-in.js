import React, { PureComponent } from 'react';
import { withRouter, useLocation } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import DOCLoading from '../doc-loading';
import { fetchTrip, editTrip, setAttendingStatus, toggleTripReturnedStatus } from '../../actions';
import utils from '../../utils';
import './mobile-check.scss';

class MobileCheckIn extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
    this.query = new URLSearchParams(this.props.location.search);
  }


  componentDidMount = () => {
    this.props.fetchTrip(this.props.match.params.tripID, this.query.get('token')).then(() => {
      this.setState({ loaded: true });
    });
  }

  toggleAttendence = (memberID, status) => {
    this.props.setAttendingStatus(this.props.match.params.tripID, memberID, status, this.query.get('token'));
  }

  toggleTripReturnedStatus = (status) => {
    this.props.toggleTripReturnedStatus(this.props.trip._id, status, this.query.get('token'));
  }

  render() {
    if (!this.state.loaded) {
      return (<DOCLoading type="doc" width="64" height="64" measure="px" />);
    } else {
      return (
        <div id="mobile-check-screen">
          <div id="mobile-check-header">
            <div className="doc-h3">{`Trip #${this.props.trip.number}`}</div>
            <Stack size={18} />
            <div className="doc-h1">{`${this.props.trip.title}`}</div>
            <Stack size={18} />
            <div className="doc-h3">{`Start: ${utils.dates.formatDate(this.props.trip.startDate)} ${utils.dates.formatTime(this.props.trip.startTime)}`}</div>
            <Stack size={18} />
            <div className="doc-h3">{`Return: ${utils.dates.formatDate(this.props.trip.endDate)} ${utils.dates.formatTime(this.props.trip.endTime)}`}</div>
          </div>
          <Stack size={18} />
          <hr />
          <Stack size={18} />
          <div id="mobile-check-body">
            <div className="doc-h2">Welcome back!</div>
            <Stack size={18} />
            <div className="p1">If you have returned safely without ANY incidents or near misses during the trip:</div>
            <Stack size={18} />
            {this.props.trip.returned
              ? <div role="button" tabIndex={0} className="doc-button alarm" onClick={() => this.toggleTripReturnedStatus(false)}>Undo return</div>

              : <div role="button" tabIndex={0} className="doc-button" onClick={() => this.toggleTripReturnedStatus(true)}>We returned safely</div>
          }
            <Stack size={18} />
            <div className="p1">If you need to file an incident or near miss report:</div>
            <Stack size={18} />
            <div role="button" tabIndex={0} className="doc-button alarm" onClick={() => { window.open('https://docs.google.com/forms/u/1/d/e/1FAIpQLSeo9jIcTGNstZ1uADtovDjJT8kkPtS-YpRwzJC2MZkVkbH0hw/viewform', '_blank'); }}>File report</div>
            <Stack size={18} />
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

export default connect(mapStateToProps, { fetchTrip, editTrip, setAttendingStatus, toggleTripReturnedStatus })(withRouter(MobileCheckIn));
