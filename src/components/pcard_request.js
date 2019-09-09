/* eslint-disable */
import React from 'react';
import '../styles/createtrip-style.scss';

const PCardRequest = (props) => {
	return (
		<div className="create-trip-form-content">
			<div className="row page-header">
				<p>P-Card Request</p>
			</div>
			{(!props.pcardStatus || props.pcardStatus === 'pending' || props.pcardStatus === 'N/A')
				? (
					<div>
						{getPcardForm(props)}
						<div className="toggle-pcard-button">
							<button
								className={`add-gear-button ${props.pcardRequest.length !== 0 ? 'create-trip-cancel-button' : ''}`}
								type="button" onClick={props.togglePcard}
							>
								{props.pcardRequest.length === 0 ? 'Request P-card' : 'Cancel Request'}
							</button>
						</div>
					</div>
				)
				: (
					<div className="no-gear">
						<div className="trip-detail">
							<div className="no-on-trip">
								<h4 className="none-f-now">You can&apos;t edit requests after they&apos;ve been reviewed</h4>
							</div>
						</div>
					</div>
				)
			}
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
					<input
						className={`field top-create-trip leaders pcard ${request.errorFields.numPeople ? 'create-trip-error' : ''}`}
						onChange={(event) => props.onPcardFieldChange(event, index)}
						name="numPeople"
						placeholder="e.g. 8"
						value={request.numPeople}
						type="number"
					/>
				</div>
				<div className="page-sub-headers">
					<p>Food per person on the trip</p>
				</div>

				<div className="pcard-food-breakdown">
					<div className="row page-sub-headers pcard">
						<p>Snacks</p>
						<input
							className={`field top-create-trip leaders pcard ${request.errorFields.snacks ? 'create-trip-error' : ''}`}
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="snacks"
							placeholder="e.g. 1"
							value={request.snacks}
							type="number"
						/>
					</div>
					<div className="row page-sub-headers pcard">
						<p>Breakfast</p>
						<input
							className={`field top-create-trip leaders pcard ${request.errorFields.breakfast ? 'create-trip-error' : ''}`}
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="breakfast"
							placeholder="e.g. 1"
							value={request.breakfast}
							type="number"
						/>
					</div>
					<div className="row page-sub-headers pcard">
						<p>Lunch</p>
						<input
							className={`field top-create-trip leaders pcard ${request.errorFields.lunch ? 'create-trip-error' : ''}`}
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="lunch"
							placeholder="e.g. 1"
							value={request.lunch}
							type="number"
						/>
					</div>
					<div className="row page-sub-headers pcard">
						<p>Dinner</p>
						<input
							className={`field top-create-trip leaders pcard ${request.errorFields.dinner ? 'create-trip-error' : ''}`}
							onChange={(event) => props.onPcardFieldChange(event, index)}
							name="dinner"
							placeholder="e.g. 1"
							value={request.dinner}
							type="number"
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
				<input
					className={`field top-create-trip leaders other_costs ${otherCost.errorFields.title ? 'create-trip-error' : ''}`}
					onChange={() => onOtherCostsChange(event, pcardIndex, costIndex)}
					name="title"
					placeholder="e.g. Tickets for EVO"
					value={otherCost.title}
				/>
				<p style={{ fontWeight: 700, display: "inline-block", width: "fit-content", fontSize: "18pt" }}>
					$
        </p>
				<input
					className={`field top-create-trip leaders other_costs other_costs_num ${otherCost.errorFields.cost ? 'create-trip-error' : ''}`}
					onChange={() => onOtherCostsChange(event, pcardIndex, costIndex)}
					name="cost"
					type="number"
					placeholder="e.g. 10"
					value={otherCost.cost}
					type="number"
				/>
				<button type="button" className="delete-gear-button" onClick={() => deleteOtherCost(event, pcardIndex, costIndex)}>X</button>
			</div>
		);
	});
}

export default PCardRequest;
