import React from 'react';
import DOCLoading from '../../doc-loading';
import '../trip-details.scss';
import './request-gear.scss';

class RequestGear extends React.Component {
  render() {
    console.log(this.props.requestedGear);
    if (this.props.trippeeGear.length === 0) {
      return (
        <div className="p1 gray thin">None</div>
      );
    } else {
      const checkmarkClass = this.props.editingGear ? 'checkmark' : 'disabled-checkmark';
      return (
        <div id="trip-request-gear-form" className="trip-details-table">
          {this.props.loading
            ? (
              <div id="trip-request-gear-form-loading">
                <DOCLoading type="spin" width="35" height="35" measure="px" />
              </div>
            )
            : null
          }
          {
            this.props.trippeeGear.map((gear, index, array) => {
              const checked = this.props.requestedGear.some((userGear) => {
                return userGear.gearId === gear._id;
              });
              return (
                <div key={gear._id}>
                  <div className="trip-details-table-row">
                    <div className="trip-details-table-left p2">{gear.name}</div>
                    <div className="trip-details-table-right">
                      <div className="p2">Needed</div>
                      <label className="checkbox-container" htmlFor={gear._id}>
                        <input
                          type="checkbox"
                          name="gear"
                          id={gear._id}
                          data-_id={gear._id}
                          data-name={gear.name}
                          onChange={this.props.onGearChange}
                          checked={checked}
                          disabled={!this.props.editingGear}
                        />
                        <span className={checkmarkClass} />
                      </label>
                    </div>
                  </div>
                  {index !== array.length - 1 ? <hr className="detail-line" /> : null}
                </div>
              );
            })
          }
        </div>
      );
    }
  }
}

export default RequestGear;
