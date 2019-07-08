return (
  <div className="row my-row">

    <div className="col-3 left-column">
      <div className="row column-headers column-adjust">
        <p>Create a trip</p>
      </div>
      <div className="row column-sub-headers">
        <p>Basic information</p>
      </div>
      <div className="row column-sub-headers">
        <p>Dates and location</p>
      </div>
      <div className="row column-headers">
        <p>Trips description</p>
      </div>
      <div className="row column-sub-headers">
        <p>About the trip</p>
      </div>
      <div className="row column-sub-headers">
        <p>What you'll need</p>
      </div>
      <div className="row column-headers">
        <p>Additional details</p>
      </div>
      <div className="row column-sub-headers">
        <p>About the trip</p>
      </div>
      <div className="row column-sub-headers">
        <p>What you'll need</p>
      </div>
    </div>

    <div className="col-9 right-column">
      <div className="row page-header">
        <p>Basic trip information</p>
      </div>
      <div className="row page-sub-headers">
        <p>Trip name</p>
        <input className="form-control field top-create-trip"
        onChange={this.onFieldChange}
        name="title"
        placeholder="e.g. Weekend Mt. Moosilauke Hike!"
        value={this.state.title} />
      </div>
      <div className="row page-sub-headers">
        <p>Subclub</p>
        <select name="club" className="custom-select field top-create-trip" defaultValue="Select Club" onChange={this.onFieldChange}>
          {this.getClubOptions()}
        </select>
      </div>
      <div className="row page-sub-headers">
        <p>Co-leader name(s)</p>
        <input
          className="form-control field top-create-trip leaders"
          onChange={this.onFieldChange}
          name="leaders"
          placeholder="Tim Tregubov"
          value={this.state.leaders}
        />
      </div>
      <div className="row page-sub-headers">
        <p>Beginner trip</p>
        <form className="radio-form-input">
          <input
            type="radio"
            value="Yes"
            onChange={this.handleOptionChange}
            checked={this.state.experienceNeeded === true}
          />
          <label>Trippees do not need prior experience to go on this trip</label>
          <div class="radio-button"></div>
          <input
            type="radio"
            value="No"
            onChange={this.handleOptionChange}
            checked={this.state.experienceNeeded === false}
          />
          <label>Trippees should have prior experience before going on this trip</label>
          <div class="radio-button"></div>
        </form>
      </div>
    </div>

  </div>
);
}
}
