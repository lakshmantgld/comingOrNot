import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { name, purpose, latlngs, sourceLabel, destinationLabel, dateArray, dateArrayErrorLabel,
        nameErrorLabel, purposeErrorLabel, eventObj, personalizedDateSelection, attendeeName,
        attendeeNameErrorLabel, toggleCastAttendance } from './registerReducers';

const reducers = combineReducers({
  name,
  purpose,
  dateArray,
  dateArrayErrorLabel,
  nameErrorLabel,
  purposeErrorLabel,
  eventObj,
  personalizedDateSelection,
  attendeeName,
  attendeeNameErrorLabel,
  toggleCastAttendance,
  routing: routerReducer
});

export default reducers;
