/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Modal } from 'react-bootstrap';
import TripDetailsModal from '../trip-details/trip-details-basic';
import TripCard from '../trip-card';
import Toggle from '../toggle';
import { fetchTrips, getClubs } from '../../actions';
import utils from '../../utils';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import notFound from './sad-tree.png';
import './trip-card.scss';

class Trips extends Component {
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
        'In a month'
      ],
      selectedTimePeriod: 'This week',
      grid: true,
      showTrip: null,
      startDate: null,
      seePastTrips: false,
    };
  }

  componentDidMount(props) {
    console.log(utils)
    this.props.fetchTrips();
    this.props.getClubs();
  }

  closeTripModal(){
    this.setState({showTrip: null});
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
      if(description.length > 100){
        description = description.substring(0, 101) + "...";
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
      <Dropdown onSelect={eventKey => this.setState({club: eventKey})}>
      <Dropdown.Toggle className="field">
        <span className="field-dropdown-bootstrap">{this.state.club}</span>
        <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="field-dropdown-menu">
      <Dropdown.Item eventKey="All clubs">All clubs</Dropdown.Item>
      <Dropdown.Divider />
        {this.props.clubs.map((club => {
          return (<Dropdown.Item key={club._id} eventKey={club.name}>{club.name}</Dropdown.Item>);
        }))}
      </Dropdown.Menu>
    </Dropdown>
    )
  }

  renderTimePeriodDropdown = () => {
    return (
      <Dropdown onSelect={eventKey => {
        if (eventKey !== 'Specific day') this.setState({startDate: null})
        this.setState({selectedTimePeriod: eventKey})
        }}>
      <Dropdown.Toggle className="field">
        <span className="field-dropdown-bootstrap">{this.state.selectedTimePeriod}</span>
        <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="field-dropdown-menu">
        {this.state.timePeriods.map((timePeriod => {
          return (<Dropdown.Item key={timePeriod} eventKey={timePeriod}>{timePeriod}</Dropdown.Item>);
        }))}
        <Dropdown.Divider />
        <Dropdown.Item eventKey="Specific day">Specific day</Dropdown.Item>
        <Dropdown.Item eventKey="All">All</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    )
  }

  renderStartDropdown = () => {
    return(
      <input type="date" name="startDate" onChange={(e) =>{
        this.setState({ startDate: e.target.value }); 
      }} className="field all-trips-date-select" value={this.state.startDate} />
    );
  }

  setCurrTrip = (trip) => {
    this.setState({
      showTrip: trip
    });
  }

  renderTripDetailsModal = () => {
    if(this.state.showTrip === null || this.state.showTrip === undefined ) {
      return null;
    } else{ 
      return(
        <TripDetailsModal 
          trip = {this.state.showTrip}  
          closeModal = {() => this.closeTripModal()}/>
      );
    }
  }

  renderTrips = () => {
    let tripsFilteringProcess = [this.props.trips];

    switch(this.state.selectedTimePeriod) {
      case 'All':
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => !utils.dates.inThePast(trip.startDate)));
        break;
      case 'Specific day':
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => utils.dates.withinTimePeriod(trip.startDate, this.state.selectedTimePeriod, this.state.startDate)));
        break;
      default:
        tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => utils.dates.withinTimePeriod(trip.startDate, this.state.selectedTimePeriod, null)));
    }

    if (this.state.seePastTrips) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().concat(this.props.trips.filter(trip => utils.dates.inThePast(trip.startDate))));
    }

    tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => (this.state.club === 'All clubs' || trip.club.name === this.state.club)));

    if (this.state.beginnerOnly) {
      tripsFilteringProcess.push(tripsFilteringProcess.pop().filter(trip => !trip.experienceNeeded));
    }

    const filteredTrips = tripsFilteringProcess.pop().sort(this.compareStartDates);

    if (filteredTrips.length === 0) {
      return <div id="trips-page-not-found">
        <img src={notFound} ></img>
        <div className="h2">Sorry, we couldn't find any!</div>
        </div>;
    } else {
      return filteredTrips.map((trip) => <TripCard key={trip._id} trip={trip} user={this.props.user} onClick={() => this.setCurrTrip(trip)}></TripCard>);
    }
  }

  render() {
      return (
        <div id="trips-page" className="center-view spacy">
          <div className="doc-card spacy-card">
            <div className="doc-h1">Explore trips</div>
            <div id="trip-safari-configs">
              {this.renderClubDropdown()}
              {this.renderTimePeriodDropdown()}
              {this.state.selectedTimePeriod === 'Specific day' ? this.renderStartDropdown() : null}
              <Toggle value={this.state.beginnerOnly} id="defaultCheck2" label="Beginner only" onChange={(e) => {
                this.setState(prevState => {
                  return {beginnerOnly: !prevState.beginnerOnly}
                })}} disabled={false}></Toggle>
              <Toggle value={this.state.seePastTrips} id="defaultCheck1" label="See past trips" onChange={(e) => {
                this.setState(prevState => {
                  return {seePastTrips: !prevState.seePastTrips}
                })
              }} disabled={false}></Toggle>
            </div>
          </div>
          <div id="trip-tiles">
            {this.renderTrips()}
          </div>
          <Modal
            centered
            size="lg"
            show={this.state.showTrip !== null}
            onHide={() => this.setState({showTrip: null})}
          >
            <div id="event-modal-close">
              <i className="material-icons close-button" onClick={() => this.setState({showTrip: null})} role="button" tabIndex={0}>close</i>
            </div>
            {this.renderTripDetailsModal()}
          </Modal>
        </div>
      );
    }
}


const mapStateToProps = state => (
  {
    trips: state.trips.all,
    authenticated: state.auth.authenticated,
    clubs: state.clubs,
    user: state.user.user,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips, getClubs })(Trips)); // connected component
