import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signIn, appError, updateRestrictedPath, getUser } from '../actions';
import Auth from '../components/auth';

export default function (ComposedComponent, dataLoader, switchMode) {
  class RequireAuth extends Component {
    // componentWillMount() {
    //   if (!this.props.authenticated) {
    //     this.props.updateRestrictedPath(`${this.props.location.pathname}`);
    //     // this.props.appError('Please sign in or sign up to view that page');
    //     // this.props.history.push('/');
    //     this.props.signIn();
    //   }
    //   this.props.getUser()
    //     .then(() => {
    //       // const { user } = this.props;
    //       // console.log(user);
    //       if (!this.props.user.hasCompleteProfile) {
    //         console.log('here');
    //         this.props.history.push('/user');
    //       }
    //     });
    // }

    // isInfoEmpty = (string) => {
    //   return !string || string.length === 0 || !string.toString().trim();
    // }

    render() {
      console.log('redux says authenticated?', this.props.authenticated);
      return (
        <div>
          {this.props.authenticated
            ? (
              <ComposedComponent
                switchMode={switchMode ? true : undefined}
                {...this.props}
              />
            )
            : <Auth dataLoader={dataLoader} />}
        </div>
      );
    }
  }

  const mapStateToProps = state => (
    {
      authenticated: state.auth.authenticated,
      user: state.user.user,
    }
  );

  return withRouter(connect(mapStateToProps, { signIn, appError, updateRestrictedPath, getUser })(RequireAuth));
}
