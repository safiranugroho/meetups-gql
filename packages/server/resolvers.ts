import { EventResponse } from './data-source';

type Event = {
  name: string;
  date: string;
  time: string;
  venue: string;
  link: string;
};

export default {
  Query: {
    events: async (_, {}, { dataSources: { events } }): Promise<Event[]> => await events.getEvents(),
  },
  Event: {
    date: (event: EventResponse): string => event.local_date,
    time: (event: EventResponse): string => event.local_time,
    venue: (event: EventResponse): string => event.venue.name,
  },
};
