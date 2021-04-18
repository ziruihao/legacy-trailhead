import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Modal, Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../layout';
import TripDetailsBasic from '../trip-details/basic/trip-details-basic';
import TripCard from '../trip-card';
import Toggle from '../toggle';
import Select from '../select/select';
import Text from '../text';
import Field from '../field';
import Icon from '../icon';
import Badge from '../badge';
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
      loaded: false,
      club: 'All clubs',
      beginnerOnly: false,
      timePeriods: [
        'Today',
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
      tripNumber: null,
      startDate: null,
      endDate: null,
      ongoingTrips: false,
      showFilters: false,
      includeLeaders: [],
      includeMembers: [],
      viewMode: 'tiles',
      hasRequest: {
        vehicle: false,
        gear: false,
        pCard: false,
      },
    };
  }

  componentDidMount() {
    this.props.fetchTrips().then(() => { this.setState({ loaded: true }); });
    this.props.getClubs();
  }

  setCurrTrip = (trip) => {
    this.props.fetchTrip(trip._id).then(() => {
      this.setState({ showTrip: true });
    });
  }

  cancelSignup = () => {
    this.setState({ cancelling: true });
    this.props.leaveTrip(this.props.trip._id, this.props.user._id).then(() => {
      this.setState({ cancelling: false, showCancellationModal: false });
    });
  }

  filterTrips = () => {
    const tripsFilteringProcess = [this.props.trips];

    if (this.state.tripNumber) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => trip.number === this.state.tripNumber));
    }

    switch (this.state.selectedTimePeriod) {
      case 'Everything':
        break;
      case 'Custom range':
        if (this.state.startDate && this.state.endDate) tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => utils.dates.withinTimePeriod(trip.startDateAndTime, this.state.selectedTimePeriod, utils.dates.createDateObject(this.state.startDate), utils.dates.createDateObject(this.state.endDate))));
        break;
      default:
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => utils.dates.withinTimePeriod(trip.startDateAndTime, this.state.selectedTimePeriod)));
    }

    if (this.state.ongoingTrips) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => trip.left && !trip.returned));
    }

    if (this.state.returnedTrips) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => trip.returned));
    }

    tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => (this.state.club === 'All clubs' || trip.club.name === this.state.club)));

    if (this.state.beginnerOnly) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => !trip.experienceNeeded));
    }

    if (this.state.includeLeaders) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter((trip) => {
        return this.state.includeLeaders.every(desiredLeader => trip.leaders.map(leader => leader._id.toString()).includes(desiredLeader.id.toString()));
      }));
    }

    if (this.state.includeMembers) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter((trip) => {
        return this.state.includeMembers.every(desiredMember => trip.members.map(member => member.user._id.toString()).includes(desiredMember.id.toString()));
      }));
    }

    if (this.state.hasRequest.gear) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => trip.gearStatus !== 'N/A' || trip.trippeeGearStatus !== 'N/A'));
    }
    if (this.state.hasRequest.vehicle) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => trip.vehicleStatus !== 'N/A'));
    }
    if (this.state.hasRequest.pCard) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => trip.pcardStatus !== 'N/A'));
    }

    const filteredTrips = tripsFilteringProcess.pop().sort(utils.trips.compareTripStartDates);

    return filteredTrips;
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

  renderRequestDropdown = () => {
    const renderToggleText = () => {
      if (Object.values(this.state.hasRequest).every(value => !value)) {
        return 'Associated requests';
      } else {
        const requestTypeMap = {
          gear: 'gears',
          vehicle: 'vehicles',
          pCard: 'P-Cards',
        };
        let text = 'Trips with:';
        Object.keys(this.state.hasRequest).forEach((requestType) => {
          if (this.state.hasRequest[requestType]) text = `${text} ${requestTypeMap[requestType]},`;
        });
        return text.slice(0, -1);
      }
    };
    return (
      <Dropdown>
        <Dropdown.Toggle className='field'>
          <span className='field-dropdown-bootstrap'>{renderToggleText()}</span>
          <img className='dropdown-icon' src={dropdownIcon} alt='dropdown-toggle' />
        </Dropdown.Toggle>
        <Dropdown.Menu className='field-dropdown-menu'>
          <Box dir='col' align='start' pad={[0, 18]}>
            <Toggle value={this.state.hasRequest.gear}
              id='has-gear-request'
              label='Gear'
              onChange={() => this.setState(prevState => ({ hasRequest: { ...prevState.hasRequest, gear: !prevState.hasRequest.gear } }))}
              disabled={false}
            />
            <Stack size={9} />
            <Toggle value={this.state.hasRequest.vehicle}
              id='has-vehicle-request'
              label='Vehicle'
              onChange={() => this.setState(prevState => ({ hasRequest: { ...prevState.hasRequest, vehicle: !prevState.hasRequest.vehicle } }))}
              disabled={false}
            />
            <Stack size={9} />
            <Toggle value={this.state.hasRequest.pCard}
              id='has-pCard-request'
              label='P-Card'
              onChange={() => this.setState(prevState => ({ hasRequest: { ...prevState.hasRequest, pCard: !prevState.hasRequest.pCard } }))}
              disabled={false}
            />
          </Box>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderTimePeriodDropdown = () => {
    return (
      <Dropdown onSelect={(eventKey) => {
        if (eventKey !== 'Custom range') this.setState({ startDate: null, endDate: null });
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
          <Dropdown.Item eventKey='Custom range'>Custom range</Dropdown.Item>
          <Dropdown.Item eventKey='Everything'>Everything</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderCustomDateRangeDropdown = () => {
    return (
      <Box dir='row' align='center'>
        <input type='date'
          name='startDate'
          onChange={(e) => {
            this.setState({ startDate: e.target.value });
          }}
          className='field all-trips-date-select'
          value={this.state.startDate}
        />
        <Queue size={25} />
        <Text type='p1' color='gray'>to</Text>
        <Queue size={25} />
        <input type='date'
          name='endDate'
          onChange={(e) => {
            this.setState({ endDate: e.target.value });
          }}
          className='field all-trips-date-select'
          value={this.state.endDate}
        />
      </Box>
    );
  }

  renderSafariConfigs = () => {
    return (
      <Box dir='col' id='trip-safari-configs'>
        <Box dir='row' justify='between'>
          <Field
            type='number'
            value={this.state.tripNumber}
            width={108}
            name='trip-number'
            placeholder='Trip #'
            onChange={event => this.setState({ tripNumber: parseInt(event.target.value, 10) })}
          />
          <Toggle value={this.state.beginnerOnly}
            id='beginner-only'
            label='Beginner only'
            onChange={() => this.setState(prevState => ({ beginnerOnly: !prevState.beginnerOnly }))}
            disabled={false}
          />
          <Toggle value={this.state.returnedTrips}
            id='returned-trips'
            label='See returned trips'
            onChange={() => this.setState(prevState => ({ returnedTrips: !prevState.returnedTrips }))}
            disabled={false}
          />
          <Toggle value={this.state.ongoingTrips}
            id='ongoing-trips'
            label='See ongoing trips'
            onChange={() => this.setState(prevState => ({ ongoingTrips: !prevState.ongoingTrips }))}
            disabled={false}
          />
          {this.props.user?.role === 'OPO'
            ? <>{this.renderRequestDropdown()}</>
            : null
          }
        </Box>
        <Stack size={25} />
        <Box dir='row' justify='between'>
          {this.renderClubDropdown()}
          <Select updateLeaderValue={(update) => {
            this.setState({ includeLeaders: update });
          }}
            currentLeaders={this.state.includeLeaders}
            name='leaders'
            placeholder='Filter by co-leaders'
          />
          {this.props.user?.role === 'OPO'
            ? (
              <Select updateLeaderValue={(update) => {
                this.setState({ includeMembers: update });
              }}
                currentLeaders={this.state.includeMembers}
                name='members'
                placeholder='Filter by attendees'
              />
              )
            : null
            }
          {this.renderTimePeriodDropdown()}
        </Box>
        <Stack size={25} />
        <Box dir='row' justify='end'>
          {this.state.selectedTimePeriod === 'Custom range' ? this.renderCustomDateRangeDropdown() : null}
        </Box>
      </Box>
    );
  }

  renderTrips = () => {
    if (this.state.loaded) {
      const filteredTrips = this.filterTrips();
      if (filteredTrips.length === 0) {
        return (
          <div id='trips-page-not-found'>
            <img src={sadTree} alt='sad tree' />
            <div className='h2'>Sorry, we couldn&apos;t find any!</div>
          </div>
        );
      } else if (this.state.viewMode === 'tiles') {
        return (
          <div id='trip-tiles'>
            {filteredTrips.map(trip => <TripCard type='large' trip={trip} displayInfoBadges user={this.props.user} displayDescription onClick={() => this.setCurrTrip(trip)} key={trip._id} />)}
          </div>
        );
      } else {
        const renderTripStatus = (trip) => {
          if (trip.returned) return 'Returned';
          else if (trip.left) return 'Left';
          else return 'N/A';
        };
        return (
          <Box pad={25} id='trip-grid' className='doc-card'>
            <Table className='doc-table' responsive='lg' hover>
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Status</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Subclub</th>
                  <th>Co-leaders</th>
                  <th>Attendee count</th>
                  <th>Group gear</th>
                  <th>Trippee gear</th>
                  <th>Vehicles</th>
                  <th>P-Card</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map(trip => (
                  <tr key={trip._id} onClick={() => this.setCurrTrip(trip)}>
                    <td>Trip #{trip.number}: {trip.title}</td>
                    <td>{renderTripStatus(trip)}</td>
                    <td>{utils.dates.formatDate(new Date(trip.startDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(trip.startDateAndTime), { timezone: true })}</td>
                    <td>{utils.dates.formatDate(new Date(trip.endDateAndTime), { weekday: true })} @ {utils.dates.formatTime(new Date(trip.endDateAndTime), { timezone: true })}</td>
                    <td>{trip.club.name}</td>
                    <td>{utils.trips.extractCoLeaderNames(trip)}</td>
                    <td>{trip.members.length}</td>
                    <td>{trip.gearStatus === 'N/A' ? 'N/A' : <Badge type={trip.gearStatus} size={36} />}</td>
                    <td>{trip.trippeeGearStatus === 'N/A' ? 'N/A' : <Badge type={trip.trippeeGearStatus} size={36} />}</td>
                    <td>{trip.vehicleStatus === 'N/A' ? 'N/A' : <Badge type={trip.vehicleStatus} size={36} />}</td>
                    <td>{trip.pcardStatus === 'N/A' ? 'N/A' : <Badge type={trip.pcardStatus} size={36} />}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        );
      }
    } else {
      return (
        <Box dir='row' justify='center' align='center' height={200}>
          <DOCLoading type='spin' width={50} height={50} />
        </Box>
      );
    }
  }

  render() {
    return (
      <div id='trips-page' className='center-view spacy'>
        <Box id='trip-safari-menu' dir='col' pad={25} className='doc-card'>
          <Box dir='row' justify='between' align='center'>
            <Box dir='row'>
              <Icon type='mountain' color='green3' size={36} />
              <Queue size={18} />
              <Text type='h1'>Explore trips</Text>
            </Box>
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
        {this.renderTrips()}
        <Stack size={100} />
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
