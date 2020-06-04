import React from 'react';
import { Stack, Queue, Divider, Box } from './layout';
import '../styles/createtrip-style.scss';

function getPcardForm(props) {
  const { pcardRequest } = props;
  return pcardRequest.map((request, index) => {
    return (
      <Box dir="col" pad={50} className="doc-card" key={request._id}>
        <Box dir="row" justify="between" align="center">
          <div className="doc-h2">Total people on trip</div>
          <input
            className={`field leaders pcard ${request.errorFields.numPeople ? 'field-error' : ''}`}
            onChange={event => props.onPcardFieldChange(event, index)}
            name="numPeople"
            placeholder="e.g. 8"
            value={request.numPeople}
            type="number"
          />
        </Box>
        <Stack size={25} />
        <div className="doc-h2">Food costs</div>
        <Stack size={25} />
        <Box dir="row">
          <Box dir="col" expand>
            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Snacks</div>
              <input
                className={`field leaders pcard ${request.errorFields.snacks ? 'field-error' : ''}`}
                onChange={event => props.onPcardFieldChange(event, index)}
                name="snacks"
                placeholder="e.g. 1"
                value={request.snacks}
                type="number"
              />
            </Box>
            <Stack size={25} />
            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Breakfast</div>
              <input
                className={`field leaders pcard ${request.errorFields.breakfast ? 'field-error' : ''}`}
                onChange={event => props.onPcardFieldChange(event, index)}
                name="breakfast"
                placeholder="e.g. 1"
                value={request.breakfast}
                type="number"
              />
            </Box>
          </Box>
          <Queue size={25} />
          <Box dir="col" expand>
            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Lunch</div>
              <input
                className={`field leaders pcard ${request.errorFields.lunch ? 'field-error' : ''}`}
                onChange={event => props.onPcardFieldChange(event, index)}
                name="lunch"
                placeholder="e.g. 1"
                value={request.lunch}
                type="number"
              />
            </Box>
            <Stack size={25} />

            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Dinner</div>
              <input
                className={`field leaders pcard ${request.errorFields.dinner ? 'field-error' : ''}`}
                onChange={event => props.onPcardFieldChange(event, index)}
                name="dinner"
                placeholder="e.g. 1"
                value={request.dinner}
                type="number"
              />
            </Box>
          </Box>
        </Box>
        <Stack size={25} />
        <div className="doc-h2">Other costs</div>
        <div>
          {renderOtherCosts(request.otherCosts, props.onOtherCostsChange, index, props.deleteOtherCost)}
          <span className="create-trip-pcard-add-other" onClick={event => props.addOtherCost(event, index)} role="button" tabIndex={0}>+ Add another expense</span>
        </div>
      </Box>
    );
  });
}

function renderOtherCosts(otherCosts, onOtherCostsChange, pcardIndex, deleteOtherCost) {
  return otherCosts.map((otherCost, costIndex) => {
    return (
      <div key={otherCost}>
        <input
          className={`field leaders other_costs ${otherCost.errorFields.title ? 'field-error' : ''}`}
          onChange={event => onOtherCostsChange(event, pcardIndex, costIndex)}
          name="title"
          placeholder="e.g. Tickets for EVO"
          value={otherCost.title}
        />
        <p style={{ fontWeight: 700, display: 'inline-block', width: 'fit-content', fontSize: '18pt' }}>
          $
        </p>
        <input
          className={`field leaders other_costs other_costs_num ${otherCost.errorFields.cost ? 'field-error' : ''}`}
          onChange={event => onOtherCostsChange(event, pcardIndex, costIndex)}
          name="cost"
          type="number"
          placeholder="e.g. 10"
          value={otherCost.cost}
        />
        <button type="button" className="delete-gear-button" onClick={event => deleteOtherCost(event, pcardIndex, costIndex)}>X</button>
      </div>
    );
  });
}

const PCardRequest = (props) => {
  return (
    <Box dir="col">
      <div className="doc-h1">P-Card Request</div>
      <Stack size={50} />

      {(!props.pcardStatus || props.pcardStatus === 'pending' || props.pcardStatus === 'N/A')
        ? (
          <Box dir="col" align="start">
            {getPcardForm(props)}
            <div className={`doc-button ${props.pcardRequest.length !== 0 ? 'alarm' : 'hollow'}`} onClick={props.togglePcard} role="button" tabIndex={0}>
              {props.pcardRequest.length === 0 ? 'Request P-card' : 'Cancel request'}
            </div>
          </Box>
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
    </Box>
  );
};

export default PCardRequest;
