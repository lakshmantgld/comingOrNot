import { graphql } from 'graphql';
import Schema from './schema';

const runGraphQL = (event, cb) => {
  const query = event.body.query;
  const variables = event.body.variables;
  console.log('query', query);
  console.log('variables', variables);
  graphql(Schema, query, null, {}, variables).then(result => {
    console.log('result', JSON.stringify(result, null, 2));
    cb(null, result);
  });
};

export default runGraphQL;
