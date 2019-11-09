import resolvers from '../resolvers';
import EventsDataSource from '../data-source';

describe('resolvers', () => {
  const events = ({
    getEvents: jest.fn(),
  } as unknown) as jest.Mocked<EventsDataSource>;

  const fakeEvent = {
    name: 'fake-event',
    local_date: '2019-11-28',
    local_time: '18:00',
    link: 'http://fake.link',
    venue: {
      name: 'fake-venue',
      city: 'Melbourne',
    },
    group: {
      name: 'fake-group',
    },
  };

  describe('Query', () => {
    describe('events', () => {
      it('should return results from EventsDataSource', async () => {
        events.getEvents.mockImplementation(() => Promise.resolve([fakeEvent]));

        const results = await resolvers.Query.events(
          {},
          { input: { category: 'fake-category', daysInAdvance: null } },
          { dataSources: { events } },
        );

        expect(results).toEqual([fakeEvent]);
      });
    });
  });

  describe('Event', () => {
    describe('day', () => {
      it('should resolve to the day of local_date', () => {
        expect(resolvers.Event.day(fakeEvent)).toEqual('Thursday');
      });
    });

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
});
