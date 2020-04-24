import React from 'react';
import './toggle.scss';

class Toggle extends React.Component {
  render() {
    return (
      <div className="toggle">
        <input className="toggle-input"
          type="checkbox"
          value={this.props.value}
          id={this.props.id}
          onChange={this.props.onChange}
        />
        <label className="toggle-label" htmlFor={this.props.id}>
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Toggle;
