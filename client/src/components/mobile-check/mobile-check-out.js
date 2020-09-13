import React, { PureComponent } from 'react';
import { withRouter, useLocation } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import DOCLoading from '../doc-loading';
import { fetchTrip, setAttendingStatus, toggleTripLeftStatus } from '../../actions';
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

  componentDidMount = () => {
    this.props.fetchTrip(this.props.match.params.tripID, this.query.get('token')).then(() => {
      this.setState({ loaded: true });
    });
  }

  toggleAttendence = (memberID, status) => {
    this.props.setAttendingStatus(this.props.match.params.tripID, memberID, status, this.query.get('token'));
  }

  toggleTripLeftStatus = (status) => {
    this.props.toggleTripLeftStatus(this.props.trip._id, status, this.query.get('token'));
  }

  render() {
    if (!this.state.loaded) {
      return (<DOCLoading type='doc' width='64' height='64' measure='px' />);
    } else {
      return (
        <div id='mobile-check-screen'>
          <div id='mobile-check-header'>
            <div className='doc-h3 gray'>{`TRIP #${this.props.trip.number}`}</div>
            <Stack size={18} />
            <div className='doc-h1'>{`${this.props.trip.title}`}</div>
            <Stack size={18} />
            <div className='doc-h3'>{`Start: ${utils.dates.formatDateAndTime(new Date(this.props.trip.startDateAndTime), 'SHORT')}`}</div>
            <Stack size={18} />
            <div className='doc-h3'>{`Return: ${utils.dates.formatDateAndTime(new Date(this.props.trip.endDateAndTime), 'SHORT')}`}</div>
          </div>
          <Stack size={18} />
          <hr />
          <Stack size={18} />
          <div id='mobile-check-body'>
            <div className='doc-h2'>Check-out your trippees before leaving.</div>
            <Stack size={18} />
            <div className='p1'>You MUST accurately mark which trippees are present on the day of the trip.</div>
            <Stack size={18} />
            <Box id='mobile-check-list' className='doc-card' pad={10}>
              <Table className='doc-table' responsive=''>
                <thead>
                  <tr>
                    <th id='mobile-check-list-name-field'>Name</th>
                    <th id='mobile-check-list-button'>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.trip.members.map((member) => {
                    console.log(member.attended);
                    return (
                      <tr key={member.user._id}>
                        <td id='mobile-check-list-name-field'>{member.user.name}</td>
                        <td id='mobile-check-list-button'>
                          {member.attended
                            ? <div role='button' tabIndex={0} className='doc-button alarm' onClick={() => this.toggleAttendence(member.user._id, false)}>Undo</div>
                            : <div role='button' tabIndex={0} className='doc-button' onClick={() => this.toggleAttendence(member.user._id, true)}>Here</div>
                       }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Box>
            <Stack size={18} />
            <div className='p1'>Once you have checked-out everyone who showed up, mark your trip as having successfully left {this.props.trip.pickup}:</div>
            <Stack size={18} />
            {this.props.trip.left
              ? <div role='button' tabIndex={0} className='doc-button alarm' onClick={() => this.toggleTripLeftStatus(false)}>Undo</div>
              : <div role='button' tabIndex={0} className='doc-button' onClick={() => this.toggleTripLeftStatus(true)}>We are leaving</div>
            }
            <Stack size={18} />
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

export default connect(mapStateToProps, { fetchTrip, setAttendingStatus, toggleTripLeftStatus })(withRouter(MobileCheckOut));
