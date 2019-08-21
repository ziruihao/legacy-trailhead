/* eslint-disable */
import React, { Component } from 'react';
import '../styles/createtrip-style.scss';

const PCardRequest = (props) => {
	return (
		<div className="create-trip-form-content">
			<div className="row page-header">
				<p>P-Card Request</p>
			</div>
			{getPcardForm(props)}
			<div className="toggle-pcard-button">
				<button className={`add-gear-button ${props.pcardRequest.length !== 0 ? 'create-trip-cancel-button' : ''}`} type="button" onClick={props.togglePcard}>{props.pcardRequest.length === 0 ? 'Request P-card' : 'Cancel Request'}</button>
			</div>
		</div>
	)
};

const getPcardForm = (props) => {
	const { pcardRequest } = props;
	return pcardRequest.map((request, index) => {
		return (
			<div key={`req_${index}`}>
				<div className="page-sub-headers">
					<p>Number of People (including trip leaders)</p>
				</div>
				<div className="row pcard-header">
					<input className="field top-create-trip leaders pcard"
						onChange={(event) => props.onPcardFieldChange(event, index)}
						name="numPeople"
						placeholder="e.g. 8"
						value={request.numPeople}
					/>
				</div>
				<div className="page-sub-headers">
					<p>Food per person on the trip</p>
				</div>

				<div className="pcard-food-breakdown">
					<div className="row page-sub-headers pcard">
						<p>Snacks</p>
						<input className="field top-create-trip leaders pcard"
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="snacks"
							placeholder="e.g. 1"
							value={request.snack}
						/>
					</div>
					<div className="row page-sub-headers pcard">
						<p>Breakfast</p>
						<input className="field top-create-trip leaders pcard"
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="breakfast"
							placeholder="e.g. 1"
							value={request.breakfast}
						/>
					</div>
					<div className="row page-sub-headers pcard">
						<p>Lunch</p>
						<input className="field top-create-trip leaders pcard"
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="lunch"
							placeholder="e.g. 1"
							value={request.lunch}
						/>
					</div>
					<div className="row page-sub-headers pcard">
						<p>Dinner</p>
						<input className="field top-create-trip leaders pcard"
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="dinner"
							placeholder="e.g. 1"
							value={request.dinner}
						/>
					</div>
				</div>
				<div className="page-sub-headers">
					<p>Other Costs</p>
				</div>
				<div>
					{otherCosts(request.otherCosts, props.onOtherCostsChange, index, props.deleteOtherCost)}
					<span className="create-trip-pcard-add-other" onClick={() => props.addOtherCost(event, index)} role="button" tabIndex={0}>+ Add another expense</span>
				</div>
			</div>
		);
	});
};

const otherCosts = (otherCosts, onOtherCostsChange, pcardIndex, deleteOtherCost) => {
	return otherCosts.map((otherCost, costIndex) => {
		return (
			<div key={`other_cost_${costIndex}`}>
				<input className="field top-create-trip leaders other_costs"
					onChange={() => onOtherCostsChange(event, pcardIndex, costIndex)}
					name="title"
					placeholder="e.g. Tickets for EVO"
					value={otherCost.title}
				/>
				<p style={{ fontWeight: 700, display: "inline-block", width: "fit-content", fontSize: "18pt" }}>
					$
        </p>
				<input className="field top-create-trip leaders other_costs other_costs_num"
					onChange={() => onOtherCostsChange(event, pcardIndex, costIndex)}
					name="cost"
					type="number"
					placeholder="e.g. 10"
					value={otherCost.cost}
				/>
				<button type="button" className="delete-gear-button" onClick={() => deleteOtherCost(event, pcardIndex, costIndex)}>X</button>
			</div>
		);
	});
}

export default PCardRequest;
