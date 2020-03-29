import { gql } from 'apollo-server';

// TODO: Find a better way to store the timeInMilliseconds time than as a string
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
    day: String
    date: String
    time: String
    timeInMilliseconds: String
    venue: String
    link: String
    group: String
  }

  input GroupsInput {
    category: Int
    country: String
  }

  type Group {
    name: String
    url: String
    city: String
    category: String
    nextEvent: Event
  }
`;
