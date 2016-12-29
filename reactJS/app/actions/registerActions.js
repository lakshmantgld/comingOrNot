import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import config from '../../config/config.json';
import cookie from 'react-cookie';

export const STORE_NAME = 'STORE_NAME';
export const STORE_EMAIL = 'STORE_EMAIL';
export const STORE_PURPOSE = 'STORE_PURPOSE';
export const STORE_DATE_ARRAY = 'STORE_DATE_ARRAY';
export const POP_DATE_ARRAY = 'POP_DATE_ARRAY';
export const STORE_DATE_ARRAY_ERROR_LABEL = 'STORE_DATE_ARRAY_ERROR_LABEL';
export const STORE_NAME_ERROR_LABEL = 'STORE_NAME_ERROR_LABEL';
export const STORE_PURPOSE_ERROR_LABEL = 'STORE_PURPOSE_ERROR_LABEL';
export const STORE_EVENT = 'STORE_EVENT';
export const STEPPER_INCREASE = 'STEPPER_INCREASE';
export const STEPPER_DECREASE = 'STEPPER_DECREASE';
export const STORE_PERSONALIZED_DATE_SELECTION = 'STORE_PERSONALIZED_DATE_SELECTION';
export const ATTENDEE_NAME = 'ATTENDEE_NAME';
export const STORE_ATTENDEE_NAME_ERROR_LABEL = 'STORE_ATTENDEE_NAME_ERROR_LABEL';
export const UPDATE_NOTIFICATION_FLAG = 'UPDATE_NOTIFICATION_FLAG';
export const STORE_LOCATION = 'STORE_LOCATION';
export const UPDATE_ATTENDEE = 'UPDATE_ATTENDEE';
export const RENDER_LANGUAGE = 'RENDER_LANGUAGE';
export const FETCH_AND_STORE_WEATHER = 'FETCH_AND_STORE_WEATHER';
export const CHECK_DISABLE_FLAG = 'CHECK_DISABLE_FLAG';
export const STORE_EMAIL_ERROR_LABEL = 'STORE_EMAIL_ERROR_LABEL';

export function storeName(name) {
  return dispatch => {
    return dispatch({
      type: STORE_NAME,
      name: name
    });
  };
}

export function storeEmail(email) {
  return dispatch => {
    return dispatch({
      type: STORE_EMAIL,
      email: email
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

export function storeEmailErrorLabel(errorLabel) {
  return dispatch => {
    return dispatch({
      type: STORE_EMAIL_ERROR_LABEL,
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
  console.log("store event ID: "+JSON.stringify(json));
  const eventId = json.data.createEvent['eventId'];

  return browserHistory.push('/eventCreated/' + eventId);
}

export function registerEvent(name, purpose, dateArray, location, email) {
  console.log("in action");
  console.log(location);
  return dispatch => {
    return fetch(config.api.baseURL + '/graphql', {credentials: 'omit',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query": `
          mutation createEvent(
            $name: String!,
            $purpose: String!,
            $location: LocationInput!,
            $dateArray: [String]!,
            $attendees: [EventInputAttendee]!,
            $email: String!
          ) {
            createEvent(
              name: $name,
              purpose: $purpose,
              location: $location,
              dateArray: $dateArray,
              attendees: $attendees,
              email: $email
            ) {
              eventId
            }
          }
        `,
        "variables": {
          "name": name,
          "purpose": purpose,
          "location": location,
          "dateArray": dateArray,
          "attendees": [],
          "email": email
        }
      })})
      .then(res => {
        if (res.status !== 200) {
          console.log('error in posting event');
          return dispatch({
            type: UPDATE_NOTIFICATION_FLAG,
            flagValue: 'registerEventServerError'
          });
        } else {
          console.log(JSON.stringify(res));
          return res.json();
        }
      })
      .then(json => {
        console.log(JSON.stringify(json));
        if (!json.flagValue) {
          storeEventId(json);
        }
      })
  };
}

function storeEvent(json) {
  console.log('coming here' + JSON.stringify(json));
  return {
    type: STORE_EVENT,
    eventObj: json.data.event
  }
}

export function stepIncrease(index) {
  return dispatch => {
    return dispatch({
      type: STEPPER_INCREASE,
      index: index
    });
  };
}

export function stepDecrease(index) {
  return dispatch => {
    return dispatch({
      type: STEPPER_DECREASE,
      index: index
    });
  };
}

export function fetchEvent(eventId) {
  return dispatch => {
    return fetch(config.api.baseURL + '/graphql', {credentials: 'omit',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query": `
          query(
            $eventId: String!,
          ) {
            event(
              eventId: $eventId
            ) {
              eventId
              name
              purpose
              location{
                locationName
                lat
                long
              }
              dateArray
              attendees{
                attendeeId
                attendeeName
                personalizedDateSelection
              }
            }
          }
        `,
        "variables": {
          "eventId": eventId
        }
      })})
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

function storeEventAfterRegisterAttendee(json) {
  return {
    type: STORE_EVENT,
    eventObj: json.data.registerAttendee
  }
}

export function registerAttendee(attendeeName, personalizedDateSelection, eventId) {
  return dispatch => {
    return fetch(config.api.baseURL + '/graphql', {credentials: 'omit',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query": `
          mutation registerAttendee(
            $eventId: String!,
            $attendeeName: String!,
            $personalizedDateSelection: PersonalizedDateSelection!
          ) {
            registerAttendee(
              eventId: $eventId,
              attendeeName: $attendeeName,
              personalizedDateSelection: $personalizedDateSelection
            ) {
              eventId
              name
              purpose
              location{
                locationName
                lat
                long
              }
              dateArray
              attendees{
                attendeeId
                attendeeName
                personalizedDateSelection
              }
            }
          }
        `,
        "variables": {
          "eventId": eventId,
          "attendeeName": attendeeName,
          "personalizedDateSelection": personalizedDateSelection
        }
      })})
      .then(res => {
        if (res.status !== 200) {
          console.log('error in register attendee event');
          return dispatch({
            type: UPDATE_NOTIFICATION_FLAG,
            flagValue: 'registerAttendeeServerError'
          });
        } else {
          console.log(JSON.stringify(res));
          return res.json();
        }
      })
      .then(json => {
        console.log(JSON.stringify(json));
        if (!json.flagValue) {
          let opt={};
          opt.expires=new Date(2020, 1, 1, 0, 0, 1);
          eventId=encodeURI(eventId);
          cookie.save(eventId, attendeeName, opt); // Save name in cookie event ID

          dispatch(storeEventAfterRegisterAttendee(json));
          dispatch({
            type: UPDATE_NOTIFICATION_FLAG,
            flagValue: 'registerSuccess'
          });

        }
      })
      // .then(res => {
      //   if (res.status === 200) {
      //     console.log('error in updating event object');
      //
      //   } else {
      //     return res.json();
      //   }
      // })
      // .then(json => dispatch(storeEventAfterRegisterAttendee(json)))
  };
}

function storeEventAfterUpdateAttendee(json) {
  return {
    type: STORE_EVENT,
    eventObj: json.data.updateAttendee
  }
}

export function updateAttendee(attendeeId, attendeeName, personalizedDateSelection, eventId) {
  console.log('calling upda');
  return dispatch => {
    return fetch(config.api.baseURL + '/graphql', {credentials: 'omit',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query": `
          mutation updateAttendee(
            $eventId: String!,
            $attendeeId: String!,
            $attendeeName: String!,
            $personalizedDateSelection: PersonalizedDateSelection!
          ) {
            updateAttendee(
              eventId: $eventId,
              attendeeId: $attendeeId,
              attendeeName: $attendeeName,
              personalizedDateSelection: $personalizedDateSelection
            ) {
              eventId
              name
              purpose
              location{
                locationName
                lat
                long
              }
              dateArray
              attendees{
                attendeeId
                attendeeName
                personalizedDateSelection
              }
            }
          }
        `,
        "variables": {
          "eventId": eventId,
          "attendeeId": attendeeId,
          "attendeeName": attendeeName,
          "personalizedDateSelection": personalizedDateSelection
        }
      })})
      .then(res => {
        if (res.status !== 200) {
          console.log('error in updating attendee');
          return dispatch({
            type: UPDATE_NOTIFICATION_FLAG,
            flagValue: 'updateAttendeeServerError'
          });
        } else {
          console.log(JSON.stringify(res));
          return res.json();
        }
      })
      .then(json => {
        console.log(JSON.stringify(json));
        if (!json.flagValue) {
          let opt={};
          opt.expires=new Date(2020, 1, 1, 0, 0, 1);
          eventId=encodeURI(eventId);
          cookie.save(eventId, attendeeName, opt); // Save name in cookie event ID

          dispatch(storeEventAfterUpdateAttendee(json));
          dispatch({
            type: UPDATE_NOTIFICATION_FLAG,
            flagValue: 'updateSuccess'
          });

        }
      })
  };
}

export function updateNotificationFlag(flagValue) {
  return dispatch => {
    return dispatch({
      type: UPDATE_NOTIFICATION_FLAG,
      flagValue: flagValue
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

export function changelanguage(languageJson) {
  return dispatch => {
    return dispatch({
      type: RENDER_LANGUAGE,
      languageJson: languageJson
    });
  };
}

function storeWeatherJson(json) {
  let modifiedForecast = [];
  console.log('coming here' + JSON.stringify(json));
  if (json.query.results === null) {
    return {
      type: FETCH_AND_STORE_WEATHER,
      forecast: modifiedForecast
    }
  } else {
    const forecast = json.query.results.channel.item.forecast;

    for (let i=0; i<forecast.length; i++) {
      let forecastObj = {};
      forecastObj["date"] = forecast[i].date;
      forecastObj["cast"] = forecast[i].text;
      forecastObj["code"] = forecast[i].code;
      modifiedForecast.push(forecastObj);
    }

    return {
      type: FETCH_AND_STORE_WEATHER,
      forecast: modifiedForecast
    }
  }
}

export function fetchWeather(location) {
  return dispatch => {
    return fetch('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"' + location + '\")&format=json&env=store://datatables.org/alltableswithkeys', {credentials: 'omit'})
      .then(res => {
        if (res.status !== 200) {
          console.log("not fetch");
          let status = res.status;
          return dispatch({
            type: FETCH_ERROR,
            status: status
          });
        }
        console.log("fetch successfully");
        console.log(JSON.stringify(res));
        return res.json();
      })
      .then(json => dispatch(storeWeatherJson(json)))
  };
}

export function storeDisableFlag(flag) {
  return dispatch => {
    return dispatch({
      type: CHECK_DISABLE_FLAG,
      flag: flag
    });
  };
}
