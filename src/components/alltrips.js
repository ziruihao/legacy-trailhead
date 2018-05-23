import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchTrips } from '../actions';
// import '../styles/alltrips-style.scss';


class AllTrips extends Component {
  componentDidMount(props) {
    this.props.fetchTrips();
  }

  renderTrips = () => {
    const trips =
      this.props.trips.map((trip, id) => {
        return (
          <div className="col-md-4">
            <div className="card mb-4 box-shadow">
              <div className="card-body">
                <a href={`/trip/${trip.id}`}>
                  <h1 className="card-title">{trip.title}</h1>
                  <p className="card-text">{trip.club}</p>
                  <p className="card-text">{trip.date}</p>
                </a>
              </div>
            </div>
          </div>
        );
      });
    return trips;
  }

  render() {
    return (
      <main role="main">
        <section className="jumbotron text-center">
          <div className="container">
            <h1 className="jumbotron-heading">All Trips</h1>
            <p>
              <a href="/" className="btn btn-primary">Home</a>
            </p>
          </div>
        </section>
        <div className="row">
          {this.renderTrips()}
        </div>
      </main>
    );
  }
}

const mapStateToProps = state => (
  {
    trips: state.trips.all,
  }
);

export default withRouter(connect(mapStateToProps, { fetchTrips })(AllTrips)); // connected component
