import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

class MobileCheckIn extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount = () => {
    console.log('MobileCheckIn will mount');
  }

  componentDidMount = () => {
    console.log('MobileCheckIn mounted');
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('MobileCheckIn will receive props', nextProps);
  }

  componentWillUpdate = (nextProps, nextState) => {
    console.log('MobileCheckIn will update', nextProps, nextState);
  }

  componentDidUpdate = () => {
    console.log('MobileCheckIn did update');
  }

  componentWillUnmount = () => {
    console.log('MobileCheckIn will unmount');
  }

  render() {
    if (!this.state.loaded) {
      return <h1>Loading...</h1>;
    } else {
      return (
        <div id="mobile-check-screen">
          <div className="h1">{`Trip #${this.props.trip.number}: ${this.props.trip.title}`}</div>
          <div className="h3">{this.props.trip.startDate}</div>
          <div className="h2">Check in your trippees before leaving:</div>
          <div className="p1">You MUST accurately mark which trippees are present on the day of the trip.</div>
          <div id="mobile-check-in-list">
            <Table className="doc-table" responsive="">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Present?</th>
                </tr>
              </thead>
              <tbody>
                {this.props.trip.members.map((member) => {
                  return (
                    <tr key={member.user._id}>
                      <td>{member.user.name}</td>
                      <td>
                        {member.attendedTrip
                          ? <button type="button" className="doc-button alarm">Undo</button>
                          : <button type="button" className="doc-button">Mark as here</button>
                       }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  trip: state.trips.trip,
});

export default connect(mapStateToProps, null)(withRouter(MobileCheckIn));
