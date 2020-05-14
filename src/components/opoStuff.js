import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Approvals from './cert_approvals';
import LeaderApprovals from './leader_approvals';
import Loading from './loading';
import dropdownIcon from '../img/dropdown-toggle.svg';
// import OpoDropdown from './approval-dropdown';
import '../styles/approvals-style.scss';
import '../styles/tripdetails_leader.scss';
import '../styles/opo-trips.scss';

class OpoApprovals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'Leader Status Requests',
    };
  }

  onClick = () => {
    if (this.state.page === 'Leader Status Requests') {
      this.setState({
        page: 'Driver Certification',
      });
    } else {
      this.setState({
        page: 'Leader Status Requests',
      });
    }
  }

  render() {
    if (this.state.page === 'Leader Status Requests') {
      return (
        <div>
          <div className="leader-details-container dashboard-container">
            <div className="pending-and-dropdown">
              <h4 className="trip-status">Pending Requests</h4>
              <div className="dropdown-and-label">
                <span className="dropdown-label">View:</span>
                <Dropdown>
                  <Dropdown.Toggle id="filter-dropdown">
                    <p className="current-filter">{this.state.page}</p>
                    <img className="dropdown-icon right-margin" src={dropdownIcon} alt="dropdown-toggle" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="filter-options">
                    <Dropdown.Item onClick={this.onClick}>Leader Status Requests</Dropdown.Item>
                    <Dropdown.Item onClick={this.onClick}>Driver Certification Requests</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <LeaderApprovals />
        </div>

      );
    } else if (this.state.page === 'Driver Certification') {
      return (
        <div>
          <div className="leader-details-container dashboard-container">
            <div className="pending-and-dropdown">
              <h4 className="trip-status">Pending Requests</h4>
              <div className="dropdown-and-label">
                <span className="dropdown-label">View:</span>
                <Dropdown>
                  <Dropdown.Toggle id="filter-dropdown">
                    <p className="current-filter">{this.state.page}</p>
                    <img className="dropdown-icon right-margin" src={dropdownIcon} alt="dropdown-toggle" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="filter-options">
                    <Dropdown.Item onClick={this.onClick}>Leader Status Requests</Dropdown.Item>
                    <Dropdown.Item onClick={this.onClick}>Driver Certification Requests</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <Approvals />
        </div>

      );
    } else {
      return (<Loading type="balls" />);
    }
  }
}


export default withRouter(OpoApprovals);
