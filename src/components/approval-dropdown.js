import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Switch } from 'react-router';
import Dropdown from 'react-bootstrap/Dropdown';
import Approvals from './cert_approvals';
import LeaderApprovals from './leader_approvals';
import requireAuth from '../containers/requireAuth';
import '../styles/approvals-style.scss';
import '../styles/tripdetails_leader.scss';
import '../styles/opo-trips.scss';


const OpoDropdown = ({ match }) => {
  return (
    <div className="dropdown-and-label">
      <span className="dropdown-label">View:</span>
      <Dropdown>
        <Dropdown.Toggle id="filter-dropdown">
          <p className="current-filter">Leadership Status Requests</p>
          <img className="dropdown-icon right-margin" src="/src/img/dropdown-toggle.svg" alt="dropdown-toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="filter-options">
          <Dropdown.Item to="/opo/leader_approvals" on>Leader Status Requests</Dropdown.Item>
          <Dropdown.Item to="/cert_approvals">Driver Certification Requests</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Switch>
        <Route path="/opo/leader_approvals" component={requireAuth(LeaderApprovals)} />
        <Route path={`${match.path}/cert_approvals`} component={requireAuth(Approvals)} />
      </Switch>
    </div>
  );
};

export default withRouter(OpoDropdown);
