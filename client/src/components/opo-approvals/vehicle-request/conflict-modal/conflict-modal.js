import React from 'react';
import utils from '../../../../utils';
import Badge from '../../../badge';
import Text from '../../../text';
import { Box, Stack, Queue, Divider } from '../../../layout';
import * as constants from '../../../../constants';
import './conflict-modal.scss';
import '../../../../styles/base.scss';

const ConflictModal = props => (
  <Box dir='col' align='center' pad={20} id='conflict-modal'>
    <Badge type='warning' size={100} />
    <Stack size={25} />
    <Text type='h3'>{props.vehicleName} is booked by these trips:</Text>
    <Stack size={25} />
    <Box dir='col'>
      {props.conflicts.map((conflict, index) => {
        const conflictObjectURL = `${constants.ROOT_URL}/opo-vehicle-request/${conflict.objectID}`;
        return (
          <Box dir='col' key={conflict.objectID}>
            <Box dir='row'>
              <Text type='p1'>
                {conflict.message}: {utils.dates.formatDate(new Date(conflict.time.start))} {utils.dates.formatTime(new Date(conflict.time.start), { military: true })} - {utils.dates.formatDate(new Date(conflict.time.end))} @ {utils.dates.formatDate(new Date(conflict.time.end), { military: true })}
              </Text>
              <Queue size={25} />
              <Text type='p1 thick'><a href={conflictObjectURL} target='_blank' rel='noopener noreferrer'>[View]</a></Text>
            </Box>
            <Stack size={index < props.conflicts.length - 1 ? 10 : 0} />
          </Box>
        );
      })}
    </Box>
    <Stack size={25} />
    <div className='doc-button' onClick={props.closeModal} role='button' tabIndex={0}>Okay</div>
  </Box>
);

export default ConflictModal;
