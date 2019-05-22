// 1. import
import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import React, { Component } from 'react';
import withDragDropContext from './withContext';

const events = [
  {
    id: 1,
    start: '2017-12-18 09:30:00',
    end: '2017-12-19 23:30:00',
    resourceId: 'r1',
    title: 'I am finished',
    bgColor: '#D9D9D9',
  },
  {
    id: 2,
    start: '2017-12-18 12:30:00',
    end: '2017-12-26 23:30:00',
    resourceId: 'r2',
    title: 'I am not resizable',
    resizable: false,
  },
  {
    id: 3,
    start: '2017-12-19 12:30:00',
    end: '2017-12-20 23:30:00',
    resourceId: 'r3',
    title: 'I am not movable',
    movable: false,
  },
  {
    id: 4,
    start: '2017-12-19 14:30:00',
    end: '2017-12-20 23:30:00',
    resourceId: 'r1',
    title: 'I am not start-resizable',
    startResizable: false,
  },
  {
    id: 5,
    start: '2017-12-19 15:30:00',
    end: '2017-12-20 23:30:00',
    resourceId: 'r2',
    title: 'R2 has recurring tasks every week on Tuesday, Friday',
    rrule: 'FREQ=WEEKLY;DTSTART=20171219T013000Z;BYDAY=TU,FR',
    bgColor: '#f759ab',
  },
];

// set resources here or later
const carOptions = [
  {
    id: 'r0',
    name: 'Minivan',
  },
  {
    id: 'r1',
    name: 'Truck',
  },
  {
    id: 'r2',
    name: 'Microbus',
  },
  {
    id: 'r3',
    name: 'Enterprise Rental',
  },
];

class VehicleScheduler extends Component {
  constructor(props) {
    super(props);
    // set locale moment to the schedulerData, if your locale isn't English. By default, Scheduler comes with English(en, United States).
    moment.locale('en');
    // 2. create the view model, put it in the props obj
    const mom = moment().format(DATE_FORMAT);
    const schedulerData = new SchedulerData(mom, ViewTypes.Week);
    schedulerData.setLocaleMoment(moment);
    schedulerData.setResources(carOptions);
    // set events here or later,
    // the event array should be sorted in ascending order by event.start property, otherwise there will be some rendering errors
    schedulerData.setEvents(events);
    this.state = {
      currentSchedule: schedulerData,
    };
  }

  componentDidMount(props) {
  }

  prevClick = (schedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(events);
    this.setState({
      currentSchedule: schedulerData,
    });
  }

    nextClick = (schedulerData) => {
      schedulerData.next();
      schedulerData.setEvents(events);
      this.setState({
        currentSchedule: schedulerData,
      });
    }

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType);
    schedulerData.setEvents(events);
    this.setState({
      currentSchedule: schedulerData,
    });
  }

  eventClicked = () => {
    console.log('eventclicked');
  }

  viewTripPage = () => {

  }

  ops2 = () => {
    console.log('eventclicked');
  }

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    let newFreshId = 0;
    schedulerData.events.forEach((event) => {
      if (event.id >= newFreshId) newFreshId = event.id + 1;
    });

    const newEvent = {
      id: newFreshId,
      title: 'New event you just created',
      start,
      end,
      resourceId: slotId,
      bgColor: 'purple',
    };
    schedulerData.addEvent(newEvent);
    this.setState({
      currentSchedule: schedulerData,
    });
  }

  render() {
    return (
      <div>
        <Scheduler
          schedulerData={this.state.currentSchedule}
          prevClick={this.prevClick}
          nextClick={this.nextClick}
          newEvent={this.newEvent}
          onViewChange={this.onViewChange}
          eventItemClick={this.eventClicked}
          viewEventText={(
            <NavLink type="button" to="/trip/5cd6fae7ac0e391d8bdcd35e" key={999}>
              <div>
                <h2>See Trip Details</h2>
              </div>
            </NavLink>
          )}
          viewEventClick={this.viewTripPage}
        />
      </div>
    );
  }
}

export default withDragDropContext(VehicleScheduler);
