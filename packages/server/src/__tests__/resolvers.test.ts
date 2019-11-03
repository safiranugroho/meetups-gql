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
  };

  describe('Query', () => {
    describe('events', () => {
      it('should return results from EventsDataSource', async () => {
        events.getEvents.mockImplementation(() => Promise.resolve([fakeEvent]));

        const results = await resolvers.Query.events({}, {}, { dataSources: { events } });
        expect(results).toEqual([fakeEvent]);
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
    });
  });
});
