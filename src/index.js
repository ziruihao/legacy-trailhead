import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import { ActionTypes } from './actions';

import App from './containers/app';

import './styles/base.scss';
import './styles/homepage-style.scss';

// this creates the store with the reducers, and does some other stuff to initialize devtools
// boilerplate to copy, don't have to know
const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
));

const token = localStorage.getItem('token');
const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090/api' : 'https://doc-planner.herokuapp.com/api';
if (token) {
  console.log('there is a token');
  axios.get(`${ROOT_URL}/user`, { headers: { authorization: token } })
    .then((r) => {
      console.log(r);
      // store.dispatch({ type: ActionTypes.AUTH_USER });
    })
    .catch(() => {
      console.log('token doesnt work');
      localStorage.clear();
      store.dispatch({ type: ActionTypes.DEAUTH_USER });
    });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main'),
);
