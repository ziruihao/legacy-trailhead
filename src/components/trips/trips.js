/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Modal } from 'react-bootstrap';
import TripDetailsModal from '../trip-details/trip-details-basic';
import TripCard from '../trip-card';
import Toggle from '../toggle';
import { fetchTrips, getClubs } from '../../actions';
import dropdownIcon from '../../img/dropdown-toggle.svg';
import './trip-card.scss';

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: 'All Clubs',
      beginnerOnly: false,
      grid: true,
      showTrip: null,
      startDate: "",
      seePastTrips: true,
    };
  }

  componentDidMount(props) {
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

  //THIS ISNT WORKING-- BECAUSE OF THE FINAL COMPARISON?
  compareStartDateWithInput = (a, b) => {
    const t1 = new Date(a.startDate);
    const t2 = new Date(b.startDate);
    const d = new Date(this.state.startDate);
    return (Math.abs(d - t1) - Math.abs(d - t2));
  }

  renderClubDropdown = () => {
    return (
      <Dropdown onSelect={eventKey => this.setState({club: eventKey})}>
      <Dropdown.Toggle className={`field ${this.state.newVehicleTypeError ? 'field-error' : ''}`}>
        <span className="field-dropdown-bootstrap">{this.state.club}</span>
        <img className="dropdown-icon" src={dropdownIcon} alt="dropdown-toggle" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="field-dropdown">
        {this.props.clubs.map((club => {
          return (<Dropdown.Item key={club._id} eventKey={club.name}>{club.name}</Dropdown.Item>);
        }))}
      </Dropdown.Menu>
    </Dropdown>
    )
  }

  renderStartDropdown = () => {
    return(
      <input type="date" name="startDate" onChange={(e) =>{this.setState({ startDate: e.target.value}); }} className="field all-trips-date-select" value={this.state.startDate} />
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
    let sortedTrips = this.props.trips.sort(this.compareStartDates);
    if (this.state.startDate!==""){
      sortedTrips.sort(this.compareStartDateWithInput);
    }

    if (!this.state.seePastTrips) {
      sortedTrips = sortedTrips.filter(trip => {
        const startDate = new Date(trip.startDate)
        const today = new Date();
        return today < startDate;
      })
    }

    let tripsGrid = [];
    const specialClubs = ['Ledyard','Mountaineering','cnt','wiw','Woodsmen','surf','dmbc','wsc'];

    if (!this.state.beginnerOnly) {
      tripsGrid = sortedTrips.filter(trip => (this.state.club === 'All Clubs' || trip.club.name === this.state.club )).map((trip) => {
        return (<TripCard key={trip._id} trip={trip} user={this.props.user} onClick={() => this.setCurrTrip(trip)}></TripCard>);
      });
    } else {
      let experienceNeeded = "";
      if (this.state.beginnerOnly) experienceNeeded= true;
      else experienceNeeded = false;

      tripsGrid = sortedTrips.filter(trip => (this.state.club === 'All Clubs' || trip.club.name === this.state.club )&& trip.experienceNeeded===experienceNeeded).map((trip) => {
        return (<TripCard key={trip._id} trip={trip} user={this.props.user} onClick={() => this.setCurrTrip(trip)}></TripCard>);
     });
    }

    if (tripsGrid.length === 0) {
      return <div>No upcoming trips for this club</div>;
    }

    if (this.state.grid) {
      return tripsGrid;
    } else {
      return tripsList;
    }
  }


  render() {
    let tiles_id = "tiles-modal-closed";
    if(this.state.showTrip!==null){
      tiles_id = "tiles-modal-open";
    }
      return (
        <div id="trips-page" className="center-view spacy">
          <div className="doc-card spacy-card">
            <div className="doc-h1">Explore trips</div>
            <div id="trip-safari-configs">
              {this.renderStartDropdown()}
              {this.renderClubDropdown()}
              <Toggle value={this.state.beginnerOnly} id="defaultCheck2" label="Beginner only" onChange={(e) => {
                this.setState(prevState => {
                  return {beginnerOnly: !prevState.beginnerOnly}
                })}}></Toggle>
              <Toggle value={this.state.seePastTrips} id="defaultCheck1" label="See past trips" onChange={(e) => {
                this.setState(prevState => {
                  return {seePastTrips: !prevState.seePastTrips}
                })}}></Toggle>
            </div>
          </div>
          <div className="box">
            <div className = "trip-tiles" id = {tiles_id}>
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
