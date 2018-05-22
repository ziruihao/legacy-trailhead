import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateUser } from '../actions';
import '../styles/profilepage-style.scss';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      clubs: '',
      dash_number: '',
      isEditing: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getUpdatedVals = () => {
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      dash_number: this.props.user.dash_number ? this.props.user.dash_number : '',
      clubs: this.props.user.clubs ? this.props.user.clubs : '',
      isEditing: true,
    });
  }

  updateUserInfo(event) {
    const updatedUser = {
      email: this.state.email,
      name: this.state.name,
      leader_for: this.state.clubs.split(','),
      dash_number: this.state.dash_number,
    };
    this.setState({ isEditing: false });
    this.props.updateUser(updatedUser);
  }

  render() {
    if (!this.state.isEditing) {
      return (
        <div className="container">
          <h2>{`Name: ${this.props.user.name}`}</h2>
          <h2>{`Email: ${this.props.user.email}`}</h2>
          <h2>{`Dash #: ${this.props.user.dash_number ? this.props.user.dash_number : 'Please fill out'}`}</h2>
          <h2>{`Clubs: ${this.props.user.clubs ? this.props.user.clubs : 'Please fill out'}`}</h2>
          <button className="btn btn-primary" onClick={this.getUpdatedVals}>Update my info</button>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="input-group field">
          <div className="input-group-prepend">
            <span className="input-group-text">Name:</span>
          </div>
          <input type="text" name="name" onChange={this.onFieldChange} className="form-control" value={this.state.name} />
        </div>
        <div className="input-group field">
          <div className="input-group-prepend">
            <span className="input-group-text">Email:</span>
          </div>
          <input type="text" name="email" onChange={this.onFieldChange} className="form-control" value={this.state.email} />
        </div>
        <div className="input-group field">
          <div className="input-group-prepend">
            <span className="input-group-text">Dash Number</span>
          </div>
          <input type="text" name="dash_number" onChange={this.onFieldChange} className="form-control" value={this.state.dash_number} />
        </div>
        <div className="input-group field">
          <div className="input-group-prepend">
            <span className="input-group-text">Clubs</span>
          </div>
          <input type="text" name="clubs" onChange={this.onFieldChange} className="form-control" value={this.state.clubs} />
        </div>
        <button className="btn btn-success" onClick={this.updateUserInfo}>Update info</button>
        <button className="btn btn-danger" onClick={() => { this.setState({ isEditing: false }); }}>Cancel changes</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps, { updateUser })(ProfilePage));
