import nock from 'nock';
import { InMemoryLRUCache } from 'apollo-server-caching';

import GroupsDataSource from '../groups-data-source';

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      format: () => '2019-11-10T07:00:00',
    }),
  }),
}));

describe('data-source', () => {
  const meetupAPI = 'https://api.meetup.com';

  const initializeDataSource = () => {
    const dataSource = new GroupsDataSource();
    dataSource.initialize({
      context: {
        token: 'fake-access-token',
      },
      cache: new InMemoryLRUCache(),
    });

    return dataSource;
  };

  describe('getGroups', () => {
    const fakeGroupsResponse = [
      {
        id: 1785640,
        name: 'Melbourne Silicon Beach',
        urlname: 'Melbourne-Silicon-Beach',
        city: 'Melbourne',
        next_event: {
          id: '269253587',
          name: 'Silicon Beach Pitch Night - April 2020 (Online Event!)',
          time: 1585809000000,
        },
        category: {
          id: 34,
          name: 'Tech',
          shortname: 'tech',
          sort_name: 'Tech',
        },
      },
    ];

    it('should send a get request and query undefined fields with default values', async () => {
      nock(meetupAPI)
        .get('/find/groups')
        .query({
          category: 34,
          country: 'AU',
        })
        .reply(200, fakeGroupsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getGroups();

      expect(response).toEqual(fakeGroupsResponse);
    });

    it('should send a get request and query category passed as argument', async () => {
      nock(meetupAPI)
        .get('/find/groups')
        .query({
          category: 111,
          country: 'AU',
        })
        .reply(200, fakeGroupsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getGroups(111);

      expect(response).toEqual(fakeGroupsResponse);
    });

    it('should send a get request and query country passed as argument', async () => {
      nock(meetupAPI)
        .get('/find/groups')
        .query({
          category: 34,
          country: 'NZ',
        })
        .reply(200, fakeGroupsResponse);

      const dataSource = initializeDataSource();
      const response = await dataSource.getGroups(undefined, 'NZ');

      expect(response).toEqual(fakeGroupsResponse);
    });
  });
});
