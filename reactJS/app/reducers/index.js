import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { name, email, purpose, latlngs, sourceLabel, destinationLabel, dateArray, dateArrayErrorLabel,
        nameErrorLabel, emailErrorLabel, purposeErrorLabel, eventObj, personalizedDateSelection, attendeeName,
        attendeeNameErrorLabel, location, languageJson, notificationFlag, stepIndex,
        weather, disableFlag } from './registerReducers';

const reducers = combineReducers({
  name,
  email,
  purpose,
  dateArray,
  stepIndex,
  dateArrayErrorLabel,
  nameErrorLabel,
  purposeErrorLabel,
  eventObj,
  personalizedDateSelection,
  attendeeName,
  attendeeNameErrorLabel,
  notificationFlag,
  location,
  languageJson,
  weather,
  disableFlag,
  emailErrorLabel,
  routing: routerReducer
});

export default reducers;
