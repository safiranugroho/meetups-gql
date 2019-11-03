import EventsDataSource, { EventResponse } from './data-source';

export default {
  Query: {
    events: async (
      _: {},
      {
        input: { category, daysInAdvance },
      }: { input: { category: string; daysInAdvance: number } },
      {
        dataSources: { events },
      }: { dataSources: { events: EventsDataSource } },
    ) => await events.getEvents(daysInAdvance, category),
  },
  Event: {
    date: (event: EventResponse): string => event.local_date,
    time: (event: EventResponse): string => event.local_time,
    venue: (event: EventResponse): string => event.venue && event.venue.name,
  },
};
