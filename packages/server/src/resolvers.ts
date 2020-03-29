import moment from 'moment';
import { get } from 'lodash';

import EventsDataSource, { EventResponse } from './events-data-source';
import GroupsDataSource, { GroupResponse } from './groups-data-source';

type EventsInput = {
  category?: number;
  daysInAdvance?: number;
};

type GroupsInput = {
  category?: number;
  country?: string;
};

export default {
  Query: {
    events: async (
      _: {},
      { input }: { input: EventsInput },
      {
        dataSources: { events },
      }: { dataSources: { events: EventsDataSource } },
    ) => {
      const category = get(input, 'category');
      const daysInAdvance = get(input, 'daysInAdvance');

      return await events.getEvents(category, daysInAdvance);
    },

    groups: async (
      _: {},
      { input }: { input?: GroupsInput },
      {
        dataSources: { groups },
      }: { dataSources: { groups: GroupsDataSource } },
    ) => {
      const category = get(input, 'category');
      const country = get(input, 'country');

      return await groups.getGroups(category, country);
    },
  },
  Event: {
    day: (event: EventResponse): string =>
      moment(get(event, 'local_date')).format('dddd'),
    date: (event: EventResponse): string => get(event, 'local_date'),
    time: (event: EventResponse): string => get(event, 'local_time'),
    timeInMilliseconds: (event: EventResponse): string => get(event, 'time').toString(),
    venue: (event: EventResponse): string => get(event, 'venue.name'),
    group: (event: EventResponse): string => get(event, 'group.name'),
  },
  Group: {
    url: (group: GroupResponse): string => get(group, 'urlname'),
    category: (group: GroupResponse): string => get(group, 'category.name'),
    nextEvent: (group: GroupResponse): EventResponse =>
      get(group, 'next_event'),
  },
};
