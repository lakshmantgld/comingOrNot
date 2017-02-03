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
const sns = new AWS.SNS();
const accountId = '381025746299';

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
      // so changing it again to [] for sending back to react App.
      data.Item.attendees = Object.values(data.Item.attendees);
      return resolve(data.Item);
    });
  });
}

// creates a new event and sends back the created event with eventID
export function createEvent(event) {
  console.log("in createEvent");
  console.log(event);
  event.eventId = moment().format('YYYYMMDDhmms') + '-' + event.name.replace(/\//g, '') + '-' + event.purpose.replace(/\//g, '');
  // making attendess as {} in dynamoDB, but in reactJS it is an []
  // This is not fair in software development. But doing, it as DynamoDb is so documentLess and cannot find a way to update JSON array.
  event.attendees = {};
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "event",
      Item: event
    };

    const snsParams = {
      Message: event.eventId,
      TopicArn: `arn:aws:sns:ap-northeast-1:${accountId}:slackbot`
    };

    dynamo.put(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      sns.publish(snsParams, (error, result) => {
        if (error) {
          console.log(error);
        }

        console.log("priniting sns result");
        console.log(result);
        // so changing it again to [] for sending back to react App.
        event.attendees = [];
        return resolve(event);
      });
    });
  });
}

// adds a new attendee to the existing event based on eventId and returns back the whole event.
export function registerAttendee(eventAttendee) {
  return new Promise((resolve, reject) => {

    const attendee = {
      "attendeeId": moment().format('YYYYMMDDhmms') + '-' + eventAttendee.attendeeName,
      "attendeeName": eventAttendee.attendeeName,
      "personalizedDateSelection": eventAttendee.personalizedDateSelection
    }
    const eventId = eventAttendee.eventId;

    // storing new attendee as key value pair like below
    /*    "2016110535818-lakshman" : {
            "attendeeId" : "2016110535818-suresh",
            "attendeeName" : "suresh murali",
            "personalizedDateSelection" : {}
          }
    */
    const params = {
      TableName: "event",
      Key: {
        "eventId": eventId
      },
      UpdateExpression: "SET attendees.#newAttendee = :attendee",
      ExpressionAttributeNames : {
          "#newAttendee" : attendee.attendeeId
      },
      ExpressionAttributeValues: {
        ":attendee" : attendee
      },
      ReturnValues: "ALL_NEW"
    };

    dynamo.update(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      // Since we use attendees as [] in react, converting {} to [].
      // Bad practice
      data.Attributes.attendees = Object.values(data.Attributes.attendees);
      return resolve(data.Attributes);
    });
  });
}

// updates the attendee with a given attendee Id
export function updateAttendee(eventAttendee) {
  return new Promise((resolve, reject) => {

    const attendee = {
      "attendeeId": eventAttendee.attendeeId,
      "attendeeName": eventAttendee.attendeeName,
      "personalizedDateSelection": eventAttendee.personalizedDateSelection
    };

    const eventId = eventAttendee.eventId;

    const params = {
      TableName: "event",
      Key: {
        "eventId": eventId
      },
      UpdateExpression: "SET attendees.#newAttendee = :attendee",
      ConditionExpression: "attribute_exists(attendees.#newAttendee)",
      ExpressionAttributeNames : {
          "#newAttendee" : attendee.attendeeId
      },
      ExpressionAttributeValues: {
        ":attendee" : attendee
      },
      ReturnValues: "ALL_NEW"
    };

    dynamo.update(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      // Since we use attendees as [] in react, converting {} to [].
      // Bad practice
      data.Attributes.attendees = Object.values(data.Attributes.attendees);
      return resolve(data.Attributes);
    });
  });
}
