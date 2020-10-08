import React from 'react';
import { Stack, Queue, Divider, Box } from './layout';
import Icon from './icon';
import Field from './field';
import Text from './text';
import '../styles/createtrip-style.scss';
import './pcard-request.scss';

function getPcardForm(props) {
  const { pcardRequest } = props;
  return pcardRequest.map((request, index) => {
    return (
      <Box dir='col' width={800} pad={50} className='doc-card pcard-request' key={request._id}>
        <Icon id='delete-pcard' type='close' size={15} onClick={props.togglePcard} />
        <Box dir='row' justify='between' align='center'>
          <Text type='h2'>Total people on trip</Text>
          <Box dir='row' align='center'>
            <div className='doc-h3' />
            <Queue size={10} />
            <Field
              onChange={event => props.onPcardFieldChange(event, index)}
              name='numPeople'
              value={request.numPeople}
              type='number'
              width={100}
              error={request.errorFields.numPeople}
            />
          </Box>
        </Box>
        <Stack size={25} />
        <Text type='h2'>Food costs</Text>
        <Stack size={25} />
        <div className='p1'>Put how many each trippee (including leaders) will need.</div>
        <Stack size={25} />
        <Box dir='row' justify='between'>
          <Box dir='col' width={300}>
            <Box dir='row' justify='between' align='center'>
              <div className='doc-h3'>Snacks</div>
              <Box dir='row' align='center'>
                <div className='doc-h3'>$</div>
                <Queue size={10} />
                <Field
                  onChange={event => props.onPcardFieldChange(event, index)}
                  name='snacks'
                  value={request.snacks}
                  type='number'
                  width={100}
                  placeholder='USD'
                  error={request.errorFields.snacks}
                />
              </Box>
            </Box>
            <Stack size={25} />
            <Box dir='row' justify='between' align='center'>
              <div className='doc-h3'>Breakfast</div>
              <Box dir='row' align='center'>
                <div className='doc-h3'>$</div>
                <Queue size={10} />
                <Field
                  onChange={event => props.onPcardFieldChange(event, index)}
                  name='breakfast'
                  value={request.breakfast}
                  type='number'
                  width={100}
                  placeholder='USD'
                  error={request.errorFields.breakfast}
                />
              </Box>
            </Box>
          </Box>
          <Box dir='col' width={300}>
            <Box dir='row' justify='between' align='center'>
              <div className='doc-h3'>Lunch</div>
              <Box dir='row' align='center'>
                <div className='doc-h3'>$</div>
                <Queue size={10} />
                <Field
                  onChange={event => props.onPcardFieldChange(event, index)}
                  name='lunch'
                  value={request.lunch}
                  type='number'
                  width={100}
                  placeholder='USD'
                  error={request.errorFields.lunch}
                />
              </Box>
            </Box>
            <Stack size={25} />

            <Box dir='row' justify='between' align='center'>
              <div className='doc-h3'>Dinner</div>
              <Box dir='row' align='center'>
                <div className='doc-h3'>$</div>
                <Queue size={10} />
                <Field
                  onChange={event => props.onPcardFieldChange(event, index)}
                  name='dinner'
                  value={request.dinner}
                  type='number'
                  width={100}
                  placeholder='USD'
                  error={request.errorFields.dinner}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Stack size={25} />
        <Text type='h2'>Other costs</Text>
        <Stack size={25} />
        {renderOtherCosts(request.otherCosts, props.onOtherCostsChange, index, props.deleteOtherCost)}
        <Stack size={25} />
        <Box dir='row' justify='end'>
          <div className='doc-button hollow' onClick={event => props.addOtherCost(event, index)} role='button' tabIndex={0}>Add other expense</div>
        </Box>
      </Box>
    );
  });
}

function renderOtherCosts(otherCosts, onOtherCostsChange, pcardIndex, deleteOtherCost) {
  return otherCosts.map((otherCost, costIndex) => {
    return (
      <>
        <Box dir='row' justify='between' align='center' key={otherCost}>
          <Field
            onChange={(event) => { onOtherCostsChange(event, pcardIndex, costIndex); }}
            name='title'
            value={otherCost.title}
            placeholder='e.g. Tickets for EVO'
            width={400}
            error={otherCost.errorFields ? otherCost.errorFields.title : false}
          />
          <Box dir='row' align='center'>
            <div className='doc-h3'>$</div>
            <Queue size={10} />
            <Field
              onChange={event => onOtherCostsChange(event, pcardIndex, costIndex)}
              name='cost'
              value={otherCost.cost}
              placeholder='USD'
              type='number'
              width={100}
              error={otherCost.errorFields ? otherCost.errorFields.cost : false}
            />
            <Queue size={25} />
            <Icon id='delete-additional-cost' type='close' size={25} onClick={event => deleteOtherCost(event, pcardIndex, costIndex)} />
          </Box>
        </Box>
        {(costIndex === otherCosts.length - 1) ? null : <Stack size={25} />}
      </>
    );
  });
}

const PCardRequest = (props) => {
  return (
    <Box dir='col'>
      <Text type='h1'>P-Card Request</Text>
      <Stack size={50} />

      {(!props.pcardStatus || props.pcardStatus === 'pending' || props.pcardStatus === 'N/A')
        ? (
          <Box dir='col' align='start'>
            {getPcardForm(props)}
            {props.pcardRequest.length === 0
              ? <div className='doc-button hollow' onClick={props.togglePcard} role='button' tabIndex={0}>Add P-Card</div>
              : null}
          </Box>
        )
        : (
          <Box dir='row' justify='center' align='center' height={100} className='doc-bordered'>
            <Text type='p1' color='gray3' weight='thin'>You can&apos;t edit requests after they&apos;ve been reviewed</Text>
          </Box>
        )
      }
    </Box>
  );
};

export default PCardRequest;
