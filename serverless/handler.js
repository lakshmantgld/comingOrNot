'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');
const yaml = require('yamljs');

// Your first function handler
module.exports.register = (event, context, cb) => {
  // console.log('body', event.body);
  // console.log('headers', event.headers);
  // console.log('method', event.method);
  // console.log('params', event.params);
  // console.log('query', event.query.eventId);

  const date = moment().format('YYYYMMDDhmms');
  const name = event.body.name;
  const purpose = event.body.purpose;
  const dateArray = event.body.dateArray;
  const googleUserName = event.body.googleUserName;

  const params = {
    TableName: "event",
    Item: {
        "eventId": date + '-' + name + '-' + purpose,
        "name": name,
        "purpose": purpose,
        "dateArray": dateArray,
        "attendees": [],
        "googleUserName": googleUserName
    }
  };

  dynamo.put(params, (err, data) => {
    if (err) {
      cb(err);
    }
    cb(null, params.Item);
  });

}

module.exports.fetch = (event, context, cb) => {
  const eventId = event.query.eventId;
  console.log(eventId);

  const params = {
    TableName: "event",
    Key: {
      "eventId": eventId
    }
  };

  // return dynamo.get(params, cb);

  dynamo.get(params, (err, data) => {
    if (err) {
      cb(err);
    }
    cb(null, data);
  });

}

module.exports.update = (event, context, cb) => {
  const name = event.body.name;
  const personalizedDateSelection = event.body.personalizedDateSelection;
  const attendee = {
    "attendeeName": name,
    "personalizedDateSelection": personalizedDateSelection
  }
  const attendeeList = [attendee];
  const eventId = event.body.eventId;

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

  return dynamo.update(params, cb);

}

module.exports.fetchUserEvents = (event, context, cb) => {
  const googleUserName = event.query.googleUserName;

  const params = {
    TableName: "event",
    IndexName: "googleUserName-index",
    KeyConditionExpression: "googleUserName = :googleUserName",
    ExpressionAttributeValues: {
      ":googleUserName" : googleUserName
    },
    ScanIndexForward: false
  };

  return dynamo.query(params, cb);

}

module.exports.postDcpfId = (event, context, cb) => {
  const dcpfId = event.body.dcpfId;
  const config = yaml.load('./config.yml');

  AWS.config.region = 'ap-northeast-1';

  let credentials = new AWS.Credentials(config.aws.accessKey, config.aws.secretKey);
  AWS.config.credentials = credentials;

  let cognitoIdentity = new AWS.CognitoIdentity();

  let params = {
    IdentityPoolId: config.aws.cognitoIdentityPoolId,
    IdentityId: null,
    Logins: {
       "letsmeetup": dcpfId
    }
  };

  cognitoIdentity.getOpenIdTokenForDeveloperIdentity(params, function(err, data) {
    if (err) {
      console.log(err);
      cb(err);
    }
    cb(null, data);
  });

}
