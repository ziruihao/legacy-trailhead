/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import TripDetailsModal from '../tripDetailsModal';
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

  renderTripDetailsModal=()=>{
    if(this.state.showTrip === null || this.state.showTrip === undefined ){
      return null;
    }else{
      return(
        <TripDetailsModal 
          className = "modal" 
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

        let isLeading = false;
        trip.leaders.some((leader) => {
          if (leader._id === this.props.user._id) {
            isLeading = true;
          }
        });

        let card_id = trip.club.name;
        if(card_id==='Cabin and Trail') card_id = 'cnt';
        if(card_id==='Women in the Wilderness') card_id = 'wiw';
        if(card_id==='Surf Club') card_id = 'surf';
        if(card_id==='Mountain Biking') card_id = 'dmbc';
        if(card_id==='Winter Sports') card_id = 'wsc';

        //TODO: try to get bait and bullet logo
        // Make arry of all the string values 
        if(!specialClubs.includes(card_id)) card_id = "doc";
        
        return (
            <div key={trip._id} className="card text-center card-trip margins">
                <div className="card-body" id = {card_id} onClick = {() => this.setCurrTrip(trip)}>
                  <h1 className= "leading-trip">{isLeading ? console.log("yes") : console.log("no")}</h1>
                  <h2 className="card-title">{isLeading ? '(L)' : null} {trip.title}</h2>
                  <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                  <p className="card-text">{this.formatDescription(trip.description)}</p>
                  <p className="card-club">{trip.club ? trip.club.name : ''}</p>
                </div>
            </div>
          );
      });
    } else {
      let experienceNeeded = "";
      if (this.state.beginnerOnly) {
        experienceNeeded= true;
      }else{
        experienceNeeded = false;
      }
      tripsGrid = sortedTrips.filter(trip => (this.state.club === 'All Clubs' || trip.club.name === this.state.club )&& trip.experienceNeeded===experienceNeeded).map((trip) => {

        let isLeading = false;
        trip.leaders.some((leader) => {
          if (leader._id === this.props.user._id) {
            isLeading = true;
          }
        });

        let card_id = trip.club.name;
        if(card_id==='Cabin and Trail') card_id = 'cnt';
        if(card_id==='Women in the Wilderness') card_id = 'wiw';
        if(card_id==='Surf Club') card_id = 'surf';
        if(card_id==='Mountain Biking') card_id = 'dmbc';
        if(card_id==='Winter Sports') card_id = 'wsc';

        //TODO: try to get bait and bullet logo
        // Make arry of all the string values 
        if(!specialClubs.includes(card_id)) card_id = "doc";
         return (
           <div key={trip._id} className="card card text-center card-trip margins">
               <div className="card-body" id = {card_id} onClick = {() => this.setCurrTrip(trip)}>
                 <h2 className="card-title">{isLeading ? '(L)' : null} {trip.title}</h2>
                 <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                 <p className="card-text">{this.formatDescription(trip.description)}</p>
                 <p className="card-club">{trip.club ? trip.club.name : ''}</p>
               </div>
           </div>
         );


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
            <div className="h1">Explore trips</div>
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
            {this.renderTripDetailsModal()}
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
