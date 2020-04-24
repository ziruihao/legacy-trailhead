import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class Dashboard extends React.Component {
  render() {
    if (this.props.user) {
      if (this.props.user.role === 'OPO') {
        this.props.history.push('/opo-dashboard');
        return null;
      } else if (this.props.user.role === 'Leader') {
        this.props.history.push('/my-trips');
        return null;
      } else {
        this.props.history.push('/all-trips');
        return null;
      }
    } else {
      return <div>Loading</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(connect(mapStateToProps, null)(Dashboard));
