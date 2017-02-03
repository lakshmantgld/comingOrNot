import { runGraphQL } from './lib';

const request = require('request');

module.exports.graphql = (event, context, callback) => {
  console.log("handler working");
  runGraphQL(event, (error, response) => {
    if (error) {
      callback(null, error);
    }
    callback(null, response);
  });
};

module.exports.secondLambda = (event, context, callback) => {
  // print out the event information on the console (so that we can see it in the CloudWatch logs)
  console.log(`I'm triggered by graphql through the SNS topic "dispatcher":\n${JSON.stringify(event, null, 2)}`);

  let eventId = event["Records"][0]["Sns"]["Message"];
  console.log("printing the Url");
  console.log(event["Records"][0]["Sns"]["Message"]);

  var options = {
    text: 'We have got new Okyakusama. And here is the link of their event:<http://comingornot.com/event/' + eventId + '> I am always at your service :)',
  }

  request.post('https://hooks.slack.com/services/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' , { body: JSON.stringify(options)}, function (err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('json response');
    console.log(httpResponse);
    console.log('Post to slack bot replied with:', body);
  });

  callback(null, { event });
};
