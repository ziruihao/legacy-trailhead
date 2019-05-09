import React from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { Switch } from 'react-router';
import Approvals from './approvals';
import GearRequests from './gearrequests';

const OpoStuff = ({ match }) => {
  return (
    <div>
      <div>
        <Link className="btn btn-primary" to="/opo/approvals">Approvals</Link>
        <Link className="btn btn-primary" to={`${match.url}/gearRequests`}>Gear Requests</Link>
      </div>
      <Switch>
        <Route path="/opo/approvals" component={Approvals} />
        <Route path={`${match.path}/gearRequests`} component={GearRequests} />
      </Switch>
    </div>
  );
};

export default withRouter(OpoStuff);
