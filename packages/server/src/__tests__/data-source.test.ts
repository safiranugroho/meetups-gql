import nock from 'nock';
import { InMemoryLRUCache } from 'apollo-server-caching';

import EventsDataSource from '../data-source';

jest.spyOn(global.Date, 'now').mockImplementation(() => 1572764400000);

describe('data-source', () => {
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
      nock('http://localhost:4001')
        .get(
          '/find/upcoming_events?topic_category=292&end_date_range=2019-11-10T07:00:00',
        )
        .reply(200, fakeEventsResponse);

      const dataSource = new EventsDataSource();
      dataSource.initialize({
        context: undefined,
        cache: new InMemoryLRUCache(),
      });

      const response = await dataSource.getEvents();

      expect(response).toEqual(fakeEventsResponse.events);
    });

    it('should send a get request and query topic_category passed as argument', async () => {
      nock('http://localhost:4001')
        .get(
          '/find/upcoming_events?topic_category=200&end_date_range=2019-11-10T07:00:00',
        )
        .reply(200, fakeEventsResponse);

      const dataSource = new EventsDataSource();
      dataSource.initialize({
        context: undefined,
        cache: new InMemoryLRUCache(),
      });

      const response = await dataSource.getEvents(undefined, '200');

      expect(response).toEqual(fakeEventsResponse.events);
    });

    it('should send a get request and query end_date_range from the days passed as argument', async () => {
      nock('http://localhost:4001')
        .get(
          '/find/upcoming_events?topic_category=292&end_date_range=2019-11-10T07:00:00',
        )
        .reply(200, fakeEventsResponse);

      const dataSource = new EventsDataSource();
      dataSource.initialize({
        context: undefined,
        cache: new InMemoryLRUCache(),
      });

      const response = await dataSource.getEvents(7);

      expect(response).toEqual(fakeEventsResponse.events);
    });
  });
});
