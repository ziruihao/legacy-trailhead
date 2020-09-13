import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table, Modal, Dropdown } from 'react-bootstrap/';
import Toggle from '../../toggle';
import Text from '../../text';
import { SmallProfileCard } from '../../profile-card';
import { Stack, Queue, Divider, Box } from '../../layout';
import { getUsers } from '../../../actions';
import Approvals from './certs/cert-approvals';
import LeaderApprovals from './leaders/leader-approvals';
import DOCLoading from '../../doc-loading';
import dropdownIcon from '../../../img/dropdown-toggle.svg';
// import OpoDropdown from './approval-dropdown';
import '../approvals-style.scss';
import '../../../styles/tripdetails_leader.scss';
import '../opo-approvals.scss';

class OPOLeaders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      sortBy: 'Name',
      club: 'All clubs',
    };
  }

  componentDidMount() {
    this.props.getUsers().then(() => {
      this.setState({ loaded: true });
    });
  }


  render() {
    if (!this.state.loaded) {
      return (
        <div className='center-view'>
          <DOCLoading type='doc' />
        </div>
      );
    } else {
      return (
        <Box dir='col' className='center-view'>
          <Box dir='col' className='doc-card' pad={45}>
            <Text type='h1'>Pending Requests</Text>
            <Stack size={45} />
            <Text type='h2'>Subclub leadership approvals</Text>
            <Stack size={45} />
            <LeaderApprovals />
            <Stack size={45} />
            <Text type='h2'>Vehicle certification approvals</Text>
            <Stack size={45} />
            <Approvals />
          </Box>
          <Stack size={100} />
          <Box dir='col' className='doc-card' pad={45}>
            <Text type='h1'>User database</Text>
            <Stack size={45} />
            <Box dir='row' justify='between'>
              <Toggle label='Trip leaders' />
              <Dropdown onSelect={eventKey => this.setState({ sortBy: eventKey })}>
                <Dropdown.Toggle className='field'>
                  <span className='field-dropdown-bootstrap'>{this.state.sortBy}</span>
                  <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
                </Dropdown.Toggle>
                <Dropdown.Menu className='field-dropdown-menu'>
                  <Dropdown.Item eventKey='Name'>Name</Dropdown.Item>
                  <Dropdown.Item eventKey='Recent activity'>Recent activity</Dropdown.Item>
                  <Dropdown.Item eventKey='No. of trips'>No. of trips</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown onSelect={eventKey => this.setState({ club: eventKey })}>
                <Dropdown.Toggle className='field'>
                  <span className='field-dropdown-bootstrap'>{this.state.club}</span>
                  <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
                </Dropdown.Toggle>
                <Dropdown.Menu className='field-dropdown-menu'>
                  <Dropdown.Item eventKey='All clubs'>All clubs</Dropdown.Item>
                  <Dropdown.Divider />
                  {/* {this.props.clubs.map(((club) => {
                    return (<Dropdown.Item key={club._id} eventKey={club.name}>{club.name}</Dropdown.Item>);
                  }))} */}
                </Dropdown.Menu>
              </Dropdown>
            </Box>
          </Box>
          <Stack size={100} />
          <Box dir='row' justify='center' wrap>
            {this.props.users.filter(user => user.completedProfile).map((user) => {
              return (
                <>
                  <SmallProfileCard user={user} />
                  <Queue size={50} />
                </>
              );
            })}
          </Box>
          <Stack size={100} />
        </Box>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user.users,
    clubs: state.clubs,
  };
};

export default connect(mapStateToProps, { getUsers })(withRouter(OPOLeaders));
