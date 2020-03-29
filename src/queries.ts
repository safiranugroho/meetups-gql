export const EVENTS = `query($input: EventsInput!) {
  events(input: $input) {
    id
    name
    date
    time
    venue
    link
    group
  }
}`;

export const GROUPS = `query($input: GroupsInput!) {
  groups(input: $input) {
    name
    url
    city
    category
    nextEvent {
      id
      name
      date
      time
      venue
      link
      group
    }
  }
}`;
