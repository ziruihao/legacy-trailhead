import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Modal } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import TripDetailsBasic from '../trip-details/basic/trip-details-basic';
import TripCard from '../trip-card';
import Toggle from '../toggle';
import Select from '../select/select';
import Text from '../text';
import Icon from '../icon';
import Button from '../button';
import DOCLoading from '../doc-loading';
import { fetchTrips, fetchTrip, getClubs, leaveTrip } from '../../actions';
import utils from '../../utils';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import sadTree from './sad-tree.png';
import './all-trips.scss';
import '../trip-card/trip-card.scss';

class AllTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: 'All clubs',
      beginnerOnly: false,
      timePeriods: [
        'Tomorrow',
        'Next 3 days',
        'This week',
        'This weekend',
        'In a month',
      ],
      selectedTimePeriod: 'This week',
      showTrip: false,
      showCancellationModal: false,
      cancelling: false,
      startDate: null,
      seePastTrips: false,
      showFilters: false,
      includeLeaders: [],
      viewMode: 'tiles',
    };
  }

  componentDidMount() {
    this.props.fetchTrips();
    this.props.getClubs();
  }

  cancelSignup = () => {
    this.setState({ cancelling: true });
    this.props.leaveTrip(this.props.trip._id, this.props.user._id).then(() => {
      this.setState({ cancelling: false, showCancellationModal: false });
    });
  }

  formatDate = (date) => {
    // date fix adapted from https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off/31732581
    if (!date) {
      return '';
    }
    return new Date(date.replace(/-/g, '/').replace(/T.+/, '')).toLocaleDateString('en-US');
  }

  formatDescription = (des) => {
    let description = des;
    if (description.length > 100) {
      description = `${description.substring(0, 101)}...`;
    }
    return description;
  }

  compareStartDates = (a, b) => {
    const t1 = new Date(a.startDate);
    const t2 = new Date(b.startDate);
    return t1.getTime() - t2.getTime();
  }

  renderClubDropdown = () => {
    return (
      <Dropdown onSelect={eventKey => this.setState({ club: eventKey })}>
        <Dropdown.Toggle className='field'>
          <span className='field-dropdown-bootstrap'>{this.state.club}</span>
          <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu'>
          <Dropdown.Item eventKey='All clubs'>All clubs</Dropdown.Item>
          <Dropdown.Divider />
          {this.props.clubs.map(((club) => {
            return (<Dropdown.Item key={club._id} eventKey={club.name}>{club.name}</Dropdown.Item>);
          }))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderTimePeriodDropdown = () => {
    return (
      <Dropdown onSelect={(eventKey) => {
        if (eventKey !== 'Specific day') this.setState({ startDate: null });
        this.setState({ selectedTimePeriod: eventKey });
      }}
      >
        <Dropdown.Toggle className='field'>
          <span className='field-dropdown-bootstrap'>{this.state.selectedTimePeriod}</span>
          <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu'>
          {this.state.timePeriods.map(((timePeriod) => {
            return (<Dropdown.Item key={timePeriod} eventKey={timePeriod}>{timePeriod}</Dropdown.Item>);
          }))}
          <Dropdown.Divider />
          <Dropdown.Item eventKey='Specific day'>Specific day</Dropdown.Item>
          <Dropdown.Item eventKey='All'>All</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderStartDropdown = () => {
    return (
      <input type='date'
        name='startDate'
        onChange={(e) => {
          this.setState({ startDate: e.target.value });
        }}
        className='field all-trips-date-select'
        value={this.state.startDate}
      />
    );
  }

  setCurrTrip = (trip) => {
    this.props.fetchTrip(trip._id).then(() => {
      this.setState({ showTrip: true });
    });
  }

  renderTrips = () => {
    const tripsFilteringProcess = [this.props.trips];

    switch (this.state.selectedTimePeriod) {
      case 'All':
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => !utils.dates.inThePast(trip.startDateAndTime)));
        break;
      case 'Specific day':
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => utils.dates.withinTimePeriod(trip.startDateAndTime, this.state.selectedTimePeriod, this.state.startDate)));
        break;
      default:
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => utils.dates.withinTimePeriod(trip.startDateAndTime, this.state.selectedTimePeriod, null)));
    }

    if (this.state.seePastTrips) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().concat(this.props.trips.filter(trip => utils.dates.inThePast(trip.startDateAndTime))));
    }

    tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => (this.state.club === 'All clubs' || trip.club.name === this.state.club)));

    if (this.state.beginnerOnly) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => !trip.experienceNeeded));
    }

    const filteredTrips = tripsFilteringProcess.pop().sort(this.compareStartDates);

    if (filteredTrips.length === 0) {
      return (
        <div id='trips-page-not-found'>
          <img src={sadTree} alt='sad tree' />
          <div className='h2'>Sorry, we couldn&apos;t find any!</div>
        </div>
      );
    } else {
      return filteredTrips.map(trip => <TripCard type='large' trip={trip} displayInfoBadges user={this.props.user} displayDescription onClick={() => this.setCurrTrip(trip)} key={trip._id} />);
    }
  }

  renderSafariConfigs = () => {
    if (this.props.user.role === 'OPO') {
      return (
        <Box dir='col' id='trip-safari-configs'>
          <Box dir='row' justify='between'>
            <Toggle value={this.state.beginnerOnly}
              id='defaultCheck2'
              label='Beginner only'
              onChange={() => this.setState(prevState => ({ beginnerOnly: !prevState.beginnerOnly }))}
              disabled={false}
            />
            <Toggle value={this.state.returnedTrips}
              id='defaultCheck2'
              label='See returned trips'
              onChange={() => this.setState(prevState => ({ beginnerOnly: !prevState.beginnerOnly }))}
              disabled={false}
            />
            <Toggle value={this.state.ongoingTrips}
              id='defaultCheck1'
              label='See ongoing trips'
              onChange={() => this.setState(prevState => ({ seePastTrips: !prevState.seePastTrips }))}
              disabled={false}
            />
            <Toggle value={this.state.hasGearRequest}
              id='defaultCheck1'
              label='Has gear request'
              onChange={() => this.setState(prevState => ({ seePastTrips: !prevState.seePastTrips }))}
              disabled={false}
            />
          </Box>
          <Stack size={50} />
          <Box dir='row' justify='between'>
            {this.renderClubDropdown()}
            {this.renderTimePeriodDropdown()}
            {this.state.selectedTimePeriod === 'Specific day' ? this.renderStartDropdown() : null}
            <Select updateLeaderValue={(update) => {
              const updateTrimmed = update.map(u => u.text);
              this.setState({ includeLeaders: updateTrimmed });
            }}
              currentLeaders={this.state.includeLeaders}
              name='leaders'
              placeholder='Filter by co-leaders'
            />
            <Select updateLeaderValue={(update) => {
              const updateTrimmed = update.map(u => u.text);
              this.setState({ includeLeaders: updateTrimmed });
            }}
              currentLeaders={this.state.includeLeaders}
              name='leaders'
              placeholder='Filter by attendees'
            />
          </Box>
        </Box>
      );
    } else {
      return (
        <Box dir='row' justify='between' id='trip-safari-configs'>
          {this.renderClubDropdown()}
          {this.renderTimePeriodDropdown()}
          {this.state.selectedTimePeriod === 'Specific day' ? this.renderStartDropdown() : null}
          <Box dir='col'>
            <Toggle value={this.state.beginnerOnly}
              id='defaultCheck2'
              label='Beginner only'
              onChange={() => this.setState(prevState => ({ beginnerOnly: !prevState.beginnerOnly }))}
              disabled={false}
            />
            <Toggle value={this.state.seePastTrips}
              id='defaultCheck1'
              label='See past trips'
              onChange={() => this.setState(prevState => ({ seePastTrips: !prevState.seePastTrips }))}
              disabled={false}
            />
          </Box>
          <Select updateLeaderValue={(update) => {
            const updateTrimmed = update.map(u => u.text);
            this.setState({ includeLeaders: updateTrimmed });
          }}
            currentLeaders={this.state.includeLeaders}
            name='leaders'
            placeholder='Filter by co-leaders'
          />
        </Box>
      );
    }
  }

  render() {
    return (
      <div id='trips-page' className='center-view spacy'>
        <Box id='trip-safari-menu' dir='col' pad={25} className='doc-card'>
          <Box dir='row' justify='between' align='center'>
            <Text type='h1'>Explore trips</Text>
            <Box dir='row'>
              <Button type='toggle' color='disabled' onClick={() => { this.setState({ viewMode: 'tiles' }); }} active={this.state.viewMode === 'tiles'}>
                <Icon type='grid' size={18} />
                <Queue size={9} />
                <Text type='button'>Tiles</Text>
              </Button>
              <Queue size={9} />
              <Button type='toggle' color='disabled' onClick={() => { this.setState({ viewMode: 'list' }); }} active={this.state.viewMode === 'list'}>
                <Icon type='stack' size={18} />
                <Queue size={9} />
                <Text type='button'>List</Text>
              </Button>
              <Queue size={15} />
              <Divider dir='col' color='gray1' size={3} />
              <Queue size={15} />
              <Button type='toggle' color='green' onClick={() => { this.setState(prevState => ({ showFilters: !prevState.showFilters })); }} active={this.state.showFilters}>
                <Icon type='filter' size={18} />
                <Queue size={9} />
                <Text type='button'>Filters</Text>
              </Button>
            </Box>
          </Box>
          {this.state.showFilters
            ? (
              <>
                <Stack size={25} />
                {this.renderSafariConfigs()}
              </>
            )
            : null
          }
        </Box>
        <div id='trip-tiles'>
          {this.renderTrips()}
        </div>
        <Modal
          centered
          show={this.state.showCancellationModal}
          onHide={() => this.setState({ showCancellationModal: false })}
        >
          <Box id='trip-cancel-modal' dir='col' align='center' pad={25}>
            {this.state.cancelling
              ? (
                <div id='trip-cancel-modal-loading'>
                  <DOCLoading type='spin' width='35' height='35' measure='px' />
                </div>
              )
              : null
              }
            <img src={sadTree} alt='confirm-cancel' className='cancel-image' />
            <Stack size={24} />
            <Text type='h2'>Are you sure you want to cancel?</Text>
            <Stack size={24} />
            <div className='p1 center-text'>This cute tree will die if you do and you’ll have to register for this trip again if you change your mind. Don&apos;t worry - we inform the trip leaders know so you don&apos;t have to.</div>
            <Stack size={24} />
            <Box dir='row' justify='center'>
              <div className='doc-button' onClick={() => this.setState({ showCancellationModal: false, showTrip: true })} role='button' tabIndex={0}>Wait no</div>
              <Queue size={15} />
              <div className='doc-button alarm' onClick={this.cancelSignup} role='button' tabIndex={0}>Remove me</div>
            </Box>
          </Box>
        </Modal>
        <Modal
          centered
          size='lg'
          show={this.state.showTrip}
          onHide={() => this.setState({ showTrip: false })}
        >
          <div id='trip-details-modal-wrapper'>
            <TripDetailsBasic
              closeModal={() => this.setState({ showTrip: false })}
              openCancellationModal={() => this.setState({ showCancellationModal: true, showTrip: false })}
              hideCancellationModal={() => this.setState({ showCancellationModal: false })}
            />
          </div>
        </Modal>
      </div>
    );
  }
}


const mapStateToProps = state => (
  {
    trips: state.trips.all,
    trip: state.trips.trip,
    authenticated: state.auth.authenticated,
    clubs: state.clubs,
    user: state.user.user,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips, fetchTrip, getClubs, leaveTrip })(AllTrips)); // connected component
