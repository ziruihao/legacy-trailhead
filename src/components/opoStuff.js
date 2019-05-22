import React from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { Switch } from 'react-router';
import Approvals from './approvals';
import GearRequests from './gearrequests';
import TrippeeGearRequests from './trippeegearrequests';

const OpoStuff = ({ match }) => {
  return (
    <div>
      <div>
        <Link className="btn btn-primary" to="/opo/approvals">Approvals</Link>
        <Link className="btn btn-primary" to={`${match.url}/gearRequests`}>Gear Requests</Link>
        <Link className="btn btn-primary" to={`${match.url}/trippeegearrequests`}>Trippee Gear</Link>
      </div>
      <Switch>
        <Route path="/opo/approvals" component={Approvals} />
        <Route path={`${match.path}/gearRequests`} component={GearRequests} />
        <Route path={`${match.path}/trippeegearrequests`} component={TrippeeGearRequests} />
      </Switch>
    </div>
  );
};

export default withRouter(OpoStuff);
