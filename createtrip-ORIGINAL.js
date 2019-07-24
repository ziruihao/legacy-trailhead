<div className="container">
  <div className="card-createTrip">
    <div className="card-header profile-header">Create your trip today!</div>
    <input className="form-control field top" onChange={this.onFieldChange} name="title" placeholder="Trip title" value={this.state.title} />
    <input
      className="form-control field"
      onChange={this.onFieldChange}
      name="leaders"
      placeholder="Leaders (comma separated emails, you are a leader by default)"
      value={this.state.leaders}
    />
    <select name="club" className="custom-select field" defaultValue="Select Club" onChange={this.onClubChange}>
      {this.getClubOptions()}
    </select>
    <div> Experience Needed </div>
    <form>
      <input
        type="radio"
        value="Yes"
        onChange={this.handleOptionChange}
        checked={this.state.experienceNeeded === true}
      />
      Yes
      <input
        type="radio"
        value="No"
        onChange={this.handleOptionChange}
        checked={this.state.experienceNeeded === false}
      />
      No
    </form>
    <textarea className="form-control field" onChange={this.onFieldChange} name="description" placeholder="Trip description (markdown supported)" value={this.state.description} />
    <input type="number" onChange={this.onFieldChange} name="mileage" placeholder="Estimated mileage" value={this.state.mileage} />
    <input onChange={this.onFieldChange} name="location" placeholder="Location" value={this.state.location} />
    <div> Trip Duration </div>
    <form>
      <input
        type="radio"
        value="single"
        onChange={this.handleDateChange}
        checked={this.state.length === 'single'}
      />
      Single Day
      <input
        type="radio"
        value="multi"
        onChange={this.handleDateChange}
        checked={this.state.length === 'multi'}
      />
      Multi-Day
    </form>
    <div className="input-group field">
      <div className="input-group-prepend">
        <span className="input-group-text">Start Date and End Date</span>
      </div>
      {this.getDateOptions()}
    </div>
    <div className="input-group field">
      <div className="input-group-prepend">
        <span className="input-group-text">Start Time and End Time</span>
      </div>
      <input type="time" name="startTime" onChange={this.onFieldChange} className="form-control" value={this.state.startTime} />
      <input type="time" name="endTime" onChange={this.onFieldChange} className="form-control" value={this.state.endTime} />
    </div>
    <div className="input-group field">
      <div className="input-group-prepend">
        <span className="input-group-text">Cost ($)</span>
      </div>
      <input type="number" name="cost" step="0.01" onChange={this.onFieldChange} className="form-control" value={this.state.cost} />
    </div>
    <div>
      {this.getGearInputs()}
      <button className="btn btn-primary btn-xs gear-button" onClick={this.addGear}>Request gear</button>
    </div>
    <div>
      {this.getTrippeeGear()}
      <button className="btn btn-primary btn-xs gear-button" onClick={this.addTrippeeGear}>Trippee gear</button>
    </div>
    <div>
      <p>Vehicles you can request:</p>
      {this.getVehicleRequest()}
    </div>
    <button className="btn btn-success post-button" onClick={this.createTrip}>Post trip</button>
  </div>
</div>
);
}
}
