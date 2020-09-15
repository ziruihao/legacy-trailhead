import React from 'react';
import { Table } from 'react-bootstrap';
import { Stack, Queue, Divider, Box } from '../../../layout';
import * as constants from '../../../../constants';

const AttendeeTable = (props) => {
  const renderAttendence = (status) => {
    if (props.tripLeft) {
      if (status) return 'Yes';
      else return 'No';
    } else {
      return 'N/A';
    }
  };
  if (props.people.length === 0) {
    return (
      <Box dir='row' justify='center' align='center' expand>
        <div className='p1 gray thin'>None
        </div>
      </Box>
    );
  } else {
    return (
      <>
        <Table className='doc-table' responsive='lg' hover>
          <thead>
            <tr>
              <th>Name</th>
              {props.showAttendence
                ? <th>Attended</th>
                : null}
              <th>Allergies/Diet Restrictions</th>
              <th>Medical conditions</th>
              <th>Gear Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.people.map(person => (
              <tr key={person.user._id} onClick={() => props.openProfile(person.user)}>
                <td>{person.user.name}</td>
                {props.showAttendence
                  ? <td>{renderAttendence(person.attended)}</td>
                  : null }
                <td>{person.user.medical_conditions}</td>
                <td>{person.user.allergies_dietary_restrictions}</td>
                <td>
                  {person.requestedGear.length !== 0 ? person.requestedGear.map(gear => (
                    <li key={gear.gearId}>{gear.name}</li>
                  )) : 'None'}
                </td>
                <td>
                  <Box dir='col'>
                    {props.actions.map((action, idx) => (
                      <>
                        <div className='doc-button hollow' onClick={(event) => { action.callback(person); event.stopPropagation(); }} role='button' tabIndex={0}>{typeof (action.message) === 'string' ? action.message : action.message(person.user)}</div>
                        {idx < props.actions.length - 1 ? <Stack size={15} /> : null}
                      </>
                    ))}
                  </Box>
                  {/* <div className="doc-button hollow" onClick={(event) => { props.assignToLeader(member); event.stopPropagation(); }} role="button" tabIndex={0}>Assign to leader</div> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Divider size={1} />
        <Stack size={18} />
        <Box dir='row' justify='center' align='stretch' wrap expand>
          <div className='doc-button' onClick={() => window.open(`mailto:${constants.getEmails(props.people)}`, '_blank')} role='button' tabIndex={0}>Send email to all</div>
        </Box>
      </>
    );
  }
};

export default AttendeeTable;
