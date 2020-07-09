/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signUp, appError } from '../actions';
import '../styles/signup-style.scss';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      // password: '',
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  componentDidMount() {
    if (this.props.authenticated) {
      this.props.history.push('/');
    }
  }

  onFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  validateInput = () => {
    if (this.state.name === '' || this.state.email === '') {
      this.props.appError('Error: all fields must be filled');
      return false;
    }

    // enforce Dartmouth email
    if (!this.state.email.endsWith('@dartmouth.edu')) {
      this.props.appError('Error: must have a Dartmouth email');
      return false;
    }

    return true;
  }

  signUp() {
    // if (this.validateInput()) {
    this.props.signUp(
      {
        id: this.props.user._id,
        name: this.state.name,
        email: this.state.email,
      },
      this.props.history,
    );
    // }
  }

  render() {
    return (
      <div className="main-signup">
        <div className="input-fields">
          <input className="input-styling" placeholder="Name" name="name" type="text" onChange={this.onFieldChange} value={this.state.name} />
          <input className="input-styling" placeholder="Dartmouth Email" name="email" type="text" onChange={this.onFieldChange} value={this.state.email} />
        </div>
        <div className="form-buttons">
          <button className="button-styling" type="submit" onClick={this.signUp}>Sign Up</button>
          <button className="button-styling" type="reset" onClick={() => this.props.history.push('/')}>Cancel</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    user: state.user.user,

  };
};

export default withRouter(connect(mapStateToProps, { signUp, appError })(SignUp));
