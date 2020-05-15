import React, { PureComponent } from 'react';
import { withRouter, useLocation } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import Loading from '../loading';
import { fetchTrip, setAttendingStatus } from '../../actions';
import * as constants from '../../constants';
import './mobile-check.scss';

class MobileCheckIn extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
    this.query = new URLSearchParams(this.props.location.search);
  }

  componentWillMount = () => {
    this.props.fetchTrip(this.props.match.params.tripID, this.query.get('token')).then(() => {
      this.setState({ loaded: true });
    });
  }

  toggleAttendence = (memberID, status) => {
    this.props.setAttendingStatus(this.props.match.params.tripID, memberID, status, this.query.get('token'));
  }

  render() {
    if (!this.state.loaded) {
      return (<Loading type="doc" width="64" height="64" measure="px" />);
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
            <div className="h2">Check in your trippees before leaving.</div>
            <div className="p1">You MUST accurately mark which trippees are present on the day of the trip.</div>
            <div id="mobile-check-in-list" className="doc-card">
              <Table className="doc-table" responsive="">
                <thead>
                  <tr>
                    <th id="mobile-check-in-list-name-field">Name</th>
                    <th id="mobile-check-in-list-button">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.trip.members.map((member) => {
                    console.log(member.attendedTrip);
                    return (
                      <tr key={member.user._id}>
                        <td id="mobile-check-in-list-name-field">{member.user.name}</td>
                        <td id="mobile-check-in-list-button">
                          {member.attendedTrip
                            ? <div role="button" tabIndex={0} className="doc-button alarm" onClick={() => this.toggleAttendence(member.user._id, false)}>Undo</div>
                            : <div role="button" tabIndex={0} className="doc-button" onClick={() => this.toggleAttendence(member.user._id, true)}>Here</div>
                       }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div>Please close this tab after you have checked in for security purposes.</div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  trip: state.trips.trip,
});

export default connect(mapStateToProps, { fetchTrip, setAttendingStatus })(withRouter(MobileCheckIn));
