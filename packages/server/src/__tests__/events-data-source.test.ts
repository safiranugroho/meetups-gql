import nock from 'nock';
import { InMemoryLRUCache } from 'apollo-server-caching';

import EventsDataSource from '../events-data-source';
import fakeEvent from './__fixtures__/event.json';

// Sunday, April 5, 2020 5:30:50 PM GMT+10:00
const fakeEndDateRange = '2020-04-05T07:30:50';

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      format: () => fakeEndDateRange,
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
      events: [fakeEvent],
    };

    it('should send a get request and query undefined fields with default values', async () => {
      nock(meetupAPI)
        .get('/find/upcoming_events')
        .query({
          topic_category: 292,
          end_date_range: fakeEndDateRange,
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
          end_date_range: fakeEndDateRange,
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
          end_date_range: fakeEndDateRange,
        })
        .reply(200, fakeEventsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getEvents(undefined, 7);

      expect(response).toEqual(fakeEventsResponse.events);
    });
  });
});
