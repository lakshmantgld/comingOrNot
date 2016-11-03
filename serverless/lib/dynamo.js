import Promise from 'bluebird';
import AWS from 'aws-sdk';
import moment from 'moment';
import config from '../config.json';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const dynamo = new AWS.DynamoDB.DocumentClient();

// gives a single event from eventId
export function fetchEvent(eventId) {

  return new Promise((resolve, reject) => {
    const params = {
      TableName: "event",
      Key: {
        "eventId": eventId
      }
    };

    dynamo.get(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Item);
    });
  });
}

// creates a new event and sends back the created event with eventID
export function createEvent(event) {
  console.log("in dynamo");
  event.eventId = moment().format('YYYYMMDDhmms') + '-' + event.name.replace(/\//g, '') + '-' + event.purpose.replace(/\//g, '');
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "event",
      Item: event
    };

    dynamo.put(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(event);
    });
  });
}

// adds a new attendee to the existing event based on eventId and returns back the whole event.
export function registerAttendee(eventAttendee) {
  console.log("comim in registerAttendee");
  console.log(eventAttendee);
  return new Promise((resolve, reject) => {

    const attendee = {
      "attendeeId": moment().format('YYYYMMDDhmms') + '-' + eventAttendee.attendeeName,
      "attendeeName": eventAttendee.attendeeName,
      "personalizedDateSelection": eventAttendee.personalizedDateSelection
    }
    const attendeeList = [attendee];
    const eventId = eventAttendee.eventId;

    const params = {
      TableName: "event",
      Key: {
        "eventId": eventId
      },
      UpdateExpression: "SET attendees = list_append(attendees, :attendee)",
      ExpressionAttributeValues: {
        ":attendee" : attendeeList
      },
      ReturnValues: "ALL_NEW"
    };

    dynamo.update(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      console.log("in update dynamo");
      console.log(data.Attributes);
      return resolve(data.Attributes);
    });
  });
}
