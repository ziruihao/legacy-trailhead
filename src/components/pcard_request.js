import React from 'react';
import { Stack, Queue, Divider, Box } from './layout';
import Icon from './icon';
import Field from './field';
import '../styles/createtrip-style.scss';
import './pcard-request.scss';

function getPcardForm(props) {
  const { pcardRequest } = props;
  return pcardRequest.map((request, index) => {
    return (
      <Box dir="col" width={800} pad={50} className="doc-card pcard-request" key={request._id}>
        <Icon id="delete-pcard" type="close" size={15} onClick={props.togglePcard} />
        <Box dir="row" justify="between" align="center">
          <div className="doc-h2">Total people on trip</div>
          <Field
            onChange={event => props.onPcardFieldChange(event, index)}
            name="numPeople"
            value={request.numPeople}
            type="number"
            width={100}
            error={request.errorFields.numPeople}
            errorMessage="Value empty, please put a number here"
          />
        </Box>
        <Stack size={25} />
        <div className="doc-h2">Food costs</div>
        <Stack size={25} />
        <div className="p1">Put how many each trippee (including leaders) will need.</div>
        <Stack size={25} />
        <Box dir="row" justify="between">
          <Box dir="col" width={300}>
            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Snacks</div>
              <Field
                onChange={event => props.onPcardFieldChange(event, index)}
                name="snacks"
                value={request.snacks}
                type="number"
                width={100}
                error={request.errorFields.snacks}
                errorMessage="Value empty for snacks, put 0 if no cost"
              />
            </Box>
            <Stack size={25} />
            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Breakfast</div>
              <Field
                onChange={event => props.onPcardFieldChange(event, index)}
                name="breakfast"
                value={request.breakfast}
                type="number"
                width={100}
                error={request.errorFields.breakfast}
                errorMessage="Value empty for breakfast, put 0 if no cost"
              />
            </Box>
          </Box>
          <Box dir="col" width={300}>
            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Lunch</div>
              <Field
                onChange={event => props.onPcardFieldChange(event, index)}
                name="lunch"
                value={request.lunch}
                type="number"
                width={100}
                error={request.errorFields.lunch}
                errorMessage="Value empty for lunch, put 0 if no cost"
              />
            </Box>
            <Stack size={25} />

            <Box dir="row" justify="between" align="center">
              <div className="doc-h3">Dinner</div>
              <Field
                onChange={event => props.onPcardFieldChange(event, index)}
                name="dinner"
                value={request.dinner}
                type="number"
                width={100}
                error={request.errorFields.dinner}
                errorMessage="Value empty for dinner, put 0 if no cost"
              />
            </Box>
          </Box>
        </Box>
        <Stack size={25} />
        <div className="doc-h2">Other costs</div>
        <Stack size={25} />
        {renderOtherCosts(request.otherCosts, props.onOtherCostsChange, index, props.deleteOtherCost)}
        <Stack size={25} />
        <Box dir="row" justify="end">
          <div className="doc-button hollow" onClick={event => props.addOtherCost(event, index)} role="button" tabIndex={0}>Add other expense</div>
        </Box>
        {/* <span className="create-trip-pcard-add-other" onClick={event => props.addOtherCost(event, index)} role="button" tabIndex={0}>+ Add another expense</span> */}
      </Box>
    );
  });
}

function renderOtherCosts(otherCosts, onOtherCostsChange, pcardIndex, deleteOtherCost) {
  return otherCosts.map((otherCost, costIndex) => {
    return (
      <>
        <Box dir="row" justify="between" align="center" key={otherCost}>
          <Field
            onChange={(event) => { console.log(event.target); onOtherCostsChange(event, pcardIndex, costIndex); }}
            name="title"
            value={otherCost.title}
            placeholder="e.g. Tickets for EVO"
            width={400}
            tooltipID={`additional-cost-${costIndex}-title`}
            error={otherCost.errorFields.title}
            errorMessage="Please write something here"
          />
          <Box dir="row" align="center">
            <div className="doc-h3">$</div>
            <Queue size={10} />
            <Field
              onChange={event => onOtherCostsChange(event, pcardIndex, costIndex)}
              name="cost"
              value={otherCost.cost}
              placeholder="USD"
              type="number"
              width={100}
              tooltipID={`additional-cost-${costIndex}-cost`}
              error={otherCost.errorFields.cost}
              errorMessage="Value empty, put 0 if no cost"
            />
            <Queue size={25} />
            <Icon id="delete-additional-cost" type="close" size={25} onClick={event => deleteOtherCost(event, pcardIndex, costIndex)} />
          </Box>
        </Box>
        {(costIndex === otherCosts.length - 1) ? null : <Stack size={25} />}
      </>
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
            {props.pcardRequest.length === 0
              ? <div className="doc-button hollow" onClick={props.togglePcard} role="button" tabIndex={0}>Add P-Card</div>
              : null}
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
