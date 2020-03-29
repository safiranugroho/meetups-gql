import { get } from 'lodash';

import EventsDataSource, { EventResponse } from './events-data-source';
import GroupsDataSource, { GroupResponse } from './groups-data-source';

type EventsInput = {
  category?: number;
  daysInAdvance?: number;
};

type GroupsInput = {
  category?: number;
  daysUntilNextEvent?: number;
};

export default {
  Query: {
    events: async (
      _: {},
      { input }: { input?: EventsInput },
      { dataSources }: { dataSources: { events: EventsDataSource } },
    ) => {
      const category = get(input, 'category');
      const daysInAdvance = get(input, 'daysInAdvance');

      return await dataSources.events.getEvents(category, daysInAdvance);
    },

    groups: async (
      _: {},
      { input }: { input?: GroupsInput },
      { dataSources }: { dataSources: { groups: GroupsDataSource } },
    ) => {
      const category = get(input, 'category');
      const daysUntilNextEvent = get(input, 'daysUntilNextEvent');

      return await dataSources.groups.getGroups(category, daysUntilNextEvent);
    },
  },

  Event: {
    date: (event: EventResponse): string => get(event, 'local_date'),
    time: (event: EventResponse): string => get(event, 'local_time'),
    venue: (event: EventResponse): string => get(event, 'venue.name'),
    group: (event: EventResponse): string => get(event, 'group.name'),
  },

  Group: {
    url: (group: GroupResponse): string => get(group, 'urlname'),
    category: (group: GroupResponse): string => get(group, 'category.name'),
    nextEvent: async (
      group: GroupResponse,
      _: {},
      { dataSources }: { dataSources: { groups: GroupsDataSource } },
    ): Promise<EventResponse> =>
      await dataSources.groups.getGroupEvent(
        group.urlname,
        group.next_event.id,
      ),
  },
};
