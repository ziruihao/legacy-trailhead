import React from 'react';
import './doc-toggle.scss';


class Toggle extends React.Component {
  render() {
    return (
      <div className="toggle">
        <label className="toggle-label" htmlFor={this.props.id}>
          <input
            className="toggle-input"
            type="checkbox"
            id={this.props.id}
            name={this.props.name}
            onChange={this.props.onChange}
            value={this.props.value}
            checked={this.props.value}
            disabled={this.props.disabled}
          />
          <span className={!this.props.disabled ? 'checkmark' : 'disabled-checkmark'} />
        </label>
        <div className="toggle-text">
          {this.props.label}
        </div>
      </div>
    );
  }
}

export default Toggle;
