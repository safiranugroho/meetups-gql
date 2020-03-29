import { gql } from 'apollo-server';

export default gql`
  type Query {
    events(input: EventsInput): [Event]
    groups(input: GroupsInput): [Group]
  }

  input EventsInput {
    category: Int
    daysInAdvance: Int
  }

  type Event {
    id: String
    name: String
    date: String
    time: String
    venue: String
    link: String
    group: String
  }

  input GroupsInput {
    category: Int
    daysUntilNextEvent: Int
  }

  type Group {
    id: String
    name: String
    url: String
    city: String
    category: String
    nextEvent: Event
  }
`;
