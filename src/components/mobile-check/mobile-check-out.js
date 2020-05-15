import React, { PureComponent } from 'react';
import { withRouter, useLocation } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import Loading from '../loading';
import { fetchTrip, editTrip, setAttendingStatus } from '../../actions';
import * as constants from '../../constants';
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

  // componentDidMount = () => {
  //   console.log('MobileCheckIn mounted');
  // }

  // componentWillReceiveProps = (nextProps) => {
  //   console.log('MobileCheckIn will receive props', nextProps);
  // }

  // componentWillUpdate = (nextProps, nextState) => {
  //   console.log('MobileCheckIn will update', nextProps, nextState);
  // }

  // componentDidUpdate = () => {
  //   console.log('MobileCheckIn did update');
  // }

  // componentWillUnmount = () => {
  //   console.log('MobileCheckIn will unmount');
  // }

  toggleAttendence = (memberID, status) => {
    this.props.setAttendingStatus(this.props.match.params.tripID, memberID, status, this.query.get('token'));
  }

  toggleReturned = (status) => {
    this.props.trip.returned = status;
    this.props.editTrip(this.props.trip, null, this.props.trip._id, this.query.get('token'));
  }

  render() {
    if (!this.state.loaded) {
      return (<Loading type="doc" />);
    } else {
      return (
        <div id="mobile-check-screen">
          <div id="mobile-check-header">
            <div className="h3">{`Trip #${this.props.trip.number}`}</div>
            <div className="h1">{`${this.props.trip.title}`}</div>
            <div className="h3">{`Start: ${constants.formatDate(this.props.trip.startDate)} ${constants.formatTime(this.props.trip.startTime)}`}</div>
            <div className="h3">{`Return: ${constants.formatDate(this.props.trip.endDate)} ${constants.formatTime(this.props.trip.endTime)}`}</div>
          </div>
          <hr />
          <div id="mobile-check-body">
            <div className="h2">Welcome back!</div>
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
