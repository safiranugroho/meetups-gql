import { gql } from 'apollo-server';

export default gql`
  type Query {
    events(input: EventsInput!): [Event]
  }

  input EventsInput {
    category: String
  }

  type Event {
    name: String
    date: String
    time: String
    venue: String
    link: String
  }
`;
