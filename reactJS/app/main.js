import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose, applyMiddleware} from 'redux';
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
// import ReactGA from 'react-ga';

// import config from '../config/config.json';
import reducers from './reducers';
import App from './components/App';
import RegisterComponent from './components/RegisterComponent';
import EventShareComponent from './components/EventShareComponent';
import EventPageComponent from './components/EventPageComponent';

// ReactGA.initialize(config.googleAnalytics, {
//   debug: true,
//   titleCase: false,
// });

window.React = React;

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const store = createStoreWithMiddleware(reducers);
const history = syncHistoryWithStore(browserHistory, store);

browserHistory.listen(location => {
  const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
  if (path) {
      history.replace(path);
   }
 });

// const trackIndexPage = () => {
//   console.log("trackIndexPage");
//   // console.log(config.googleAnalytics);
//   // ReactGA.set({ page: '/' });
//   // ReactGA.pageview('/');
// }

// const trackEventPage = () => {
//   console.log("trackEventPage");
//   // ReactGA.set({ page: '/event' });
//   // ReactGA.pageview('/event');
// }

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={RegisterComponent} />
        <Route path='event/' component={EventPageComponent}>
          <Route path=':eventId' component={EventPageComponent}>
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
