/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import marked from 'marked';
import { joinTrip, addToPending, fetchTrip, leaveTrip, isOnTrip, emailTrip, deleteTrip } from '../actions';
import '../styles/tripdetails-style.scss';

class TripDetails extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      showMembers: false,
      showPending: false,
      showEmail: false,
      emailSubject: '',
      emailBody: '',
    });
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onJoin = this.onJoin.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onEmail = this.onEmail.bind(this);
    this.toggleMembers = this.toggleMembers.bind(this);
    this.toggleEmail = this.toggleEmail.bind(this);
  }

  async componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    return Promise
      .all([
        this.props.isOnTrip(this.props.match.params.tripID),
        this.props.fetchTrip(this.props.match.params.tripID),
      ])
      .then(() => {
        this.props.trip.leaders.forEach((leader) => {
          if (leader.id === this.props.user.id) {
            this.setState({ showMembers: true, showPending: true });
          }
        });
      })
      .catch((error) => {
        console.log(':( error');
      });
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit() {
    if (!this.props.user.email || !this.props.user.name || !this.props.user.dash_number) {
      alert('Please fill out all of your info before signing up');
      this.props.history.push('/user');
    } else {
      this.props.addToPending(this.props.trip._id);
      this.props.fetchTrip(this.props.match.params.tripID);
    }
  }

  onJoin() {
    if (!this.props.user.email || !this.props.user.name || !this.props.user.dash_number) {
      alert('Please fill out all of your info before signing up');
      this.props.history.push('/user');
    } else {
      this.props.joinTrip(this.props.trip._id);
      this.props.fetchTrip(this.props.match.params.tripID);
    }
  }

  onLeave() {
    this.props.leaveTrip(this.props.trip._id);
    this.props.fetchTrip(this.props.match.params.tripID);
  }

  onEmail() {
    this.props.emailTrip(this.props.trip._id, this.state.emailSubject, this.state.emailBody, this.props.history);
    this.setState({ showEmail: false });
  }

  getLeaders = (leaders) => {
    if (leaders) {
      let leaderString = '';
      for (const leader of leaders) {
        leaderString = leaderString.concat(`${leader.name} (${leader.email}), `);
      }
      return leaderString.substring(0, leaderString.length - 2);
    }
    return '';
  }

  formatDate = (date) => {
    // date fix adapted from https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off/31732581
    if (!date) {
      return '';
    }
    return new Date(date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString('en-US');
  }

  showMembers = (members) => {
    if (!this.props.trip.leaders) {
      return <span />;
    }

    if (members.length < 1) {
      return (<p> No Members Yet </p>);
    }

    const rows = members.map((member) => {
      return (
        <tr key={member.id}>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.dash_number}</td>
        </tr>
      );
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Dash #</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    );
  }

  showPending = (pending) => {
    if (!this.props.trip.leaders) {
      return <span />;
    }

    if (pending.length < 1) {
      return (<p> No Pending Yet </p>);
    }

    const rows = pending.map((pend) => {
      return (
        <tr key={pend.id}>
          <td>{pend.name}</td>
          <td>{pend.email}</td>
          <button type="button" className="btn btn-success btn-email" onClick={this.onJoin}>Add To Trip</button>
        </tr>
      );
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    );
  }

  showEmail = () => {
    return (
      <div id="email">
        <p>Subject</p>
        <input name="emailSubject" className="email subject" type="text" onChange={this.onFieldChange} value={this.state.emailSubject} />
        <p>Body</p>
        <textarea name="emailBody" className="email body" type="text" onChange={this.onFieldChange} value={this.state.emailBody} />
        <button type="button" className="btn btn-success btn-email" onClick={this.onEmail}>Send the email</button>
      </div>
    );
  }

  appropriateButton = () => {
    console.log(this.props);
    if (!this.props.trip.leaders) {
      return <span />;
    }

    let isLeaderForTrip = false;
    this.props.trip.leaders.forEach((leader) => {
      if (leader.id === this.props.user.id) {
        isLeaderForTrip = true;
      }
    });

    if (isLeaderForTrip) {
      return (
        <div>
          <h3 className="member-button" onClick={this.toggleEmail}> Send Email To Your Trip </h3>
          {this.state.showEmail
            ? (
              this.showEmail()
            ) : (
              <p />
            )
          }
          <NavLink to={`/edittrip/${this.props.trip.id}`} className="edit-button"><button className="btn btn-success">Edit Trip</button></NavLink>
          <button onClick={this.handleDelete} className="btn btn-danger">Delete Trip</button>
        </div>
      );
    } else if (this.props.isUserOnTrip) {
      return <button className="btn btn-danger" type="button" onClick={this.onLeave}>Leave Trip</button>;
    } else {
      return <button className="btn btn-primary" type="button" onClick={this.onSubmit}>Sign Up</button>;
    }
  }

  handleDelete = () => {
    this.props.deleteTrip(this.props.trip, this.props.history);
  }

  toggleMembers() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const next = !this.state.showMembers;
    this.setState({ showMembers: next });
  }

  togglePending() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const next = !this.state.showPending;
    this.setState({ showPending: next });
  }

  toggleEmail() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const next = !this.state.showEmail;
    this.setState({ showEmail: next });
  }

  render() {
    return (
      <div className="trip-detail-div">
        <h1> {this.props.trip.title} </h1>
        <h2> Leaders:</h2>
        <p className="leaders"> {this.getLeaders(this.props.trip.leaders)}</p>
        <h3> Dates: {`${this.formatDate(this.props.trip.startDate)}-${this.formatDate(this.props.trip.endDate)}`}</h3>
        <h3> Cost: ${this.props.trip.cost}</h3>
        <h3> Description:</h3>
        <p className="description" dangerouslySetInnerHTML={{ __html: marked(this.props.trip.description || '') }} />
        {this.state.showMembers
          ? (
            <h3> Members </h3>
          ) : (
            <p />
          )
        }
        {this.state.showMembers
          ? (
            this.showMembers(this.props.trip.members)
          ) : (
            <p />
          )
        }
        {this.state.showPending
          ? (
            <h3> Pending </h3>
          ) : (
            <p />
          )
        }
        {this.state.showPending
          ? (
            this.showPending(this.props.trip.pending)
          ) : (
            <p />
          )
        }
        { this.appropriateButton() }
      </div>
    );
  }
}


// connects particular parts of redux state to this components props
const mapStateToProps = state => (
  {
    trip: state.trips.trip,
    isUserOnTrip: state.trips.isUserOnTrip,
    authenticated: state.auth.authenticated,
    user: state.user,
  }
);

export default withRouter(connect(mapStateToProps, {
  joinTrip, addToPending, fetchTrip, leaveTrip, deleteTrip, isOnTrip, emailTrip,
})(TripDetails));
