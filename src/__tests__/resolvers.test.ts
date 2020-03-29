import resolvers from '../resolvers';
import EventsDataSource from '../events-data-source';
import GroupsDataSource from '../groups-data-source';

describe('resolvers', () => {
  const events = ({
    getEvents: jest.fn(),
  } as unknown) as jest.Mocked<EventsDataSource>;

  const groups = ({
    getGroups: jest.fn(),
    getGroupEvent: jest.fn(),
  } as unknown) as jest.Mocked<GroupsDataSource>;

  const fakeEvent = {
    id: 'fake-id',
    name: 'fake-event',
    local_date: '2019-11-28',
    local_time: '18:00',
    time: 1585809000000,
    link: 'http://fake.link',
    venue: {
      name: 'fake-venue',
      city: 'Melbourne',
    },
    group: {
      name: 'fake-group',
    },
  };

  const fakeGroup = {
    id: 1785640,
    name: 'Melbourne Silicon Beach',
    urlname: 'Melbourne-Silicon-Beach',
    city: 'Melbourne',
    next_event: {
      id: fakeEvent.id,
      name: fakeEvent.name,
      time: fakeEvent.time,
    },
    category: {
      id: 34,
      name: 'Tech',
    },
  };

  describe('Query', () => {
    describe('events', () => {
      it('should return results from EventsDataSource', async () => {
        events.getEvents.mockImplementation(() => Promise.resolve([fakeEvent]));

        const results = await resolvers.Query.events(
          {},
          { input: { category: 111, daysInAdvance: null } },
          { dataSources: { events } },
        );

        expect(results).toEqual([fakeEvent]);
      });

      it('should return the same results from EventsDataSource with no input', async () => {
        events.getEvents.mockImplementation(() => Promise.resolve([fakeEvent]));

        const results = await resolvers.Query.events(
          {},
          {},
          { dataSources: { events } },
        );

        expect(results).toEqual([fakeEvent]);
      });
    });

    describe('groups', () => {
      it('should return results from GroupsDataSource', async () => {
        groups.getGroups.mockImplementation(() => Promise.resolve([fakeGroup]));

        const results = await resolvers.Query.groups(
          {},
          { input: { category: 34 } },
          { dataSources: { groups } },
        );

        expect(results).toEqual([fakeGroup]);
      });

      it('should return the same results from GroupsDataSource with no input', async () => {
        groups.getGroups.mockImplementation(() => Promise.resolve([fakeGroup]));

        const results = await resolvers.Query.groups(
          {},
          {},
          { dataSources: { groups } },
        );

        expect(results).toEqual([fakeGroup]);
      });
    });
  });

  describe('Event', () => {
    describe('date', () => {
      it('should resolve to local_date', () => {
        expect(resolvers.Event.date(fakeEvent)).toEqual(fakeEvent.local_date);
      });
    });

    describe('time', () => {
      it('should resolve to local_time', () => {
        expect(resolvers.Event.time(fakeEvent)).toEqual(fakeEvent.local_time);
      });
    });

    describe('venue', () => {
      it('should resolve to name of venue', () => {
        expect(resolvers.Event.venue(fakeEvent)).toEqual(fakeEvent.venue.name);
      });

      it('should resolve to undefined if venue is undefined', () => {
        expect(
          resolvers.Event.venue({ ...fakeEvent, venue: undefined }),
        ).toBeUndefined();
      });
    });

    describe('group', () => {
      it('should resolve to name of group', () => {
        expect(resolvers.Event.group(fakeEvent)).toEqual(fakeEvent.group.name);
      });

      it('should resolve to undefined if group is undefined', () => {
        expect(
          resolvers.Event.group({ ...fakeEvent, group: undefined }),
        ).toBeUndefined();
      });
    });
  });

  describe('Group', () => {
    describe('url', () => {
      it('should resolve to the urlname', () => {
        expect(resolvers.Group.url(fakeGroup)).toEqual(
          'Melbourne-Silicon-Beach',
        );
      });
    });

    describe('category', () => {
      it('should resolve to the name of the category', () => {
        expect(resolvers.Group.category(fakeGroup)).toEqual('Tech');
      });
    });

    describe('nextEvent', () => {
      it('should resolve to the next_event', async () => {
        groups.getGroupEvent.mockImplementation(() =>
          Promise.resolve(fakeEvent),
        );

        const event = await resolvers.Group.nextEvent(
          fakeGroup,
          {},
          { dataSources: { groups } },
        );

        expect(event).toEqual(fakeEvent);
      });
    });
  });
});
