import { gql } from 'apollo-server';

export default gql`
  type Query {
    events(input: EventsInput!): [Event]
  }

  input EventsInput {
    category: String
    daysInAdvance: Float
  }

  type Event {
    name: String
    day: String
    date: String
    time: String
    venue: String
    link: String
    group: String
  }
`;
