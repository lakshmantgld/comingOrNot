import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { name, purpose, latlngs, sourceLabel, destinationLabel, dateArray, dateArrayErrorLabel,
        nameErrorLabel, purposeErrorLabel, eventObj, personalizedDateSelection, attendeeName,
        attendeeNameErrorLabel, location, languageJson, notificationFlag, stepIndex,
        weather, disableFlag, open } from './registerReducers';

const reducers = combineReducers({
  name,
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
  open,
  routing: routerReducer
});

export default reducers;
