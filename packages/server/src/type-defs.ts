import { gql } from 'apollo-server';

export default gql`
  type Event {
    name: String
    date: String
    time: String
    venue: String
    link: String
  }

  type Query {
    events: [Event]
  }
`;
