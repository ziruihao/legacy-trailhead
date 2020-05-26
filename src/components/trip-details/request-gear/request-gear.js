import React from 'react';
import Loading from '../../Loading';
import '../trip-details.scss';
import './request-gear.scss';

class RequestGear extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestedGear: this.props.selfGear,
    };
  }

  onGearChange = (event) => {
    event.persist();
    if (event.target.checked) {
      this.setState(prevState => ({
        requestedGear: [...prevState.requestedGear, { gearId: event.target.dataset._id, name: event.target.dataset.name }],
      }));
    } else {
      this.setState((prevState) => {
        const withoutClickedGear = prevState.requestedGear.filter(gear => gear.gearId !== event.target.dataset._id.toString());
        return {
          requestedGear: withoutClickedGear,
        };
      });
    }
    this.props.updateGear(this.state.requestedGear);
  }

  render() {
    if (this.props.trippeeGear.length === 0) {
      return (
        <div className="no-on-trip">
          <h4 className="none-f-now">None</h4>
        </div>
      );
    } else {
      const checkmarkClass = this.props.isEditing ? 'checkmark' : 'disabled-checkmark';
      console.log(this.props.trippeeGear);
      return (
        <div id="trip-request-gear-form" className="trip-modal-details">
          {this.props.loading
            ? (
              <div id="trip-request-gear-form-loading">
                <Loading type="spin" width="35" height="35" measure="px" />
              </div>
            )
            : null
          }
          {
            this.props.trippeeGear.map((gear, index, array) => {
              const checked = this.state.requestedGear.some((userGear) => {
                return userGear.gearId === gear._id;
              });
              return (
                <div key={gear._id}>
                  <div className="trip-modal-details-row">
                    <div className="trip-modal-details-left p2">{gear.name}</div>
                    <div className="trip-modal-details-right">
                      <div className="p2">Needed</div>
                      <label className="checkbox-container" htmlFor={gear._id}>
                        <input
                          type="checkbox"
                          name="gear"
                          id={gear._id}
                          data-_id={gear._id}
                          data-name={gear.name}
                          onChange={this.onGearChange}
                          checked={checked}
                          disabled={!this.props.isEditing}
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
