import React, { PureComponent } from 'react';
import { withRouter, useLocation } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { fetchTrip } from '../../actions';
import * as constants from '../../constants';
import './mobile-check.scss';

class MobileCheckIn extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }


  componentWillMount = () => {
    const query = new URLSearchParams(this.props.location.search);
    this.props.fetchTrip(this.props.match.params.tripID, query.get('token')).then(() => {
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

  render() {
    if (!this.state.loaded) {
      return <h1>Loading...</h1>;
    } else {
      return (
        <div id="mobile-check-screen">
          <div id="mobile-check-header">
            <div className="h3">{`Trip #${this.props.trip.number}`}</div>
            <div className="h1">{`${this.props.trip.title}`}</div>
            <div className="h3">{`${constants.formatDate(this.props.trip.startDate)} ${constants.formatTime(this.props.trip.startTime)}`}</div>
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
                    return (
                      <tr key={member.user._id}>
                        <td id="mobile-check-in-list-name-field">{member.user.name}</td>
                        <td id="mobile-check-in-list-button">
                          {member.attendedTrip
                            ? <button type="button" className="doc-button alarm">Undo</button>
                            : <button type="button" className="doc-button">Here</button>
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

export default connect(mapStateToProps, { fetchTrip })(withRouter(MobileCheckIn));
