import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

export const STORE_NAME = 'STORE_NAME';
export const STORE_PURPOSE = 'STORE_PURPOSE';
export const STORE_DATE_ARRAY = 'STORE_DATE_ARRAY';
export const POP_DATE_ARRAY = 'POP_DATE_ARRAY';
export const STORE_DATE_ARRAY_ERROR_LABEL = 'STORE_DATE_ARRAY_ERROR_LABEL';
export const STORE_NAME_ERROR_LABEL = 'STORE_NAME_ERROR_LABEL';
export const STORE_PURPOSE_ERROR_LABEL = 'STORE_PURPOSE_ERROR_LABEL';
export const STORE_EVENT = 'STORE_EVENT';
export const STORE_PERSONALIZED_DATE_SELECTION = 'STORE_PERSONALIZED_DATE_SELECTION';
export const ATTENDEE_NAME = 'ATTENDEE_NAME';
export const STORE_ATTENDEE_NAME_ERROR_LABEL = 'STORE_ATTENDEE_NAME_ERROR_LABEL';
export const TOGGLE_CAST_ATTENDANCE = 'TOGGLE_CAST_ATTENDANCE';
export const STORE_LOCATION = 'STORE_LOCATION';
export const EMPTY_PERSONALIZED_DATE_SELECTION = 'EMPTY_PERSONALIZED_DATE_SELECTION';
export const STORE_UPDATE_ATTENDEE_ID = 'STORE_UPDATE_ATTENDEE_ID';
export const STORE_UPDATE_ATTENDEE_NAME = 'STORE_UPDATE_ATTENDEE_NAME';
export const STORE_UPDATE_ATTENDEE_DATE = 'STORE_UPDATE_ATTENDEE_DATE';
export const UPDATE_ATTENDEE = 'UPDATE_ATTENDEE';

export function storeName(name) {
  return dispatch => {
    return dispatch({
      type: STORE_NAME,
      name: name
    });
  };
}

export function storeUpdateAttendeeId(id) {
  return dispatch => {
    return dispatch({
      type: STORE_UPDATE_ATTENDEE_ID,
      id: id
    });
  };
}

export function storeUpdateAttendeeDate(date) {
  return dispatch => {
    return dispatch({
      type: STORE_UPDATE_ATTENDEE_DATE,
      date: date
    });
  };
}

export function storeUpdateAttendeeName(name) {
  return dispatch => {
    return dispatch({
      type: STORE_UPDATE_ATTENDEE_NAME,
      name: name
    });
  };
}

export function storePurpose(purpose) {
  return dispatch => {
    return dispatch({
      type: STORE_PURPOSE,
      purpose: purpose
    });
  };
}

export function storeDateArray(date) {
  return dispatch => {
    return dispatch({
      type: STORE_DATE_ARRAY,
      date: date
    });
  };
}

export function popDateArray(date) {
  return dispatch => {
    return dispatch({
      type: POP_DATE_ARRAY,
      date: date
    });
  };
}

export function storeDateArrayErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_DATE_ARRAY_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

export function storeNameErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_NAME_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

export function storePurposeErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_PURPOSE_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

function storeEventId(json) {
  const eventId = json['eventId'];

  return browserHistory.push('/eventCreated/eventId=' + eventId);
}

export function registerEvent(name, purpose, dateArray, location) {
  return dispatch => {
    return fetch('/api/registerEvent', {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'name' : name, 'purpose' : purpose, 'dateArray': dateArray, 'location': location})})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          console.log('error in posting event');
        }
        return res.json();
      })
      .then(json => storeEventId(json))
  };
}

function storeEvent(json) {
  console.log('coming here' + JSON.stringify(json));
  return {
    type: STORE_EVENT,
    json
  }
}

export function fetchEvent(eventId) {
  return dispatch => {
    return fetch('/api/fetchEvent/?eventId=' + eventId, {credentials: 'include'})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          return dispatch({
            type: FETCH_ERROR,
            status: status
          });
        }
        return res.json();
      })
      .then(json => dispatch(storeEvent(json)))
  };
}

export function storePersonalizedDateSelection(date, status) {
  return dispatch => {
    return dispatch({
      type: STORE_PERSONALIZED_DATE_SELECTION,
      date: date,
      status: status
    });
  };
}

export function storeAttendeeName(name) {
  return dispatch => {
    return dispatch({
      type: ATTENDEE_NAME,
      name: name
    });
  };
}

export function storeAttendeeNameErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_ATTENDEE_NAME_ERROR_LABEL,
      errorLabel: errorLabel
    });
  };
}

export function updateEvent(name, personalizedDateSelection, eventId) {
  console.log('calling upda');
  return dispatch => {
    return fetch('/api/updateEvent', {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'name': name, 'personalizedDateSelection': personalizedDateSelection, 'eventId': eventId})})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          console.log('error in updating event object');
        }
        return res.json();
      })
      .then(json => dispatch(storeEvent(json)))
  };
}

export function updateAttendee(attendeeId, name, personalizedDateSelection, eventId) {
  console.log('calling upda');
  return dispatch => {
    return fetch('/api/updateAttendee', {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'attendeeId': attendeeId, 'name': name, 'personalizedDateSelection': personalizedDateSelection, 'eventId': eventId})})
      .then(res => {
        if (res.status !== 200) {
          let status = res.status;
          console.log('error in updating attendee object');
        }
        return res.json();
      })
      .then(json => dispatch(storeEvent(json)))
  };
}

export function toggleCastAttendance(toggleValue) {
  return dispatch => {
    return dispatch({
      type: TOGGLE_CAST_ATTENDANCE,
      toggleValue: toggleValue
    });
  };
}

export function storeLocation(location) {
  return dispatch => {
    return dispatch({
      type: STORE_LOCATION,
      location: location
    });
  }
}

export function emptyPersonalizedDateSelection() {
  return dispatch => {
    return dispatch({
      type: EMPTY_PERSONALIZED_DATE_SELECTION
    });
  };
}
