import React from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { Switch } from 'react-router';
import LeaderApprovals from './leader_approvals';
import GearRequests from './gearrequests';
import TrippeeGearRequests from './trippeegearrequests';
import CertApprovals from './cert_approvals';
import requireAuth from '../containers/requireAuth';

const OpoStuff = ({ match }) => {
  return (
    <div>
      <div>
        <Link className="btn btn-primary" to="/opo/leader_approvals">Leader Requests</Link>
        <Link className="btn btn-primary" to={`${match.url}/gearRequests`}>Gear Requests</Link>
        <Link className="btn btn-primary" to={`${match.url}/trippeegearrequests`}>Trippee Gear</Link>
        <Link className="btn btn-primary" to={`${match.url}/cert_approvals`}>Certification Requests</Link>
      </div>
      <Switch>
        <Route path="/opo/leader_approvals" component={requireAuth(LeaderApprovals)} />
        <Route path={`${match.path}/gearRequests`} component={requireAuth(GearRequests)} />
        <Route path={`${match.path}/trippeegearrequests`} component={requireAuth(TrippeeGearRequests)} />
        <Route path={`${match.path}/cert_approvals`} component={requireAuth(CertApprovals)} />
      </Switch>
    </div>
  );
};

export default withRouter(OpoStuff);
