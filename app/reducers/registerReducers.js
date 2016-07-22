import { STORE_NAME, STORE_PURPOSE, STORE_LATLNG, STORE_SOURCE_LABEL, STORE_DESTINATION_LABEL, STORE_DATE_ARRAY,
         STORE_DATE_ARRAY_ERROR_LABEL, POP_DATE_ARRAY, STORE_NAME_ERROR_LABEL, STORE_PURPOSE_ERROR_LABEL,
         STORE_EVENT, STORE_PERSONALIZED_DATE_SELECTION, ATTENDEE_NAME, STORE_ATTENDEE_NAME_ERROR_LABEL,
         TOGGLE_CAST_ATTENDANCE } from './../actions/registerActions';

export function name(state = '', action) {
  switch(action.type) {
    case STORE_NAME:
      return action.name;
    default:
      return state;
  }
}

export function purpose(state = '', action) {
  switch(action.type) {
    case STORE_PURPOSE:
      return action.purpose;
    default:
      return state;
  }
}

export function dateArray(state = [], action) {
  switch(action.type) {
    case STORE_DATE_ARRAY:
      let newArray = [action.date];
      return state.concat(newArray);
    case POP_DATE_ARRAY:
      let index = state.indexOf(action.date);
      state.splice(index, 1);
      return state.concat([]);
    default:
      return state;
  }
}

export function dateArrayErrorLabel(state = '', action) {
  switch(action.type) {
    case STORE_DATE_ARRAY_ERROR_LABEL:
      return action.errorLabel;
    default:
      return state;
  }
}

export function nameErrorLabel(state = '', action) {
  switch(action.type) {
    case STORE_NAME_ERROR_LABEL:
      return action.errorLabel;
    default:
      return state;
  }
}

export function purposeErrorLabel(state = '', action) {
  switch(action.type) {
    case STORE_PURPOSE_ERROR_LABEL:
      return action.errorLabel;
    default:
      return state;
  }
}

export function eventObj(state = {}, action) {
  switch(action.type) {
    case STORE_EVENT:
      return action.json;
    default:
      return state;
  }
}

export function personalizedDateSelection(state = {}, action) {
  switch(action.type) {
    case STORE_PERSONALIZED_DATE_SELECTION:
      return Object.assign({}, state, {
        [action.date]: action.status
      })
    default:
      return state;
  }
}

export function attendeeName(state = '', action) {
  switch(action.type) {
    case ATTENDEE_NAME:
      return action.name;
    default:
      return state;
  }
}

export function attendeeNameErrorLabel(state = '', action) {
  switch(action.type) {
    case STORE_ATTENDEE_NAME_ERROR_LABEL:
      return action.errorLabel;
    default:
      return state;
  }
}

export function toggleCastAttendance(state = false, action) {
  switch(action.type) {
    case TOGGLE_CAST_ATTENDANCE:
      return action.toggleValue;
    default:
      return state;
  }
}
