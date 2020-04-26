import React from 'react';
import warningBadge from './warning-badge.svg';
import './conflict-modal.scss';
import '../../../styles/base.scss';

const ConflictModal = props => (
  <div id="conflict-modal">
    <img src={warningBadge} alt="warning-badge" id="conflict-modal-warning-badge" />
    <div id="conflict-modal-message" className="p1">{props.vehicleName} is booked by these trips:</div>
    <div id="conflict-modal-conflicts" className="p1">
      {props.conflicts.map((conflict) => {
        return (
          <div key={conflict.objectID} className="conflict-modal-conflict p1">
            {conflict.message}: {conflict.time.start} - {conflict.time.end}
          </div>
        );
      })}
    </div>
    <button type="submit" className="action-button" onClick={props.closeModal}>Okay</button>
  </div>
);

export default ConflictModal;
