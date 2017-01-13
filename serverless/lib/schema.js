import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLScalarType
} from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

import {
  createEvent,
  registerAttendee,
  fetchEvent,
  updateAttendee
} from './dynamo';

const PersonalizedDateSelection = new GraphQLScalarType({
    name: 'PersonalizedDateSelection',
    serialize: value => {
      return value;
    },
    parseValue: value => {
      return value;
    },
    parseLiteral: ast => {
      console.log("coming in parseLiteral");
      console.log(ast);
      let value = {};
      if (ast.kind !== Kind.OBJECT) {
        throw new GraphQLError("Query error: Can only parse object but got a: " + ast.kind, [ast]);
      }
      ast.fields.forEach(field => {
        value[field.name.value] = parseJSONLiteral(field.value);
      });

      return value;
    }
});

const EventAttendee = new GraphQLObjectType({
  name: 'EventAttendee',
  fields: () => ({
    attendeeId: {type: GraphQLString},
    attendeeName: {type: GraphQLString},
    personalizedDateSelection: {type: PersonalizedDateSelection}
  })
});

const EventInputAttendee = new GraphQLInputObjectType({
  name: 'EventInputAttendee',
  fields: () => ({
    attendeeId: {type: GraphQLString},
    attendeeName: {type: GraphQLString},
    personalizedDateSelection: {type: PersonalizedDateSelection}
  })
});

const LocationInput = new GraphQLInputObjectType({
  name: 'LocationInput',
  fields: () => ({
    locationName: {type: GraphQLString},
    lat: {type: GraphQLString},
    long: {type: GraphQLString}
  })
});

const Location = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    locationName: {type: GraphQLString},
    lat: {type: GraphQLString},
    long: {type: GraphQLString}
  })
});

const Event = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    eventId: {type: GraphQLString},
    name: {type: GraphQLString},
    purpose: {type: GraphQLString},
    location: {type: Location},
    dateArray: {type: new GraphQLList(GraphQLString)},
    attendees: {type: new GraphQLList(EventAttendee)}
  })
});

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    event: {
      type: Event,
      description: 'Get event details',
      args: {
        eventId: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(value, args) {
        return fetchEvent(args.eventId);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createEvent: {
      type: Event,
      description: 'Create new event',
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        purpose: {type: new GraphQLNonNull(GraphQLString)},
        location: {type: LocationInput},
        dateArray: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        attendees: {type: new GraphQLNonNull(new GraphQLList(EventInputAttendee))}
      },
      resolve(source, args) {
        return createEvent(args);
      }
    },
    registerAttendee: {
      type: Event,
      description: 'Add a new attendee to the Event',
      args: {
        eventId: {type: new GraphQLNonNull(GraphQLString)},
        attendeeName: {type: new GraphQLNonNull(GraphQLString)},
        personalizedDateSelection: {type: new GraphQLNonNull(PersonalizedDateSelection)}
      },
      resolve(source, args) {
        return registerAttendee(args);
      }
    },
    updateAttendee: {
      type: Event,
      description: 'Update a specific attendee in the Event',
      args: {
        eventId: {type: new GraphQLNonNull(GraphQLString)},
        attendeeId: {type: new GraphQLNonNull(GraphQLString)},
        attendeeName: {type: new GraphQLNonNull(GraphQLString)},
        personalizedDateSelection: {type: new GraphQLNonNull(PersonalizedDateSelection)}
      },
      resolve(source, args) {
        return updateAttendee(args);
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
