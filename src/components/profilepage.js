/* eslint-disable react/button-has-type */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateUser, getClubs } from '../actions';
import '../styles/profilepage-style.scss';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      clubsList: [],
      dash_number: '',
      isEditing: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.changeToOPO = this.changeToOPO.bind(this);
    this.changeToTrippee = this.changeToTrippee.bind(this);
    this.changeToLeader = this.changeToLeader.bind(this);
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      alert('Please sign in/sign up to view this page');
      this.props.history.push('/');
    }
    this.props.getClubs();
  }

  onFieldChange(event) {
    event.persist();
    if (event.target.type === 'checkbox') {
      if (event.target.checked) {
        this.setState(prevState => ({
          clubsList: [...prevState.clubsList, { _id: event.target.id, name: event.target.value }],
        }));
      } else {
        this.setState((prevState) => {
          const key = event.target.id;
          const withoutClickedClub = prevState.clubsList.filter(club => club._id !== key);
          return {
            clubsList: withoutClickedClub,
          };
        });
      }
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  getUpdatedVals = () => {
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      dash_number: this.props.user.dash_number ? this.props.user.dash_number : '',
      isEditing: true,
      clubsList: this.props.user.leader_for,
    });
  }

  displayClubs = () => {
    if (!this.props.user.leader_for) {
      return '';
    }
    if (!this.state.isEditing) {
      let clubString = '';
      this.props.user.leader_for.forEach((club) => {
        clubString = clubString.concat(`${club.name}, `);
      });
      const clubs = clubString.substring(0, clubString.length - 2);
      return clubs.length === 0 ? <em>None</em> : clubs;
    } else {
      return this.getClubForm();
    }
  }

  getClubForm = () => {
    if (this.props.user.has_pending_changes) {
      return <h1>You can&apos;t update this until your previous changes have been reviewed</h1>;
    }
    const currentClubIds = this.state.clubsList.map(club => club._id);
    return this.props.clubs.map((club) => {
      const checked = currentClubIds.includes(club.id);
      return (
        <div key={club.id}>
          <label htmlFor={club.id}>
            <input
              type="checkbox"
              name="club"
              id={club.id}
              value={club.name}
              onChange={this.onFieldChange}
              checked={checked}
            />
            {club.name}
          </label>
        </div>
      );
    });
  }

  displayFeedback = () => {
    if (this.props.user.role === 'Leader' && this.state.clubsList.length === 0) {
      return (
        <p>
          {`Unchecking all clubs will revoke your leader permissions.
          You will need to request acccess from the OPO to regain them.
          Please review before you proceed`}.
        </p>
      );
    } else if (this.props.user.role === 'Trippee' && this.state.clubsList.length > 0) {
      return (
        <p>
          {`Submitting this form will trigger a request to the OPO for leader permissions.
          Please proceed only if you're a leader!`}
        </p>
      );
    } else {
      return null;
    }
  }

  pendingChanges = () => {
    return this.props.user.has_pending_changes
      ? <strong>You have changes pending approval</strong>
      : null;
  }

  updateUserInfo(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  changeToOPO(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: [],
      role: 'OPO',
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  changeToTrippee(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: [],
      role: 'Trippee',
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  changeToLeader(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubsList,
      role: 'Leader',
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: [] });
    this.props.updateUser(updatedUser);
  }

  render() {
    if (!this.state.isEditing) {
      return (
        <div className="container">
          <div className="profile">
            <div className="card-header profile-header">{`${this.props.user.name}'s Profile`}</div>
            <div className="card-body">
              <div className="profile-field">
                <h5 className="card-title">Email</h5>
                <p className="card-text">{this.props.user.email}</p>
              </div>
              <div className="profile-field">
                <h5 className="card-title">Account Type</h5>
                <p className="card-text">{this.props.user.role}</p>
              </div>
              <div className="profile-field">
                <h5 className="card-title">Dash #</h5>
                <p className="card-text">{this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}</p>
              </div>
              <div className="profile-field">
                <h5 className="card-title">DOC clubs that you are a leader for</h5>
                <p className="card-text">{this.displayClubs()}</p>
              </div>
              <button className="btn btn-primary" onClick={this.getUpdatedVals}>Update my info</button>
              {this.pendingChanges()}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="card profile">
          <div className="card-header profile-header">{`${this.props.user.name}'s Profile`}</div>
          <div className="card-body">
            <div className="profile-field">
              <h5 className="card-title">Name</h5>
              <input type="text" name="name" onChange={this.onFieldChange} className="form-control" value={this.state.name} />
            </div>
            <div className="profile-field">
              <h5 className="card-title">Email</h5>
              <input type="text" name="email" onChange={this.onFieldChange} className="form-control" value={this.state.email} />
            </div>
            <div className="profile-field">
              <h5 className="card-title">Dash #</h5>
              <input type="text" name="dash_number" onChange={this.onFieldChange} className="form-control" value={this.state.dash_number} />
            </div>
            <div className="profile-field">
              <h5 className="card-title"> {this.props.user.role === 'Leader' ? 'DOC clubs that you are a leader for' : 'Request leader access'}</h5>
              {this.displayClubs()}
              {this.displayFeedback()}
            </div>
            <button className="btn btn-primary" onClick={this.changeToOPO}>Change to OPO</button>
            <button className="btn btn-primary" onClick={this.changeToTrippee}>Change to Trippee</button>
            <button className="btn btn-primary" onClick={this.changeToLeader}>Change to Leader</button>
            <button className="btn btn-success" onClick={this.updateUserInfo}>Update info</button>
            <button className="btn btn-danger" onClick={() => { this.setState({ isEditing: false, clubsList: [] }); }}>Cancel changes</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    clubs: state.clubs,
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { updateUser, getClubs })(ProfilePage));
