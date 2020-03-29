import moment from 'moment';
import EventsDataSource, { EventResponse } from './data-source';
import GroupsDataSource, { GroupResponse } from './groups-data-source';

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
    ) => await events.getEvents(category, daysInAdvance),

    groups: async (
      _: {},
      {
        input: { category, country },
      }: { input: { category: number; country: string } },
      {
        dataSources: { groups },
      }: { dataSources: { groups: GroupsDataSource } },
    ) => await groups.getGroups(category, country),
  },
  Event: {
    day: (event: EventResponse): string =>
      moment(event.local_date).format('dddd'),
    date: (event: EventResponse): string => event.local_date,
    time: (event: EventResponse): string =>
      event.local_time || event.time.toString(),
    venue: (event: EventResponse): string => event.venue && event.venue.name,
    group: (event: EventResponse): string => event.group && event.group.name,
  },
  Group: {
    url: (group: GroupResponse): string => group.urlname,
    category: (group: GroupResponse): string =>
      group.category && group.category.name,
    nextEvent: (group: GroupResponse): EventResponse => group.next_event,
  },
};
