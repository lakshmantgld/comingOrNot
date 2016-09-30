import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { name, purpose, latlngs, sourceLabel, destinationLabel, dateArray, dateArrayErrorLabel,
        nameErrorLabel, purposeErrorLabel, eventObj, personalizedDateSelection, attendeeName,
        attendeeNameErrorLabel, toggleCastAttendance, attendeeNameEmptyFlag, attendeeNameExistsFlag,
        registerSuccessFlag, updateSuccessFlag,location, updateAttendeeDate, updateAttendeeId,
        updateAttendeeName, languageJson, weather } from './registerReducers';

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
  attendeeNameExistsFlag,
  registerSuccessFlag,
  updateSuccessFlag,
  location,
  updateAttendeeId,
  updateAttendeeName,
  updateAttendeeDate,
  languageJson,
  weather,
  routing: routerReducer
});

export default reducers;
