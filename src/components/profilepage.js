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
      clubsList: {},
      dropdowns: [],
      dash_number: '',
      isEditing: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  componentDidMount() {
    this.props.getClubs();
  }

  onFieldChange(event) {
    if (event.target.name === 'select') {
      this.setState({
        clubsList: Object.assign({}, this.state.clubsList, { [event.target.getAttribute('data-key')]: event.target.value }),
      });
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
    });
  }

  displayClubs = () => {
    if (!this.props.user.leader_for) {
      return '';
    }

    let clubString = '';
    this.props.user.leader_for.forEach((club) => {
      clubString = clubString.concat(`${club.name}, `);
    });
    return clubString.substring(0, clubString.length - 2);
  }

  addDropdown = () => {
    const options = this.props.clubs.map((club) => {
      return <option key={club.id} value={club.id}>{club.name}</option>;
    });
    this.setState({
      dropdowns: this.state.dropdowns.concat((
        <select
          name="select"
          className="custom-select club-select"
          defaultValue="none"
          key={this.state.dropdowns.length}
          data-key={this.state.dropdowns.length}
          onChange={this.onFieldChange}
        >
          <option key="none" value="none">Choose a club...</option>
          { options }
        </select>
      )),
    });
  }

  updateUserInfo(event) {
    const clubs = [];
    Object.keys(this.state.clubsList).forEach((k) => {
      const val = this.state.clubsList[k];
      if (val !== 'none' && clubs.indexOf(val) === -1) {
        clubs.push(val);
      }
    });

    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: clubs,
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false, clubsList: {}, dropdowns: [] });
    this.props.updateUser(updatedUser);
  }

  render() {
    if (!this.state.isEditing) {
      return (
        <div className="container">
          <div className="card profile">
            <div className="card-header profile-header">{`${this.props.user.name}'s Profile`}</div>
            <div className="card-body">
              <div className="profile-field">
                <h5 className="card-title">Email</h5>
                <p className="card-text">{this.props.user.email}</p>
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
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="card">
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
              <h5 className="card-title">DOC clubs that you are a leader for</h5>
              { this.state.dropdowns }
              {
                this.state.dropdowns.length < this.props.clubs.length
                ? <button className="btn btn-primary" onClick={this.addDropdown}>Add club</button>
                : <span />
              }
            </div>
            <button className="btn btn-success" onClick={this.updateUserInfo}>Update info</button>
            <button className="btn btn-danger" onClick={() => { this.setState({ isEditing: false, clubsList: {}, dropdowns: [] }); }}>Cancel changes</button>
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
  };
};

export default withRouter(connect(mapStateToProps, { updateUser, getClubs })(ProfilePage));
