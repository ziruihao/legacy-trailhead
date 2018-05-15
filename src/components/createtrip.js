import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { postTrip } from '../actions';

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      club: '',
      description: '',
      timeDate: '',
      leaders: '',
      cost: '',
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onTimeDateChange = this.onTimeDateChange.bind(this);
    this.onLeadersChange = this.onLeadersChange.bind(this);
    this.onCostChange = this.onCostChange.bind(this);
    this.onClubChange = this.onClubChange.bind(this);
    this.createTrip = this.createTrip.bind(this);
  }

  onTitleChange(e) {
    this.setState({
      title: e.target.value,
    });
  }
  onClubChange(e) {
    this.setState({
      club: e.target.value,
    });
  }
  onCostChange(e) {
    this.setState({
      cost: e.target.value,
    });
  }
  onDescriptionChange(e) {
    this.setState({
      description: e.target.value,
    });
  }
  onTimeDateChange(e) {
    this.setState({
      timeDate: e.target.value,
    });
  }
  onLeadersChange(e) {
    this.setState({
      leaders: e.target.value,
    });
  }
  createTrip() {
    const trip = {
      title: this.state.title,
      leaders: this.state.leaders,
      club: this.state.club,
      description: this.state.description,
      timeDate: this.state.timeDate,
      cost: this.state.cost,
    };
    console.log(trip);
    // this.props.postTrip(trip); TODO
  }

  render() {
    return (
      <div className="container">
        <input onChange={this.onTitleChange} className="one-line-content" placeholder="Trip title" value={this.state.title} />
        <input onChange={this.onLeadersChange} className="one-line-content" placeholder="Leaders" value={this.state.leaders} />
        <input onChange={this.onClubChange} className="one-line-content" placeholder="Club" value={this.state.club} />
        <input onChange={this.onDescriptionChange} className="main-post-content" placeholder="Content" value={this.state.content} />
        <input onChange={this.onTimeDateChange} className="one-line-content" placeholder="Time" value={this.state.timeDate} />
        <input onChange={this.onCostChange} className="one-line-content" placeholder="Cost" value={this.state.cost} />
        <button onClick={this.createTrip}>Post trip</button>
      </div>
    );
  }
}

export default withRouter(connect(null, { postTrip })(CreateTrip));
