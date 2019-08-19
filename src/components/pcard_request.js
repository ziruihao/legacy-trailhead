import React, { Component } from 'react'; 

class PCardRequest extends Component {
    constructor(props) {
      super(props);
      this.state = {
        numPeople: null,
        snacks:null,
        breakfast:null,
        lunch:null,
        dinner:null,
        otherCostsTitle: [],
        otherCostsCost:[],
        numOtherRequests: 1,
        totalCost: 0,
      };

    }
    updateOtherRequests = () => {
        this.setState({
            numOtherRequests: this.state.numOtherRequests+1,
        })
    }
    removeOtherRequests = (key) =>{

        this.setState({
            numOtherRequests: this.state.numOtherRequests - 1,
            otherCostsTitle: this.state.otherCostsTitle.splice(key, 1),
            otherCostsCost: this.state.otherCostsCost.splice(key, 1),
        });
    }
    otherCosts = (n) => {
        let ret = [];
        ret.push(
        <div style= {{width: '200%'}}>
        <input className="field top-create-trip leaders other_costs"
        onChange={()=>this.props.onFieldChangeOther(event, 0)}
        name="otherCostsTitle"
        placeholder="e.g. Tickets for EVO"
        value={this.state.otherCostsTitle[0]}
        />
        <p style = {{fontWeight: 700, display:"inline-block", width: "fit-content", fontSize:"18pt"}}>
            $
        </p>
        <input className="field top-create-trip leaders other_costs other_costs_num"
        onChange={()=>this.props.onFieldChangeOther(event, 0)}
        name="otherCostsCost"
        type = "number"
        placeholder="e.g. 10"
        value={this.state.otherCostsCost[0]}
        />
        </div>);
        for(let i = 0; i < n-1; i++){
            ret.push(
                <div key = {i} style= {{width: '200%'}}>
                    <input className="field top-create-trip leaders other_costs"
                    onChange={()=>this.props.onFieldChangeOther(event, i+1)}
                    name="otherCostsTitle"
                    placeholder="e.g. Tickets for EVO"
                    value={this.state.otherCostsTitle[i+1]}
                    />
                    <p style = {{fontWeight: 700, display:"inline-block", width: "fit-content", fontSize:"18pt"}}>
                        $
                    </p>
                    <input className="field top-create-trip leaders other_costs other_costs_num"
                    onChange={() => this.props.onFieldChangeOther(event, i+1)}
                    name="otherCostsCost"
                    type = "number"
                    placeholder="e.g. 10"
                    value={this.state.otherCostsCost[i+1]}
                    />
                    <button type="button" className="delete-gear-button" onClick={() => this.removeOtherRequests(i+1)}>X</button>
                    </div>
            );
        }
        return ret;
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
            value={this.state.numPeople}
            />
        </div>
        <div className = "page-sub-headers">
            <p>Food per person on the trip</p>
        </div>

        <div style = {{width:'200%'}}>
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
        <div>
        {this.otherCosts(this.state.numOtherRequests)}
        </div>
        <button className="add-gear-button" type="button" onClick={this.updateOtherRequests}>+</button>

        </div>

        );
    }

    }
}
export default PCardRequest;
