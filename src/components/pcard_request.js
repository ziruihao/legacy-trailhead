import React, { Component } from 'react'; 
import { getPCardRequests } from '../../../project-doc-website-api/src/controllers/trip_controller';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appError } from '../actions';

class PCardRequest extends Component {
    constructor(props) {
      super(props);
      this.state = {
        numPeople: null,
        numTripees:null,
        snacks:null,
        breakfast:null,
        lunch:null,
        dinner:null,
        otherCostsTitle: [],
        otherCostsCost:[],
      };

    }

    render(){
        if (this.props.currentStep !== 5) {
            return null;
          }else{

        return(
        <div className="col-4 right-column">
            <div className="row page-header">
                <p>P-Card Request</p>
            </div>
            <div className = "page-sub-headers">
                <p>Number of People (including trip leaders)</p>
            </div>
        <div className="row pcard-header">
            <input className="field top-create-trip leaders pcard"
            onChange={this.props.onFieldChange}
            name="numPeople"
            placeholder="e.g. 8"
            value={this.state.numTripLeader}
            />
        </div>
        <div className = "page-sub-headers">
            <p>Food per person on the trip</p>
        </div>

        <div>
            <div className="row page-sub-headers pcard">
                <p>Snacks</p>
                <input className="field top-create-trip leaders pcard"
                onChange={this.props.onFieldChange}
                name="snacks"
                placeholder="e.g. 1"
                value={this.state.snacks}
                />
            </div>
            <div className="row page-sub-headers pcard">
                <p>Breakfast</p>
                <input className="field top-create-trip leaders pcard"
                onChange={this.props.onFieldChange}
                name="breakfast"
                placeholder="e.g. 1"
                value={this.state.breakfast}
                />
            </div>
        </div>
        
        <div>
            <div className="row page-sub-headers pcard">
                <p>Lunch</p>
                <input className="field top-create-trip leaders pcard"
                onChange={this.props.onFieldChange}
                name="lunch"
                placeholder="e.g. 1"
                value={this.state.lunch}
                />
            </div>
            <div className="row page-sub-headers pcard">
                <p>Dinner</p>
                <input className="field top-create-trip leaders pcard"
                onChange={this.props.onFieldChange}
                name="dinner"
                placeholder="e.g. 1"
                value={this.state.dinner}
                />
            </div>
        </div>
        <div className = "page-sub-headers">
            <p>Other Costs</p>
        </div>
        <div style= {{width: '200%'}}>
            <input className="field top-create-trip leaders other_costs"
            onChange={this.props.onFieldChange}
            name="otherCostsTitle"
            placeholder="e.g. Tickets for EVO"
            value={this.state.dinner}
            />
            <p style = {{fontWeight: 700, display:"inline-block", width: "fit-content"}}>$</p>
            <input className="field top-create-trip leaders other_costs other_costs_num"
            onChange={this.props.onFieldChange}
            name="otherCostsCost"
            placeholder="e.g. 10"
            value={this.state.dinner}
            />
        </div>
    </div>
    );
    }

    }
}
export default PCardRequest;
