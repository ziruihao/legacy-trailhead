/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { fetchTrips, getClubs } from '../actions';
import '../styles/card-style.scss';
import TripDetailsModal from './tripDetailsModal';



class AllTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: '',
      beginner: "all",
      grid: true,
      showTrip: null,
      startDate: "",
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
    const options = this.props.clubs.map((club) => {
      return <option key={club.id} value={club.name}>{club.name}</option>;
    });
    return (
        <select
          name="select"
          className="custom-select all-trips-select"
          defaultValue=""
          onChange={(e) => {
            this.setState({ club: e.target.value }); }}
        >
          <option key="none" value="">All Clubs</option>
          { options }
        </select>
    );
  }
  renderBeginnerDropdown = () => {
    return (
        <select
          name="select"
          className="custom-select all-trips-select"
          defaultValue=""
          onChange={(e) => {this.setState({ beginner: e.target.value }); }}
        >
          <option key = "all" value = "all"> All Trips </option>
          <option key="yes" value="yes">Yes</option>
          <option key="no" value="no">No</option>
        </select>
    );
  }
renderStartDropdown = () => {
  return(
    <input type="date" name="startDate" onChange={(e) =>{this.setState({ startDate: e.target.value}); }} className="custom-select all-trips-date-select" value={this.state.startDate} />
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
      <TripDetailsModal className = "modal" trip = {this.state.showTrip}  closeModal = {() => this.closeTripModal()}/>
    );
  }
}
  renderTrips = () => {
    const sortedTrips = this.props.trips.sort(this.compareStartDates);
    if(this.state.startDate!==""){
      sortedTrips.sort(this.compareStartDateWithInput);
    }
    let tripsGrid = sortedTrips;
    if(this.state.beginner === "all") {
       tripsGrid = sortedTrips.filter(trip => (this.state.club === '' || trip.club.name === this.state.club )).map((trip) => {
        let card_id = trip.club.name;
        if(card_id==="Cabin and Trail") card_id = "cnt";
        if(card_id==="Women in the Wilderness") card_id = "wiw";
        if(card_id==="Surf Club") card_id = "surf";
        if(card_id==="Mountain Biking") card_id = "dmbc";
        if(card_id==="Winter Sports") card_id = "wsc";

        //TODO: try to get bait and bullet logo
        if(trip.club.name !== ('Ledyard' || 'Mountaineering' || 'cnt'|| 'wiw' || 'Woodsmen' || 'surf' || 'dmbc' || 'wsc')) card_id = "doc";
        return (
            <div key={trip.id} className="card text-center card-trip margins">
                <div className="card-body" id = {card_id} onClick = {() => this.setCurrTrip(trip)}>
                  <h2 className="card-title">{trip.title}</h2>
                  <p className="card-text">{this.formatDate(trip.startDate)} - {this.formatDate(trip.endDate)}</p>
                  <p className="card-text">{this.formatDescription(trip.description)}</p>
                  <p className="card-club">{trip.club ? trip.club.name : ''}</p>

                </div>
            </div>
          );


      });
    }else{
      let experienceNeeded = "";
      if(this.state.beginner === "yes"){
        experienceNeeded= true;
      }else{
        experienceNeeded = false;
      }
      tripsGrid = sortedTrips.filter(trip => (this.state.club === '' || trip.club.name === this.state.club )&& trip.experienceNeeded===experienceNeeded).map((trip) => {
       let card_id = trip.club.name;
       if(card_id==="Cabin and Trail") card_id = "cnt";
       if(card_id==="Women in the Wilderness") card_id = "wiw";
       if(card_id==="Surf Club") card_id = "surf";
       if(card_id==="Mountain Biking") card_id = "dmbc";
       if(card_id==="Winter Sports") card_id = "wsc";


       if(trip.club.name !== ('Ledyard' || 'Mountaineering' || 'cnt'|| 'wiw' || 'Woodsmen' || 'surf' || 'dmbc' || 'wsc')) card_id = "doc";
         return (
           <div key={trip.id} className="card card text-center card-trip margins">
               <div className="card-body" id = {card_id} onClick = {() => this.setCurrTrip(trip)}>
                 <h2 className="card-title">{trip.title}</h2>
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
        <div className="tile-box">
          <div className = "all-trips-dropdown-bar">
            <div className = "all-trips-dropdown-header"> Experience Needed? </div>  {this.renderBeginnerDropdown()}
            <div className = "all-trips-dropdown-header"> Subclub: </div>  {this.renderClubDropdown()}
            <div className = "all-trips-dropdown-header"> Start: </div>  {this.renderStartDropdown()}
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
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips, getClubs })(AllTrips)); // connected component
