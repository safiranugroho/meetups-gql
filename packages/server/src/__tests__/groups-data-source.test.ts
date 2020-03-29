import nock from 'nock';
import { InMemoryLRUCache } from 'apollo-server-caching';

import GroupsDataSource from '../groups-data-source';
import fakeGroup from './__fixtures__/group.json';
import fakeEvent from './__fixtures__/event.json';

// Sunday, April 5, 2020 5:30:50 PM GMT+10:00
const max7Days = 1586071850000;

// Friday, April 10, 2020 5:00:00 PM GMT+10:00
const over7Days = 1586502000000;

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      valueOf: () => max7Days,
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

  const fakeGroupsResponse = [fakeGroup];

  describe('getGroups', () => {
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

    it('should return the only the groups with an upcoming event', async () => {
      const fakeGroupWithNoEvent = {
        ...fakeGroup,
        next_event: null,
      };

      nock(meetupAPI)
        .get('/find/groups')
        .query({
          category: 34,
          country: 'AU',
        })
        .reply(200, [fakeGroup, fakeGroupWithNoEvent]);

      const dataSource = initializeDataSource();
      const response = await dataSource.getGroups();

      expect(response).toEqual(fakeGroupsResponse);
    });

    it('should return the only the groups with an upcoming event in the next 7 days by default', async () => {
      const fakeGroupWithNoEvent = {
        ...fakeGroup,
        next_event: {
          ...fakeGroup.next_event,
          time: over7Days,
        },
      };

      nock(meetupAPI)
        .get('/find/groups')
        .query({
          category: 34,
          country: 'AU',
        })
        .reply(200, [fakeGroup, fakeGroupWithNoEvent]);

      const dataSource = initializeDataSource();
      const response = await dataSource.getGroups();

      expect(response).toEqual(fakeGroupsResponse);
    });
  });

  describe('getGroupEvent', () => {
    it('should send a get request with the group and event id passed as arguments', async () => {
      nock(meetupAPI)
        .get(`/${fakeGroup.urlname}/events/${fakeGroup.next_event.id}`)
        .reply(200, fakeEvent);

      const dataSource = initializeDataSource();
      const response = await dataSource.getGroupEvent(
        fakeGroup.urlname,
        fakeGroup.next_event.id,
      );

      expect(response).toEqual(fakeEvent);
    });
  });
});
