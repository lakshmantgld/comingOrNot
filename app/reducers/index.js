import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { name, purpose, latlngs, sourceLabel, destinationLabel, dateArray, dateArrayErrorLabel,
        nameErrorLabel, purposeErrorLabel, eventObj, personalizedDateSelection, attendeeName,
        attendeeNameErrorLabel, toggleCastAttendance, attendeeNameEmptyFlag, location, updateAttendeeDate, updateAttendeeId,
        updateAttendeeName, languageJson } from './registerReducers';

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
  attendeeNameEmptyFlag,
  location,
  updateAttendeeId,
  updateAttendeeName,
  updateAttendeeDate,
  languageJson,
  routing: routerReducer
});

export default reducers;
