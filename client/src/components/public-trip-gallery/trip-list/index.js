import React from 'react';
import { connect } from 'react-redux';
import { Box, Stack, Queue, Divider } from '../../layout';
import Badge from '../../badge';
import Icon from '../../icon';
import Text from '../../text';
import DOCLoading from '../../doc-loading';
import utils from '../../../utils';

class TripList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      expanded: true,
      today: new Date(),
    };
  }

  render() {
    return null;
  }
}

const mapStoreToProps = store => ({
  publicTrips: store.trips.trips,
});

export default connect(null, null)(TripList);
