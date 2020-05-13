import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class MobileCheckOut extends PureComponent {
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
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="MobileCheckInWrapper">
        Test content
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trip: state.trips.trip,
});

export default connect(mapStateToProps, null)(withRouter(MobileCheckOut));
