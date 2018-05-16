import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signUp } from '../actions';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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
    if (this.state.password !== this.state.confirmPassword) return false;

    if (this.state.name === '' || this.state.email === '' || this.state.password === '') return false;

    // enforce Dartmouth email
    if (!this.state.email.endsWith('@dartmouth.edu')) return false;

    return true;
  }

  signUp(event) {
    if (this.validateInput()) {
      this.props.signUp({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }, this.props.history);
    }
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <form className="input" onSubmit={this.signUp}>
          <label htmlFor="name">
            <div>Name:</div>
            <input name="name" type="text" onChange={this.onFieldChange} value={this.state.name} />
          </label>
          <label htmlFor="email">
            <div>Dartmouth e-mail:</div>
            <input name="email" type="text" onChange={this.onFieldChange} value={this.state.email} />
          </label>
          <label htmlFor="password">
            <div>Password:</div>
            <input name="password" type="password" onChange={this.onFieldChange} value={this.state.password} />
          </label>
          <label htmlFor="confirmPassword">
            <div>Confirm Password:</div>
            <input name="confirmPassword" type="password" onChange={this.onFieldChange} value={this.state.confirmPassword} />
          </label>
          <button type="submit">Sign Up</button>
          <button type="reset" onClick={() => this.props.history.push('/')}>Cancel</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
  };
};

export default withRouter(connect(mapStateToProps, { signUp })(SignUp));
