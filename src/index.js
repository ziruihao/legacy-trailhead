import $ from 'jquery';
import './style.scss';

$('#main').html('Here we go!');


const timer = {
  time: 0,
  output() {
    console.log(this.time);
    $('#main').html(`You've been on this page for ${this.time} seconds`);
    this.time += 1;
  },
  interval() {
    setInterval(() => { this.output(); }, 1000);
  },

};


timer.interval();
