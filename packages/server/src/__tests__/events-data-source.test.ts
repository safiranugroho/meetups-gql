import nock from 'nock';
import { InMemoryLRUCache } from 'apollo-server-caching';

import EventsDataSource from '../events-data-source';

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      // Saturday, November 10, 2019 7:00:00 AM GMT+10:00
      format: () => '2019-11-10T07:00:00',
    }),
  }),
}));

describe('events-data-source', () => {
  const meetupAPI = 'https://api.meetup.com';

  const initializeDataSource = () => {
    const dataSource = new EventsDataSource();
    dataSource.initialize({
      context: {
        token: 'fake-access-token',
      },
      cache: new InMemoryLRUCache(),
    });

    return dataSource;
  };

  describe('getEvents', () => {
    const fakeEventsResponse = {
      events: [
        {
          name: 'fake-event',
          local_date: '2019-11-28',
          local_time: '18:00',
          link: 'http://fake.link',
          venue: {
            name: 'fake-venue',
            city: 'Melbourne',
          },
        },
      ],
    };

    it('should send a get request and query undefined fields with default values', async () => {
      nock(meetupAPI)
        .get('/find/upcoming_events')
        .query({
          topic_category: 292,
          end_date_range: '2019-11-10T07:00:00',
        })
        .reply(200, fakeEventsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getEvents();

      expect(response).toEqual(fakeEventsResponse.events);
    });

    it('should send a get request and query topic_category passed as argument', async () => {
      nock(meetupAPI)
        .get('/find/upcoming_events')
        .query({
          topic_category: 111,
          end_date_range: '2019-11-10T07:00:00',
        })
        .reply(200, fakeEventsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getEvents(111);

      expect(response).toEqual(fakeEventsResponse.events);
    });

    it('should send a get request and query end_date_range from the days passed as argument', async () => {
      nock(meetupAPI)
        .get('/find/upcoming_events')
        .query({
          topic_category: 292,
          end_date_range: '2019-11-10T07:00:00',
        })
        .reply(200, fakeEventsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getEvents(undefined, 7);

      expect(response).toEqual(fakeEventsResponse.events);
    });
  });
});
