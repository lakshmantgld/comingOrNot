import { runGraphQL } from './lib';

module.exports.graphql = (event, context, callback) => {
  console.log("handler working");
  runGraphQL(event, (error, response) => {
    if (error) {
      callback(null, error);
    }
    callback(null, response);
  });
};
