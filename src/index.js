import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import reducers from './reducers';
import Homepage from './components/homepage';
import SignIn from './components/signin';
import SignUp from './components/signup';
import AllTrips from './components/alltrips';
import CreateTrip from './components/createtrip';
import MyTrips from './components/mytrips';
import TripDetails from './components/tripdetails';
import { ActionTypes } from './actions';
import './style.scss';

// this creates the store with the reducers, and does some other stuff to initialize devtools
// boilerplate to copy, don't have to know
const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

const token = localStorage.getItem('token');
if (token) {
  store.dispatch({ type: ActionTypes.AUTH_USER });
}

const FallBack = (props) => {
  return <div>URL Not Found</div>;
};

const App = (props) => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/alltrips" component={AllTrips} />
          <Route path="/alltrips/:tripID" component={TripDetails} />
          <Route path="/createtrip" component={CreateTrip} />
          <Route path="/mytrips" component={MyTrips} />
          <Route path="/mytrips/:tripID" component={TripDetails} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

// we now wrap App in a Provider
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('main'),
);
