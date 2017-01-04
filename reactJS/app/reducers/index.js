import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// import {  } from './registerReducers';

const reducers = combineReducers({
  routing: routerReducer
});

export default reducers;
